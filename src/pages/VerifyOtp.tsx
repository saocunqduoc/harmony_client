
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import OtpVerificationForm from '@/components/auth/OtpVerificationForm';

const VerifyOtp = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <OtpVerificationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyOtp;
