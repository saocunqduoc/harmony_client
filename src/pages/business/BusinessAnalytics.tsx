import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, formatCurrency } from '@/components/ui/charts';

const BusinessAnalytics = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Thống kê</h1>

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
                <CardDescription>Xu hướng doanh thu trong 30 ngày qua</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={[
                    { name: 'Tuần 1', value: 12000000 },
                    { name: 'Tuần 2', value: 18000000 },
                    { name: 'Tuần 3', value: 14000000 },
                    { name: 'Tuần 4', value: 21000000 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue']}
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn</CardTitle>
                <CardDescription>Số lượng lịch hẹn theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { name: 'T2', value: 5 },
                    { name: 'T3', value: 8 },
                    { name: 'T4', value: 12 },
                    { name: 'T5', value: 7 },
                    { name: 'T6', value: 15 },
                    { name: 'T7', value: 20 },
                    { name: 'CN', value: 10 },
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
                <CardTitle>Dịch vụ phổ biến</CardTitle>
                <CardDescription>Dịch vụ được đặt nhiều nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={[
                    { name: 'Massage truyền thống', value: 35 },
                    { name: 'Cắt tóc', value: 25 },
                    { name: 'Mát-xa đá nóng', value: 20 },
                    { name: 'Khác', value: 5 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['blue', 'teal', 'indigo', 'rose', 'indigo']}
                  valueFormatter={(value) => `${value}%`}
                  className="h-72"
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Mức độ hài lòng của khách hàng</CardTitle>
                <CardDescription>Phân bố đánh giá</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={[
                    { name: '1 Sao', value: 2 },
                    { name: '2 Sao', value: 5 },
                    { name: '3 Sao', value: 12 },
                    { name: '4 Sao', value: 38 },
                    { name: '5 Sao', value: 76 },
                  ]}
                  index="name"
                  categories={['value']}
                  colors={['amber']}
                  valueFormatter={(value) => `${value} đánh giá`}
                  className="h-72"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất dịch vụ</CardTitle>
              <CardDescription>Phân tích chi tiết về dịch vụ của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Chi tiết phân tích dịch vụ sẽ xuất hiện tại đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích doanh thu</CardTitle>
              <CardDescription>Thông tin chi tiết về doanh thu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Chi tiết phân tích doanh thu sẽ xuất hiện tại đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích khách hàng</CardTitle>
              <CardDescription>Thông tin về cơ sở khách hàng của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Chi tiết phân tích khách hàng sẽ xuất hiện tại đây
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalytics;
