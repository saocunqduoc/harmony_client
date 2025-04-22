
import { toast as sonnerToast } from "sonner";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Cookies from "js-cookie";

// Base API URL - update to match your backend API URL
const API_BASE_URL = "http://localhost:3000/api/v1";

// Default request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

// Auth token cookie names
const ACCESS_TOKEN_COOKIE = "harmony_access_token";
const REFRESH_TOKEN_COOKIE = "harmony_refresh_token";
const USER_DATA_COOKIE = "harmony_user";

// Token expiration times (in days)
const ACCESS_TOKEN_EXPIRY = 1; // 1 day
const REFRESH_TOKEN_EXPIRY = 30; // 30 days

// HTTP request methods
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Basic request options
interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  withCredentials?: boolean;
}

// Custom error class for API errors
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to extract data from API responses with different formats
export const extractApiData = (response: any) => {
  if (!response) return null;
  
  // Handle multiple possible response formats
  if (response.data && response.data.data) {
    return response.data.data;
  } else if (response.data) {
    return response.data;
  }
  
  return response;
};

// Add response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response, check if it contains a message to show
    if (response.data && response.data.message) {
      // Show success message for important operations
      if (response.config.method !== 'get') {
        sonnerToast.success(response.data.message);
      }
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          // No refresh token available, clear auth and reject
          clearAuthData();
          return Promise.reject(error);
        }
        
        // Call token refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken
        });
        
        // Handle variability in API response format
        const responseData = response.data || {};
        const data = responseData.data || responseData;
        const accessToken = data.accessToken || data.access_token;
        const newRefreshToken = data.refreshToken || data.refresh_token;
        
        // Save new tokens
        setAuthToken(accessToken);
        setRefreshToken(newRefreshToken);
        
        // Update the Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        } else if (originalRequest && typeof originalRequest === 'object') {
          originalRequest.headers = { Authorization: `Bearer ${accessToken}` };
        }
        
        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, clear auth and reject
        clearAuthData();
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      
      // Try to extract error message from different possible response formats
      let errorMessage = "An error occurred";
      let errorData = null;
      
      if (error.response.data) {
        if (typeof error.response.data === 'object') {
          const responseData = error.response.data as any;
          errorMessage = responseData.message || responseData.error || error.message;
          errorData = responseData;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      }
      
      sonnerToast.error(errorMessage);
      
      return Promise.reject(new ApiError(errorMessage, status, errorData));
    } else if (error.request) {
      // The request was made but no response was received
      sonnerToast.error("Network error. Please check your connection.");
      return Promise.reject(new ApiError("Network error", 0));
    } else {
      // Something happened in setting up the request that triggered an Error
      sonnerToast.error("Request error. Please try again.");
      return Promise.reject(new ApiError(error.message, 0));
    }
  }
);

/**
 * Wrapper around axios for making HTTP requests
 */
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<any, T>(url, config),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.post<any, T>(url, data, config),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.put<any, T>(url, data, config),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    axiosInstance.patch<any, T>(url, data, config),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.delete<any, T>(url, config),
};

// Auth token management with cookies
export const setAuthToken = (token: string): void => {
  Cookies.set(ACCESS_TOKEN_COOKIE, token, { 
    expires: ACCESS_TOKEN_EXPIRY,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

export const getAuthToken = (): string | null => {
  return Cookies.get(ACCESS_TOKEN_COOKIE) || null;
};

export const setRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_COOKIE, token, { 
    expires: REFRESH_TOKEN_EXPIRY,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

export const getRefreshToken = (): string | null => {
  return Cookies.get(REFRESH_TOKEN_COOKIE) || null;
};

export const setUserData = (user: any): void => {
  Cookies.set(USER_DATA_COOKIE, JSON.stringify(user), { 
    expires: ACCESS_TOKEN_EXPIRY,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

export const getUserData = (): any | null => {
  const userData = Cookies.get(USER_DATA_COOKIE);
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (e) {
      console.error('Failed to parse user data from cookie', e);
      return null;
    }
  }
  return null;
};

export const clearAuthData = (): void => {
  Cookies.remove(ACCESS_TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
  Cookies.remove(USER_DATA_COOKIE);
};

// Create auth header utility
export const createAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Legacy fetch-based implementation
/**
 * Handles API request timeouts
 */
const timeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiError("Request timeout", 408));
    }, timeout);
  });
};

/**
 * Core fetch function with error handling, timeout, and response processing
 */
export const fetchWithConfig = async <T>(
  url: string,
  options: RequestOptions
): Promise<T> => {
  const { timeout = DEFAULT_TIMEOUT, withCredentials = true, ...fetchOptions } = options;
  
  // Prepare headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Prepare the body if it's not a GET request
  if (options.method !== "GET" && options.body && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(`${API_BASE_URL}${url}`, {
        ...fetchOptions,
        headers,
        credentials: withCredentials ? "include" : "same-origin",
      }),
      timeoutPromise(timeout),
    ]);

    // Handle non-2xx responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      
      throw new ApiError(
        errorData.message || "An error occurred",
        response.status,
        errorData
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Handle and transform errors
    if (error instanceof ApiError) {
      // Show error toast for API errors
      sonnerToast.error(error.message || "An error occurred");
      throw error;
    }
    
    // Handle network errors
    if (error instanceof Error) {
      const apiError = new ApiError(
        error.message || "Network error",
        0
      );
      sonnerToast.error("Network error. Please check your connection.");
      throw apiError;
    }
    
    // Handle unknown errors
    throw new ApiError("Unknown error", 0);
  }
};

/**
 * HTTP request methods with proper typing
 */
export const api = {
  get: <T>(url: string, options?: Omit<RequestOptions, "method" | "body">) =>
    fetchWithConfig<T>(url, { method: "GET", ...options }),
    
  post: <T>(url: string, body?: any, options?: Omit<RequestOptions, "method">) =>
    fetchWithConfig<T>(url, { method: "POST", body, ...options }),
    
  put: <T>(url: string, body?: any, options?: Omit<RequestOptions, "method">) =>
    fetchWithConfig<T>(url, { method: "PUT", body, ...options }),
    
  patch: <T>(url: string, body?: any, options?: Omit<RequestOptions, "method">) =>
    fetchWithConfig<T>(url, { method: "PATCH", body, ...options }),
    
  delete: <T>(url: string, options?: Omit<RequestOptions, "method">) =>
    fetchWithConfig<T>(url, { method: "DELETE", ...options }),
};
