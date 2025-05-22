import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Chính sách bảo mật</h1>
          <p className="text-muted-foreground mb-8">
            Cập nhật lần cuối: 15 tháng 04, 2025
          </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Giới thiệu</CardTitle>
            <CardDescription>
              Cam kết bảo mật thông tin của chúng tôi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Tại Harmony, chúng tôi coi trọng quyền riêng tư của bạn. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng nền tảng của chúng tôi.
            </p>
            <p>
              Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản được nêu trong chính sách bảo mật này.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Thông tin chúng tôi thu thập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Thông tin cá nhân:</strong> Họ tên, địa chỉ email, số điện thoại, địa chỉ, ngày sinh.</li>
              <li><strong>Thông tin tài khoản:</strong> Tên đăng nhập, mật khẩu (được mã hóa).</li>
              <li><strong>Thông tin thanh toán:</strong> Chi tiết thẻ tín dụng hoặc thông tin thanh toán khác (được xử lý qua các cổng thanh toán an toàn).</li>
              <li><strong>Thông tin sử dụng:</strong> Dữ liệu về cách bạn tương tác với nền tảng của chúng tôi, lịch sử đặt lịch.</li>
              <li><strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, thiết bị, thời gian truy cập.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Cách chúng tôi sử dụng thông tin của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Chúng tôi sử dụng thông tin của bạn để:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cung cấp và duy trì dịch vụ của chúng tôi</li>
              <li>Xử lý và xác nhận đặt lịch</li>
              <li>Thông báo cho bạn về các thay đổi trong dịch vụ của chúng tôi</li>
              <li>Cải thiện và cá nhân hóa trải nghiệm người dùng</li>
              <li>Phân tích cách dịch vụ của chúng tôi được sử dụng</li>
              <li>Gửi thông tin tiếp thị và quảng cáo (khi bạn đã đồng ý)</li>
              <li>Ngăn chặn hoạt động gian lận và bảo mật hệ thống</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. Chia sẻ thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi có thể chia sẻ thông tin cá nhân của bạn với:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Nhà cung cấp dịch vụ:</strong> Khi bạn đặt lịch, thông tin cần thiết sẽ được chia sẻ với nhà cung cấp dịch vụ.</li>
              <li><strong>Đối tác thanh toán:</strong> Để xử lý các giao dịch thanh toán.</li>
              <li><strong>Nhà cung cấp dịch vụ:</strong> Những bên thứ ba hỗ trợ hoạt động của chúng tôi (ví dụ: lưu trữ đám mây, phân tích dữ liệu).</li>
              <li><strong>Cơ quan quản lý:</strong> Khi pháp luật yêu cầu.</li>
            </ul>
            <p className="mt-4">
              Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Khi chia sẻ dữ liệu với đối tác, chúng tôi đảm bảo họ tuân thủ các tiêu chuẩn bảo mật tương tự.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Bảo mật dữ liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi mất mát, truy cập trái phép, tiết lộ, thay đổi hoặc phá hủy. Các biện pháp này bao gồm:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Mã hóa dữ liệu nhạy cảm</li>
              <li>Hệ thống tường lửa và phát hiện xâm nhập</li>
              <li>Kiểm soát truy cập và xác thực người dùng</li>
              <li>Đào tạo nhân viên về các thực hành bảo mật</li>
              <li>Đánh giá bảo mật định kỳ</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Quyền của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Tùy thuộc vào luật pháp địa phương của bạn, bạn có thể có các quyền sau liên quan đến dữ liệu cá nhân của mình:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Quyền truy cập và nhận bản sao dữ liệu của bạn</li>
              <li>Quyền yêu cầu chỉnh sửa hoặc cập nhật dữ liệu không chính xác</li>
              <li>Quyền yêu cầu xóa dữ liệu cá nhân (quyền được quên lãng)</li>
              <li>Quyền hạn chế hoặc phản đối việc xử lý dữ liệu</li>
              <li>Quyền rút lại sự đồng ý</li>
              <li>Quyền khiếu nại với cơ quan bảo vệ dữ liệu</li>
            </ul>
            <p className="mt-4">
              Để thực hiện bất kỳ quyền nào trong số này, vui lòng liên hệ với chúng tôi qua thông tin liên hệ được cung cấp bên dưới.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Thay đổi chính sách bảo mật</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phản ánh những thay đổi trong hoạt động kinh doanh hoặc để tuân thủ các yêu cầu pháp lý mới. Chúng tôi sẽ thông báo cho bạn về những thay đổi đáng kể thông qua thông báo trên trang web hoặc qua email.
            </p>
            <p>
              Chúng tôi khuyên bạn nên xem xét chính sách này định kỳ để biết bất kỳ thay đổi nào.
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="mb-4">Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật, vui lòng liên hệ chúng tôi:</p>
          <p className="mb-4">Email: support@harmony.com</p>
          <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-6">
            <Link to="/terms" className="text-primary hover:underline">Điều khoản dịch vụ</Link>
            <Link to="/contact" className="text-primary hover:underline">Liên hệ</Link>
            <Link to="/cookies" className="text-primary hover:underline">Chính sách cookie</Link>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default PrivacyPolicy;