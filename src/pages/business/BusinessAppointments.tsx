
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, X, Info, AlertCircle, Phone, Calendar, Clock, User, Search } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { bookingService, Booking as BookingType } from '@/api/services/bookingService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const statusColorMap: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-purple-100 text-purple-800"
};

const paymentStatusColorMap: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-blue-100 text-blue-800",
  failed: "bg-red-100 text-red-800"
};

const BookingStatusBadge = ({ status }: { status: string }) => {
  const statusDisplay: Record<string, string> = {
    draft: 'Nháp',
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    no_show: 'Không đến'
  };

  const colorClass = statusColorMap[status as keyof typeof statusColorMap] || "bg-gray-100 text-gray-800";
  return <Badge className={`${colorClass} font-normal`}>{statusDisplay[status] || status}</Badge>;
};

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const statusDisplay: Record<string, string> = {
    pending: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
    refunded: 'Đã hoàn tiền',
    failed: 'Thất bại'
  };

  const colorClass = paymentStatusColorMap[status as keyof typeof paymentStatusColorMap] || "bg-gray-100 text-gray-800";
  return <Badge variant="outline" className={`${colorClass} font-normal`}>{statusDisplay[status] || status}</Badge>;
};

const formatTime = (timeString: string) => {
  if (!timeString || timeString === '00:00:00') return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
};

interface BusinessBooking {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  customer: {
    fullName: string;
    email: string;
    phone?: string | null; // Changed to optional to match the data structure
  };
}

const BusinessAppointments = () => {
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState<BusinessBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const formattedDate = format(date, 'yyyy-MM-dd');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBusinessBookings({ date: formattedDate });
      
      if (response && response.bookings) {
        // Map the API response to our BusinessBooking interface
        const formattedBookings: BusinessBooking[] = response.bookings.map(booking => ({
          id: booking.id,
          bookingDate: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          totalAmount: booking.totalAmount.toString(),
          paymentStatus: booking.paymentStatus || 'pending',
          customer: booking.customer || {
            fullName: 'N/A',
            email: 'N/A',
            phone: null
          }
        }));
        
        setBookings(formattedBookings);
      } else {
        console.error('Unexpected response structure:', response);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Không thể tải lịch hẹn');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [date]);

  const handlePreviousDay = () => {
    setDate(subDays(date, 1));
  };

  const handleNextDay = () => {
    setDate(addDays(date, 1));
  };

  const handleViewDetails = (bookingId: number) => {
    navigate(`/business-dashboard/appointments/${bookingId}`);
  };

  const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus as any);
      toast.success('Cập nhật trạng thái thành công');
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const filteredBookingsByStatus = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const filteredBookings = filteredBookingsByStatus.filter(booking => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      booking.customer?.fullName?.toLowerCase().includes(query) ||
      booking.customer?.email?.toLowerCase().includes(query) ||
      (booking.customer?.phone && booking.customer.phone.toLowerCase().includes(query)) ||
      booking.id.toString().includes(query) ||
      booking.totalAmount.includes(query)
    );
  });

  return (
    <div className="container px-4 pb-8 pt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lịch hẹn của bạn</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">{format(date, 'dd/MM/yyyy')}</div>
          <Button variant="outline" size="sm" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
              <SelectItem value="no_show">Không đến</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khách hàng..."
              className="pl-10 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchBookings} className="ml-auto md:ml-0">
          Làm mới
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Lịch hẹn trong ngày</CardTitle>
          <CardDescription>
            Xem và quản lý lịch hẹn cho ngày {format(date, 'dd/MM/yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Đang tải...</p>
            </div>
          ) : filteredBookings && filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.customer?.fullName || 'N/A'}</div>
                        {booking.customer?.phone && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {booking.customer.phone}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {booking.customer?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span className="text-sm">{format(parseISO(booking.bookingDate), 'dd/MM/yyyy')}</span>
                          </div>
                          {booking.startTime && booking.startTime !== '00:00:00' && (
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-sm">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <BookingStatusBadge status={booking.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={booking.paymentStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking.id)}>
                            Chi tiết
                          </Button>
                          
                          {booking.status === 'pending' && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Cập nhật
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-56 p-2">
                                <div className="space-y-2">
                                  <Button 
                                    size="sm" 
                                    variant="default" 
                                    className="w-full"
                                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                  >
                                    <Check className="h-4 w-4 mr-2" /> Xác nhận
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="default" 
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                  >
                                    <Check className="h-4 w-4 mr-2" /> Hoàn thành
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    className="w-full"
                                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                  >
                                    <X className="h-4 w-4 mr-2" /> Hủy bỏ
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => handleUpdateStatus(booking.id, 'no_show')}
                                  >
                                    <User className="h-4 w-4 mr-2" /> Không đến
                                  </Button>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Cập nhật
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-56 p-2">
                                <div className="space-y-2">
                                  <Button 
                                    size="sm" 
                                    variant="default" 
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                  >
                                    <Check className="h-4 w-4 mr-2" /> Hoàn thành
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive" 
                                    className="w-full"
                                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                  >
                                    <X className="h-4 w-4 mr-2" /> Hủy bỏ
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => handleUpdateStatus(booking.id, 'no_show')}
                                  >
                                    <User className="h-4 w-4 mr-2" /> Không đến
                                  </Button>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Không có lịch hẹn nào trong ngày này.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessAppointments;
