
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
  otp: z.string().min(6, 'OTP must be 6 characters').max(6),
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
    // Get email and type from URL query parameter
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const typeParam = params.get('type');
    
    if (!emailParam) {
      toast.error('Email is required');
      navigate('/');
      return;
    }
    
    setEmail(emailParam);
    setVerificationType(typeParam === 'reset' ? 'reset' : 'registration');
  }, [location, navigate]);
  
  // Timer effect for resend cooldown
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
      
      // Convert OTP to string to ensure proper format
      const otpString = values.otp.toString();
      
      if (verificationType === 'reset') {
        // For password reset flow, use the new verifyOtpForPasswordReset endpoint
        await authService.verifyOtpForPasswordReset({
          email,
          otp: otpString,
        });
        
        toast.success('OTP verified successfully');
        navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpString)}`);
      } else {
        // For registration verification flow
        await authService.verifyOtp({
          email,
          otp: otpString,
        });
        
        toast.success('Account verification successful');
        navigate('/login');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      toast.error('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setIsLoading(true);
      // Always use forgotPassword for both flows since it sends OTP
      await authService.forgotPassword({ email });
      toast.success('A new OTP has been sent to your email');
      setCountdown(60); // Set countdown to 60 seconds
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error('Cannot resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">OTP Verification</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter the 6-digit code sent to {email}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP 
                    maxLength={6} 
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Verifying...
              </>
            ) : 'Verify OTP'}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code? {' '}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            onClick={handleResendOtp}
            disabled={isLoading || countdown > 0}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
          </Button>
        </p>

        <Button 
          variant="link" 
          className="mt-2" 
          onClick={() => verificationType === 'reset' ? navigate('/forgot-password') : navigate('/register')}
        >
          {verificationType === 'reset' ? 'Change Email' : 'Back to registration'}
        </Button>
      </div>
    </div>
  );
};

export default OtpVerificationForm;
