
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { bookingService } from '@/api/services/bookingService';
import { paymentService } from '@/api/services/paymentService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Building, Check, CreditCard, Wallet } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { vi } from 'date-fns/locale';

const formatTime = (time: string) => {
  if (!time || time === '00:00:00') return '';
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    if (isNaN(hour)) return '';
    // Trả về định dạng 24 giờ
    return `${hours.padStart(2, '0')}:${minutes}`;
  } catch (error) {
    console.error('Lỗi định dạng thời gian:', time, error);
    return '';
  }
};

const CheckoutPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'zalopay' | 'cash'>('cash');
  
  // Convert bookingId to number
  const bookingIdNumber = bookingId ? parseInt(bookingId, 10) : 0;

  const { data: booking, isLoading, error, refetch } = useQuery({
    queryKey: ['bookingDetails', bookingIdNumber],
    queryFn: () => bookingService.getBookingDetail(bookingIdNumber),
    enabled: !!bookingIdNumber && !isNaN(bookingIdNumber),
  });

  const handleConfirmBooking = async () => {
    if (!bookingIdNumber) return;
    
    try {
      setIsSubmitting(true);
      
      if (paymentMethod === 'cash') {
        // If paying by cash, just confirm the booking
        await bookingService.confirmBooking(bookingIdNumber);
        toast.success('Đã đặt lịch thành công!');
        navigate('/user/bookings?tab=upcoming');
      } else if (paymentMethod === 'zalopay') {
        // If paying by ZaloPay, initialize payment
        console.log('Initializing ZaloPay payment for booking:', bookingIdNumber);
        const response = await paymentService.initPayment({
          bookingId: bookingIdNumber,
          method: 'zalopay'
        });
        
        console.log('Payment initialization response:', response.redirectUrl);
        
        if (response?.redirectUrl) {
          // Redirect to payment gateway
          window.location.href = response.redirectUrl;
        } else {
          toast.error('Không thể khởi tạo thanh toán');
        }
      }
    } catch (error) {
      console.error('Error processing booking:', error);
      toast.error('Không thể xác nhận đặt lịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang tải thông tin đặt lịch...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!booking || error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Lỗi</h1>
            <p className="mt-2">Không thể tải thông tin đặt lịch. Vui lòng thử lại sau.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/user/bookings')}>
              Quay lại đặt lịch của tôi
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Convert totalAmount to number to ensure consistency
  const totalAmount = typeof booking.totalAmount === 'string' 
    ? parseInt(booking.totalAmount, 10)
    : Number(booking.totalAmount);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Xác nhận đặt lịch</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin đặt lịch</CardTitle>
              <CardDescription>Xác nhận thông tin trước khi đặt lịch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div>
                  <div className="font-medium">{booking.business.name}</div>
                </div>
              </div>

              <div className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">{booking?.businessAddress}</div>
                </div>
              </div>
              
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {booking.bookingDate ? format(parseISO(booking.bookingDate), 'EEEE, dd/MM/yyyy', { locale: vi }) : 'Không có ngày'}
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Dịch vụ đã chọn:</h3>
                
                {booking?.services?.map((detail) => (
                  <div key={detail.id} className="flex justify-between items-start border-b pb-3 mb-3 last:border-b-0">
                    <div>
                      <div className="font-medium">{detail.name}</div>
                      {detail.startTime && detail.startTime !== '00:00:00' && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {formatTime(detail.startTime)} - {formatTime(detail.endTime)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {detail.finalPrice !== detail.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          {parseInt(detail.price.toString()).toLocaleString('vi-VN')} VND
                        </div>
                      )}
                      <div className="font-medium">
                        {parseInt(detail.finalPrice.toString()).toLocaleString('vi-VN')} VND
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-4 font-bold">
                  <span>Tổng cộng:</span>
                  <span>{totalAmount.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Method Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
              <CardDescription>Chọn phương thức thanh toán của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as 'zalopay' | 'cash')}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="cash" id="cash" />
                  <label htmlFor="cash" className="cursor-pointer flex items-center flex-1">
                    <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Thanh toán tại cửa hàng</div>
                      <div className="text-sm text-muted-foreground">Thanh toán khi đến cửa hàng sử dụng dịch vụ</div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="zalopay" id="zalopay" />
                  <label htmlFor="zalopay" className="cursor-pointer flex items-center flex-1">
                    <Wallet className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">ZaloPay</div>
                      <div className="text-sm text-muted-foreground">Thanh toán trực tuyến qua ZaloPay</div>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Xác nhận đặt lịch
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
