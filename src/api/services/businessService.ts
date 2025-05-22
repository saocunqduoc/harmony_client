import { apiClient } from "../client";

export interface Business {
  id: number;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  taxCode?: string;
  status?: string;
  logo?: string;
  coverImage?: string;
  latitude?: string;
  longitude?: string;
  createdAt?: string;
  updatedAt?: string;
  website?: string;
}

export interface BusinessApplyRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
}

export interface CreateBusinessRequest {
  name: string;
  email: string;
  description?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  latitude?: string;
  longitude?: string;
  taxCode?: string;
}

export interface BusinessServiceResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  thumbnail?: string;
  categoryId: number;
  businessId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSearchParams {
  name?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface BusinessSearchResponse {
  total: number;
  page: number;
  pageSize: number;
  data: Business[];
}

export interface RevenuePerDay {
  date: string;
  total: number;
}

export interface BookingPerDay {
  name: string;
  value: number;
}

export interface PopularService {
  name: string;
  value: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface BusinessOverview {
  totalServices: number;
  bookingsToday: number;
  totalStaff: number;
  revenueThisMonth: number;
}

export interface ServicePerformance {
  id: number;
  name: string;
  price: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: string;
}

export interface RevenueAnalysis {
  totalRevenue: number;
  totalTransactions: number;
  averageBooking: number;
}

export interface TopCustomer {
  name: string;
  email: string;
  phone: string;
  bookingCount: number;
}

export interface CustomerAnalysis {
  totalCustomers: number;
  averageBookingsPerCustomer: string;
  topCustomers: TopCustomer[];
}

/**
 * Business service for managing businesses
 */
export const businessService = {
  /**
   * Get all businesses with optional search parameters
   */
  getAllBusinesses: async (params?: BusinessSearchParams): Promise<BusinessSearchResponse> => {
    const response = await apiClient.get<any>("/businesses", {
      params: params
    });
    return response.data?.data || { total: 0, page: 1, pageSize: 10, data: [] };
  },

  /**
   * Get business by ID
   */
  getBusinessById: async (id: number): Promise<Business> => {
    const response = await apiClient.get<any>(`/businesses/${id}`);
    return response.data?.data;
  },

  /**
   * Get business of the current owner
   */
  getBusinessOwner: async (): Promise<Business> => {
    const response = await apiClient.get<any>("/businesses/owner");
    return response.data?.data;
  },

  /**
   * Apply for a new business
   */
  applyBusiness: async (businessData: BusinessApplyRequest): Promise<any> => {
    const response = await apiClient.post<any>("/businesses/apply", businessData);
    return response.data;
  },

  /**
   * Create a new business (Admin only)
   */
  createBusiness: async (businessData: CreateBusinessRequest): Promise<Business> => {
    const response = await apiClient.post<any>("/businesses", businessData);
    return response.data?.data;
  },

  /**
   * Update business information
   * Endpoint for owner and manager updating their own business
   */
  updateBusiness: async (businessData: UpdateBusinessRequest): Promise<Business> => {
    const response = await apiClient.put<any>(`/businesses`, businessData);
    return response.data?.data;
  },

  /**
   * Delete a business
   */
  deleteBusiness: async (id: number): Promise<void> => {
    await apiClient.delete<any>(`/businesses/${id}`);
  },

  /**
   * Get business services
   */
  getBusinessServices: async (id: number): Promise<BusinessServiceResponse[]> => {
    const response = await apiClient.get<any>(`/businesses/${id}/services`);
    return response.data?.data || [];
  },

  /**
   * Upload business logo
   */
  uploadBusinessLogo: async (logoFile: File): Promise<Business> => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await apiClient.post<any>(`/businesses/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data?.data;
  },

  /**
   * Upload business cover image
   */
  uploadBusinessCover: async (coverFile: File): Promise<Business> => {
    const formData = new FormData();
    formData.append('coverImage', coverFile);
    
    const response = await apiClient.post<any>(`/businesses/cover-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data?.data;
  },

  /**
   * Get customers of the current business (with pagination & search)
   */
  getBusinessCustomers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get<any>("/businesses/customers", {
      params
    });
    return response.data?.data;
  },

  /**
   * Get reviews for a business (with pagination)
   */
  getBusinessReviews: async (id: number, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get<any>(`/businesses/${id}/reviews`, { params });
    const d = response.data.data;
    return {
      reviews: d.items,
      pagination: {
        totalItems: d.totalItems,
        totalPages: d.totalPages,
        currentPage: d.currentPage,
        itemsPerPage: d.itemsPerPage
      }
    };
  },

  // Tổng doanh thu theo ngày (tùy chọn khoảng from/to)
  getBusinessRevenue: async (params?: { from?: string; to?: string }): Promise<RevenuePerDay[]> => {
    const response = await apiClient.get<any>("/businesses/analytics/revenue", { params });
    return response.data?.data || [];
  },

  // Số lần đặt lịch theo ngày (thêm filter from/to)
  getBusinessBookingsPerDay: async (params?: { from?: string; to?: string }): Promise<BookingPerDay[]> => {
    const response = await apiClient.get<any>(
      "/businesses/analytics/bookings-per-day",
      { params }
    );
    return response.data?.data || [];
  },

  // Top dịch vụ phổ biến (filter by date range)
  getBusinessPopularServices: async (params?: { from?: string; to?: string }): Promise<PopularService[]> => {
    const response = await apiClient.get<any>(
      "/businesses/analytics/popular-services",
      { params }
    );
    return response.data?.data || [];
  },

  // Phân bố đánh giá 1-5 sao (filter by date range)
  getBusinessRatings: async (params?: { from?: string; to?: string }): Promise<RatingDistribution[]> => {
    const response = await apiClient.get<any>(
      "/businesses/analytics/ratings",
      { params }
    );
    return response.data?.data || [];
  },

  // Tổng quan doanh nghiệp
  getBusinessOverview: async (): Promise<BusinessOverview> => {
    const response = await apiClient.get<any>("/businesses/overview");
    return response.data?.data;
  },

  // Hiệu suất dịch vụ (filter by date range)
  getServicePerformance: async (params?: { from?: string; to?: string }): Promise<ServicePerformance[]> => {
    const response = await apiClient.get<any>("/businesses/analytics/service-performance", { params });
    return response.data?.data || [];
  },

  // Phân tích doanh thu tổng quan (filter by date range)
  getRevenueAnalysis: async (params?: { from?: string; to?: string }): Promise<RevenueAnalysis> => {
    const response = await apiClient.get<any>("/businesses/analytics/revenue-analytics", { params });
    return response.data?.data;
  },

  // Phân tích khách hàng (filter by date range)
  getCustomerAnalysis: async (params?: { from?: string; to?: string }): Promise<CustomerAnalysis> => {
    const response = await apiClient.get<any>("/businesses/analytics/customer-analytics", { params });
    return response.data?.data;
  }
};
