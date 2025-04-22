
import { apiClient } from "../client";

export interface Province {
  code: string;
  name: string;
  codename?: string;
  division_type?: string;
  phone_code?: string;
  id?: string;          // Added to support the API response
  type?: number;        // Added to support the API response
  typeText?: string;    // Added to support the API response
  slug?: string;        // Added to support the API response
}

export interface District {
  code: string;
  name: string;
  codename?: string;
  division_type?: string;
  province_code?: string;
  id?: string;          // Added to support the API response
  provinceId?: string;  // Added to support the API response
  type?: number;        // Added to support the API response
  typeText?: string;    // Added to support the API response
}

export interface Ward {
  code: string;
  name: string;
  codename?: string;
  division_type?: string;
  district_code?: string;
  id?: string;          // Added to support the API response
  districtId?: string;  // Added to support the API response
  type?: number;        // Added to support the API response
  typeText?: string;    // Added to support the API response
}

export interface LocationResponse<T> {
  data: T[];
  total: number;
  totalPages?: number;
  currentPage?: number;
  code?: string;
  message?: string | null;
}

export interface LocationQueryParams {
  page?: number;
  size?: number;
  query?: string;
}

/**
 * Service for fetching Vietnam administrative location data
 */
export const locationService = {
  /**
   * Get provinces/cities
   */
  getProvinces: async (params?: LocationQueryParams): Promise<LocationResponse<Province>> => {
    try {
      // We're using a direct fetch for this third-party API instead of apiClient
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.query) queryParams.append('query', params.query);
      }

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`https://open.oapi.vn/location/provinces${queryString}`);
      const data = await response.json();
      
      // Transform the API data to match our Province interface
      const provinces: Province[] = data.data ? data.data.map((item: any) => ({
        code: item.id || '',
        name: item.name || '',
        id: item.id || '',
        type: item.type,
        typeText: item.typeText,
        slug: item.slug
      })) : [];
      
      // Return the data in the expected format
      return {
        data: provinces,
        total: data.total || 0,
        code: data.code,
        message: data.message
      };
    } catch (error) {
      console.error('Error fetching provinces:', error);
      // Return an object that matches the LocationResponse interface
      return {
        data: [],
        total: 0
      };
    }
  },

  /**
   * Get districts by province code
   */
  getDistricts: async (provinceId: number, params?: LocationQueryParams): Promise<LocationResponse<District>> => {
    try {
      // We're using a direct fetch for this third-party API instead of apiClient
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.query) queryParams.append('query', params.query);
      }

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`https://open.oapi.vn/location/districts/${provinceId}${queryString}`);
      const data = await response.json();
      
      // Transform the API data to match our District interface
      const districts: District[] = data.data ? data.data.map((item: any) => ({
        code: item.id || '',
        name: item.name || '',
        id: item.id || '',
        provinceId: item.provinceId,
        type: item.type,
        typeText: item.typeText
      })) : [];
      
      // Return the data in the expected format
      return {
        data: districts,
        total: data.total || 0,
        code: data.code,
        message: data.message
      };
    } catch (error) {
      console.error(`Error fetching districts for province ${provinceId}:`, error);
      // Return an object that matches the LocationResponse interface
      return {
        data: [],
        total: 0
      };
    }
  },

  /**
   * Get wards by district code
   */
  getWards: async (districtId: number, params?: LocationQueryParams): Promise<LocationResponse<Ward>> => {
    try {
      // We're using a direct fetch for this third-party API instead of apiClient
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
        if (params.query) queryParams.append('query', params.query);
      }

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await fetch(`https://open.oapi.vn/location/wards/${districtId}${queryString}`);
      const data = await response.json();
      
      // Transform the API data to match our Ward interface
      const wards: Ward[] = data.data ? data.data.map((item: any) => ({
        code: item.id || '',
        name: item.name || '',
        id: item.id || '',
        districtId: item.districtId,
        type: item.type,
        typeText: item.typeText
      })) : [];
      
      // Return the data in the expected format
      return {
        data: wards,
        total: data.total || 0,
        code: data.code,
        message: data.message
      };
    } catch (error) {
      console.error(`Error fetching wards for district ${districtId}:`, error);
      // Return an object that matches the LocationResponse interface
      return {
        data: [],
        total: 0
      };
    }
  },
  
  /**
   * Get cities (simplified list of provinces specifically for city selection)
   */
  getCities: async (): Promise<string[]> => {
    try {
      const response = await locationService.getProvinces();
      // Extract city names and filter out any empty values
      const cities = response.data
        .map(province => province.name)
        .filter(name => name && name.trim() !== '');
      
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }
};
