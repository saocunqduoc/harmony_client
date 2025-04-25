import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BusinessCTA = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-harmony-800 to-harmony-600 rounded-xl p-8 md:p-12 text-white">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Bạn Sở Hữu Doanh Nghiệp Làm Đẹp hoặc Chăm Sóc Sức Khỏe?</h2>
              <p className="text-white/90 max-w-xl">
                Tham gia Harmony để tiếp cận khách hàng mới, tối ưu hóa quy trình đặt lịch,
                và phát triển doanh nghiệp của bạn. Nền tảng của chúng tôi giúp bạn quản lý lịch hẹn,
                xử lý thanh toán và xây dựng sự hiện diện trực tuyến.
              </p>
            </div>
            <div>
              <Link to="/business/register">
                <Button size="lg" variant="secondary" className="w-full md:w-auto">
                  Đăng Ký Doanh Nghiệp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessCTA;
