
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Tạo tài khoản mới</h1>
          <p className="text-muted-foreground">
            Tham gia cùng chúng tôi để trải nghiệm dịch vụ đặt lịch dễ dàng và tiện lợi hơn.
          </p>
        </div>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default Register;
