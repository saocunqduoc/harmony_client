import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RegistrationOtpForm from '@/components/auth/RegistrationOtpForm';
import ResetPasswordOtpForm from '@/components/auth/ResetPasswordOtpForm';

const VerifyOtp = () => {
  const [verificationType, setVerificationType] = useState<'registration' | 'reset'>('registration');
  const location = useLocation();
  
  useEffect(() => {
    // Lấy loại từ tham số URL
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    
    if (typeParam === 'reset') {
      setVerificationType('reset');
    } else {
      setVerificationType('registration');
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {verificationType === 'reset' ? (
            <ResetPasswordOtpForm />
          ) : (
            <RegistrationOtpForm />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyOtp;
