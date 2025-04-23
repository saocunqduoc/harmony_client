
import React from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  CreditCard,
  LogOut,
  Package,
  Calendar,
  Heart,
  Star,
  Settings,
  BarChart4,
  Home
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import UserBookings from './UserBookings';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (location.pathname === '/dashboard/bookings') {
    return <UserBookings />;
  }

  if (location.pathname !== '/dashboard') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex flex-1 flex-col md:flex-row">
          <aside className="w-full md:w-64 bg-card border-r border-border md:min-h-screen">
            <div className="p-6 flex flex-col h-full">
              <Link to="/" className="flex items-center mb-8">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-harmony-700 to-harmony-500">
                  Harmony
                </span>
              </Link>

              <h2 className="font-medium mb-6">Tài khoản</h2>

              <nav className="space-y-1 flex-1">
                <Link
                  to="/dashboard"
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/dashboard') ? 'bg-accent' : ''}`}
                >
                  <Home className="h-4 w-4 mr-3" />
                  Tổng quan
                </Link>
                <Link
                  to="/dashboard/bookings"
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/user/bookings') ? 'bg-accent' : ''}`}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Lịch hẹn đã đặt
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive('/profile') ? 'bg-accent' : ''}`}
                >
                  <User className="h-4 w-4 mr-3" />
                  Thông tin cá nhân
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
              <Route path="/bookings" element={<UserBookings />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Chào {user?.name || 'bạn'}</h1>
            <p className="text-muted-foreground">Quản lý tài khoản và đặt lịch dịch vụ của bạn</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button asChild variant="outline">
              <Link to="/services">Khám phá dịch vụ</Link>
            </Button>
            <Button asChild>
              <Link to="/profile">Cài đặt tài khoản</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/user/bookings">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lịch hẹn</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Quản lý lịch hẹn</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Xem và quản lý các lịch hẹn đã đặt
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/services">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dịch vụ</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Tìm kiếm dịch vụ</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Khám phá và đặt lịch các dịch vụ mới
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tài khoản</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Hồ sơ cá nhân</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Cập nhật thông tin và thiết lập tài khoản
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Các hoạt động</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn sắp tới</CardTitle>
                <CardDescription>Các lịch hẹn dịch vụ sắp diễn ra</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button asChild variant="outline" className="w-full flex justify-center">
                    <Link to="/user/bookings">
                      <Calendar className="mr-2 h-4 w-4" />
                      Xem tất cả lịch hẹn
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dịch vụ phổ biến</CardTitle>
                <CardDescription>Các dịch vụ được ưa chuộng hiện nay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button asChild variant="outline" className="w-full flex justify-center">
                    <Link to="/services">
                      <Package className="mr-2 h-4 w-4" />
                      Khám phá dịch vụ
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
