
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';
import { Toaster } from 'sonner';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Chào mừng bạn đến với Harmony</h1>
          <p className="text-muted-foreground">
            Đăng nhập để tiếp tục sử dụng dịch vụ đặt lịch của chúng tôi. Nếu bạn chưa có tài khoản, hãy đăng ký ngay hôm nay!
          </p>
        </div>
        <LoginForm />
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default Login;
