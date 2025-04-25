import { api, createAuthHeader } from "../client";

// Review interface for handling review data
export interface Review {
  id?: number;
  bookingDetailId: number;
  rating: number;
  comment?: string;
  status?: string;
  businessId?: number;
  serviceId?: number;
  staffId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Review request interface for creating multiple reviews
export interface ReviewRequest {
  bookingDetailId: number;
  rating: number;
  comment?: string;
}

// Response interface for review API calls
export interface ReviewResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Service for managing reviews
 */
export const reviewService = {
  /**
   * Create multiple reviews for different booking details
   */
  createMultipleReviews: async (reviews: ReviewRequest[]): Promise<ReviewResponse> => {
    return api.post<ReviewResponse>('/reviews', reviews, {
      headers: createAuthHeader()
    });
  },

  /**
   * Update an existing review
   */
  updateReview: async (reviewId: number, data: { rating: number, comment?: string }): Promise<ReviewResponse> => {
    return api.put<ReviewResponse>(`/reviews/${reviewId}`, data, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get all reviews by the current user
   */
  getMyReviews: async (params?: { search?: string, page?: number, limit?: number }): Promise<ReviewResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<ReviewResponse>(`/reviews/my${queryString}`, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get reviews for a specific business
   */
  getBusinessReviews: async (businessId: number, params?: { search?: string, page?: number, limit?: number }): Promise<ReviewResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<ReviewResponse>(`/reviews/business/${businessId}${queryString}`, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get reviews for a specific service
   */
  getServiceReviews: async (serviceId: number, params?: { rating?: number, page?: number, limit?: number }): Promise<ReviewResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<ReviewResponse>(`/reviews/service/${serviceId}${queryString}`, {
      headers: createAuthHeader()
    });
  }
};
