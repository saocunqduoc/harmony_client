import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react';

import { Input } from '@/components/ui/input';
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

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ hoa')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất một chữ thường')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất một chữ số'),
  confirmPassword: z.string()
}).refine(
  (values) => values.password === values.confirmPassword,
  {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  }
);

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Lấy email và otp từ tham số URL
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const otpParam = params.get('otp');
    
    if (!emailParam || !otpParam) {
      // toast.error('Email hoặc OTP không hợp lệ hoặc bị thiếu');
      navigate('/forgot-password');
      return;
    }
    
    setEmail(emailParam);
    setOtp(otpParam);
  }, [location, navigate]);
  
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      setIsLoading(true);
      await authService.resetPassword({
        email,
        otp,
        newPassword: values.password,
      });
      
      // toast.success('Đặt lại mật khẩu thành công');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Password reset failed:', error);
      // toast.error('Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Vui lòng tạo mật khẩu mới an toàn cho tài khoản của bạn
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nhập mật khẩu mới"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Xác nhận mật khẩu mới"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
