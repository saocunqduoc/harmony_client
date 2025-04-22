import { apiClient } from '../client';

export interface PaymentMethod {
  id: number;
  name: string;
  type: 'cash' | 'credit_card' | 'bank_transfer' | 'ewallet';
  logoUrl?: string;
  isDefault?: boolean;
}

export interface PaymentInitRequest {
  bookingId: number;
  method: 'zalopay' | 'cash';
}

export interface PaymentInitResponse {
  redirectUrl: string;
  transactionId?: string;
}

export interface PayoutAccount {
  id: number;
  provider: 'zalopay' | 'vnpay' | 'vietqr' | 'momo' | 'bank' | 'manual';
  accountNumber: string;
  accountName: string;
  bankCode?: string;
  isDefault: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PayoutAccountRequest {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isDefault?: boolean;
}

export interface PaymentStatus {
  status: 'success' | 'failed' | 'pending' | 'timeout';
  message: string;
  transactionId?: string;
  amount?: number;
  failureReason?: string;
  bookingId?: number;
}

export interface ZaloPayRedirectParams {
  appid?: string;
  apptransid: string;
  status?: string;
  amount?: string;
  bankcode?: string;
  checksum?: string;
}

/**
 * Service for managing payments and payout accounts
 */
export const paymentService = {
  // Initialize a payment
  initPayment: async (data: PaymentInitRequest): Promise<PaymentInitResponse> => {
    const response = await apiClient.post<{ data: PaymentInitResponse }>('/payments/init', data);
    return response.data.data;
  },

  // Get payment status by transaction ID
  getPaymentStatus: async (transactionId: string): Promise<PaymentStatus> => {
    const response = await apiClient.get<{ data: PaymentStatus }>(`/payments/status/${transactionId}`);
    return response.data.data;
  },

  // Process ZaloPay redirect parameters
  processPaymentRedirect: async (params: ZaloPayRedirectParams): Promise<PaymentStatus> => {
    const response = await apiClient.get<{ data: PaymentStatus }>('/payments/result', { params });
    return response.data.data;
  },

  // Verify ZaloPay callback
  verifyZaloPayCallback: async (data: any) => {
    const response = await apiClient.post<{ data: any }>('/payments/zalopay/verify', data);
    return response.data;
  },

  // Get available payment methods
  getAvailablePaymentMethods: async () => {
    const response = await apiClient.get<{ data: PaymentMethod[] }>('/payments/methods');
    return response.data;
  },

  // Create payout account
  createPayoutAccount: async (data: PayoutAccountRequest) => {
    const response = await apiClient.post<{ data: PayoutAccount }>('/payments/payout-accounts', data);
    return response.data;
  },

  // Get payout accounts
  getPayoutAccounts: async () => {
    const response = await apiClient.get<{ data: PayoutAccount[] }>('/payments/payout-accounts');
    return response.data;
  },

  // Update payout account
  updatePayoutAccount: async (id: number, data: Partial<PayoutAccountRequest>) => {
    const response = await apiClient.put<{ data: PayoutAccount }>(`/payments/payout-accounts/${id}`, data);
    return response.data;
  },

  // Delete payout account
  deletePayoutAccount: async (id: number) => {
    const response = await apiClient.delete<{ data: boolean }>(`/payments/payout-accounts/${id}`);
    return response.data;
  }
};
