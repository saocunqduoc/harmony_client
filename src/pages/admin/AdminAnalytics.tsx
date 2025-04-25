import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { adminService, DashboardStats } from '@/api/services/adminService';
import { Loader2, CreditCard, User, Building2, Package2, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Added states for additional API data
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  
  const [topBusinesses, setTopBusinesses] = useState<any[]>([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(false);
  const [businessError, setBusinessError] = useState<string | null>(null);
  
  const [topServices, setTopServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  // Main dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching dashboard stats...');
        const response = await adminService.getDashboardStats();
        console.log('API Response (raw):', response);
        
        // If the data is directly in the response or nested in data property
        const data = response.data || response;
        console.log('Dashboard stats (parsed):', data);
        
        setDashboardStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard statistics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);
  
  // Function to fetch data when a tab is selected
  const handleTabChange = (value: string) => {
    switch(value) {
      case 'users':
        fetchTopCustomers();
        break;
      case 'businesses':
        fetchTopBusinesses();
        break;
      case 'revenue':
        fetchTopServices();
        break;
      default:
        break;
    }
  };

  // Fetch top customers data
  const fetchTopCustomers = async () => {
    if (topCustomers.length > 0) return; // Already loaded
    
    try {
      setIsLoadingCustomers(true);
      setCustomerError(null);
      const data = await adminService.getTopCustomers();
      console.log('Top customers data:', data);
      setTopCustomers(data);
    } catch (err) {
      console.error('Failed to fetch top customers:', err);
      setCustomerError('Không thể tải dữ liệu khách hàng.');
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Fetch top businesses data
  const fetchTopBusinesses = async () => {
    if (topBusinesses.length > 0) return; // Already loaded
    
    try {
      setIsLoadingBusinesses(true);
      setBusinessError(null);
      const data = await adminService.getTopBusinessesByRevenue();
      console.log('Top businesses data:', data);
      setTopBusinesses(data);
    } catch (err) {
      console.error('Failed to fetch top businesses:', err);
      setBusinessError('Không thể tải dữ liệu doanh nghiệp.');
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  // Fetch top services data
  const fetchTopServices = async () => {
    if (topServices.length > 0) return; // Already loaded
    
    try {
      setIsLoadingServices(true);
      setServiceError(null);
      const data = await adminService.getTopServicesByUsage();
      console.log('Top services data:', data);
      setTopServices(data);
    } catch (err) {
      console.error('Failed to fetch top services:', err);
      setServiceError('Không thể tải dữ liệu dịch vụ.');
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Format currency
  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(numValue);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
        <span className="ml-2">Đang tải dữ liệu thống kê...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Default empty stats if data is not available
  const counts = dashboardStats?.counts || { users: 0, businesses: 0, services: 0, bookings: 0 };
  const userRegistrations = dashboardStats?.userRegistrations || [];
  const recentBookings = dashboardStats?.recentBookings || [];
  const revenue = dashboardStats?.revenue || { total: 0, monthly: [] };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thống kê hệ thống</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{counts.users}</div>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng doanh nghiệp</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{counts.businesses}</div>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng dịch vụ</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{counts.services}</div>
            <Package2 className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng lịch hẹn</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-2xl font-bold">{counts.bookings}</div>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="businesses">Doanh nghiệp</TabsTrigger>
          <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Overview tab content - unchanged */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Tăng trưởng người dùng</CardTitle>
                <CardDescription>Đăng ký người dùng theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                {userRegistrations.length > 0 ? (
                  <LineChart 
                    data={userRegistrations}
                    index="month"
                    categories={['count']}
                    colors={['blue']}
                    valueFormatter={(value) => `${value} người dùng`}
                    className="h-72"
                  />
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    Không có dữ liệu
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Lịch hẹn gần đây</CardDescription>
              </CardHeader>
              <CardContent>
                {recentBookings.length > 0 ? (
                  <div className="space-y-4 max-h-72 overflow-auto">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="p-3 border rounded-md">
                        <p className="font-medium">{booking.booking_date} lúc {booking.booking_time}</p>
                        <p className="text-sm text-muted-foreground">Người dùng: {booking.user?.name || 'Không xác định'}</p>
                        <p className="text-sm text-muted-foreground">Doanh nghiệp: {booking.business?.name || 'Không xác định'}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'completed' ? 'Đã hoàn thành' : 
                           booking.status === 'confirmed' ? 'Đã xác nhận' :
                           booking.status === 'cancelled' ? 'Đã hủy' : booking.status || 'Không xác định'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    Không có lịch hẹn gần đây
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Doanh thu theo tháng</CardTitle>
                <CardDescription>Phân tích doanh thu theo tháng</CardDescription>
              </CardHeader>
              <CardContent>
                {revenue.monthly && revenue.monthly.some(val => val > 0) ? (
                  <PieChart 
                    data={[
                      { name: '1', value: revenue.monthly[0] || 0 },
                      { name: '2', value: revenue.monthly[1] || 0 },
                      { name: '3', value: revenue.monthly[2] || 0 },
                      { name: '4', value: revenue.monthly[3] || 0 },
                      { name: '5', value: revenue.monthly[4] || 0 },
                      { name: '6', value: revenue.monthly[5] || 0 },
                      { name: '7', value: revenue.monthly[0] || 0 },
                      { name: '8', value: revenue.monthly[1] || 0 },
                      { name: '9', value: revenue.monthly[2] || 0 },
                      { name: '10', value: revenue.monthly[3] || 0 },
                      { name: '11', value: revenue.monthly[4] || 0 },
                      { name: '12', value: revenue.monthly[5] || 0 },
                    ].filter(item => item.value > 0)}
                    index="name"
                    categories={['value']}
                    colors={[
                      '#3B82F6', '#14B8A6', '#F59E0B', '#F43F5E', '#6366F1', '#10B981',
                      '#06B6D4', '#84CC16', '#FB923C', '#EC4899', '#8B5CF6', '#38BDF8'
                    ]}
                    valueFormatter={(value) => formatCurrency(value)}
                    className="h-72"
                  />
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    Không có dữ liệu doanh thu
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tổng doanh thu</CardTitle>
                <CardDescription>Doanh thu nền tảng theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                {revenue.monthly ? (
                  <LineChart 
                    data={[
                      { name: '1', value: revenue.monthly[0] || 0 },
                      { name: '2', value: revenue.monthly[1] || 0 },
                      { name: '3', value: revenue.monthly[2] || 0 },
                      { name: '4', value: revenue.monthly[3] || 0 },
                      { name: '5', value: revenue.monthly[4] || 0 },
                      { name: '6', value: revenue.monthly[5] || 0 },
                      { name: '7', value: revenue.monthly[6] || 0 },
                      { name: '8', value: revenue.monthly[7] || 0 },
                      { name: '9', value: revenue.monthly[8] || 0 },
                      { name: '10', value: revenue.monthly[9] || 0 },
                      { name: '11', value: revenue.monthly[10] || 0 },
                      { name: '12', value: revenue.monthly[11] || 0 },
                    ]}
                    index="name"
                    categories={['value']}
                    colors={['teal']}
                    valueFormatter={(value) => formatCurrency(value)}
                    className="h-72"
                  />
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    Không có dữ liệu doanh thu
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Khách hàng hàng đầu</CardTitle>
              <CardDescription>Khách hàng có chi tiêu nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCustomers ? (
                <div className="flex justify-center items-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
                  <span className="ml-2">Đang tải dữ liệu khách hàng...</span>
                </div>
              ) : customerError ? (
                <div className="flex justify-center items-center h-80 text-red-500">
                  <p>{customerError}</p>
                </div>
              ) : topCustomers.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  Không có dữ liệu khách hàng
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">STT</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Đặt lịch</TableHead>
                        <TableHead>Tổng chi tiêu</TableHead>
                        <TableHead>Dịch vụ sử dụng nhiều nhất</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCustomers.map((customer, index) => (
                        <TableRow key={customer.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                {customer.avatar ? (
                                  <AvatarImage src={customer.avatar} alt={customer.fullName} />
                                ) : null}
                                <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{customer.fullName}</div>
                                <div className="text-sm text-muted-foreground">{customer.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.bookingCount}</TableCell>
                          <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
                          <TableCell>
                            {customer.mostUsedService ? (
                              <div>
                                <div className="font-medium">{customer.mostUsedService.serviceName}</div>
                                <div className="text-sm text-muted-foreground">
                                  {customer.mostUsedService.business.name} • {customer.mostUsedService.usedCount} lần
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Không có dữ liệu</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="businesses">
          <Card>
            <CardHeader>
              <CardTitle>Doanh nghiệp hàng đầu</CardTitle>
              <CardDescription>Doanh nghiệp có doanh thu cao nhất</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBusinesses ? (
                <div className="flex justify-center items-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
                  <span className="ml-2">Đang tải dữ liệu doanh nghiệp...</span>
                </div>
              ) : businessError ? (
                <div className="flex justify-center items-center h-80 text-red-500">
                  <p>{businessError}</p>
                </div>
              ) : topBusinesses.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  Không có dữ liệu doanh nghiệp
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">STT</TableHead>
                        <TableHead>Doanh nghiệp</TableHead>
                        <TableHead>Tổng doanh thu</TableHead>
                        <TableHead>Dịch vụ phổ biến nhất</TableHead>
                        <TableHead>Dịch vụ doanh thu cao nhất</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topBusinesses.map((business, index) => (
                        <TableRow key={business.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="font-medium">{business.name}</div>
                          </TableCell>
                          <TableCell>{formatCurrency(business.totalRevenue)}</TableCell>
                          <TableCell>
                            {business.mostUsedService ? (
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="font-medium">{business.mostUsedService.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {business.mostUsedService.usedCount} lần sử dụng
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Không có dữ liệu</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {business.highestRevenueService ? (
                              <div>
                                <div className="font-medium">{business.highestRevenueService.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatCurrency(business.highestRevenueService.totalRevenue)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Không có dữ liệu</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Dịch vụ hàng đầu</CardTitle>
              <CardDescription>Dịch vụ được sử dụng nhiều nhất và tạo ra nhiều doanh thu nhất</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingServices ? (
                <div className="flex justify-center items-center h-80">
                  <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
                  <span className="ml-2">Đang tải dữ liệu dịch vụ...</span>
                </div>
              ) : serviceError ? (
                <div className="flex justify-center items-center h-80 text-red-500">
                  <p>{serviceError}</p>
                </div>
              ) : topServices.length === 0 ? (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  Không có dữ liệu dịch vụ
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">STT</TableHead>
                        <TableHead>Dịch vụ</TableHead>
                        <TableHead>Doanh nghiệp</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead className="text-center">Số lần sử dụng</TableHead>
                        <TableHead>Đơn giá</TableHead>
                        <TableHead>Tổng doanh thu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topServices.map((service, index) => (
                        <TableRow key={service.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div className="font-medium">{service.name}</div>
                          </TableCell>
                          <TableCell>
                            {service.business ? service.business.name : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {service.category ? service.category.name : 'N/A'}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <span className="font-medium">{service.usageCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(service.price)}</TableCell>
                          <TableCell>{formatCurrency(service.totalRevenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
