import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';

const AdminAnalytics = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

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
                <LineChart 
                  data={[
                    { name: 'Jan', value: 420 },
                    { name: 'Feb', value: 380 },
                    { name: 'Mar', value: 510 },
                    { name: 'Apr', value: 480 },
                    { name: 'May', value: 620 },
                    { name: 'Jun', value: 750 },
                    { name: 'Jul', value: 800 },
                    { name: 'Aug', value: 920 },
                    { name: 'Sep', value: 1050 },
                    { name: 'Oct', value: 1248 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue']}
                  valueFormatter={(value) => `${value} users`}
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>Appointments booked per month</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { name: 'Jan', value: 1250 },
                    { name: 'Feb', value: 1100 },
                    { name: 'Mar', value: 1500 },
                    { name: 'Apr', value: 1700 },
                    { name: 'May', value: 1900 },
                    { name: 'Jun', value: 2200 },
                    { name: 'Jul', value: 2400 },
                    { name: 'Aug', value: 2700 },
                    { name: 'Sep', value: 3100 },
                    { name: 'Oct', value: 3500 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['purple']}
                  valueFormatter={(value) => `${value}`}
                  className="h-72"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
                <CardDescription>Distribution of services by category</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={[
                    { name: 'Massage', value: 30 },
                    { name: 'Hair', value: 25 },
                    { name: 'Facial', value: 15 },
                    { name: 'Fitness', value: 10 },
                    { name: 'Yoga', value: 10 },
                    { name: 'Nail', value: 5 },
                    { name: 'Other', value: 5 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue', 'teal', 'amber', 'rose', 'indigo', 'emerald', 'slate']}
                  valueFormatter={(value) => `${value}%`}
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Platform revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={[
                    { name: 'Jan', value: 15000 },
                    { name: 'Feb', value: 13500 },
                    { name: 'Mar', value: 18000 },
                    { name: 'Apr', value: 20500 },
                    { name: 'May', value: 22000 },
                    { name: 'Jun', value: 26000 },
                    { name: 'Jul', value: 28000 },
                    { name: 'Aug', value: 32000 },
                    { name: 'Sep', value: 38000 },
                    { name: 'Oct', value: 42000 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['emerald']}
                  valueFormatter={(value) => `$${value}`}
                  className="h-72"
                />
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
