
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePayment } from '@/hooks/use-payment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import axios from 'axios';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyZaloPayCallback, isVerifyingPayment } = usePayment();
  const [isProcessed, setIsProcessed] = useState(false);
  
  // Extract ZaloPay parameters
  const queryParams = new URLSearchParams(location.search);
  const appTransId = queryParams.get('apptransid') || '';
  const appId = queryParams.get('appid') || '';
  const pmcId = queryParams.get('pmcid') || '';
  const bankCode = queryParams.get('bankcode') || '';
  const amount = queryParams.get('amount') || '';
  const discountAmount = queryParams.get('discountamount') || '';
  const status = queryParams.get('status') || '';
  const checksum = queryParams.get('checksum') || '';
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!appTransId || !checksum || isProcessed) return;
      
      try {
        // Call the API using the query parameters directly
        verifyZaloPayCallback({
          appid: appId,
          apptransid: appTransId,
          pmcid: pmcId,
          bankcode: bankCode,
          amount,
          discountamount: discountAmount,
          status,
          checksum
        });
        setIsProcessed(true);
      } catch (error) {
        console.error('Error verifying payment:', error);
      }
    };
    
    verifyPayment();
  }, [appTransId, appId, pmcId, bankCode, amount, discountAmount, status, checksum, isProcessed, verifyZaloPayCallback]);

  return (
    <Layout>
      <div className="container py-12 max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {isVerifyingPayment ? (
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              ) : (
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isVerifyingPayment ? 'Đang xác nhận thanh toán...' : 'Thanh toán thành công!'}
            </CardTitle>
            <CardDescription>
              {isVerifyingPayment 
                ? 'Vui lòng đợi trong khi chúng tôi xác nhận giao dịch của bạn' 
                : 'Đặt lịch của bạn đã được thanh toán thành công'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appTransId && (
              <div className="text-xs p-2 bg-muted rounded-md">
                <p className="font-semibold">Mã giao dịch:</p>
                <p className="font-mono">{appTransId}</p>
              </div>
            )}
            {amount && (
              <div className="text-xs p-2 bg-muted rounded-md">
                <p className="font-semibold">Số tiền:</p>
                <p className="font-mono">{parseInt(amount).toLocaleString('vi-VN')} VND</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button 
              className="w-full" 
              onClick={() => navigate('/user/bookings')}
              disabled={isVerifyingPayment}
            >
              Xem đặt lịch của tôi
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/services')}
              disabled={isVerifyingPayment}
            >
              Tiếp tục đặt dịch vụ
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
