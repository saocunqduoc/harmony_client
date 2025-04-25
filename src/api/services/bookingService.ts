
import { api, createAuthHeader } from "../client";

// Types for booking-related data
export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface StaffTimeSlot {
  staffId: number;
  staffName: string;
  slots: { startTime: string; endTime: string; }[];
}

export interface BookingDetail {
  id: number;
  bookingId: number;
  serviceId: number;
  name: string;
  price: number;
  discount: number;
  finalPrice: number;
  startTime: string;
  endTime: string;
  staffId?: number;
  status: string;
  notes?: string;
  bookingDate: string;
}

export interface Booking {
  id: number;
  serviceId: number;
  serviceName: string;
  businessId: number;
  businessName: string;
  userId: number;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "draft" | "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  paymentStatus?: "pending" | "paid" | "refunded" | "failed";
  price: number;
  totalAmount: number;
  createdAt: string;
  services: BookingDetail[];
  customer?: {
    fullName: string;
    email: string;
    phone?: string | null; // Make sure phone is optional here as well
  };
  business?: {
    id: number;
    name: string;
  };
  bookingDate: string;
}

// New User Booking interface to match backend response
export interface UserBooking {
  bookingId: number;
  businessId: number;
  businessName: string;
  bookingDate: string;
  status: string;
  totalAmount: string;
  paymentStatus: string;
  services: {
    bookingDetailId: number;
    serviceId: number;
    serviceName: string;
    price: string;
    discount: string;
    finalPrice: string;
    startTime: string;
    endTime: string;
    staffId?: number;
    status: string;
  }[];
}

export interface BookingRequest {
  serviceId: number;
  date: string;
  timeSlotId: number;
}

export interface AddServiceRequest {
  businessId: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  bookingDate: string;
  staffId?: number;
  notes?: string;
}

export interface UpdateBookingStatusRequest {
  status: Booking["status"];
}

export interface BookingFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
  date?: string;
  sort?: string;
  sortBy?: string;
}

// Updated to match the actual response structure from the backend
export interface BusinessBookingsResponse {
  date: string;
  total: number;
  bookings: {
    id: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    status: string;
    totalAmount: string;
    paymentStatus: string;
    customer: {
      fullName: string;
      email: string;
      phone?: string | null;
    };
  }[];
  message?: string;
  success?: boolean;
  statusCode?: number;
}

// New interface for getUserBookings response type
export interface BookingsResponse {
  data: {
    bookings: Record<string, UserBooking[]>;
    meta: {
      total: number;
      page: number;
      totalPages: number;
    }
  };
  message: string;
  success: boolean;
}

export interface Staff {
  id: number;
  fullName: string;
}

/**
 * Service for managing bookings and appointments
 */
export const bookingService = {
  /**
   * Get available time slots for a service on a specific date
   */
  getAvailableTimeSlots: async (serviceId: number, date: string): Promise<StaffTimeSlot[]> => {
    try {
      // Ensure serviceId is a number
      const parsedServiceId = parseInt(String(serviceId), 10);
      
      const response = await api.get<any>(`/bookings/availability?serviceId=${parsedServiceId}&date=${date}`, {
        headers: createAuthHeader()
      });
      
      // Handle API response format
      if (response && response.data) {
        return response.data || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      return []; // Return empty array on error
    }
  },

  /**
   * Add a service to a draft booking (creates new draft if none exists)
   */
  addServiceToDraft: (bookingData: AddServiceRequest): Promise<{ booking: Booking, addedService: BookingDetail }> => {
    return api.post<{ booking: Booking, addedService: BookingDetail }>('/bookings/add-service', bookingData, {
      headers: createAuthHeader()
    });
  },

  /**
   * Confirm a draft booking
   */
  confirmBooking: (bookingId: number): Promise<Booking> => {
    return api.post<Booking>(`/bookings/${bookingId}/confirm`, {}, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get user's bookings (for customers)
   */
  getUserBookings: async (filters?: BookingFilters): Promise<BookingsResponse> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<BookingsResponse>(`/bookings/my${queryString}`, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get business bookings (for business owners)
   */
  getBusinessBookings: async (filters?: BookingFilters): Promise<BusinessBookingsResponse> => {
    // Convert filters to query string
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get<any>(`/bookings/business${queryString}`, {
      headers: createAuthHeader()
    });
    
    // Extract the data from the response
    const data = response.data || { date: '', bookings: [], total: 0 };
    
    return {
      date: data.date || '',
      bookings: Array.isArray(data.bookings) ? data.bookings : [],
      total: data.total || 0,
    };
  },

  /**
   * Update booking details (for business owners)
   */
  updateBookingDetail: (bookingId: number, details: Partial<BookingDetail>[]): Promise<void> => {
    return api.put<void>(`/bookings/${bookingId}/update-detail`, { details }, {
      headers: createAuthHeader()
    });
  },

  /**
   * Update booking status (for business owners)
   */
  updateBookingStatus: (bookingId: number, status: Booking["status"]): Promise<Booking> => {
    return api.put<Booking>(`/bookings/${bookingId}/status`, { status }, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get staff bookings by date
   */
  getStaffBookingsByDate: (date?: string): Promise<{ date: string, bookings: any[] }> => {
    const query = date ? `?date=${date}` : '';
    return api.get<{ date: string, bookings: any[] }>(`/bookings/schedule-by-date${query}`, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get all bookings (admin only)
   */
  getAllBookings: (filters?: BookingFilters): Promise<{ bookings: Booking[], total: number, totalPages: number }> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<{ bookings: Booking[], totalItems: number, totalPages: number }>(`/bookings${queryString}`, {
      headers: createAuthHeader()
    }).then(response => {
      // Map totalItems to total for compatibility
      return {
        bookings: response.bookings,
        total: response.totalItems,
        totalPages: response.totalPages
      };
    });
  },

  /**
   * Cancel a booking (for customers)
   */
  cancelBooking: (bookingId: number): Promise<void> => {
    return api.put<void>(`/bookings/${bookingId}/status`, { status: 'cancelled' }, {
      headers: createAuthHeader()
    });
  },

  /**
   * Update booking detail
   */
  updateBookingDetail2: async (detailId: number, data: {
    serviceId?: number;
    staffId?: number;
    startTime?: string;
    endTime?: string;
  }): Promise<BookingDetail> => {
    const response = await api.put<any>(`/bookings/${detailId}/update-detail`, data, {
      headers: createAuthHeader()
    });
    return response.data?.data;
  },

  /**
   * Delete booking detail
   */
  deleteBookingDetail: async (detailId: number): Promise<void> => {
    await api.delete<any>(`/bookings/${detailId}/delete-detail`, {
      headers: createAuthHeader()
    });
  },

  /**
   * Get detailed booking information
   */
  getBookingDetail2: async (bookingId: number): Promise<BookingDetail> => {
    const response = await api.get<any>(`/bookings/${bookingId}/detail`, {
      headers: createAuthHeader()
    });
    return response?.data;
  },

  /**
 * Get detailed booking information
 */
  getBookingDetail: async (bookingId: number): Promise<any> => {
    const response = await api.get<any>(`/bookings/${bookingId}/booking`, {
      headers: createAuthHeader()
    });
    return response?.data;
  }
};
