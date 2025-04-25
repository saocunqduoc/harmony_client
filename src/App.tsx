import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApiAuthProvider } from "./context/ApiAuthContext";
import { AuthProvider } from "./context/AuthContext";

// Import PaymentResult component
import PaymentResult from "./pages/PaymentResult";
import BookingReview from "./pages/BookingReview";

// Public pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import BusinessProfile from "./pages/BusinessProfile";
import NotFound from "./pages/NotFound";
import Businesses from "./pages/Businesses";
import ExploreBusinesses from "./pages/ExploreBusinesses";
import Profile from "./pages/Profile";
import CheckoutPage from "./pages/CheckoutPage";

// Protected pages
import Dashboard from "./pages/Dashboard";
import UserBookings from "./pages/UserBookings";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
// import StaffDashboard from "./pages/staff/StaffDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ApiAuthProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/business/register" element={<Businesses />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service/:id" element={<ServiceDetails />} />
                <Route path="/business/:id" element={<BusinessProfile />} />
                <Route path="/businesses" element={<ExploreBusinesses />} />
                
                {/* Profile route (protected) */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'owner', 'manager', 'staff', 'admin']}>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Customer routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/dashboard/bookings" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <UserBookings />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/checkout/:bookingId" 
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* User bookings route */}
                <Route path="/user/bookings" element={<UserBookings />} />
                
                {/* Payment result route */}
                <Route path="/payment-result" element={<PaymentResult />} />
                
                {/* Business Management Dashboard - for both owners and managers */}
                <Route path="/business-dashboard/*" element={
                  <ProtectedRoute allowedRoles={['owner', 'manager']}>
                    <BusinessDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Manager Dashboard - Redirect to Business Dashboard */}
                <Route 
                  path="/manager-dashboard/*" 
                  element={<Navigate to="/business-dashboard" replace />} 
                />
                
                {/* Staff routes */}
                {/* <Route path="/staff-dashboard/*" element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                } /> */}
                
                {/* Admin routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Review routes */}
                <Route path="/review/booking/:bookingId" element={<BookingReview />} />
                <Route path="/booking/:bookingId/review" element={<BookingReview />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </ApiAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
