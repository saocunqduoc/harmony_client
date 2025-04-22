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

/**
 * Business service for managing businesses
 */
export const businessService = {
  /**
   * Get all businesses
   */
  getAllBusinesses: async (): Promise<Business[]> => {
    const response = await apiClient.get<any>("/businesses");
    return response.data?.data || [];
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
};
