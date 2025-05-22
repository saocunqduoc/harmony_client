
import React, { useState } from 'react';
import { usePayment } from '@/hooks/use-payment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, AlertCircle } from 'lucide-react';
import PaymentMethodSelector from './PaymentMethodSelector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaymentInitRequest } from '@/api/services/paymentService';
import { toast } from 'sonner';

interface BookingPaymentProps {
  bookingId: number;
  totalAmount: number;
  onComplete?: () => void;
}

const BookingPayment: React.FC<BookingPaymentProps> = ({
  bookingId,
  totalAmount,
  onComplete
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('cash');
  const { getPaymentMethods, initPayment, isInitiatingPayment } = usePayment();
  const { data: paymentMethods, isLoading } = getPaymentMethods();

  console.log('Payment Methods:', paymentMethods);
  console.log('Selected Method:', selectedMethod);

  const handlePayment = async () => {
    try {
      console.log('Processing payment with method:', selectedMethod);
      
      if (selectedMethod === 'cash') {
        console.log('Completing cash payment for booking:', bookingId);
        // For cash payment, just complete the booking
        if (onComplete) onComplete();
        return;
      }

      // For online payment, initialize the payment gateway
      if (['zalopay', 'momo'].includes(selectedMethod)) {
        console.log('Initializing online payment for booking:', bookingId);
        
        const paymentData: PaymentInitRequest = {
          bookingId,
          method: selectedMethod as 'zalopay' | 'momo'
        };

        console.log('Payment request data:', paymentData);
        const result = await initPayment(paymentData);
        console.log('Payment initialization result:', result);
        
        // Additional logging to troubleshoot checkout issues
        if (!result || !result.redirectUrl) {
          // toast.error('Không thể khởi tạo thanh toán. Vui lòng thử lại sau.');
          console.error('Payment initiation failed - no redirect URL returned');
        } else {
          // If we have a redirect URL, redirect the user
          window.location.href = result.redirectUrl;
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      // toast.error('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Thanh toán
        </CardTitle>
        <CardDescription>
          Chọn phương thức thanh toán cho đặt lịch của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : paymentMethods && paymentMethods.length > 0 ? (
          <PaymentMethodSelector
            methods={paymentMethods}
            selectedMethod={selectedMethod}
            onSelectMethod={setSelectedMethod}
          />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Không thể tải phương thức thanh toán. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Tổng thanh toán:</span>
            <span className="font-bold text-lg">
              {totalAmount.toLocaleString('vi-VN')} VND
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handlePayment}
          disabled={isInitiatingPayment || !selectedMethod}
        >
          {isInitiatingPayment ? 'Đang xử lý...' : 'Thanh toán ngay'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingPayment;
