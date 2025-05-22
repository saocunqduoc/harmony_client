import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  Loader2,
  CheckCircle,
  XCircle,
  Trash,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, ReviewInfo } from '@/api/services/adminService';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

const AdminReviews = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  // Prepare query params
  const queryParams = {
    page,
    limit,
    search: search || undefined,
    status: status !== 'all' ? status : undefined
  };

  // Fetch reviews
  const { 
    data: reviewsData,
    isLoading, 
    error
  } = useQuery({
    queryKey: ['adminReviews', queryParams],
    queryFn: () => adminService.getAllReviews(queryParams),
  });

  // Approve review mutation
  const approveReviewMutation = useMutation({
    mutationFn: (reviewId: number) => adminService.approveReview(reviewId),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đánh giá đã được duyệt"
      });
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể duyệt đánh giá",
        variant: "destructive"
      });
    }
  });

  // Reject review mutation
  const rejectReviewMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => 
      adminService.rejectReview(id, reason),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã từ chối đánh giá"
      });
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
      setRejectReason('');
      setSelectedReviewId(null);
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể từ chối đánh giá",
        variant: "destructive"
      });
    }
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => adminService.deleteReview(reviewId),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa đánh giá"
      });
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa đánh giá",
        variant: "destructive"
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleApproveReview = (id: number) => {
    approveReviewMutation.mutate(id);
  };

  const handleRejectConfirm = () => {
    if (selectedReviewId && rejectReason.trim()) {
      rejectReviewMutation.mutate({ id: selectedReviewId, reason: rejectReason });
    }
  };

  const openRejectDialog = (id: number) => {
    setSelectedReviewId(id);
    setRejectReason('');
  };

  const handleDeleteReview = (id: number) => {
    deleteReviewMutation.mutate(id);
  };

  // Render stars based on rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    );
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get reviews data from the API response
  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm đánh giá..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={status} 
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          <Filter className="h-4 w-4 mr-2" /> Lọc
        </Button>
      </form>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
              <span className="ml-2">Đang tải dữ liệu đánh giá...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-red-500">
              <p>Đã xảy ra lỗi khi tải danh sách đánh giá</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Người đánh giá</th>
                      <th className="py-2 px-4 text-left">Đánh giá</th>
                      <th className="py-2 px-4 text-left">Dịch vụ</th>
                      <th className="py-2 px-4 text-left">Doanh nghiệp</th>
                      <th className="py-2 px-4 text-left">Nội dung</th>
                      <th className="py-2 px-4 text-left">Ngày</th>
                      <th className="py-2 px-4 text-left">Trạng thái</th>
                      <th className="py-2 px-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{review.customerName}</td>
                        <td className="py-2 px-4">{renderRating(review.rating)}</td>
                        <td className="py-2 px-4">{review.serviceName}</td>
                        <td className="py-2 px-4">{review.businessName}</td>
                        <td className="py-2 px-4">{review.comment}</td>
                        <td className="py-2 px-4">{new Date(review.createdAt).toLocaleDateString()}</td>
                        <td className="py-2 px-4">{renderStatus(review.status)}</td>
                        <td className="py-2 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            {review.status !== 'approved' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon" variant="outline" className="text-green-600"
                                    onClick={() => handleApproveReview(review.id)}>
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Duyệt</TooltipContent>
                              </Tooltip>
                            )}
                            {review.status !== 'rejected' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="icon" variant="outline" className="text-red-600"
                                    onClick={() => openRejectDialog(review.id)}>
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Từ chối đánh giá</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Vui lòng cung cấp lý do từ chối đánh giá này. Người dùng có thể sẽ nhận được thông báo.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <Textarea
                                    placeholder="Lý do từ chối..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="mt-2"
                                  />
                                  <AlertDialogFooter className="mt-4">
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={handleRejectConfirm} 
                                      disabled={!rejectReason.trim()}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Từ chối
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="icon" variant="outline" className="text-red-600"
                                  onClick={() => handleDeleteReview(review.id)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xóa đánh giá</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteReview(review.id)} 
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Trang</span>
                  <Input
                    type="number"
                    size="sm"
                    className="w-16 text-center"
                    min={1}
                    max={pagination.totalPages}
                    value={page}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= pagination.totalPages) {
                        setPage(val);
                      }
                    }}
                  />
                  <span className="text-sm text-muted-foreground">/ {pagination.totalPages}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviews;