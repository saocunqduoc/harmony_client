
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApiAuth } from '@/context/ApiAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isAuthenticated, isLoading } = useApiAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but not allowed for this role, redirect to appropriate dashboard
  if (user && user.role) {
    const userRole = user.role;
    
    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on role
      if (userRole === 'admin') {
        return <Navigate to="/admin" replace />;
      } else if (userRole === 'owner') {
        return <Navigate to="/business-dashboard" replace />;
      } else if (userRole === 'manager') {
        return <Navigate to="/manager-dashboard" replace />;
      } else if (userRole === 'staff') {
        return <Navigate to="/staff-dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  // If authenticated and has the right role, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
