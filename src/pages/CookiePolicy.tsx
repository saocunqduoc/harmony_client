import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Layout from '@/components/layout/Layout';

const CookiePolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chính sách cookie</h1>
          <p className="text-muted-foreground mb-8">
            Cập nhật lần cuối: 15 tháng 04, 2025
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Giới thiệu</CardTitle>
              <CardDescription>
                Cách chúng tôi sử dụng cookie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Trang web của Harmony sử dụng cookie để cải thiện trải nghiệm của bạn khi sử dụng nền tảng của chúng tôi. Chính sách này giải thích cách chúng tôi sử dụng cookie và các công nghệ tương tự, cũng như các tùy chọn bạn có.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>1. Cookie là gì?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Cookie là các tệp văn bản nhỏ chứa một số lượng nhỏ thông tin được đặt trên thiết bị của bạn khi bạn truy cập một trang web. Cookie được sử dụng rộng rãi để làm cho trang web hoạt động hoặc hoạt động hiệu quả hơn, cũng như để cung cấp thông tin cho chủ sở hữu trang web.
              </p>
              <p>
                Cookie có thể là "bền vững" hoặc "phiên". Cookie bền vững được lưu trữ trong trình duyệt web và vẫn còn hiệu lực cho đến khi chúng hết hạn hoặc cho đến khi bạn xóa chúng. Cookie phiên được xóa khi bạn đóng trình duyệt.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>2. Các loại cookie chúng tôi sử dụng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Chúng tôi sử dụng các loại cookie sau trên trang web của mình:
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại cookie</TableHead>
                    <TableHead>Mục đích</TableHead>
                    <TableHead>Thời hạn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Cookie cần thiết</TableCell>
                    <TableCell>Cho phép các chức năng cơ bản như xác thực đăng nhập và ghi nhớ các bước trong quá trình đặt lịch</TableCell>
                    <TableCell>Phiên / 1 năm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cookie phân tích</TableCell>
                    <TableCell>Giúp chúng tôi hiểu cách khách truy cập tương tác với trang web thông qua việc thu thập và báo cáo thông tin ẩn danh</TableCell>
                    <TableCell>2 năm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cookie tiếp thị</TableCell>
                    <TableCell>Được sử dụng để theo dõi người dùng khi họ chuyển từ trang web này sang trang web khác, cho phép hiển thị quảng cáo có liên quan</TableCell>
                    <TableCell>30 ngày</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cookie chức năng</TableCell>
                    <TableCell>Cho phép trang web ghi nhớ các lựa chọn bạn đã thực hiện và cung cấp các tính năng nâng cao, cá nhân hóa</TableCell>
                    <TableCell>1 năm</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>3. Cách quản lý cookie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bạn có thể quản lý cookie thông qua cài đặt trình duyệt web của mình. Hầu hết các trình duyệt cho phép bạn:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Xem cookie đã lưu trữ</li>
                <li>Chấp nhận hoặc từ chối tất cả cookie</li>
                <li>Chấp nhận hoặc từ chối cookie từ các trang web cụ thể</li>
                <li>Xóa một số hoặc tất cả cookie</li>
              </ul>
              <p className="mt-4">
                Vui lòng lưu ý rằng việc hạn chế cookie có thể ảnh hưởng đến chức năng của trang web của chúng tôi. Các cài đặt cho mỗi trình duyệt khác nhau có thể được tìm thấy trong menu trợ giúp của trình duyệt của bạn.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>4. Cookie bên thứ ba</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Bên cạnh cookie của riêng mình, chúng tôi cũng sử dụng cookie từ các bên thứ ba đáng tin cậy cho một số mục đích sau:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics - để hiểu cách khách truy cập sử dụng trang web của chúng tôi</li>
                <li>Nền tảng thanh toán - để xử lý thanh toán an toàn</li>
                <li>Mạng xã hội - để tích hợp với các nền tảng mạng xã hội mà bạn có thể sử dụng để đăng nhập</li>
                <li>Đối tác quảng cáo - để cung cấp quảng cáo có liên quan</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>5. Thay đổi chính sách cookie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Chúng tôi có thể cập nhật Chính sách cookie này thỉnh thoảng để phản ánh các thay đổi về cookie chúng tôi sử dụng hoặc vì lý do vận hành, pháp lý hoặc quy định khác. Vui lòng truy cập lại chính sách này thường xuyên để cập nhật về việc chúng tôi sử dụng cookie.
              </p>
              <p>
                Ngày "Cập nhật lần cuối" ở đầu trang này cho biết khi nào chính sách được sửa đổi gần đây nhất.
              </p>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          <div className="text-center">
            <p className="mb-4">Nếu bạn có bất kỳ câu hỏi nào về Chính sách cookie, vui lòng liên hệ chúng tôi:</p>
            <p className="mb-4">Email: support@harmony.com</p>
            <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-6">
              <Link to="/terms" className="text-primary hover:underline">Điều khoản dịch vụ</Link>
              <Link to="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
              <Link to="/contact" className="text-primary hover:underline">Liên hệ</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicy;