
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/api/services/authService';
import { getUserData, clearAuthData } from '@/api/client';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
  address?: string;
  avatar?: string;
}

interface ApiAuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ApiAuthContext = createContext<ApiAuthContextType | undefined>(undefined);

export const ApiAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user data in cookies on mount
  useEffect(() => {
    const userData = getUserData();
    
    if (userData) {
      setUser(userData);
      setIsLoading(false);
    } else {
      fetchUserProfile();
    }
  }, []);

  // Fetch current user profile
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await authService.getCurrentUser();
      
      // Check if userData exists and has the expected properties
      if (userData && userData.id) {
        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName,
          phone: userData.phone,
          role: userData.role || 'customer', // Default to customer if no role found
          address: userData.address,
          avatar: userData.avatar
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; role?: string }> => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password });
      
      if (response && response.user) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          fullName: response.user.fullName,
          phone: response.user.phone,
          role: response.user.role || 'customer', // Default to customer if no role found
          address: response.user.address,
          avatar: response.user.avatar
        };
        
        setUser(userData);
        return { 
          success: true,
          role: userData.role
        };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    fullName: string, 
    email: string, 
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      await authService.register({ fullName, email, password });
      // Don't set user here as registration might require email verification
      // We'll navigate to the verification page instead
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearAuthData();
    }
  };

  return (
    <ApiAuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </ApiAuthContext.Provider>
  );
};

export const useApiAuth = () => {
  const context = useContext(ApiAuthContext);
  if (context === undefined) {
    throw new Error('useApiAuth must be used within an ApiAuthProvider');
  }
  return context;
};
