import { useApi } from './use-api';
import { paymentService, PayoutAccountRequest, PaymentInitRequest, PaymentStatus, ZaloPayRedirectParams } from '@/api/services/paymentService';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const TRANSACTION_ID_COOKIE = 'harmony_current_transaction';
const REDIRECT_PROCESSED_COOKIE = 'harmony_redirect_processed';

export const usePayment = () => {
  const { apiQuery, apiMutation, invalidateQueries } = useApi();
  const location = useLocation();
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Extract transaction ID from URL or cookies on mount
  useEffect(() => {
    const storedTransId = Cookies.get(TRANSACTION_ID_COOKIE);
    
    if (storedTransId) {
      setTransactionId(storedTransId);
      console.log('Loaded transaction ID from cookie:', storedTransId);
    }
  }, [location]);

  // Clear transaction ID on unmount
  useEffect(() => {
    return () => {
      // Do not remove the cookie on unmount to allow for persistence between page navigations
      // Only clear it after payment is completed or failed
    };
  }, []);

  // Get payment status
  const getPaymentStatus = () => {
    if (!transactionId) return;

    return apiQuery<PaymentStatus>(
      ['paymentStatus', transactionId],
      () => paymentService.getPaymentStatus(transactionId),
      {
        refetchInterval: (query) => 
          query.state.data?.status === 'pending' ? 3000 : false, // Poll every 3s if pending
        staleTime: 0, // Always fetch fresh data
        gcTime: 0, // Don't cache the results
        retry: 3,
        // Remove the onSuccess logic as it is not supported here
      }
    );
  };

  // Process ZaloPay redirect parameters with added safeguards
  const processPaymentRedirectMutation = apiMutation<PaymentStatus, ZaloPayRedirectParams>(
    (params) => {
      // Check if this specific redirect has already been processed
      const redirectId = params.apptransid || '';
      const redirectProcessedKey = `${REDIRECT_PROCESSED_COOKIE}_${redirectId}`;
      
      if (Cookies.get(redirectProcessedKey)) {
        console.log('Skipping already processed redirect:', redirectId);
        // Return mock result to avoid API call
        return Promise.resolve({
          status: 'pending',
          message: 'Đã xử lý thanh toán trước đó, đang kiểm tra trạng thái...',
          transactionId: params.apptransid || transactionId
        } as PaymentStatus);
      }
      
      // Mark this redirect as processed to prevent duplicates
      Cookies.set(redirectProcessedKey, 'true', {
        expires: 1/24, // 1 hour
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      return paymentService.processPaymentRedirect(params);
    },
    {
      onSuccess: (data) => {
        console.log('Payment redirect processed:', data);
        
        // Store transaction ID to allow checking status
        if (data.transactionId) {
          setTransactionId(data.transactionId);
          
          Cookies.set(TRANSACTION_ID_COOKIE, data.transactionId, {
            expires: 1/24, // 1 hour
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        }
        
        // Invalidate any queries that might depend on payment status
        invalidateQueries([['userBookings'], ['paymentStatus']]);
      },
      onError: (error: any) => {
        console.error('Error processing payment redirect:', error);
        
        // Extract apptransid from the original parameters if available
        const params = error.config?.params || {};
        const apptransid = params.apptransid || '';
        
        if (apptransid) {
          // Still store the transaction ID even if validation failed
          setTransactionId(apptransid);
          Cookies.set(TRANSACTION_ID_COOKIE, apptransid, {
            expires: 1/24, // 1 hour
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        }
        
        // Create a more helpful error message based on the error
        const errorMessage = error.response?.data?.message || error.message || 'Vui lòng liên hệ hỗ trợ';
        
        // For specific error cases, use custom messages
        let displayMessage = 'Không thể xử lý kết quả thanh toán: ';
        
        if (errorMessage.includes('Checksum')) {
          displayMessage += 'Thông tin xác thực không hợp lệ. Đang kiểm tra trạng thái thanh toán...';
          
          // In case of checksum errors, we should still try to update payment status
          // by invalidating the query to force a refresh
          invalidateQueries([['paymentStatus', apptransid]]);
        } else {
          displayMessage += errorMessage;
        }
        
        toast.error(displayMessage);
      },
      retry: 0 // Don't retry on failure as it could lead to duplicate processing
    }
  );

  // Get payout accounts
  const getPayoutAccounts = () => {
    return apiQuery(
      ['payoutAccounts'],
      () => paymentService.getPayoutAccounts(),
      {
        staleTime: 5 * 60 * 1000, // 5 minutes cache
      }
    );
  };

  // Get available payment methods
  const getPaymentMethods = () => {
    return apiQuery(
      ['paymentMethods'],
      () => paymentService.getAvailablePaymentMethods(),
      {
        staleTime: 60 * 60 * 1000, // 1 hour cache
      }
    );
  };
  
  // Create payout account
  const createPayoutAccountMutation = apiMutation(
    (data: PayoutAccountRequest) => paymentService.createPayoutAccount(data),
    {
      onSuccess: () => {
        toast.success('Tài khoản nhận tiền đã được tạo thành công');
        invalidateQueries([['payoutAccounts']]);
      }
    }
  );

  // Update payout account
  const updatePayoutAccountMutation = apiMutation(
    ({ id, data }: { id: number; data: Partial<PayoutAccountRequest> }) =>
      paymentService.updatePayoutAccount(id, data),
    {
      onSuccess: () => {
        toast.success('Tài khoản nhận tiền đã được cập nhật');
        invalidateQueries([['payoutAccounts']]);
      }
    }
  );

  // Delete payout account
  const deletePayoutAccountMutation = apiMutation(
    (id: number) => paymentService.deletePayoutAccount(id),
    {
      onSuccess: () => {
        toast.success('Tài khoản nhận tiền đã được xóa');
        invalidateQueries([['payoutAccounts']]);
      }
    }
  );

  // Initialize payment with better error handling
  const initPaymentMutation = apiMutation(
    (data: PaymentInitRequest) => paymentService.initPayment(data),
    {
      onSuccess: (data) => {
        if (data.redirectUrl) {
          // Store transaction ID before redirect
          if (data.transactionId) {
            Cookies.set(TRANSACTION_ID_COOKIE, data.transactionId, {
              expires: 1/24, // 1 hour
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            });
            console.log('Stored transaction ID in cookie:', data.transactionId);
          }
          window.location.href = data.redirectUrl;
        } else {
          toast.error('Không thể khởi tạo thanh toán');
        }
      },
      onError: (error: any) => {
        toast.error('Lỗi khi khởi tạo thanh toán: ' + (error.message || 'Vui lòng thử lại sau'));
      }
    }
  );

  // Verify ZaloPay payment
  const verifyZaloPayCallbackMutation = apiMutation(
    (data: any) => paymentService.verifyZaloPayCallback(data),
    {
      onSuccess: () => {
        toast.success('Thanh toán đã được xác nhận');
        invalidateQueries([['userBookings']]);
      },
      onError: (error: any) => {
        console.error('Payment verification error:', error);
        toast.error('Không thể xác nhận thanh toán: ' + (error.message || 'Vui lòng liên hệ hỗ trợ.'));
      }
    }
  );

  return {
    transactionId,
    getPaymentStatus,
    getPayoutAccounts,
    getPaymentMethods,
    createPayoutAccount: (data: PayoutAccountRequest) => createPayoutAccountMutation.mutate(data),
    updatePayoutAccount: (id: number, data: Partial<PayoutAccountRequest>) =>
      updatePayoutAccountMutation.mutate({ id, data }),
    deletePayoutAccount: (id: number) => deletePayoutAccountMutation.mutate(id),
    initPayment: (data: PaymentInitRequest) => initPaymentMutation.mutateAsync(data),
    verifyZaloPayCallback: (data: any) => verifyZaloPayCallbackMutation.mutate(data),
    processPaymentRedirect: (params: ZaloPayRedirectParams) => 
      processPaymentRedirectMutation.mutateAsync(params),
    isCreatingAccount: createPayoutAccountMutation.isPending,
    isUpdatingAccount: updatePayoutAccountMutation.isPending,
    isDeletingAccount: deletePayoutAccountMutation.isPending,
    isInitiatingPayment: initPaymentMutation.isPending,
    isVerifyingPayment: verifyZaloPayCallbackMutation.isPending,
    isProcessingRedirect: processPaymentRedirectMutation.isPending
  };
};
