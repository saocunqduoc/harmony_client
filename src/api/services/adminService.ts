
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

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
  roles: { id: number; name: string }[];
  createdAt: string;
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

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Admin service for dashboard and management operations
 */
export const adminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>("/admin/dashboard");
  },

  /**
   * Get all businesses (with pagination)
   */
  getAllBusinesses: async (params: PaginationParams = {}) => {
    return apiClient.get<{ businesses: BusinessInfo[]; pagination: PaginationMeta }>(
      "/admin/businesses", 
      { params }
    );
  },

  /**
   * Get all users (with pagination)
   */
  getAllUsers: async (params: PaginationParams = {}) => {
    return apiClient.get<{ users: UserInfo[]; pagination: PaginationMeta }>(
      "/admin/users", 
      { params }
    );
  },

  /**
   * Get all bookings (with pagination)
   */
  getAllBookings: async (params: PaginationParams = {}) => {
    return apiClient.get<{ bookings: BookingInfo[]; pagination: PaginationMeta }>(
      "/admin/bookings", 
      { params }
    );
  },

  /**
   * Get all payments (with pagination)
   */
  getAllPayments: async (params: PaginationParams = {}) => {
    return apiClient.get<{ payments: PaymentInfo[]; pagination: PaginationMeta }>(
      "/admin/payments", 
      { params }
    );
  },

  /**
   * Get all reviews (with pagination)
   */
  getAllReviews: async (params: PaginationParams = {}) => {
    return apiClient.get<{ reviews: ReviewInfo[]; pagination: PaginationMeta }>(
      "/admin/reviews", 
      { params }
    );
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: number) => {
    return apiClient.delete<{ message: string }>(`/admin/reviews/${id}`);
  },

  /**
   * Get site settings
   */
  getSiteSettings: async () => {
    return apiClient.get<{ settings: SiteSettings }>("/admin/settings");
  },

  /**
   * Update site settings
   */
  updateSiteSettings: async (settings: SiteSettings) => {
    return apiClient.put<{ message: string }>("/admin/settings", { settings });
  },

  /**
   * Update user roles
   */
  updateUserRoles: async (userId: number, roleIds: string[]) => {
    return apiClient.put<{ message: string }>(`/users/${userId}/roles`, { roleIds });
  }
};

