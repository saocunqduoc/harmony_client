import React from 'react';
import { Search, Calendar, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Khám Phá Dịch Vụ',
    description: 'Duyệt qua nhiều dịch vụ chăm sóc sức khỏe và làm đẹp từ các nhà cung cấp hàng đầu.'
  },
  {
    icon: Calendar,
    title: 'Đặt Lịch Hẹn',
    description: 'Chọn khung giờ thuận tiện và đặt lịch hẹn chỉ với vài cú nhấp chuột.'
  },
  {
    icon: Star,
    title: 'Trải Nghiệm & Đánh Giá',
    description: 'Tận hưởng dịch vụ và chia sẻ trải nghiệm của bạn bằng cách để lại đánh giá sau đó.'
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Cách Harmony Hoạt Động</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Đặt lịch hẹn làm đẹp hoặc chăm sóc sức khỏe tiếp theo của bạn trong ba bước đơn giản.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 bg-primary/10 p-4 rounded-full">
                <step.icon size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
