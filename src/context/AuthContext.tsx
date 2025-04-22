
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'customer' | 'owner' | 'manager' | 'staff' | 'admin';

interface Business {
  id: number;
  name?: string;
}

interface User {
  email: string;
  role: UserRole;
  id: number;
  name: string;
  business?: Business;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded user accounts
const USERS = [
  { email: 'user@yopmail.com', password: '123456', role: 'customer', id: 'user1', name: 'Regular User' },
  { 
    email: 'business@yopmail.com', 
    password: '123456', 
    role: 'owner', 
    id: 'business1', 
    name: 'Business Owner',
    business: { 
      id: 'business-1',
      name: 'Sample Business'
    }
  },
  { email: 'admin@yopmail.com', password: '123456', role: 'admin', id: 'admin1', name: 'Admin User' },
] as const;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem('harmony_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Find user with matching credentials
    const matchedUser = USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (matchedUser) {
      const { password, ...userWithoutPassword } = matchedUser;
      const userData = userWithoutPassword as User;
      
      // Save user data to state and localStorage
      setUser(userData);
      localStorage.setItem('harmony_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('harmony_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
