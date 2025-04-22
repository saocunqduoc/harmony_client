
import { apiClient } from '../client';

// Staff data types
export interface Staff {
  id: number;
  position: string;
  specialization: string;
  status: string;
  user: {
    id: number;
    email: string;
    phone: string | null;
    fullName: string;
    avatar: string | null;
    role: string;
  };
}

export interface CreateStaffParams {
  email: string;
  fullName: string;
  role: 'staff' | 'manager';
  position: string;
  specialization?: string;
}

export interface UpdateStaffParams {
  position?: string;
  specialization?: string;
}

// Schedule data types
export interface StaffSchedule {
  id: number;
  staffId: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  isDayOff: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateScheduleParams {
  staffId: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  isDayOff: boolean;
}

export interface UpdateScheduleParams {
  dayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime?: string;
  endTime?: string;
  isDayOff?: boolean;
}

export interface CreateMultipleScheduleParams {
  staffId: number;
  startDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  endDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  isDayOff: boolean;
}

// Staff service
class StaffService {
  private apiClient;

  constructor() {
    this.apiClient = apiClient;
  }

  // Staff endpoints
  async getAllStaff(): Promise<Staff[]> {
    const response = await this.apiClient.get('/staff');
    return response.data?.data || [];
  }

  // New method to get owner's staff
  async getOwnerStaff(): Promise<Staff[]> {
    const response = await this.apiClient.get('/staff/owner');
    return response.data?.data || [];
  }

  async getStaffByBusiness(businessId: number): Promise<Staff[]> {
    const response = await this.apiClient.get(`/staff/business/${businessId}`);
    return response.data?.data || [];
  }

  async getStaffDetail(staffId: number): Promise<Staff> {
    const response = await this.apiClient.get(`/staff/${staffId}`);
    return response.data?.data;
  }

  async createStaff(params: CreateStaffParams): Promise<Staff> {
    const response = await this.apiClient.post('/staff', params);
    return response.data?.data;
  }

  async updateStaff(staffId: number, params: UpdateStaffParams): Promise<Staff> {
    const response = await this.apiClient.put(`/staff/${staffId}`, params);
    return response.data?.data;
  }

  async deleteStaff(staffId: number): Promise<void> {
    await this.apiClient.delete(`/staff/${staffId}`);
  }

  async updateStaffAvatar(staffId: number, avatarFile: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await this.apiClient.patch(
      `/staff/${staffId}/avatar`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data?.data;
  }

  // Schedule endpoints
  async getStaffSchedule(staffId: number): Promise<StaffSchedule[]> {
    const response = await this.apiClient.get(`/staff/schedule/${staffId}`);
    return response.data?.data || [];
  }

  async createStaffSchedule(params: CreateScheduleParams): Promise<StaffSchedule> {
    const response = await this.apiClient.post('/staff/schedule', params);
    return response.data?.data;
  }

  async createMultipleStaffSchedules(params: CreateMultipleScheduleParams): Promise<StaffSchedule[]> {
    const response = await this.apiClient.post(`/staff/schedule/mutiple/${params.staffId}`, {
      startDay: params.startDay,
      endDay: params.endDay,
      startTime: params.startTime,
      endTime: params.endTime,
      isDayOff: params.isDayOff
    });
    return response.data?.data || [];
  }

  async updateStaffSchedule(scheduleId: number, params: UpdateScheduleParams): Promise<StaffSchedule> {
    const response = await this.apiClient.put(`/staff/schedule/${scheduleId}`, params);
    return response.data?.data;
  }

  async deleteStaffSchedule(scheduleId: number): Promise<void> {
    await this.apiClient.delete(`/staff/schedule/${scheduleId}`);
  }
}

export const staffService = new StaffService();
