
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BookingPayment from '../payment/BookingPayment';

interface BookingPaymentTestProps {
  bookingId?: number;
}

const BookingPaymentTest: React.FC<BookingPaymentTestProps> = ({ bookingId = 123 }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePaymentComplete = () => {
    setPaymentComplete(true);
    setTimeout(() => setIsDialogOpen(false), 1500);
  };

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Thử Thanh Toán</CardTitle>
        <CardDescription>
          Thử nghiệm component thanh toán với ZaloPay
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Nhấn nút bên dưới để mở dialog thanh toán. Bạn có thể chọn giữa thanh toán tiền mặt hoặc thanh toán online qua ZaloPay/MoMo.
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setPaymentComplete(false)}>Thanh toán đặt lịch</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thanh toán đặt lịch</DialogTitle>
              <DialogDescription>
                Chọn phương thức thanh toán bạn muốn sử dụng
              </DialogDescription>
            </DialogHeader>
            {paymentComplete ? (
              <div className="text-center py-6 text-green-500">
                Thanh toán tiền mặt hoàn tất!
              </div>
            ) : (
              <BookingPayment
                bookingId={bookingId}
                totalAmount={150000}
                onComplete={handlePaymentComplete}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Lưu ý: Đây chỉ là component thử nghiệm để demo chức năng thanh toán.
      </CardFooter>
    </Card>
  );
};

export default BookingPaymentTest;
