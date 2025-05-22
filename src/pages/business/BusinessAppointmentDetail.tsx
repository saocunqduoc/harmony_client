import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/use-api';
import { bookingService, Booking } from '@/api/services/bookingService';
import { format, parseISO, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CreditCard,
  Check,
  X,
  AlertCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Interfaces to better type our booking data from API response
interface BookingService {
  bookingDetailId: number;
  serviceId: number;
  name: string;
  price: number;
  finalPrice: number;
  startTime: string;
  endTime: string;
  staff: {
    id: number;
    fullName: string;
  } | null;
}

interface BookingResponse {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  business: {
    id: number;
    name: string;
  };
  businessAddress: string;
  customer: {
    fullName: string;
    email: string;
    phone: string | null;
  };
  services: BookingService[];
}

const statusLabels: Record<string, string> = {
  draft: 'Nháp',
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  no_show: 'Không đến'
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-purple-100 text-purple-800'
};

const paymentStatusLabels: Record<string, string> = {
  pending: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
  failed: 'Thất bại'
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  refunded: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800'
};

const formatTime = (time: string) => {
  if (!time || time === '00:00:00') return '';
  const [hours, minutes] = time.split(':');
  if (hours == null || minutes == null) return '';
  const h = hours.padStart(2, '0');
  const m = minutes.padStart(2, '0');
  return `${h}:${m}`;
};

const formatCurrency = (value: number | string): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericValue);
};

const safeFormatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, 'dd/MM/yyyy');
    }
    return dateString;
  } catch (error) {
    console.error('Invalid date format:', dateString);
    return 'Invalid date';
  }
};

const BookingStatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge className={statusColors[status] || 'bg-gray-100'}>
      {statusLabels[status] || status}
    </Badge>
  );
};

const PaymentStatusBadge = ({ status }: { status: string }) => {
  return (
    <Badge variant="outline" className={paymentStatusColors[status] || 'bg-gray-100'}>
      {paymentStatusLabels[status] || status}
    </Badge>
  );
};

const BusinessAppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { apiQuery, apiMutation } = useApi();
  
  const bookingId = id ? parseInt(id, 10) : null;
  
  const { 
    data: booking,
    isLoading,
    refetch
  } = apiQuery<BookingResponse>(
    ['businessBookingDetail', bookingId],
    () => bookingId ? bookingService.getBookingDetail(bookingId) : Promise.reject('No booking ID'),
    {
      enabled: !!bookingId,
      meta: {
        onSuccess: (data: BookingResponse) => {
          // Set the initial form values from the fetched data
          setSelectedStatus(data.status || '');
          setSelectedPaymentStatus(data.paymentStatus || 'pending');
        }
      }
    }
  );
  
  const updateStatusMutation = apiMutation(
    async ({ id, status, paymentStatus }: { id: number; status: string; paymentStatus: string }) => {
      // First update the booking status
      const result = await bookingService.updateBookingStatus(
        id,
        status as any,
        paymentStatus
      );
      
      return result;
    },
    {
      onSuccess: () => {
        toast.success('Cập nhật trạng thái thành công');
        setIsUpdateStatusDialogOpen(false);
        refetch();
      },
      onError: (error) => {
        toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
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
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Đang tải thông tin lịch hẹn...</p>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Không tìm thấy lịch hẹn</h2>
        <p className="text-muted-foreground mb-4">Lịch hẹn này không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={goBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={goBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div className="ml-4">
          <h1 className="text-2xl font-bold">Chi tiết lịch hẹn #{booking.id}</h1>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Booking Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Thông tin lịch hẹn</span>
                <div className="flex space-x-2">
                  <BookingStatusBadge status={booking.status} />
                  <PaymentStatusBadge status={booking.paymentStatus || 'pending'} />
                </div>
              </CardTitle>
              <CardDescription>
                Thông tin chi tiết về lịch hẹn và trạng thái hiện tại
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Booking date and time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Ngày đặt lịch</p>
                    <p className="text-muted-foreground">
                      {safeFormatDate(booking.bookingDate)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Thời gian</p>
                    <p className="text-muted-foreground">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Thông tin khách hàng</h3>
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Tên khách hàng</p>
                      <p className="text-muted-foreground">{booking.customer?.fullName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">{booking.customer?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Điện thoại</p>
                      <p className="text-muted-foreground">{booking.customer?.phone || 'Không có thông tin'}</p>
                    </div>
                  </div>
                  {booking.customer?.phone && (
                    <div className="flex space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Số điện thoại</p>
                        <p className="text-muted-foreground">{booking.customer.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {/* Booked services */}
              <div>
                <h3 className="text-lg font-medium mb-4">Dịch vụ đã đặt</h3>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-3 text-left">Dịch vụ</th>
                        <th className="p-3 text-left">Thời gian</th>
                        <th className="p-3 text-right">Giá</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {booking.services && booking.services.map((service) => (
                        <tr key={service.bookingDetailId} className="hover:bg-muted/50">
                          <td className="p-3">
                            <p className="font-medium">{service.name}</p>
                            {service.staff && (
                              <p className="text-sm text-muted-foreground">
                                Nhân viên: {service.staff.fullName || 'N/A'}
                              </p>
                            )}
                          </td>
                          <td className="p-3">
                            <p className="text-sm">
                              {formatTime(service.startTime)} - {formatTime(service.endTime)}
                            </p>
                          </td>
                          <td className="p-3 text-right">
                            <p className="font-medium">{formatCurrency(service.finalPrice)}</p>
                            {service.price > service.finalPrice && (
                              <p className="text-xs text-muted-foreground line-through">
                                {formatCurrency(service.price)}
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted/30 font-medium">
                        <td className="p-3" colSpan={2}>Tổng tiền</td>
                        <td className="p-3 text-right">{formatCurrency(booking.totalAmount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thao tác</CardTitle>
              <CardDescription>Cập nhật trạng thái lịch hẹn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Trạng thái hiện tại</p>
                <div className="flex space-x-2">
                  <BookingStatusBadge status={booking.status} />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Thanh toán</p>
                <div className="flex space-x-2">
                  <PaymentStatusBadge status={booking.paymentStatus || 'pending'} />
                </div>
              </div>
              
              <Separator />
              
              <Button 
                className="w-full" 
                onClick={() => {
                  setSelectedStatus(booking.status);
                  setSelectedPaymentStatus(booking.paymentStatus || 'pending');
                  setIsUpdateStatusDialogOpen(true);
                }}
              >
                Cập nhật trạng thái
              </Button>
              
              {/* Other actions based on status */}
              {booking.status === 'pending' && (
                <div className="space-y-2">
                  <Button 
                    variant="default" 
                    className="w-full" 
                    onClick={() => {
                      setSelectedStatus('confirmed');
                      setSelectedPaymentStatus(booking.paymentStatus || 'pending');
                      setIsUpdateStatusDialogOpen(true);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Xác nhận lịch hẹn
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      setSelectedStatus('cancelled');
                      setSelectedPaymentStatus(booking.paymentStatus || 'pending');
                      setIsUpdateStatusDialogOpen(true);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy lịch hẹn
                  </Button>
                </div>
              )}
              
              {booking.status === 'confirmed' && (
                <div className="space-y-2">
                  <Button 
                    variant="default" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={() => {
                      setSelectedStatus('completed');
                      setSelectedPaymentStatus(booking.paymentStatus !== 'paid' ? 'paid' : booking.paymentStatus);
                      setIsUpdateStatusDialogOpen(true);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Đánh dấu hoàn thành
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      setSelectedStatus('cancelled');
                      setSelectedPaymentStatus(booking.paymentStatus || 'pending');
                      setIsUpdateStatusDialogOpen(true);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy lịch hẹn
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái đặt lịch và thanh toán
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Cập nhật trạng thái đặt lịch</label>
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
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateStatus} 
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessAppointmentDetail;