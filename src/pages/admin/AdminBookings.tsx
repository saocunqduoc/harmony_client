import React, { useState } from 'react';
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
  
  const { 
    data: bookingsData, 
    isLoading, 
    refetch 
  } = apiQuery(
    ['adminBookings', JSON.stringify(filters)],
    () => bookingService.getAllBookings(filters),
    {
      placeholderData: (previousData) => previousData
    }
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  const handleFilterChange = (key: string, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : prev.page
    }));
  };
  
  const handleClearFilters = () => {
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
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
                value={filters.status as string} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
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
          ) : !bookingsData?.bookings.length ? (
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
                    {bookingsData?.bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>
                          {format(new Date(booking.date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          {booking.startTime} - {booking.endTime}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.customer?.fullName}</div>
                          <div className="text-sm text-muted-foreground">{booking.customer?.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.businessName}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          {booking.paymentStatus === 'paid' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                              Đã thanh toán
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
              {bookingsData && bookingsData.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('page', Number(filters.page) - 1)}
                    disabled={Number(filters.page) <= 1}
                  >
                    Trước
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: bookingsData.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={Number(filters.page) === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange('page', page)}
                        className="w-9"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterChange('page', Number(filters.page) + 1)}
                    disabled={Number(filters.page) >= bookingsData.totalPages}
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
