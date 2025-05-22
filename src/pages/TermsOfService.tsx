import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Điều khoản dịch vụ</h1>
          <p className="text-muted-foreground mb-8">
            Cập nhật lần cuối: 15 tháng 04, 2025
          </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Giới thiệu</CardTitle>
            <CardDescription>
              Thông tin về các điều khoản dịch vụ của Harmony
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chào mừng bạn đến với Harmony - nền tảng đặt lịch dịch vụ làm đẹp và chăm sóc sức khỏe. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được mô tả trong tài liệu này.
            </p>
            <p>
              Vui lòng đọc kỹ tài liệu này. Bằng cách truy cập hoặc sử dụng dịch vụ của Harmony, bạn đồng ý bị ràng buộc bởi các điều khoản này.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Định nghĩa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Harmony"</strong> - đề cập đến nền tảng Harmony, bao gồm website, ứng dụng di động và dịch vụ đặt lịch trực tuyến.</li>
              <li><strong>"Người dùng"</strong> - bất kỳ cá nhân nào sử dụng nền tảng Harmony để đặt lịch, truy cập thông tin hoặc sử dụng bất kỳ tính năng nào.</li>
              <li><strong>"Nhà cung cấp dịch vụ"</strong> - đề cập đến các doanh nghiệp, cá nhân cung cấp dịch vụ làm đẹp, chăm sóc sức khỏe thông qua nền tảng Harmony.</li>
              <li><strong>"Dịch vụ"</strong> - các dịch vụ và tính năng được cung cấp thông qua nền tảng Harmony.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Đăng ký và tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Để sử dụng đầy đủ dịch vụ của Harmony, bạn cần tạo một tài khoản. Khi tạo tài khoản, bạn phải cung cấp thông tin chính xác và cập nhật. Bạn chịu trách nhiệm duy trì tính bảo mật tài khoản của mình và chấp nhận trách nhiệm cho mọi hoạt động xảy ra trên tài khoản của bạn.
            </p>
            <p>
              Chúng tôi có quyền từ chối cung cấp dịch vụ, đóng tài khoản, xóa hoặc chỉnh sửa nội dung do vi phạm các điều khoản dịch vụ này.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Đặt lịch và thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Khi đặt lịch dịch vụ thông qua Harmony, bạn đồng ý tuân thủ các chính sách đặt lịch và hủy lịch của nhà cung cấp dịch vụ cụ thể. Mọi giao dịch thanh toán được xử lý thông qua các cổng thanh toán an toàn được chỉ định.
            </p>
            <p>
              Giá cả và tính sẵn có của dịch vụ có thể thay đổi tùy từng thời điểm. Harmony không đảm bảo rằng giá hiển thị sẽ không thay đổi trước khi đơn đặt lịch được xác nhận.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Chính sách hủy lịch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chính sách hủy lịch cụ thể do từng nhà cung cấp dịch vụ quy định. Vui lòng xem chi tiết chính sách hủy lịch được hiển thị trong quá trình đặt lịch và xác nhận đặt lịch.
            </p>
            <p>
              Người dùng không tuân thủ chính sách hủy lịch có thể phải chịu phí hoặc hạn chế đặt lịch trong tương lai.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Quyền sở hữu trí tuệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Tất cả nội dung trên nền tảng Harmony, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo, biểu tượng, hình ảnh, clip âm thanh, tải xuống kỹ thuật số và phần mềm, đều là tài sản của Harmony hoặc các nhà cung cấp nội dung và được bảo vệ bởi luật sở hữu trí tuệ.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Miễn trừ trách nhiệm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Harmony đóng vai trò là trung gian kết nối giữa người dùng và nhà cung cấp dịch vụ. Chúng tôi không chịu trách nhiệm về chất lượng dịch vụ, hành vi của nhà cung cấp dịch vụ hoặc kết quả của việc sử dụng dịch vụ.
            </p>
            <p>
              Nền tảng Harmony được cung cấp "nguyên trạng" và "như sẵn có" mà không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Thay đổi điều khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Harmony có quyền sửa đổi các điều khoản này vào bất kỳ lúc nào. Khi chúng tôi thực hiện các thay đổi, chúng tôi sẽ cung cấp thông báo thích hợp dựa trên mức độ quan trọng của thay đổi.
            </p>
            <p>
              Việc tiếp tục sử dụng nền tảng sau khi các thay đổi có hiệu lực sẽ cấu thành sự chấp nhận của bạn đối với các điều khoản đã sửa đổi.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="mb-4">Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ, vui lòng liên hệ chúng tôi:</p>
          <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-6">
            <Link to="/contact" className="text-primary hover:underline">Liên hệ</Link>
            <Link to="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
            <Link to="/cookies" className="text-primary hover:underline">Chính sách cookie</Link>
          </div>
        </div>      </div>
    </div>
    </Layout>
  );
};

export default TermsOfService;