
import { 
  apiClient, 
  setAuthToken, 
  setRefreshToken, 
  clearAuthData, 
  setUserData 
} from "../client";

// Types for auth requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    role: string;
    address?: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpForPasswordResetRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  valid: boolean;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  address?: string;
}

/**
 * Authentication service for login, register, logout operations
 */
export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>("/auth/login", credentials);
    
    // Extract data from the API response format
    const responseData = response.data || {};
    
    // Handle different API response formats
    const data = responseData.data || responseData;
    
    const user = data || {};
    const accessToken = user.accessToken || user.access_token;
    const refreshToken = user.refreshToken || user.refresh_token;
    
    if (accessToken) {
      setAuthToken(accessToken);
      setRefreshToken(refreshToken);
      
      const userData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        address: user.address,
        avatar: user.avatar
      };
      
      setUserData(userData);
      
      return {
        user: userData,
        accessToken,
        refreshToken
      };
    }
    
    throw new Error('Authentication failed');
  },
  
  /**
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>("/auth/register", userData);
    
    // Extract data from the API response format
    const responseData = response.data || {};
    
    // Handle different API response formats
    const data = responseData.data || responseData;
    
    // For registration, we might just return the user data and not authenticate yet
    // since email verification might be required
    return {
      user: {
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role || 'customer',
      },
      accessToken: '',
      refreshToken: ''
    };
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<void>("/auth/logout", {});
    } finally {
      clearAuthData();
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await apiClient.get<any>("/users/me");
    const responseData = response.data || {};
    const data = responseData.data || responseData;
    
    return {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      address: data.address,
      avatar: data.avatar
    };
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: UpdateProfileRequest) => {
    const response = await apiClient.put<any>("/users/me", userData);
    const responseData = response.data || {};
    const data = responseData.data || responseData;
    return data;
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordRequest) => {
    return apiClient.put<{ message: string }>("/users/change-password", data);
  },

  /**
   * Request password reset (sends OTP)
   */
  forgotPassword: async (data: ForgotPasswordRequest) => {
    return apiClient.post<{ message: string }>("/auth/forgot-password", data);
  },

  /**
   * Verify OTP for password reset
   */
  verifyOtpForPasswordReset: async (data: VerifyOtpForPasswordResetRequest) => {
    // Ensure OTP is a string
    const payload = {
      email: data.email,
      otp: data.otp.toString()
    };
    return apiClient.post<{ message: string }>("/auth/forgot-password-verify", payload);
  },

  /**
   * Reset password with OTP and new password
   */
  resetPassword: async (data: ResetPasswordRequest) => {
    // Ensure OTP is a string
    const payload = {
      email: data.email,
      otp: data.otp.toString(),
      newPassword: data.newPassword
    };
    return apiClient.put<{ message: string }>("/auth/reset-password", payload);
  },
  
  /**
   * Verify OTP for account verification
   */
  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    // Ensure OTP is sent as a string
    const response = await apiClient.post<any>("/auth/verify-otp", {
      email: data.email,
      otp: data.otp.toString()
    });
    
    // Parse response to determine if OTP verification was successful
    const responseData = response.data || {};
    
    return {
      valid: true,
      message: responseData.message || "OTP verification complete"
    };
  },
  
  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.patch<any>("/users/avatar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    const responseData = response.data || {};
    const data = responseData.data || responseData;
    return data;
  },

  /**
   * Get user bookings
   */
  getUserBookings: async () => {
    const response = await apiClient.get<any>("/bookings");
    const responseData = response.data || {};
    const data = responseData.data || responseData;
    return data.bookings || [];
  }
};
