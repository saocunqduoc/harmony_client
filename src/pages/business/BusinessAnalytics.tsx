import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { businessService, ServicePerformance, RevenueAnalysis, CustomerAnalysis } from '@/api/services/businessService';
import { BarChart, LineChart, PieChart, formatCurrency } from '@/components/ui/charts';

// map English weekday names to Vietnamese
const dayMap: Record<string, string> = {
  Monday: 'Thứ Hai',
  Tuesday: 'Thứ Ba',
  Wednesday: 'Thứ Tư',
  Thursday: 'Thứ Năm',
  Friday: 'Thứ Sáu',
  Saturday: 'Thứ Bảy',
  Sunday: 'Chủ Nhật',
};
const translateDay = (eng: string) => dayMap[eng] || eng;

const BusinessAnalytics = () => {
  // date‐range filter state
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0,10);
  });
  const [toDate, setToDate] = useState<string>(new Date().toISOString().slice(0,10));

  // analytics state
  const [revenueTrend, setRevenueTrend] = useState<RevenuePerDay[]>([]);
  const [bookingsPerDay, setBookingsPerDay] = useState<BookingPerDay[]>([]);
  const [popularServices, setPopularServices] = useState<PopularService[]>([]);
  const [ratingsDist, setRatingsDist] = useState<RatingDistribution[]>([]);

  // new analytics state
  const [servicePerf, setServicePerf] = useState<ServicePerformance[]>([]);
  const [revAnalysis, setRevAnalysis] = useState<RevenueAnalysis | null>(null);
  const [custAnalysis, setCustAnalysis] = useState<CustomerAnalysis | null>(null);

  const fetchOverview = () => {
    businessService.getBusinessRevenue({ from: fromDate, to: toDate }).then(setRevenueTrend);
    businessService.getBusinessBookingsPerDay({ from: fromDate, to: toDate }).then(setBookingsPerDay);
    businessService.getBusinessPopularServices({ from: fromDate, to: toDate }).then(setPopularServices);
    businessService.getBusinessRatings({ from: fromDate, to: toDate }).then(setRatingsDist);

    // thêm các tab khác
    businessService.getServicePerformance({ from: fromDate, to: toDate }).then(setServicePerf);
    businessService.getRevenueAnalysis({ from: fromDate, to: toDate }).then(setRevAnalysis);
    businessService.getCustomerAnalysis({ from: fromDate, to: toDate }).then(setCustAnalysis);
  };

  useEffect(() => {
    // initial load for all analytics
    fetchOverview();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thống kê</h1>

      {/* date‐range filter */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border px-2 py-1"
        />
        <button
          onClick={fetchOverview}
          className="px-4 py-1 bg-blue-600 text-white rounded"
        >
          Lọc
        </button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="services">Dịch vụ</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
          <TabsTrigger value="customers">Khách hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
                <CardDescription>Xu hướng doanh thu</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={revenueTrend}
                  index="date"
                  categories={['total']}
                  colors={['blue']}
                  valueFormatter={formatCurrency}
                  className="h-72"
                />
              </CardContent>
            </Card>

            {/* bookings chart with translated days */}
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn</CardTitle>
                <CardDescription>Số lượng lịch hẹn theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={bookingsPerDay.map(item => ({
                    name: translateDay(item.name),
                    value: item.value
                  }))}
                  index="name"
                  categories={['value']}
                  colors={['purple']}
                  className="h-72"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Dịch vụ phổ biến</CardTitle>
                <CardDescription>Dịch vụ được đặt nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={popularServices}
                  index="name"
                  categories={['value']}
                  colors={['blue','teal','indigo','rose','orange']}
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mức độ hài lòng của khách hàng</CardTitle>
                <CardDescription>Phân bố đánh giá</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={ratingsDist.map(r=>({ name: `${r.rating} Sao`, value: r.count }))}
                  index="name"
                  categories={['value']}
                  colors={['amber']}
                  className="h-72"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SERVICES TAB */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất dịch vụ</CardTitle>
              <CardDescription>Thống kê lượt đặt và doanh thu</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead className="text-right">Lượt đặt</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                    <TableHead className="text-right">Đánh giá TB</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicePerf.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell className="text-right">{s.totalBookings}</TableCell>
                      <TableCell className="text-right">{formatCurrency(s.totalRevenue)}</TableCell>
                      <TableCell className="text-right">{s.averageRating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REVENUE TAB */}
        <TabsContent value="revenue">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                {formatCurrency(revAnalysis?.totalRevenue || 0)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Số giao dịch</CardTitle>
              </CardHeader>
              <CardContent>
                {revAnalysis?.totalTransactions || 0}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Giá trị trung bình</CardTitle>
              </CardHeader>
              <CardContent>
                {formatCurrency(revAnalysis?.averageBooking || 0)}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CUSTOMERS TAB */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích khách hàng</CardTitle>
              <CardDescription>Top khách hàng và số lượt đặt</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead className="text-right">Lượt đặt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {custAnalysis?.topCustomers.map((c, i) => (
                    <TableRow key={i}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.phone}</TableCell>
                      <TableCell className="text-right">{c.bookingCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalytics;
