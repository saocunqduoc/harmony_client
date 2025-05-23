import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/api/services/reviewService';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ServiceReviewsProps {
  serviceId: number;
  businessId?: number;
}

interface ReviewsPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const ReviewsPagination: React.FC<ReviewsPaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">Trang</span>
      <Input
        type="number"
        size="sm"
        className="w-16 text-center"
        min={1}
        max={totalPages}
        value={currentPage}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val >= 1 && val <= totalPages) {
            onPageChange(val);
          }
        }}
      />
      <span className="text-sm text-muted-foreground">/ {totalPages}</span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const ServiceReviews: React.FC<ServiceReviewsProps> = ({ serviceId, businessId }) => {
  const [page, setPage] = useState(1);

  // Fetch service reviews if serviceId is provided
  const {
    data: serviceReviewsData,
    isLoading: isServiceReviewsLoading,
    error: serviceReviewsError
  } = useQuery({
    queryKey: ['serviceReviews', serviceId, page],
    queryFn: () => reviewService.getServiceReviews(serviceId, { page, limit: 3 }),
    enabled: !!serviceId,
  });

  // Fetch business reviews if businessId is provided
  const {
    data: businessReviewsData,
    isLoading: isBusinessReviewsLoading,
    error: businessReviewsError
  } = useQuery({
    queryKey: ['businessReviews', businessId, page],
    queryFn: () => reviewService.getBusinessReviews(businessId || 0, { page }),
    enabled: !!businessId,
  });

  // Debug reviews data
  console.log('Service reviews data:', serviceReviewsData);
  
  const isLoading = isServiceReviewsLoading || isBusinessReviewsLoading;
  const error = serviceReviewsError || businessReviewsError;
  
  // Extract the reviews data correctly from the response
  const reviews = businessId 
    ? (businessReviewsData?.data?.reviews || []) 
    : (serviceReviewsData?.data?.reviews || []);
  const totalPages = businessId 
    ? (businessReviewsData?.data?.totalPages || 1) 
    : (serviceReviewsData?.data?.totalPages || 1);
  
  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Không xác định';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-2">Lỗi khi tải đánh giá</p>
        <Button variant="outline" onClick={() => setPage(1)}>
          Thử lại
        </Button>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Chưa có đánh giá nào.</p>
      </div>
    );
  }

  return (
    <div>
      {reviews.map((review: any) => (
        <Card key={review.id} className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarImage
                  src={review.customer?.avatar}
                  alt={review.customer?.fullName || 'User'}
                />
                <AvatarFallback>
                  {getInitials(review.customer?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{review.customer?.fullName}</h3>
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <ReviewsPagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ServiceReviews;
