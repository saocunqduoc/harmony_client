
import { api, createAuthHeader } from "../client";

// Types for service-related data
export interface Service {
  id: number;
  title: string;
  business: string;
  businessId: number;
  image: string;
  description: string;
  price: number;
  duration: number;
  rating: number;
  reviews: number;
  location: string;
  category: string;
}

export interface ServiceFilter {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: "price_asc" | "price_desc" | "rating" | "popular";
  page?: number;
  limit?: number;
}

export interface ServicePaginatedResponse {
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Services for managing wellness services
 */
export const serviceService = {
  /**
   * Get all services with optional filtering
   */
  getServices: (filters?: ServiceFilter): Promise<ServicePaginatedResponse> => {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<ServicePaginatedResponse>(`/services${queryString}`);
  },

  /**
   * Get service by ID
   */
  getServiceById: (id: number): Promise<Service> => {
    return api.get<Service>(`/services/${id}`);
  },

  /**
   * Create a new service (for business users)
   */
  createService: (serviceData: Omit<Service, "id" | "rating" | "reviews">): Promise<Service> => {
    return api.post<Service>('/services', serviceData, {
      headers: createAuthHeader()
    });
  },

  /**
   * Update an existing service (for business users)
   */
  updateService: (id: number, serviceData: Partial<Omit<Service, "id" | "rating" | "reviews">>): Promise<Service> => {
    return api.put<Service>(`/services/${id}`, serviceData, {
      headers: createAuthHeader()
    });
  },

  /**
   * Delete a service (for business users)
   */
  deleteService: (id: number): Promise<void> => {
    return api.delete<void>(`/services/${id}`, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get featured services for homepage
   */
  getFeaturedServices: (location?: string): Promise<Service[]> => {
    const queryParams = location ? `?location=${encodeURIComponent(location)}` : '';
    return api.get<Service[]>(`/services/featured${queryParams}`);
  },
  
  /**
   * Get user's favorite services
   */
  getFavorites: (): Promise<Service[]> => {
    return api.get<Service[]>('/services/favorites', {
      headers: createAuthHeader()
    });
  },
  
  /**
   * Add a service to favorites
   */
  addToFavorites: (serviceId: number): Promise<void> => {
    return api.post<void>('/services/favorites', { serviceId }, {
      headers: createAuthHeader()
    });
  },
  
  /**
   * Remove a service from favorites
   */
  removeFromFavorites: (serviceId: number): Promise<void> => {
    return api.delete<void>(`/services/favorites/${serviceId}`, {
      headers: createAuthHeader()
    });
  }
};
