import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

const forgotPasswordSchema = z.object({
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword({ email: values.email });
      
      toast.success('Hướng dẫn đặt lại đã được gửi', {
        description: 'Vui lòng kiểm tra email của bạn để lấy mã OTP'
      });
      
      // Chuyển hướng đến màn hình xác minh OTP với tham số email và định danh luồng đặt lại
      navigate(`/verify-otp?email=${encodeURIComponent(values.email)}&type=reset`);
    } catch (error) {
      console.error('Password reset request failed:', error);
      toast.error('Không thể gửi hướng dẫn đặt lại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Quên mật khẩu?</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Nhập email của bạn và chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="email@example.com"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang gửi...' : 'Gửi hướng dẫn đặt lại'}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <Button variant="link" onClick={() => navigate('/login')}>
          Quay lại đăng nhập
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
