import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/api/services/bookingService';
import { reviewService, ReviewRequest } from '@/api/services/reviewService';
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
import { StarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { format, parseISO } from 'date-fns';

interface ServiceReview {
  rating: number;
  comment: string;
}

const BookingReview = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceReviews, setServiceReviews] = useState<Record<number, ServiceReview>>({});
  
  // Fetch booking details including services
  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking-detail', bookingId],
    queryFn: () => bookingService.getBookingDetail(parseInt(bookingId || '0')),
    enabled: !!bookingId,
    onSuccess: (data) => {
      // Initialize reviews object with each bookingDetailId as key
      const reviewsObj: Record<number, ServiceReview> = {};
      
      if (data && data.services) {
        data.services.forEach(service => {
          reviewsObj[service.bookingDetailId] = { rating: 5, comment: '' };
        });
      }
      
      setServiceReviews(reviewsObj);
    }
  });

  // Handle rating change for a specific service
  const handleRatingChange = (detailId: number, newRating: number) => {
    setServiceReviews(prev => ({
      ...prev,
      [detailId]: { 
        ...prev[detailId], 
        rating: newRating 
      }
    }));
  };

  // Handle comment change for a specific service
  const handleCommentChange = (detailId: number, comment: string) => {
    setServiceReviews(prev => ({
      ...prev,
      [detailId]: { 
        ...prev[detailId], 
        comment 
      }
    }));
  };

  // Format time string (HH:MM:SS) to AM/PM format
  const formatTime = (time: string) => {
    if (!time || time === '00:00:00') return '';
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      if (isNaN(hour)) return '';
      return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
    } catch (error) {
      console.error('Error formatting time:', time, error);
      return '';
    }
  };

  // Submit all service reviews
  const handleSubmitReviews = async () => {
    if (!bookingId || Object.keys(serviceReviews).length === 0) {
      toast.error('Không có dịch vụ để đánh giá');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert object to array of review requests
      const reviewsToSubmit: ReviewRequest[] = [];
      Object.entries(serviceReviews).forEach(([detailId, review]) => {
        reviewsToSubmit.push({
          bookingDetailId: parseInt(detailId),
          rating: review.rating,
          comment: review.comment || undefined
        });
      });

      await reviewService.createMultipleReviews(reviewsToSubmit);
      toast.success('Đánh giá đã được gửi thành công');
      navigate('/user/bookings?tab=past');
    } catch (error) {
      console.error('Error submitting reviews:', error);
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
  
  // Extract business name correctly from response data
  const businessName = booking.business?.name || booking.businessName;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Đánh giá dịch vụ</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{businessName}</CardTitle>
              <CardDescription>
                Đánh giá chất lượng các dịch vụ bạn đã sử dụng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Thời gian: {booking.bookingDate && format(parseISO(booking.bookingDate), 'dd/MM/yyyy')}</h3>
              </div>
              
              {/* Individual service review sections */}
              {booking.services && booking.services.map((service) => {
                const reviewData = serviceReviews[service.bookingDetailId] || { rating: 5, comment: '' };
                
                return (
                  <Card key={service.bookingDetailId} className="p-4 border-muted">
                    <div className="mb-3">
                      <h3 className="font-medium">{service.name || service.serviceName}</h3>
                      
                      {service.startTime && service.startTime !== '00:00:00' && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {formatTime(service.startTime)} - {formatTime(service.endTime)}
                          </span>
                        </div>
                      )}
                      
                      {service.staff && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Nhân viên: {service.staff.fullName}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="text-sm font-medium">Đánh giá:</label>
                      <div className="flex items-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={`star-${service.bookingDetailId}-${star}`}
                            type="button"
                            onClick={() => handleRatingChange(service.bookingDetailId, star)}
                            className="focus:outline-none"
                          >
                            <StarIcon 
                              className={`h-7 w-7 ${
                                star <= reviewData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Nhận xét:</label>
                      <Textarea
                        placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
                        className="mt-1"
                        rows={3}
                        value={reviewData.comment}
                        onChange={(e) => handleCommentChange(service.bookingDetailId, e.target.value)}
                      />
                    </div>
                  </Card>
                );
              })}

              {(!booking.services || booking.services.length === 0) && (
                <div className="text-center p-4 border rounded-md bg-muted/20">
                  <p>Không có dịch vụ nào để đánh giá</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/user/bookings?tab=past')}
              >
                Quay lại
              </Button>
              <Button 
                onClick={handleSubmitReviews}
                disabled={isSubmitting || !booking.services || booking.services.length === 0}
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
