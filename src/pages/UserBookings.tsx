import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isValid } from 'date-fns';
import { bookingService } from '@/api/services/bookingService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { Calendar, Clock, Trash2, Pencil, BuildingIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import EditBookingModal from '@/components/bookings/EditBookingModal';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

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

interface EditBookingModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const safeFormatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
    return dateString;
  } catch (error) {
    console.error('Invalid date format:', dateString);
    return 'Invalid date';
  }
};

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

const UserBookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('draft');
  const [editBookingDetailId, setEditBookingDetailId] = useState<number | null>(null);
   // Thêm state để quản lý dialog
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [deleteDetailDialogOpen, setDeleteDetailDialogOpen] = useState(false);
   const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
   const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  
  React.useEffect(() => {
    if (tabFromUrl && ['upcoming', 'draft', 'past', 'cancelled', 'failed'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const { data: bookingsData, isLoading, error, refetch } = useQuery({
    queryKey: ['userBookings', activeTab],
    queryFn: () => {
      let params: any = {};
      
      switch (activeTab) {
        case 'upcoming':
          params = {
            status: ['pending', 'confirmed'].join(','),
            paymentStatus: ['pending', 'paid'].join(',')
          };
          break;
        case 'draft':
          params.status = 'draft';
          break;
        case 'past':
          params.status = 'completed';
          break;
        case 'cancelled':
          params.status = 'cancelled';
          break;
        case 'failed':
          params.paymentStatus = 'failed';
          break;
      }
      
      return bookingService.getUserBookings(params);
    }
  });

  const bookings = bookingsData?.data?.bookings || {};
  const bookingDates = Object.keys(bookings).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const navigateToBusinessPage = (businessId: number) => {
    navigate(`/business/${businessId}`);
  };


  // Sửa lại hàm handleDeleteBookingDetail
  const handleDeleteBookingDetail = async (detailId: number) => {
    setSelectedDetailId(detailId);
    setDeleteDetailDialogOpen(true);
  };

  // Thêm hàm xử lý xác nhận xóa detail
  const confirmDeleteDetail = async () => {
    if (!selectedDetailId) return;
    
    try {
      await bookingService.deleteBookingDetail(selectedDetailId);
      toast.success('Đã hủy dịch vụ thành công');
      refetch();
    } catch (error) {
      console.error('Error cancelling booking detail:', error);
      toast.error('Không thể hủy dịch vụ này');
    } finally {
      setDeleteDetailDialogOpen(false);
      setSelectedDetailId(null);
    }
  };

  // Sửa lại hàm handleDelete
  const handleDelete = async (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setDeleteDialogOpen(true);
  };

  // Thêm hàm xử lý xác nhận xóa booking
  const confirmDelete = async () => {
    if (!selectedBookingId) return;
    
    try {
      await bookingService.cancelBooking(selectedBookingId);
      toast.success('Đã hủy đặt lịch thành công');
      refetch();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Không thể hủy đặt lịch');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedBookingId(null);
    }
  };

  const handleCheckout = (booking: any) => {
    const bookingId = parseInt(booking.bookingId, 10);
    navigate(`/checkout/${bookingId}`);
  };

  const handleAddMoreServices = (businessId: number) => {
    navigate(`/business/${businessId}?tab=services`);
  };

  const handleNavigateToReview = (bookingId: number) => {
    navigate(`/booking/${bookingId}/review`);
  };

  const filteredBookingDates = bookingDates.filter(date => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      Object.values(bookings[date]).some(booking => 
        booking.businessName?.toLowerCase().includes(searchLower) ||
        booking.services.some((service: any) => 
          service.serviceName?.toLowerCase().includes(searchLower)
        )
      )
    );
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Lịch hẹn của tôi</h1>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm lịch hẹn..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Sắp đến</TabsTrigger>
            <TabsTrigger value="draft">Nháp</TabsTrigger>
            <TabsTrigger value="past">Đã xong</TabsTrigger>
            <TabsTrigger value="cancelled">Bị hủy</TabsTrigger>
            <TabsTrigger value="failed">Lỗi</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading bookings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Error loading bookings. Please try again.</p>
                <Button onClick={() => refetch()} className="mt-4">Retry</Button>
              </div>
            ) : filteredBookingDates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No bookings found.</p>
                <Button asChild>
                  <Link to="/services">Browse Services</Link>
                </Button>
              </div>
            ) : (
              filteredBookingDates.map(date => (
                <div key={date} className="mb-8">
                  <div className="flex items-center mb-4">
                    <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-medium">
                      {safeFormatDate(date)}
                    </h2>
                  </div>
                  
                  {bookings[date].map((booking: any) => (
                    <Card key={booking.bookingId} className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div 
                              className="text-lg font-medium cursor-pointer hover:text-primary hover:underline"
                              onClick={() => navigateToBusinessPage(booking.businessId)}
                            >
                              {/* <BuildingIcon className="inline-block mr-2 h-4 w-4" /> */}
                              {booking.businessName}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={statusColors[booking.status] || 'bg-gray-100'}>
                              {statusLabels[booking.status] || booking.status}
                            </Badge>
                            <Badge variant="outline" className={paymentStatusColors[booking.paymentStatus] || 'bg-gray-100'}>
                              {paymentStatusLabels[booking.paymentStatus] || booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="inline-block mr-2 h-4 w-4" />
                          <span>Thời gian: {booking.bookingDate ? format(parseISO(booking.bookingDate), 'dd/MM/yyyy') : 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <BuildingIcon className="inline-block mr-2 h-4 w-4" />
                          <span>Địa chỉ: {booking.businessAddress}</span>
                        </div>

                        
                        {booking.services.map((service: any) => (
                          <div key={service.bookingDetailId} className="py-2 border-b last:border-0">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">{service.serviceName}</h3>
                                {service.startTime && service.startTime !== '00:00:00' && (
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>
                                      {formatTime(service.startTime)} - {formatTime(service.endTime)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  {parseInt(service.finalPrice).toLocaleString('vi-VN')} VND
                                </div>
                                {(activeTab === 'draft' 
                                // || (activeTab === 'upcoming' && booking.status === 'pending')
                              ) && (
                                  <div className="flex mt-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-700 h-8 w-8"
                                      onClick={() => handleDeleteBookingDetail(parseInt(service.bookingDetailId, 10))}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-blue-500 hover:text-blue-700 h-8 w-8"
                                      onClick={() => setEditBookingDetailId(parseInt(service.bookingDetailId, 10))}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex justify-between items-center pt-4">
                          <span className="font-medium">Tổng tiền:</span>
                          <span className="font-bold">
                            {parseInt(booking.totalAmount).toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                        
                        {activeTab === 'draft' && (
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddMoreServices(parseInt(booking.businessId, 10))}
                            >
                              Add More Services
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleCheckout(booking)}
                            >
                              Đặt lịch
                            </Button>
                          </div>
                        )}
                        
                        {activeTab === 'past' && (
                          <div className="flex justify-end mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleNavigateToReview(parseInt(booking.bookingId, 10))}
                            >
                              Đánh giá
                            </Button>
                          </div>
                        )}
                        
                        {activeTab === 'upcoming' && booking.status === 'pending' && (
                          <div className="flex justify-end mt-4">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(parseInt(booking.bookingId, 10))}
                            >
                              Hủy lịch
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {editBookingDetailId && (
        <EditBookingModal
          bookingDetailId={editBookingDetailId}
          isOpen={!!editBookingDetailId}
          onClose={() => setEditBookingDetailId(null)}
          onSave={() => {
            setEditBookingDetailId(null);
            refetch();
          }}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy đặt lịch</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy lịch đặt này không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Không, giữ lại
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Có, hủy đặt lịch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Thêm Dialog xác nhận xóa BookingDetail */}
      <AlertDialog open={deleteDetailDialogOpen} onOpenChange={setDeleteDetailDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy dịch vụ này không? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDetailDialogOpen(false)}>
              Không, giữ lại
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDetail} className="bg-red-500 hover:bg-red-600">
              Có, hủy dịch vụ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default UserBookings;
