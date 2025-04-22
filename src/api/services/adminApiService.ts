
import { apiClient } from "../client";

// Pagination params type for admin requests
export interface PaginationParams {
  search?: string;
  page?: string | number;
  limit?: string | number;
  [key: string]: string | number | undefined;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

export interface BusinessResponse {
  id: number;
  name: string;
  email: string;
  status: string;
  ownerName: string;
  phone: string;
  city: string;
  createdAt: string;
}

export interface ServiceResponse {
  id: number;
  name: string;
  price: number;
  status: string;
  businessId: number;
  business?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

/**
 * Admin API Service for interacting with admin endpoints
 */
export const adminApiService = {
  // User Management
  getAllUsers: (params: PaginationParams) => {
    const queryParams: Record<string, string> = {};
    
    // Convert number values to strings for the API request
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });
    
    return apiClient.get<any>("/admins/users", { params: queryParams });
  },

  updateUser: (userId: number | string, data: any) => {
    const numericId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    return apiClient.put<any>(`/admins/users/${numericId}`, data);
  },

  deleteUser: (userId: number | string) => {
    const numericId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    return apiClient.delete<any>(`/admins/users/${numericId}`);
  },

  // Business Management
  getAllBusinesses: (params: PaginationParams) => {
    const queryParams: Record<string, string> = {};
    
    // Convert number values to strings for the API request
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });
    
    return apiClient.get<any>("/admins/businesses", { params: queryParams });
  },

  updateBusinessStatus: (businessId: number | string, status: string) => {
    const numericId = typeof businessId === 'string' ? parseInt(businessId, 10) : businessId;
    return apiClient.put<any>(`/admins/businesses/${numericId}/status`, { status });
  },

  // Service Management
  getAllServices: (params: PaginationParams) => {
    const queryParams: Record<string, string> = {};
    
    // Convert number values to strings for the API request
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });
    
    return apiClient.get<any>("/admins/services", { params: queryParams });
  },

  // Categories
  getAllCategories: (params: PaginationParams) => {
    const queryParams: Record<string, string> = {};
    
    // Convert number values to strings for the API request
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });
    
    return apiClient.get<any>("/admins/categories", { params: queryParams });
  },

  createCategory: (data: any) => {
    return apiClient.post<any>("/admins/categories", data);
  },

  updateCategory: (categoryId: number | string, data: any) => {
    const numericId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
    return apiClient.put<any>(`/admins/categories/${numericId}`, data);
  },

  // Reviews
  getAllReviews: (params: PaginationParams) => {
    const queryParams: Record<string, string> = {};
    
    // Convert number values to strings for the API request
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });
    
    return apiClient.get<any>("/admins/reviews", { params: queryParams });
  },

  approveReview: (reviewId: number | string) => {
    const numericId = typeof reviewId === 'string' ? parseInt(reviewId, 10) : reviewId;
    return apiClient.put<any>(`/admins/reviews/${numericId}/approve`);
  },

  rejectReview: (reviewId: number | string, reason: string) => {
    const numericId = typeof reviewId === 'string' ? parseInt(reviewId, 10) : reviewId;
    return apiClient.put<any>(`/admins/reviews/${numericId}/reject`, { reason });
  },

  deleteReview: (reviewId: number | string) => {
    const numericId = typeof reviewId === 'string' ? parseInt(reviewId, 10) : reviewId;
    return apiClient.delete<any>(`/admins/reviews/${numericId}`);
  },

  // Dashboard
  getDashboard: () => {
    return apiClient.get<any>("/admins/dashboard");
  }
};
