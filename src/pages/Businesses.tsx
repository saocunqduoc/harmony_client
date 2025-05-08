import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BusinessLoginForm from '@/components/auth/BusinessLoginForm';
import BusinessRegisterForm from '@/components/auth/BusinessRegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";

const Businesses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title> Harmony Scheduling</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Cổng doanh nghiệp</h1>
          <p className="text-muted-foreground">
            Đăng nhập vào tài khoản doanh nghiệp hoặc đăng ký doanh nghiệp mới
          </p>
        </div>
        
        <Tabs defaultValue="register" className="max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <BusinessLoginForm />
          </TabsContent>
          <TabsContent value="register">
            <BusinessRegisterForm />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Businesses;
