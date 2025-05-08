import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '@/hooks/use-api';
import { bookingService, Booking, BookingFilters } from '@/api/services/bookingService';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  Filter, 
  ArrowUpDown, 
  Loader2, 
  RefreshCw,
  Eye 
} from 'lucide-react';
import BookingDetailsModal from '@/components/business/BookingDetailsModal';

const AdminBookings = () => {
  // Tham chiếu để theo dõi khi nào cần refetch thủ công
  const shouldRefetch = useRef(false);
  
  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    status: '',
    date: '',
    page: 1,
    limit: 10,
    sort: 'DESC',
    sortBy: 'bookingDate'
  });
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const { apiQuery } = useApi();
  
  // Sử dụng tham số filters trực tiếp trong queryKey thay vì JSON.stringify
  const { 
    data: bookingsData, 
    isLoading, 
    refetch 
  } = apiQuery(
    ['adminBookings', filters.page, filters.limit, filters.search, filters.status, filters.date, filters.sort, filters.sortBy],
    () => bookingService.getAllBookings(filters)
  );
  
  // Đảm bảo refetch được gọi khi filters thay đổi
  useEffect(() => {
    if (shouldRefetch.current) {
      refetch();
      shouldRefetch.current = false;
    }
  }, [refetch, filters]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    shouldRefetch.current = true;
    setFilters(prev => ({ ...prev }));
  };
  
  const handleFilterChange = (key: string, value: string | number) => {
    // Special handling for status filter - convert 'all' to empty string for API
    if (key === 'status' && value === 'all') {
      value = '';
    }
    
    shouldRefetch.current = true;
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Nếu thay đổi bất kỳ bộ lọc nào ngoài trang, reset về trang 1
      page: key !== 'page' ? 1 : value
    }));
  };
  
  const handleNextPage = () => {
    const nextPage = Math.min(totalPages, Number(filters.page) + 1);
    shouldRefetch.current = true;
    setFilters(prev => ({
      ...prev,
      page: nextPage
    }));
  };
  
  const handlePrevPage = () => {
    const prevPage = Math.max(1, Number(filters.page) - 1);
    shouldRefetch.current = true;
    setFilters(prev => ({
      ...prev,
      page: prevPage
    }));
  };
  
  const handlePageSelect = (pageNumber: number) => {
    shouldRefetch.current = true;
    setFilters(prev => ({
      ...prev,
      page: pageNumber
    }));
  };
  
  const handleClearFilters = () => {
    shouldRefetch.current = true;
    setFilters({
      search: '',
      status: '',
      date: '',
      page: 1,
      limit: 10,
      sort: 'DESC',
      sortBy: 'bookingDate'
    });
  };
  
  const handleSort = (column: string) => {
    shouldRefetch.current = true;
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sort: prev.sortBy === column && prev.sort === 'DESC' ? 'ASC' : 'DESC'
    }));
  };
  
  const handleViewDetails = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsDetailsModalOpen(true);
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
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Nháp</Badge>;
      case 'no_show':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Không đến</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Hàm để định dạng thời gian, chỉ lấy giờ và phút
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    
    // Nếu thời gian đã ở định dạng "HH:MM" thì trả về nguyên bản
    if (/^\d{1,2}:\d{2}$/.test(timeString)) return timeString;
    
    // Nếu thời gian ở định dạng ISO hoặc có chứa thông tin khác
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        // Nếu không phải ngày hợp lệ, xem như là string "HH:MM:SS" và cắt bỏ phần giây
        return timeString.split(':').slice(0, 2).join(':');
      }
      return date.getHours().toString().padStart(2, '0') + ':' + 
             date.getMinutes().toString().padStart(2, '0');
    } catch (e) {
      return timeString;
    }
  };

  // Check if bookings data is available and has the correct structure
  const hasBookings = bookingsData && bookingsData.bookings && Array.isArray(bookingsData.bookings);
  const bookings = hasBookings ? bookingsData.bookings : [];
  const totalPages = bookingsData?.totalPages || 0;
  
  // Get the display value for the status filter
  const getStatusDisplayValue = () => {
    return filters.status || 'all';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý đặt lịch</h2>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm khách hàng, doanh nghiệp..."
                    className="pl-8"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </form>
            </div>
            
            <div>
              <Select 
                value={getStatusDisplayValue()} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="no_show">Không đến</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  placeholder="Ngày đặt lịch"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap"
                onClick={handleClearFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
              
              <Button 
                size="sm" 
                className="whitespace-nowrap"
                onClick={() => refetch()}
              >
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !hasBookings || bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Không có lịch hẹn nào</h3>
              <p className="text-muted-foreground mb-6">
                Không tìm thấy lịch hẹn nào phù hợp với bộ lọc của bạn.
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Mã</TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center cursor-pointer" 
                          onClick={() => handleSort('bookingDate')}
                        >
                          Ngày đặt
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Giờ</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Doanh nghiệp</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thanh toán</TableHead>
                      <TableHead className="text-right">Tổng tiền</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>
                          {format(new Date(booking.bookingDate || booking.date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.customer?.fullName}</div>
                          <div className="text-sm text-muted-foreground">{booking.customer?.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.business?.name || booking.businessName}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          {booking.paymentStatus === 'paid' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                              Đã thanh toán
                            </Badge>
                          ) : booking.paymentStatus === 'failed' ? (
                            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                              Thất bại
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              Chưa thanh toán
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(booking.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(booking.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={Number(filters.page) <= 1}
                  >
                    Trước
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Tính toán số trang để hiển thị xung quanh trang hiện tại
                      let currentPage = Number(filters.page);
                      let pageToShow;
                      
                      if (totalPages <= 5) {
                        // Nếu có 5 trang trở xuống, hiển thị tất cả
                        pageToShow = i + 1;
                      } else if (currentPage <= 3) {
                        // Nếu đang ở trang đầu, hiển thị 1-5
                        pageToShow = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // Nếu đang ở trang cuối, hiển thị totalPages-4 đến totalPages
                        pageToShow = totalPages - 4 + i;
                      } else {
                        // Hiển thị 2 trang trước và sau trang hiện tại
                        pageToShow = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageToShow}
                          variant={Number(filters.page) === pageToShow ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageSelect(pageToShow)}
                          className="w-9"
                        >
                          {pageToShow}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={Number(filters.page) >= totalPages}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <BookingDetailsModal
        bookingId={selectedBookingId}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        onStatusChange={refetch}
      />
    </div>
  );
};

export default AdminBookings;
