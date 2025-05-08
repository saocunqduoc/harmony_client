import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useApiAuth } from '@/context/ApiAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Vui lòng nhập một email hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { login, isLoading } = useApiAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      const { success, role } = await login(values.email, values.password);
      
      if (success) {
        // Chuyển hướng dựa trên vai trò người dùng
        if (role === 'admin') {
          navigate('/admin');
        } else if (['owner', 'manager', 'staff'].includes(role || '')) {
          navigate('/business-dashboard');
        } else {
          // Mặc định cho vai trò customer
          navigate('/dashboard');
        }
        
        toast.success('Đăng nhập thành công', {
          description: 'Chào mừng bạn quay trở lại!'
        });
      } else {
        setError('Email hoặc mật khẩu không hợp lệ');
        toast.error('Đăng nhập thất bại', {
          description: 'Vui lòng kiểm tra thông tin đăng nhập và thử lại'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi trong quá trình đăng nhập');
      toast.error('Đăng nhập thất bại', {
        description: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
      });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Mật khẩu</FormLabel>
                  <Link 
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••"
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
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <div className="text-center text-sm">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Đăng ký
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
