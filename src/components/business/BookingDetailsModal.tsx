
import React, { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { bookingService, Booking, BookingDetail } from '@/api/services/bookingService';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface BookingDetailsModalProps {
  bookingId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: () => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  bookingId,
  open,
  onOpenChange,
  onStatusChange
}) => {
  const { apiQuery, apiMutation } = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('');
  
  const { data: booking, isLoading } = apiQuery<Booking>(
    ['bookingDetail', bookingId ? bookingId.toString() : null],
    () => bookingId ? bookingService.getBookingDetail2(bookingId) : Promise.reject('No booking ID'),
    {
      enabled: !!bookingId && open,
      meta: {
        onSuccess: (data: Booking) => {
          setSelectedStatus(data.status || '');
          setSelectedPaymentStatus(data.paymentStatus || 'pending');
        }
      }
    }
  );
  
  const updateStatusMutation = apiMutation(
    async ({ id, status, paymentStatus }: { id: number; status: string; paymentStatus: string }) => {
      // Modified to include paymentStatus
      try {
        const response = await fetch(`/api/v1/bookings/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status, paymentStatus })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update booking status');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error updating booking status:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        // toast.success('Cập nhật trạng thái thành công');
        onStatusChange();
        onOpenChange(false);
      },
      onError: (error) => {
        // toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
      },
    }
  );
  
  const handleUpdateStatus = () => {
    if (!bookingId) return;
    
    setIsSubmitting(true);
    updateStatusMutation.mutate({ 
      id: bookingId, 
      status: selectedStatus,
      paymentStatus: selectedPaymentStatus 
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã xác nhận</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xác nhận</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đã hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Đã hủy</Badge>;
      case 'no_show':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Không đến</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã thanh toán</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chưa thanh toán</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đã hoàn tiền</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Thanh toán thất bại</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  
  if (!open) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về lịch hẹn và dịch vụ đã đặt.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : booking ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Trạng thái:</span>
                {getStatusBadge(booking.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Thanh toán:</span>
                {getPaymentStatusBadge(booking.paymentStatus || 'pending')}
              </div>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground mr-1">Mã lịch hẹn:</span>
              <span className="font-mono">#{booking.id}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:gap-8">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
            </div>
            
            <Separator />
            
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-medium mb-3">Thông tin khách hàng</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.customer?.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.customer?.email}</span>
                </div>
                {booking.customer?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.customer.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Services */}
            <div>
              <h3 className="text-sm font-medium mb-3">Dịch vụ đã đặt</h3>
              <div className="space-y-3">
                {booking.details.map((detail: BookingDetail) => (
                  <div key={detail.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{detail.serviceName}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{detail.startTime} - {detail.endTime}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {detail.discount > 0 && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatCurrency(detail.price)}
                        </p>
                      )}
                      <p className="font-medium">{formatCurrency(detail.finalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Payment */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tổng thanh toán</span>
              </div>
              <span className="text-lg font-bold">{formatCurrency(booking.totalAmount)}</span>
            </div>
            
            <Separator />
            
            {/* Update Status Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Cập nhật trạng thái</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                    <SelectItem value="no_show">Không đến</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Cập nhật thanh toán</label>
                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái thanh toán" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chưa thanh toán</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                    <SelectItem value="failed">Thanh toán thất bại</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                onClick={handleUpdateStatus}
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Cập nhật trạng thái
              </Button>
              
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            Không thể tải thông tin lịch hẹn.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetailsModal;
