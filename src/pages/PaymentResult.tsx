import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { usePayment } from '@/hooks/use-payment';
import { useQuery } from '@tanstack/react-query';
import type { PaymentStatus } from '@/api/services/paymentService';
import { paymentService } from '@/api/services/paymentService';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const DEFAULT_STATUS: PaymentStatus = {
  status: 'pending',
  message: 'Đang kiểm tra trạng thái thanh toán...'
};

// Cookie key for storing bookingId
const BOOKING_ID_COOKIE = 'harmony_current_booking';

const PaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    getPaymentStatus, 
    transactionId, 
    processPaymentRedirect,
    isProcessingRedirect
  } = usePayment();
  
  const [isProcessed, setIsProcessed] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Extract ZaloPay parameters from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const apptransid = searchParams.get('apptransid');
    const status = searchParams.get('status');
    const processed = searchParams.get('processed');
    const bookingId = searchParams.get('bookingId');
    
    // Store bookingId in cookie if available
    if (bookingId) {
      Cookies.set(BOOKING_ID_COOKIE, bookingId, {
        expires: 1/24, // 1 hour
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    // Only process if there's a transaction ID, it hasn't been processed yet,
    // and there's no 'processed' flag in the URL
    if (apptransid && !isProcessed && !processed) {
      console.log('ZaloPay redirect detected, processing payment result...', { apptransid, status });
      setIsProcessed(true);
      
      // Send these parameters to the backend to update payment status
      const params = {
        apptransid,
        status: status || undefined,
        amount: searchParams.get('amount') || undefined,
        appid: searchParams.get('appid') || undefined,
        bankcode: searchParams.get('bankcode') || undefined,
        checksum: searchParams.get('checksum') || undefined
      };

      // Use the hook to process payment redirect
      const processZaloPayRedirect = async () => {
        try {
          await processPaymentRedirect(params);
          
          // After processing, add processed flag to URL to prevent reprocessing if page refreshes
          const newSearchParams = new URLSearchParams(location.search);
          newSearchParams.set('processed', 'true');
          
          // Replace URL without causing a page reload
          window.history.replaceState(
            {},
            '',
            `${location.pathname}?${newSearchParams.toString()}`
          );
        } catch (error) {
          console.error('Error processing ZaloPay redirect', error);
          setProcessingError("Có lỗi xử lý kết quả thanh toán. Đang hiển thị trạng thái từ thông tin URL.");
          
          // Still mark as processed to prevent infinite retries
          const newSearchParams = new URLSearchParams(location.search);
          newSearchParams.set('processed', 'true');
          window.history.replaceState(
            {},
            '',
            `${location.pathname}?${newSearchParams.toString()}`
          );
        }
      };
      
      processZaloPayRedirect();
    }
  }, [location.search, processPaymentRedirect, isProcessed]);
  
  // Check for payment status with priority to URL parameters if present
  const { data } = useQuery({
    queryKey: ['payment-status', transactionId],
    queryFn: async () => {
      // First, check if payment status is in URL parameters
      const urlParams = new URLSearchParams(location.search);
      const urlStatus = urlParams.get('status');
      const urlTransId = urlParams.get('transactionId') || urlParams.get('apptransid');
      const bookingId = urlParams.get('bookingId') || Cookies.get(BOOKING_ID_COOKIE);
      
      if (urlStatus && urlTransId) {
        console.log('Using payment status from URL parameters');
        
        // For ZaloPay, convert status code to readable status
        let statusText: 'success' | 'failed' | 'pending' | 'timeout' = 'pending';
        let statusMessage = '';
        
        if (urlStatus === '1') {
          statusText = 'success';
          statusMessage = 'Thanh toán thành công';
        } else if (urlStatus === '-49') {
          statusText = 'timeout';
          statusMessage = 'Thanh toán đã hết hạn';
        } else if (urlStatus.startsWith('-')) {
          statusText = 'failed';
          statusMessage = urlParams.get('message') || 'Thanh toán thất bại';
          
          // If we had a processing error earlier, use that for display
          if (processingError) {
            statusMessage = processingError;
          }
        }
        
        return {
          status: statusText,
          message: statusMessage,
          transactionId: urlTransId,
          bookingId,
          amount: urlParams.get('amount') ? parseInt(urlParams.get('amount') || '0') : undefined,
          failureReason: urlParams.get('failureReason') || undefined
        } as PaymentStatus;
      }
      
      // If not in URL, check with backend using the hook
      try {
        const status = await getPaymentStatus?.();
        console.log('Backend payment status:', status);
        
        // If we got status from backend but no bookingId, try to add it from cookie
        if (status && !status.bookingId) {
          const cookieBookingId = Cookies.get(BOOKING_ID_COOKIE);
          if (cookieBookingId) {
            status.bookingId = cookieBookingId;
          }
        }
        
        return status || DEFAULT_STATUS;
      } catch (error) {
        console.error('Error fetching payment status:', error);
        toast.error('Lỗi khi kiểm tra trạng thái thanh toán');
        return {
          status: 'failed',
          message: 'Lỗi khi kiểm tra trạng thái thanh toán'
        } as PaymentStatus;
      }
    },
    enabled: !isProcessingRedirect && (!!transactionId || !!location.search),
    refetchInterval: (query) => {
      const status = query.state.data as PaymentStatus | undefined;
      if (!status) return 3000;
      return status.status === 'pending' ? 3000 : false;
    },
    refetchOnWindowFocus: true,
    staleTime: 0
  });

  const paymentStatus = (data || DEFAULT_STATUS) as PaymentStatus;

  // Handle retry payment for failed or timeout payments
  const handleRetryPayment = async () => {
    const bookingId = paymentStatus.bookingId || Cookies.get(BOOKING_ID_COOKIE);
    
    if (!bookingId) {
      toast.error('Không tìm thấy thông tin đặt lịch để thử lại');
      return;
    }

    try {
      setIsRetrying(true);
      toast.info('Đang khởi tạo lại thanh toán...');
      
      // Khởi tạo lại thanh toán ZaloPay với bookingId
      const response = await paymentService.initPayment({
        bookingId: parseInt(bookingId),
        method: 'zalopay'
      });
      
      if (response?.redirectUrl) {
        // Redirect to payment gateway
        window.location.href = response.redirectUrl;
      } else {
        toast.error(response?.message || 'Không thể khởi tạo thanh toán');
        setIsRetrying(false);
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
      toast.error('Không thể thử lại thanh toán. Vui lòng thử lại sau.');
      setIsRetrying(false);
    }
  };

  const renderIcon = () => {
    switch (paymentStatus.status) {
      case 'success':
        return <CheckCircle2 className="h-16 w-16 text-green-500" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-500" />;
      case 'timeout':
        return <AlertTriangle className="h-16 w-16 text-amber-500" />;
      default:
        return <Loader2 className="h-16 w-16 text-primary animate-spin" />;
    }
  };

  const renderTitle = () => {
    switch (paymentStatus.status) {
      case 'success':
        return 'Thanh toán thành công!';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'timeout':
        return 'Thanh toán hết hạn';
      default:
        return 'Đang xử lý thanh toán...';
    }
  };

  return (
    <Layout>
      <div className="container py-12 max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {renderIcon()}
            </div>
            <CardTitle className="text-2xl">
              {renderTitle()}
            </CardTitle>
            <CardDescription>
              {paymentStatus.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentStatus.transactionId && (
              <div className="text-xs p-2 bg-muted rounded-md">
                <p className="font-semibold">Mã giao dịch:</p>
                <p className="font-mono">{paymentStatus.transactionId}</p>
              </div>
            )}
            {paymentStatus.amount && (
              <div className="text-xs p-2 bg-muted rounded-md">
                <p className="font-semibold">Số tiền:</p>
                <p className="font-mono">{parseInt(String(paymentStatus.amount)).toLocaleString('vi-VN')} VND</p>
              </div>
            )}
            {paymentStatus.failureReason && (
              <div className="text-xs p-2 bg-red-50 text-red-700 rounded-md">
                <p className="font-semibold">Lý do:</p>
                <p>{paymentStatus.failureReason}</p>
              </div>
            )}
            {processingError && (
              <div className="text-xs p-2 bg-amber-50 text-amber-700 rounded-md">
                <p className="font-semibold">Lưu ý:</p>
                <p>{processingError}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={() => navigate('/user/bookings?tab=upcoming')}
              disabled={paymentStatus.status === 'pending'}
            >
              Xem đặt lịch của tôi
            </Button>
            <Button 
              variant={paymentStatus.status === 'failed' || paymentStatus.status === 'timeout' ? 'default' : 'outline'} 
              className="w-full" 
              onClick={() => {
                if (paymentStatus.status === 'failed' || paymentStatus.status === 'timeout') {
                  handleRetryPayment();
                } else {
                  navigate('/services');
                }
              }}
              disabled={paymentStatus.status === 'pending' || isRetrying}
            >
              {isRetrying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang khởi tạo lại...
                </>
              ) : paymentStatus.status === 'failed' || paymentStatus.status === 'timeout' ? 
                'Thử lại' : 
                'Tiếp tục đặt dịch vụ'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentResult;