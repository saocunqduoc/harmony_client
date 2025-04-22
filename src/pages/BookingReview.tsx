import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/api/services/bookingService';
import { reviewService } from '@/api/services/reviewService';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';

const BookingReview = () => {
  const { bookingId } = useParams<{ bookingId: number }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking-review', bookingId],
    queryFn: () => bookingService.getBookingDetail2(parseInt(bookingId || '0')),
    enabled: !!bookingId,
  });

  const handleSubmitReview = async () => {
    if (!bookingId || !rating) {
      toast.error('Vui lòng chọn đánh giá');
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewService.createReview({
        bookingId: bookingId,
        rating,
        comment,
      });
      
      toast.success('Đánh giá đã được gửi thành công');
      navigate('/user/bookings?tab=past');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Không thể gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-center">Đang tải thông tin đặt lịch...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !booking) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-500">Lỗi</h1>
            <p className="mt-2">Không thể tải thông tin đặt lịch để đánh giá.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/user/bookings')}>
              Quay lại đặt lịch của tôi
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Đánh giá dịch vụ</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{booking.businessName}</CardTitle>
              <CardDescription>Đánh giá chất lượng dịch vụ của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Dịch vụ đã sử dụng:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {booking.details.map(detail => (
                    <li key={detail.id} className="text-muted-foreground">
                      {detail.serviceName}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <label className="font-medium">Đánh giá của bạn:</label>
                <div className="flex items-center space-x-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <StarIcon 
                        className={`h-8 w-8 ${
                          star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium">Nhận xét của bạn:</label>
                <Textarea
                  placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
                  className="mt-2"
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/user/bookings')}
              >
                Quay lại
              </Button>
              <Button 
                onClick={handleSubmitReview}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BookingReview;
