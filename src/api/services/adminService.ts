import { apiClient } from "../client";

// Types for admin dashboard statistics
export interface DashboardStats {
  counts: {
    users: number;
    businesses: number;
    services: number;
    bookings: number;
  };
  recentBookings: BookingInfo[];
  revenue: {
    total: number;
    monthly: number[];
  };
  userRegistrations: { month: string; count: number }[];
}

export interface BusinessInfo {
  id: number;
  name: string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  address: string;
  phone?: string;
  email?: string;
  location?: string;
  status: string;
  createdAt: string;
}

// Updated to match actual API response
export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  avatar?: string | null;
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingInfo {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  business: {
    id: number;
    name: string;
    address: string;
  };
  status: string;
  booking_date: string;
  booking_time: string;
  created_at: string;
}

export interface PaymentInfo {
  id: number;
  amount: number;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  booking: {
    id: number;
    business: {
      id: number;
      name: string;
    };
  };
  created_at: string;
}

export interface ReviewInfo {
  id: number;
  rating: number;
  comment: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  service: {
    id: number;
    name: string;
    business: {
      id: number;
      name: string;
    };
  };
  created_at: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  rating?: number;
}

// Updated to match actual API response
export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// Updated to match actual API response format
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

/**
 * Admin service for dashboard and management operations
 */
export const adminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    console.log('Calling getDashboardStats API');
    const response = await apiClient.get<ApiResponse<DashboardStats>>("/admins/dashboard");
    console.log('getDashboardStats raw response:', response);
    console.log('getDashboardStats data structure:', response.data);
    return response?.data; // Extract data from nested response
  },

  /**
   * Get all businesses (with pagination)
   */
  getAllBusinesses: async (params: PaginationParams = {}) => {
    console.log('Calling getAllBusinesses API with params:', params);
    const response = await apiClient.get<ApiResponse<{ 
      businesses: BusinessInfo[]; 
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    }>>("/admins/businesses", { params });
    
    console.log('getAllBusinesses raw response:', response);
    console.log('getAllBusinesses data structure:', response.data);
    
    // Extract data from nested response
    return {
      businesses: response.data.data.items || [],
      pagination: {
        total: response.data.data.totalItems,
        totalPages: response.data.data.totalPages,
        page: response.data.data.currentPage,
        limit: response.data.data.itemsPerPage
      }
    };
  },

  /**
   * Get all users (with pagination)
   */
  getAllUsers: async (params: PaginationParams = {}) => {
    console.log('Calling getAllUsers API with params:', params);
    const response = await apiClient.get<ApiResponse<{
      users: UserInfo[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    }>>("/admins/users", { params });
    
    console.log('getAllUsers raw response:', response);
    console.log('getAllUsers data structure:', response.data);
    
    // Extract data from nested response
    return {
      users: response.data?.data.items || [],
      pagination: {
        total: response.data?.data?.totalItems,
        totalPages: response?.data?.data?.totalPages,
        page: response.data?.data?.currentPage,
        limit: response.data?.data?.itemsPerPage
      }
    };
  },

  /**
   * Get all bookings (with pagination)
   */
  getAllBookings: async (params: PaginationParams = {}) => {
    const response = await apiClient.get<ApiResponse<{
      bookings: BookingInfo[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    }>>("/admins/bookings", { params });
    
    return {
      bookings: response.data.bookings,
      pagination: {
        total: response.data.totalItems,
        totalPages: response.data.totalPages,
        page: response.data.currentPage,
        limit: response.data.itemsPerPage
      }
    };
  },

  /**
   * Get all payments (with pagination)
   */
  getAllPayments: async (params: PaginationParams = {}) => {
    const response = await apiClient.get<ApiResponse<{
      payments: PaymentInfo[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    }>>("/admins/payments", { params });
    
    return {
      payments: response.data.payments,
      pagination: {
        total: response.data.totalItems,
        totalPages: response.data.totalPages,
        page: response.data.currentPage,
        limit: response.data.itemsPerPage
      }
    };
  },

  /**
   * Get all reviews (with pagination)
   */
  getAllReviews: async (params: PaginationParams = {}) => {
    const response = await apiClient.get<ApiResponse<{
      reviews: ReviewInfo[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    }>>("/admins/reviews", { params });
    
    return {
      reviews: response.data.reviews,
      pagination: {
        total: response.data.totalItems,
        totalPages: response.data.totalPages,
        page: response.data.currentPage,
        limit: response.data.itemsPerPage
      }
    };
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/admins/reviews/${id}`);
    return response.data;
  },

  /**
   * Get site settings
   */
  getSiteSettings: async () => {
    const response = await apiClient.get<ApiResponse<{ settings: SiteSettings }>>("/admins/settings");
    return response.data;
  },

  /**
   * Update site settings
   */
  updateSiteSettings: async (settings: SiteSettings) => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>("/admins/settings", { settings });
    return response.data;
  },

  /**
   * Update user roles
   */
  updateUserRoles: async (userId: number, role: string) => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>(`/admins/users/${userId}/role`, { role });
    return response.data;
  }
};

