
import { apiClient } from "../client";

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
}

export interface ServiceCategoryResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  serviceCategories: ServiceCategory[];
}

/**
 * Service category service for managing service categories
 */
export const serviceCategoryService = {
  /**
   * Get all service categories with optional pagination and filtering
   */
  getAllServiceCategories: async (params?: {
    page?: number;
    limit?: number;
    name?: string;
  }): Promise<ServiceCategoryResponse> => {
    const response = await apiClient.get<any>("/service-categories", { params });
    return response.data?.data || { totalItems: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10, serviceCategories: [] };
  },

  /**
   * Create a new service category (Admin only)
   */
  createServiceCategory: async (categoryData: ServiceCategoryRequest): Promise<ServiceCategory> => {
    const response = await apiClient.post<any>("/service-categories", categoryData);
    return response.data?.data;
  },

  /**
   * Update a service category (Admin only)
   */
  updateServiceCategory: async (id: number, categoryData: ServiceCategoryRequest): Promise<ServiceCategory> => {
    const response = await apiClient.put<any>(`/service-categories/${id}`, categoryData);
    return response.data?.data;
  },

  /**
   * Delete a service category (Admin only)
   */
  deleteServiceCategory: async (id: number): Promise<void> => {
    await apiClient.delete<any>(`/service-categories/${id}`);
  },

  /**
   * Get business service categories
   */
  getBusinessServiceCategories: async (businessId: number): Promise<ServiceCategory[]> => {
    const response = await apiClient.get<any>(`/service-categories/${businessId}`);
    return response.data?.data || [];
  },

  /**
   * Get owner's service categories
   */
  getOwnerServiceCategories: async (): Promise<ServiceCategory[]> => {
    const response = await apiClient.get<any>("/service-categories/owner");
    return response.data?.data || [];
  },
};
