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

export interface ServiceCategoryInfo {
  id: number;
  name: string;
  description?: string;
  status: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  description?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
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
    return response?.data.data; // Extract data from nested response
  },

  /**
   * Get all businesses (with pagination)
   */
  getAllBusinesses: async (params: PaginationParams = {}) => {
    console.log('Calling getAllBusinesses API with params:', params);
    const response = await apiClient.get<ApiResponse<{ 
      items: BusinessInfo[]; 
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
   * Update business status
   */
  updateBusinessStatus: async (businessId: number, status: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/admins/businesses/${businessId}/status`, { 
      status 
    });
    return response.data;
  },

  /**
   * Get all services (with pagination)
   */
  getAllServices: async (params: PaginationParams = {}) => {
    const queryParams: Record<string, string> = {};
    
    // Convert number values to strings for the API request
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });
    
    const response = await apiClient.get<ApiResponse<any>>("/admins/services", { 
      params: queryParams 
    });
    
    return response.data.data;
  },
  
  /**
   * Update service status
   */
  updateServiceStatus: async (serviceId: number, status: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/admins/services/${serviceId}/status`, { 
      status 
    });
    return response.data;
  },

  /**
   * Verify a service
   */
  verifyService: async (serviceId: number, verificationStatus: 'verified' | 'rejected', rejectReason?: string) => {
    const response = await apiClient.put<ApiResponse<any>>(`/admins/services/${serviceId}/verify`, { 
      status: verificationStatus,
      reason: rejectReason
    });
    return response.data;
  },

  /**
   * Get all service categories (with pagination)
   */
  getAllCategories: async (params: PaginationParams = {}) => {
    const response = await apiClient.get<ApiResponse<{
      items: ServiceCategoryInfo[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    }>>("/admins/categories", { params });
    
    return response.data.data;
  },
  
  /**
   * Create a new service category
   */
  createCategory: async (categoryData: {
    name: string;
    description?: string;
    status?: string;
    icon?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<ServiceCategoryInfo>>("/admins/categories", categoryData);
    return response.data;
  },
  
  /**
   * Update a service category
   */
  updateCategory: async (categoryId: number, categoryData: {
    name?: string;
    description?: string;
    status?: string;
    icon?: string;
  }) => {
    const response = await apiClient.put<ApiResponse<ServiceCategoryInfo>>(`/admins/categories/${categoryId}`, categoryData);
    return response.data;
  },

  /**
   * Get all users (with pagination)
   */
  getAllUsers: async (params: PaginationParams = {}) => {
    console.log('Calling getAllUsers API with params:', params);
    const response = await apiClient.get<ApiResponse<{
      items: UserInfo[];
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
   * Update user information
   */
  updateUser: async (userId: number, userData: {
    fullName?: string;
    email?: string;
    phone?: string;
    status?: string;
  }) => {
    const response = await apiClient.put<ApiResponse<UserInfo>>(`/admins/users/${userId}`, userData);
    return response.data;
  },
  
  /**
   * Delete a user
   */
  deleteUser: async (userId: number) => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/admins/users/${userId}`);
    return response.data;
  },

  /**
   * Get all bookings (with pagination)
   */
  getAllBookings: async (params: PaginationParams = {}) => {
    const response = await apiClient.get<ApiResponse<{
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
      bookings: {
        id: number;
        bookingDate: string;
        startTime: string;
        endTime: string;
        status: string;
        totalAmount: number;
        paymentStatus: string;
        customer: {
          fullName: string;
          email: string;
          phone?: string | null;
        };
        business: {
          id: number;
          name: string;
        };
      }[];
    }>>("/admins/bookings", { params });
    
    // Return data in the format expected by the component
    return {
      bookings: response.data.data.bookings || [],
      totalItems: response.data.data.totalItems,
      totalPages: response.data.data.totalPages,
      currentPage: response.data.data.currentPage,
      itemsPerPage: response.data.data.itemsPerPage
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
      payments: response.data.data.payments,
      pagination: {
        total: response.data.data.totalItems,
        totalPages: response.data.data.totalPages,
        page: response.data.data.currentPage,
        limit: response.data.data.itemsPerPage
      }
    };
  },

  /**
   * Get all reviews (with pagination)
   */
  getAllReviews: async (params: PaginationParams = {}) => {
    const response = await apiClient.get<ApiResponse<{
      items: ReviewInfo[];
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    }>>("/admins/reviews", { params });
    
    return {
      reviews: response.data.data.items || [],
      pagination: {
        total: response.data.data.totalItems,
        totalPages: response.data.data.totalPages,
        page: response.data.data.currentPage,
        limit: response.data.data.itemsPerPage
      }
    };
  },

  /**
   * Approve a review
   */
  approveReview: async (id: number) => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>(`/admins/reviews/${id}/approve`);
    return response.data;
  },

  /**
   * Reject a review
   */
  rejectReview: async (id: number, reason: string) => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>(`/admins/reviews/${id}/reject`, { reason });
    return response.data;
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: number) => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/admins/reviews/${id}`);
    return response.data;
  },

  /**
   * Get all system settings
   */
  getAllSettings: async () => {
    const response = await apiClient.get<ApiResponse<{items: SystemSetting[]}>>("/admins/settings");
    return response.data.data.items;
  },

  /**
   * Update a system setting
   */
  updateSetting: async (key: string, value: string) => {
    const response = await apiClient.put<ApiResponse<SystemSetting>>(`/admins/settings/${key}`, { value });
    return response.data;
  },
  
  /**
   * Delete a system setting
   */
  deleteSetting: async (key: string) => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/admins/settings/${key}`);
    return response.data;
  },

  /**
   * Update user roles
   */
  updateUserRoles: async (userId: number, role: string) => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>(`/admins/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Get analytics - Top customers
   */
  getTopCustomers: async () => {
    const response = await apiClient.get<ApiResponse<any>>("/admins/analytics/top-customers");
    return response.data.data;
  },

  /**
   * Get analytics - Top businesses by revenue
   */
  getTopBusinessesByRevenue: async () => {
    const response = await apiClient.get<ApiResponse<any>>("/admins/analytics/top-businesses");
    return response.data.data;
  },

  /**
   * Get analytics - Top services by usage
   */
  getTopServicesByUsage: async () => {
    const response = await apiClient.get<ApiResponse<any>>("/admins/analytics/top-services");
    return response.data.data;
  }
};

