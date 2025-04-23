import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { adminService, DashboardStats } from '@/api/services/adminService';
import { Loader2 } from 'lucide-react';

const AdminAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
        <span className="ml-2">Loading statistics...</span>
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
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.businesses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.services}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.bookings}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                {userRegistrations.length > 0 ? (
                  <LineChart 
                    data={userRegistrations}
                    index="month"
                    categories={['count']}
                    colors={['blue']}
                    valueFormatter={(value) => `${value} users`}
                    className="h-72"
                  />
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>Recent bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {recentBookings.length > 0 ? (
                  <div className="space-y-4 max-h-72 overflow-auto">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="p-3 border rounded-md">
                        <p className="font-medium">{booking.booking_date} at {booking.booking_time}</p>
                        <p className="text-sm text-muted-foreground">User: {booking.user?.name || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground">Business: {booking.business?.name || 'Unknown'}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status || 'Unknown'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    No recent bookings
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue breakdown by month</CardDescription>
              </CardHeader>
              <CardContent>
                {revenue.monthly && revenue.monthly.some(val => val > 0) ? (
                  <PieChart 
                    data={[
                      { name: 'Jan', value: revenue.monthly[0] || 0 },
                      { name: 'Feb', value: revenue.monthly[1] || 0 },
                      { name: 'Mar', value: revenue.monthly[2] || 0 },
                      { name: 'Apr', value: revenue.monthly[3] || 0 },
                      { name: 'May', value: revenue.monthly[4] || 0 },
                      { name: 'Jun', value: revenue.monthly[5] || 0 },
                      { name: 'Jul', value: revenue.monthly[6] || 0 },
                      { name: 'Aug', value: revenue.monthly[7] || 0 },
                      { name: 'Sep', value: revenue.monthly[8] || 0 },
                      { name: 'Oct', value: revenue.monthly[9] || 0 },
                      { name: 'Nov', value: revenue.monthly[10] || 0 },
                      { name: 'Dec', value: revenue.monthly[11] || 0 },
                    ].filter(item => item.value > 0)}
                    index="name"
                    categories={['value']}
                    colors={[
                      '#3B82F6', '#14B8A6', '#F59E0B', '#F43F5E', '#6366F1', '#10B981',
                      '#06B6D4', '#84CC16', '#FB923C', '#EC4899', '#8B5CF6', '#38BDF8'
                    ]}
                    valueFormatter={(value) => `$${value}`}
                    className="h-72"
                  />
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    No revenue data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>Platform revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                {revenue.monthly ? (
                  <LineChart 
                    data={[
                      { name: 'Jan', value: revenue.monthly[0] || 0 },
                      { name: 'Feb', value: revenue.monthly[1] || 0 },
                      { name: 'Mar', value: revenue.monthly[2] || 0 },
                      { name: 'Apr', value: revenue.monthly[3] || 0 },
                      { name: 'May', value: revenue.monthly[4] || 0 },
                      { name: 'Jun', value: revenue.monthly[5] || 0 },
                      { name: 'Jul', value: revenue.monthly[6] || 0 },
                      { name: 'Aug', value: revenue.monthly[7] || 0 },
                      { name: 'Sep', value: revenue.monthly[8] || 0 },
                      { name: 'Oct', value: revenue.monthly[9] || 0 },
                      { name: 'Nov', value: revenue.monthly[10] || 0 },
                      { name: 'Dec', value: revenue.monthly[11] || 0 },
                    ]}
                    index="name"
                    categories={['value']}
                    colors={['teal']}
                    valueFormatter={(value) => `$${value}`}
                    className="h-72"
                  />
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    No revenue data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>Detailed user metrics and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Detailed user analytics will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="businesses">
          <Card>
            <CardHeader>
              <CardTitle>Business Analytics</CardTitle>
              <CardDescription>Detailed business metrics and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Detailed business analytics will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Financial performance and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Detailed revenue analytics will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
