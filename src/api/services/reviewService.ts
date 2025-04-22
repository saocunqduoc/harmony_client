
import { api, createAuthHeader, apiClient } from "../client";

export interface Review {
  id: number;
  serviceId: number;
  serviceName: string;
  businessId: number;
  businessName: string;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
  status?: 'pending' | 'approved' | 'rejected';
  reasonRejected?: string;
  createdAt?: string;
  customer?: {
    fullName: string;
    avatar?: string;
  };
  service?: {
    name: string;
  };
  staff?: {
    id: number;
  };
  images?: string[];
}

export interface CreateReviewRequest {
  serviceId?: number;
  bookingId: number; // Update to accept both string and number
  rating: number;
  comment: string;
  staffId?: number;
}

export interface ReviewsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  reviews: Review[];
  totalApproved?: number;
  averageRating?: string;
}

export interface ReviewsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  status?: string;
  businessId?: string;
}

/**
 * Service for managing user reviews
 */
export const reviewService = {
  /**
   * Get all reviews for a service
   */
  getServiceReviews: async (serviceId: number, params?: ReviewsQueryParams): Promise<ReviewsResponse> => {
    try {
      const response = await apiClient.get<any>(`/reviews/service/${serviceId}`, { 
        params 
      });
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        reviews: []
      };
    } catch (error) {
      console.error('Error getting service reviews:', error);
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        reviews: []
      };
    }
  },

  /**
   * Get all reviews by the current user
   */
  getUserReviews: async (params?: ReviewsQueryParams): Promise<ReviewsResponse> => {
    try {
      const response = await apiClient.get<any>('/reviews/my', {
        headers: createAuthHeader(),
        params
      });
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        reviews: []
      };
    } catch (error) {
      console.error('Error getting user reviews:', error);
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        reviews: []
      };
    }
  },

  /**
   * Get all reviews for a business
   */
  getBusinessReviews: async (params?: ReviewsQueryParams): Promise<ReviewsResponse> => {
    try {
      const businessId = params?.businessId;
      const url = businessId ? `/reviews/business/${businessId}` : '/reviews/business';
      
      const response = await apiClient.get<any>(url, {
        headers: createAuthHeader(),
        params: {
          page: params?.page,
          limit: params?.limit,
          search: params?.search,
          rating: params?.rating,
          status: params?.status
        }
      });
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        reviews: []
      };
    } catch (error) {
      console.error('Error getting business reviews:', error);
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        reviews: []
      };
    }
  },

  /**
   * Get all reviews (admin only)
   */
  getAllReviews: async (params?: ReviewsQueryParams): Promise<ReviewsResponse> => {
    try {
      const response = await apiClient.get<any>('/reviews/admin', {
        headers: createAuthHeader(),
        params
      });
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        reviews: []
      };
    } catch (error) {
      console.error('Error getting all reviews:', error);
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        reviews: []
      };
    }
  },

  /**
   * Create a new review
   */
  createReview: (reviewData: CreateReviewRequest): Promise<Review> => {
    return apiClient.post<Review>('/reviews', reviewData, {
      headers: createAuthHeader()
    });
  },

  /**
   * Update an existing review
   */
  updateReview: (reviewId: number, reviewData: Partial<CreateReviewRequest>): Promise<Review> => {
    return apiClient.put<Review>(`/reviews/${reviewId}`, reviewData, {
      headers: createAuthHeader()
    });
  },

  /**
   * Delete a review
   */
  deleteReview: (reviewId: number): Promise<void> => {
    return apiClient.delete<void>(`/reviews/${reviewId}`, {
      headers: createAuthHeader()
    });
  },

  /**
   * Approve a review (admin only)
   */
  approveReview: (reviewId: number): Promise<Review> => {
    return apiClient.post<Review>(`/reviews/admin/${reviewId}/approve`, {}, {
      headers: createAuthHeader()
    });
  },

  /**
   * Reject a review (admin only)
   */
  rejectReview: (reviewId: number, reasonRejected: string): Promise<Review> => {
    return apiClient.post<Review>(`/reviews/admin/${reviewId}/reject`, { reasonRejected }, {
      headers: createAuthHeader()
    });
  }
};
