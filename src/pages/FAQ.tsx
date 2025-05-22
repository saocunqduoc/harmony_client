import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';

const FAQ = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h1>
          <p className="text-muted-foreground mb-8">
            Tìm câu trả lời cho những câu hỏi phổ biến nhất về dịch vụ của chúng tôi
          </p>

          <Tabs defaultValue="general" className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="general">Chung</TabsTrigger>
              <TabsTrigger value="booking">Đặt lịch</TabsTrigger>
              <TabsTrigger value="payment">Thanh toán</TabsTrigger>
              <TabsTrigger value="business">Doanh nghiệp</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chung</CardTitle>
                  <CardDescription>
                    Các câu hỏi cơ bản về Harmony
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Harmony là gì?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Harmony là nền tảng đặt lịch dịch vụ trực tuyến hàng đầu, kết nối khách hàng với các dịch vụ làm đẹp, spa, và chăm sóc sức khỏe chất lượng cao. Thông qua Harmony, khách hàng có thể tìm kiếm, đánh giá và đặt lịch dịch vụ một cách dễ dàng và thuận tiện.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>Tôi có cần tạo tài khoản để sử dụng Harmony không?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Bạn có thể duyệt xem các dịch vụ và doanh nghiệp trên Harmony mà không cần tài khoản. Tuy nhiên, để đặt lịch và sử dụng đầy đủ các tính năng của nền tảng, bạn cần đăng ký một tài khoản miễn phí. Việc đăng ký chỉ mất vài phút và giúp bạn quản lý các cuộc hẹn, nhận thông báo, và tích lũy điểm thưởng.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>Làm thế nào để tải ứng dụng Harmony?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Ứng dụng Harmony có sẵn trên cả iOS và Android. Bạn có thể tải ứng dụng từ App Store hoặc Google Play Store bằng cách tìm kiếm "Harmony Booking". Ngoài ra, bạn cũng có thể sử dụng đầy đủ các tính năng thông qua trang web của chúng tôi trên trình duyệt di động hoặc máy tính.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>Các dịch vụ nào được cung cấp trên Harmony?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Harmony kết nối người dùng với nhiều loại dịch vụ làm đẹp và chăm sóc sức khỏe, bao gồm nhưng không giới hạn ở:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Dịch vụ tóc (cắt, nhuộm, tạo kiểu)</li>
                          <li>Dịch vụ làm móng</li>
                          <li>Massage và liệu pháp spa</li>
                          <li>Chăm sóc da và điều trị thẩm mỹ</li>
                          <li>Trang điểm</li>
                          <li>Xăm thẩm mỹ</li>
                          <li>Dịch vụ chăm sóc sức khỏe tổng thể</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5">
                      <AccordionTrigger>Tôi có thể sử dụng Harmony ở những khu vực nào?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Hiện tại, Harmony đang hoạt động ở các thành phố lớn của Việt Nam, bao gồm Hà Nội, Hồ Chí Minh, Đà Nẵng, Hải Phòng, và Nha Trang. Chúng tôi đang nỗ lực mở rộng để phủ sóng nhiều khu vực hơn trong tương lai. Bạn có thể kiểm tra danh sách đầy đủ các khu vực được hỗ trợ bằng cách tìm kiếm dịch vụ theo vị trí của bạn.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking">
              <Card>
                <CardHeader>
                  <CardTitle>Đặt lịch</CardTitle>
                  <CardDescription>
                    Thông tin về quy trình đặt lịch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="booking-1">
                      <AccordionTrigger>Làm thế nào để đặt lịch trên Harmony?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Để đặt lịch trên Harmony, hãy làm theo các bước sau:
                        </p>
                        <ol className="list-decimal pl-6 mt-2 space-y-1">
                          <li>Tìm kiếm dịch vụ hoặc doanh nghiệp bạn quan tâm</li>
                          <li>Chọn dịch vụ cụ thể bạn muốn đặt</li>
                          <li>Chọn ngày và giờ phù hợp từ lịch trống có sẵn</li>
                          <li>Chọn nhân viên (nếu có tùy chọn)</li>
                          <li>Xác nhận thông tin đặt lịch và thanh toán (nếu cần)</li>
                          <li>Nhận xác nhận qua email hoặc tin nhắn</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="booking-2">
                      <AccordionTrigger>Tôi có thể hủy hoặc đổi lịch đã đặt không?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Có, bạn có thể hủy hoặc đổi lịch đã đặt thông qua tài khoản Harmony của bạn. Tuy nhiên, mỗi doanh nghiệp có chính sách hủy lịch riêng, vì vậy vui lòng kiểm tra chính sách của doanh nghiệp cụ thể trước khi đặt lịch. Một số doanh nghiệp có thể yêu cầu thông báo trước một thời gian nhất định hoặc thu phí hủy lịch nếu bạn hủy quá gần thời gian đặt lịch.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="booking-3">
                      <AccordionTrigger>Tôi có nhận được thông báo nhắc lịch không?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Có, Harmony sẽ gửi cho bạn thông báo nhắc lịch qua email và/hoặc tin nhắn SMS (tùy thuộc vào cài đặt của bạn) 24 giờ trước cuộc hẹn đã đặt. Bạn cũng có thể đồng bộ lịch hẹn với Google Calendar hoặc Apple Calendar để nhận thêm nhắc nhở.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="booking-4">
                      <AccordionTrigger>Có giới hạn về số lượng đặt lịch tôi có thể thực hiện không?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Không có giới hạn về số lượng đặt lịch bạn có thể thực hiện trên Harmony. Tuy nhiên, chúng tôi khuyến khích bạn chỉ đặt lịch khi bạn chắc chắn về kế hoạch của mình và tôn trọng thời gian của các nhà cung cấp dịch vụ bằng cách hủy lịch sớm nếu bạn không thể tham dự.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Thanh toán</CardTitle>
                  <CardDescription>
                    Thông tin về các phương thức thanh toán và tính phí
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="payment-1">
                      <AccordionTrigger>Các phương thức thanh toán nào được chấp nhận?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Harmony chấp nhận nhiều phương thức thanh toán khác nhau, bao gồm:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB)</li>
                          <li>Ví điện tử (MoMo, ZaloPay, VNPay)</li>
                          <li>Chuyển khoản ngân hàng</li>
                          <li>Thanh toán khi đến nơi (tùy thuộc vào chính sách của từng doanh nghiệp)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="payment-2">
                      <AccordionTrigger>Tôi có phải trả phí đặt lịch trên Harmony không?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Không, Harmony không tính phí đặt lịch cho khách hàng. Dịch vụ đặt lịch của chúng tôi hoàn toàn miễn phí cho người dùng. Một số doanh nghiệp có thể yêu cầu đặt cọc hoặc thanh toán trước để đảm bảo lịch hẹn, nhưng đây là chính sách của riêng họ và không phải là phí của Harmony.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="payment-3">
                      <AccordionTrigger>Có an toàn khi thanh toán trực tuyến trên Harmony không?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Có, chúng tôi ưu tiên hàng đầu việc bảo mật thông tin thanh toán của bạn. Harmony sử dụng công nghệ mã hóa SSL tiêu chuẩn ngành để bảo vệ thông tin thẻ và giao dịch của bạn. Chúng tôi cũng tuân thủ các tiêu chuẩn PCI DSS (Payment Card Industry Data Security Standard) và hợp tác với các nhà cung cấp dịch vụ thanh toán uy tín để đảm bảo mọi giao dịch đều an toàn.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="payment-4">
                      <AccordionTrigger>Làm thế nào để nhận hoàn tiền nếu tôi hủy dịch vụ?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Chính sách hoàn tiền phụ thuộc vào chính sách hủy lịch của từng doanh nghiệp. Nếu bạn hủy lịch trong thời gian cho phép và đã thanh toán trước, số tiền sẽ được hoàn lại theo phương thức thanh toán ban đầu trong vòng 5-7 ngày làm việc. Trong trường hợp gặp vấn đề với việc hoàn tiền, bạn có thể liên hệ với đội ngũ hỗ trợ khách hàng của chúng tôi để được trợ giúp.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Dành cho doanh nghiệp</CardTitle>
                  <CardDescription>
                    Thông tin dành cho đối tác kinh doanh
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="business-1">
                      <AccordionTrigger>Làm thế nào để đăng ký doanh nghiệp trên Harmony?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Để đăng ký doanh nghiệp của bạn trên Harmony, hãy làm theo các bước sau:
                        </p>
                        <ol className="list-decimal pl-6 mt-2 space-y-1">
                          <li>Truy cập trang "Đăng ký doanh nghiệp" trên trang web hoặc ứng dụng của chúng tôi</li>
                          <li>Điền vào biểu mẫu với thông tin doanh nghiệp của bạn, bao gồm tên, địa chỉ, và dịch vụ cung cấp</li>
                          <li>Cung cấp giấy tờ kinh doanh cần thiết để xác minh doanh nghiệp của bạn</li>
                          <li>Thiết lập lịch làm việc và các dịch vụ bạn muốn cung cấp</li>
                          <li>Chọn gói dịch vụ phù hợp với nhu cầu của doanh nghiệp</li>
                          <li>Sau khi được phê duyệt, bạn có thể bắt đầu nhận đặt lịch qua Harmony</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="business-2">
                      <AccordionTrigger>Chi phí để sử dụng Harmony cho doanh nghiệp của tôi là bao nhiêu?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Harmony cung cấp nhiều gói dịch vụ khác nhau phù hợp với quy mô và nhu cầu của doanh nghiệp bạn. Chúng tôi có gói cơ bản miễn phí với các tính năng giới hạn và các gói cao cấp với nhiều tính năng hơn. Các gói cao cấp hoạt động trên mô hình phí đăng ký hàng tháng hoặc hàng năm, hoặc mô hình hoa hồng nhỏ trên mỗi đặt lịch thành công. Vui lòng liên hệ với đội ngũ bán hàng của chúng tôi để nhận báo giá chi tiết cho doanh nghiệp của bạn.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="business-3">
                      <AccordionTrigger>Harmony có tích hợp với phần mềm quản lý doanh nghiệp hiện tại của tôi không?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Có, Harmony cung cấp API và các tùy chọn tích hợp với nhiều phần mềm quản lý doanh nghiệp phổ biến. Chúng tôi có thể tích hợp với các hệ thống POS, phần mềm quản lý nhân viên, và phần mềm lịch làm việc. Điều này cho phép đồng bộ hóa liền mạch các lịch đặt, thông tin khách hàng, và dữ liệu kinh doanh. Vui lòng liên hệ với đội ngũ hỗ trợ kỹ thuật của chúng tôi để thảo luận về các yêu cầu tích hợp cụ thể của doanh nghiệp bạn.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="business-4">
                      <AccordionTrigger>Làm thế nào để quản lý đánh giá và phản hồi từ khách hàng?</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Harmony cung cấp bảng điều khiển dành cho doanh nghiệp nơi bạn có thể xem tất cả đánh giá và phản hồi từ khách hàng. Bạn có thể phản hồi các đánh giá, giải quyết các vấn đề, và theo dõi điểm đánh giá trung bình của mình theo thời gian. Chúng tôi khuyến khích các doanh nghiệp phản hồi tích cực với cả đánh giá tốt và không tốt, vì điều này cho thấy bạn coi trọng ý kiến của khách hàng. Harmony cũng cung cấp các công cụ phân tích để giúp bạn hiểu xu hướng trong phản hồi của khách hàng và cải thiện dịch vụ của mình.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Bạn vẫn còn thắc mắc?</h2>
            <p className="mb-6">Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, vui lòng liên hệ với đội ngũ hỗ trợ khách hàng của chúng tôi:</p>
            
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <h3 className="text-lg font-medium mb-2">Hỗ trợ qua email</h3>
                    <p className="text-muted-foreground mb-2">Gửi email cho chúng tôi và nhận phản hồi trong vòng 24 giờ</p>
                    <a href="mailto:support@harmony.com" className="text-primary hover:underline">support@harmony.com</a>
                  </div>
                  <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <h3 className="text-lg font-medium mb-2">Hỗ trợ qua điện thoại</h3>
                    <p className="text-muted-foreground mb-2">Thứ Hai - Thứ Sáu, 9:00 - 18:00</p>
                    <a href="tel:+842100009474" className="text-primary hover:underline">+84 (210) 000-9474</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          <div className="text-center">
            <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-6">
              <Link to="/terms" className="text-primary hover:underline">Điều khoản dịch vụ</Link>
              <Link to="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
              <Link to="/cookies" className="text-primary hover:underline">Chính sách cookie</Link>
              <Link to="/contact" className="text-primary hover:underline">Liên hệ</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;