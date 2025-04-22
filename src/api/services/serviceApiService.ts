
import { apiClient } from "../client";

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  thumbnail?: string;
  categoryId: number;
  businessId: number;
  discount?: number;
  discountType?: 'percent' | 'fixed';
  status?: 'active' | 'inactive';
  category?: {
    id: number;
    name: string;
  };
  business?: {
    id: number;
    name: string;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
  };
  rating?: {
    average: number;
    count: number;
  };
  review?: {
    averageRating: number;
    count: number;
  };
}

export interface ServiceRequest {
  name: string;
  description?: string;
  price: number;
  duration: number;
  categoryId: number;
  discount?: number;
  discountType?: 'percent' | 'fixed' | 'percentage';
  status?: 'active' | 'inactive';
  thumbnail?: File;
}

export interface ServiceQueryParams {
  page?: number | string;
  limit?: number | string;
  categoryIds?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
  city?: string; // Add city parameter
}

export interface ServicesResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  services: Service[];
}

/**
 * Service API for managing services
 */
export const serviceApiService = {
  /**
   * Get all services with optional filtering and pagination
   */
  getAllServices: async (params?: ServiceQueryParams): Promise<ServicesResponse> => {
    try {
      const response = await apiClient.get<any>("/services", { params });
      
      // Ensure we're returning a valid response structure
      if (response.data?.data) {
        return response.data.data;
      }
      
      // Return empty default if no data
      return { 
        totalItems: 0, 
        totalPages: 0, 
        currentPage: 1, 
        itemsPerPage: 10, 
        services: [] 
      };
    } catch (error) {
      console.error("Error getting all services:", error);
      // Return empty default on error
      return { 
        totalItems: 0, 
        totalPages: 0, 
        currentPage: 1, 
        itemsPerPage: 10, 
        services: [] 
      };
    }
  },
  
  /**
   * Get a specific service by ID
   */
  getServiceById: async (id: number): Promise<Service> => {
    try {
      const response = await apiClient.get<any>(`/services/${id}`);
      
      // Return the data object from the response
      if (response.data?.data) {
        return response.data.data;
      }
      
      throw new Error("Service data not found in response");
    } catch (error) {
      console.error(`Error getting service by ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get business services with optional filtering and pagination
   */
  getBusinessServices: async (businessId: number, params?: ServiceQueryParams): Promise<ServicesResponse> => {
    try {
      const response = await apiClient.get<any>(`/services/business/${businessId}`, { params });
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return { 
        totalItems: 0, 
        totalPages: 0, 
        currentPage: 1, 
        itemsPerPage: 10, 
        services: [] 
      };
    } catch (error) {
      console.error(`Error getting services for business ${businessId}:`, error);
      return { 
        totalItems: 0, 
        totalPages: 0, 
        currentPage: 1, 
        itemsPerPage: 10, 
        services: [] 
      };
    }
  },

  /**
   * Get owner's services with optional filtering and pagination
   */
  getBusinessOwnerServices: async (params?: ServiceQueryParams): Promise<ServicesResponse> => {
    try {
      const response = await apiClient.get<any>("/services/business", { params });
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return { 
        totalItems: 0, 
        totalPages: 0, 
        currentPage: 1, 
        itemsPerPage: 10, 
        services: [] 
      };
    } catch (error) {
      console.error("Error getting business owner services:", error);
      return { 
        totalItems: 0, 
        totalPages: 0, 
        currentPage: 1, 
        itemsPerPage: 10, 
        services: [] 
      };
    }
  },

  /**
   * Create a new service
   */
  createService: async (serviceData: ServiceRequest): Promise<Service> => {
    const formData = new FormData();
    
    // Add all fields to formData
    Object.entries(serviceData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'thumbnail' && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value !== 'object') {
          formData.append(key, value.toString());
        }
      }
    });
    
    const response = await apiClient.post<any>("/services", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    if (response.data?.data) {
      return response.data.data;
    }
    
    throw new Error("Failed to create service");
  },

  /**
   * Update a service
   */
  updateService: async (id: number, serviceData: Partial<ServiceRequest>): Promise<Service> => {
    const formData = new FormData();
    
    // Add all fields to formData
    Object.entries(serviceData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'thumbnail' && value instanceof File) {
          formData.append(key, value);
        } else if (typeof value !== 'object') {
          formData.append(key, value.toString());
        }
      }
    });
    
    const response = await apiClient.put<any>(`/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    if (response.data?.data) {
      return response.data.data;
    }
    
    throw new Error("Failed to update service");
  },

  /**
   * Delete a service
   */
  deleteService: async (id: number): Promise<void> => {
    await apiClient.delete<any>(`/services/${id}`);
  },

  /**
   * Get recommended services - NEW 
   */
  getRecommendedServices: async (categoryId?: number | string, limit: number = 5, city?: string): Promise<Service[]> => {
    try {
      const params: any = { limit };
      if (categoryId) {
        params.categoryId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
      }
      if (city && city !== 'all_cities') params.city = city;
      
      const response = await apiClient.get<any>("/services/recommend", { params });
      
      if (response.data?.data) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      console.error("Error getting recommended services:", error);
      return [];
    }
  }
};
