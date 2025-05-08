import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { authService } from '@/api/services/authService';
import { Loader2 } from 'lucide-react';

const otpVerificationSchema = z.object({
  otp: z.string().min(6, 'Mã OTP phải có 6 ký tự').max(6),
});

type OtpVerificationValues = z.infer<typeof otpVerificationSchema>;

const OtpVerificationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [verificationType, setVerificationType] = useState<'registration' | 'reset'>('registration');
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Lấy email và loại từ tham số URL
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const typeParam = params.get('type');
    
    if (!emailParam) {
      toast.error('Email là bắt buộc');
      navigate('/');
      return;
    }
    
    setEmail(emailParam);
    setVerificationType(typeParam === 'reset' ? 'reset' : 'registration');
  }, [location, navigate]);
  
  // Hiệu ứng hẹn giờ cho thời gian chờ gửi lại
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const form = useForm<OtpVerificationValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (values: OtpVerificationValues) => {
    try {
      setIsLoading(true);
      
      // Chuyển đổi OTP thành chuỗi để đảm bảo định dạng đúng
      const otpString = values.otp.toString();
      
      if (verificationType === 'reset') {
        // Cho luồng đặt lại mật khẩu, sử dụng endpoint verifyOtpForPasswordReset
        await authService.verifyOtpForPasswordReset({
          email,
          otp: otpString,
        });
        
        toast.success('Xác minh OTP thành công');
        navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpString)}`);
      } else {
        // Cho luồng xác minh đăng ký
        await authService.verifyOtp({
          email,
          otp: otpString,
        });
        
        toast.success('Xác minh tài khoản thành công');
        navigate('/login');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      // toast.error('Xác minh OTP thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setIsLoading(true);
      // Luôn sử dụng forgotPassword cho cả hai luồng vì nó gửi OTP
      await authService.forgotPassword({ email });
      toast.success('Mã OTP mới đã được gửi đến email của bạn');
      setCountdown(60); // Đặt đếm ngược là 60 giây
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error('Không thể gửi lại OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Xác minh OTP</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Nhập mã 6 chữ số đã gửi đến {email}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="text-center">
                <FormLabel className="text-center block">Mã xác thực một lần</FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP 
                      maxLength={6} 
                      value={field.value}
                      onChange={field.onChange}
                      className="flex justify-center"
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Đang xác minh...
              </>
            ) : 'Xác minh OTP'}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Không nhận được mã? {' '}
          <Button 
            variant="link" 
            className="p-0 h-auto text-primary" 
            onClick={handleResendOtp}
            disabled={isLoading || countdown > 0}
          >
            {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại OTP'}
          </Button>
        </p>

        <Button 
          variant="link" 
          className="mt-2 text-primary" 
          onClick={() => verificationType === 'reset' ? navigate('/forgot-password') : navigate('/register')}
        >
          {verificationType === 'reset' ? 'Thay đổi Email' : 'Quay lại đăng ký'}
        </Button>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
