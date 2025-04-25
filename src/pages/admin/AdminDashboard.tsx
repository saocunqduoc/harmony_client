import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAnalytics from './AdminAnalytics';
import AdminBusinesses from './AdminBusinesses';
import AdminServices from './AdminServices';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';
import AdminBookings from './AdminBookings';
import AdminReviews from './AdminReviews';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  Settings, 
  Users, 
  Building2, 
  LayoutDashboard, 
  Calendar, 
  PackageOpen, 
  LogOut,
  MessageSquare 
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AdminServiceCategories from './AdminServiceCategories';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-card border-r border-border md:min-h-screen">
          <div className="p-6 flex flex-col h-full">
            <Link to="/" className="flex items-center mb-8">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-harmony-700 to-harmony-500">
                Harmony Admin
              </span>
            </Link>

            <nav className="space-y-1 flex-1">
              <Link
                to="/admin"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/admin') ? 'bg-accent' : ''}`}
              >
                <LayoutDashboard className="h-4 w-4 mr-3" />
                Tổng quan
              </Link>
              <Link
                to="/admin/users"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/admin/users') ? 'bg-accent' : ''}`}
              >
                <Users className="h-4 w-4 mr-3" />
                Người dùng
              </Link>
              <Link
                to="/admin/businesses"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/admin/businesses') ? 'bg-accent' : ''}`}
              >
                <Building2 className="h-4 w-4 mr-3" />
                Doanh nghiệp
              </Link>

              <Link
                to="/admin/services"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/admin/services') ? 'bg-accent' : ''}`}
              >
                <PackageOpen className="h-4 w-4 mr-3" />
                Dịch vụ
              </Link>

              <Link
                to="/admin/categories"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/admin/categories') ? 'bg-accent' : ''}`}
              >
                <PackageOpen className="h-4 w-4 mr-3" />
                Danh mục
              </Link>

              <Link
                to="/admin/bookings"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/admin/bookings') ? 'bg-accent' : ''}`}
              >
                <Calendar className="h-4 w-4 mr-3" />
                Đặt lịch
              </Link>
              <Link
                to="/admin/reviews"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/admin/reviews') ? 'bg-accent' : ''}`}
              >
                <MessageSquare className="h-4 w-4 mr-3" />
                Đánh giá
              </Link>
              <Link
                to="/admin/settings"
                className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/admin/settings') ? 'bg-accent' : ''}`}
              >
                <Settings className="h-4 w-4 mr-3" />
                Cài đặt
              </Link>
            </nav>

            <div className="mt-auto pt-6">
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<AdminAnalytics />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="businesses" element={<AdminBusinesses />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="categories" element={<AdminServiceCategories/>} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
