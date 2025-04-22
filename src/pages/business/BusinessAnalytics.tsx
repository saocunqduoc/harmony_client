import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';

const BusinessAnalytics = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue trend for the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={[
                    { name: 'Week 1', value: 1200 },
                    { name: 'Week 2', value: 1800 },
                    { name: 'Week 3', value: 1400 },
                    { name: 'Week 4', value: 2100 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue']}
                  valueFormatter={(value) => `$${value}`}
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Number of appointments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { name: 'Mon', value: 5 },
                    { name: 'Tue', value: 8 },
                    { name: 'Wed', value: 12 },
                    { name: 'Thu', value: 7 },
                    { name: 'Fri', value: 15 },
                    { name: 'Sat', value: 20 },
                    { name: 'Sun', value: 10 },
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
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Most booked services</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={[
                    { name: 'Deep Tissue', value: 35 },
                    { name: 'Swedish', value: 25 },
                    { name: 'Hot Stone', value: 20 },
                    { name: 'Aromatherapy', value: 15 },
                    { name: 'Other', value: 5 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue', 'teal', 'amber', 'rose', 'indigo']}
                  valueFormatter={(value) => `${value}%`}
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Rating distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { name: '1 Star', value: 2 },
                    { name: '2 Stars', value: 5 },
                    { name: '3 Stars', value: 12 },
                    { name: '4 Stars', value: 38 },
                    { name: '5 Stars', value: 76 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['amber']}
                  valueFormatter={(value) => `${value} ratings`}
                  className="h-72"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
              <CardDescription>Detailed analysis of your services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Service analytics details will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Detailed revenue insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Revenue analytics details will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Insights about your customer base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Customer analytics details will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalytics;
