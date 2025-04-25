import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    text: 'Đặt lịch qua Harmony đã hoàn toàn thay đổi cách tôi lên lịch các buổi spa. Giao diện trực quan và tôi thích có thể xem đánh giá trước khi đặt lịch.',
    service: 'Điều Trị Spa',
  },
  {
    id: 2,
    name: 'Michael Chen',
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
    rating: 5,
    text: 'Là người có lịch trình bận rộn, Harmony giúp tôi dễ dàng tìm và đặt các dịch vụ phù hợp với lịch của mình. Các nhắc nhở cũng rất hữu ích!',
    service: 'Cắt & Tạo Kiểu Tóc',
  },
  {
    id: 3,
    name: 'Alexis Rivera',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    text: 'Tôi đã khám phá ra một số tiệm salon địa phương tuyệt vời thông qua Harmony mà tôi không thể tìm thấy bằng cách khác. Quy trình đặt lịch rất mượt mà và dịch vụ khách hàng xuất sắc.',
    service: 'Làm Móng Tay & Chân',
  },
  {
    id: 4,
    name: 'David Williams',
    image: 'https://randomuser.me/api/portraits/men/62.jpg',
    rating: 5,
    text: 'Sự tiện lợi khi quản lý tất cả các cuộc hẹn chăm sóc sức khỏe của tôi ở một nơi thật tuyệt vời. Tôi đặc biệt đánh giá cao việc có thể đổi lịch chỉ với một vài cú chạm.',
    service: 'Liệu Pháp Massage',
  },
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="h-12 w-12 rounded-full mr-4 object-cover"
          />
          <div>
            <h4 className="font-medium">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.service}</p>
          </div>
        </div>
        
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}
            />
          ))}
        </div>
        
        <p className="text-muted-foreground">"{testimonial.text}"</p>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Khách Hàng Nói Gì Về Chúng Tôi</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Đọc đánh giá từ khách hàng đã sử dụng Harmony để đặt lịch dịch vụ
          </p>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="relative static mr-2" />
            <CarouselNext className="relative static ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
