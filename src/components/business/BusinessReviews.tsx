
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/api/services/reviewService';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface BusinessReviewsProps {
  businessId: number;
}

interface ReviewsPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const ReviewsPagination: React.FC<ReviewsPaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="w-9"
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const BusinessReviews: React.FC<BusinessReviewsProps> = ({ businessId }) => {
  const [page, setPage] = useState(1);
  
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['businessReviews', businessId, page],
    queryFn: () => reviewService.getBusinessReviews({ page, limit: 5, businessId: businessId.toString() }),
    enabled: !!businessId,
  });
  
  const reviews = data?.reviews || [];
  const totalPages = data?.totalPages || 1;
  const averageRating = data?.averageRating || 0;
  const totalReviews = data?.totalItems || 0;
  
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Đánh giá từ khách hàng</h2>
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
          <span className="font-medium">{Number(averageRating).toFixed(1)}</span>
          <span className="text-muted-foreground">({totalReviews} đánh giá)</span>
        </div>
      </div>

      {reviews.map((review) => (
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
                    {new Date(review.createdAt || review.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
                {review.service?.name && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Dịch vụ: {review.service.name}
                  </div>
                )}
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

export default BusinessReviews;
