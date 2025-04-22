
import { apiClient } from "../client";

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface BusinessHours {
  id: number;
  dayOfWeek: DayOfWeek;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
  businessId: number;
}

export interface BusinessHoursRequest {
  dayOfWeek: DayOfWeek;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface MultipleBusinessHoursRequest {
  startDay: DayOfWeek;
  endDay: DayOfWeek;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface BusinessHoursResponse {
  formattedData: {
    openHours: string;
    closedHours: string;
  };
}

/**
 * Service for managing business hours
 */
export const businessHoursService = {
  /**
   * Get business hours by business ID
   */
  getBusinessHours: async (businessId: number): Promise<BusinessHoursResponse> => {
    const response = await apiClient.get<any>(`/business/hours/${businessId}`);
    return response.data?.data || { formattedData: { openHours: '', closedHours: '' } };
  },
  
  /**
   * Get business hours for owner's business
   */
  getOwnerHours: async (): Promise<BusinessHours[]> => {
    const response = await apiClient.get<any>("/business/hours/owner");
    return response.data?.data || [];
  },
  
  /**
   * Create business hours
   */
  createBusinessHours: async (businessHoursData: BusinessHoursRequest): Promise<BusinessHours> => {
    const response = await apiClient.post<any>("/business/hours", businessHoursData);
    return response.data?.data;
  },
  
  /**
   * Create business hours for multiple days
   */
  addBusinessHoursForMultipleDays: async (businessHoursData: MultipleBusinessHoursRequest): Promise<BusinessHours[]> => {
    const response = await apiClient.post<any>("/business/hours/multiple", businessHoursData);
    return response.data?.data;
  },
  
  /**
   * Update business hours
   */
  updateBusinessHours: async (id: number, hoursData: BusinessHoursRequest): Promise<BusinessHours> => {
    const response = await apiClient.put<any>(`/business/hours/${id}`, hoursData);
    return response.data?.data;
  },
  
  /**
   * Delete business hours
   */
  deleteBusinessHours: async (id: number): Promise<void> => {
    await apiClient.delete<any>(`/business/hours/${id}`);
  },
};
