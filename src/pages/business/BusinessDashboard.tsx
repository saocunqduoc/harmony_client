import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { LogOut, Home, Calendar, Users, Settings, BarChart, PlusCircle, Briefcase } from 'lucide-react';
import BusinessServices from './BusinessServices';
import BusinessAppointments from './BusinessAppointments';
import BusinessAppointmentDetail from './BusinessAppointmentDetail';
import BusinessCustomers from './BusinessCustomers';
import BusinessAnalytics from './BusinessAnalytics';
import BusinessSettings from './BusinessSettings';
import BusinessStaff from './BusinessStaff';
import { businessService } from '@/api/services/businessService';
import { staffService } from '@/api/services/staffService';
import { serviceApiService } from '@/api/services/serviceApiService';
import Navbar from '@/components/layout/Navbar';

interface UserWithBusiness {
  id: number;
  name?: string;
  email?: string;
  business?: {
    id: number;
    name?: string;
  };
}

const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = location.pathname.includes('/manager-dashboard') 
    ? '/manager-dashboard' 
    : '/business-dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const typedUser = user as unknown as UserWithBusiness;
  const businessName = typedUser?.business?.name || typedUser?.name || 'Doanh nghiệp';

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

            <div className="mb-6">
              <h2 className="font-medium">Quản lý doanh nghiệp</h2>
              <p className="text-sm text-muted-foreground">{businessName}</p>
            </div>

            <nav className="space-y-1 flex-1">
              <NavLink
                to={baseUrl}
                end
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive ? 'bg-accent' : ''}`
                }
              >
                <Home className="h-4 w-4 mr-3" />
                Tổng quan
              </NavLink>
              <NavLink
                to={`${baseUrl}/services`}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive ? 'bg-accent' : ''}`
                }
              >
                <Briefcase className="h-4 w-4 mr-3" />
                Dịch vụ
              </NavLink>
              <NavLink
                to={`${baseUrl}/staff`}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive ? 'bg-accent' : ''}`
                }
              >
                <Users className="h-4 w-4 mr-3" />
                Nhân viên
              </NavLink>
              <NavLink
                to={`${baseUrl}/appointments`}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md hover:bg-accent ${
                    isActive || location.pathname.startsWith(`${baseUrl}/appointments/`) ? 'bg-accent' : ''
                  }`
                }
              >
                <Calendar className="h-4 w-4 mr-3" />
                Lịch hẹn
              </NavLink>
              <NavLink
                to={`${baseUrl}/customers`}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive ? 'bg-accent' : ''}`
                }
              >
                <Users className="h-4 w-4 mr-3" />
                Khách hàng
              </NavLink>
              <NavLink
                to={`${baseUrl}/analytics`}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive ? 'bg-accent' : ''}`
                }
              >
                <BarChart className="h-4 w-4 mr-3" />
                Thống kê
              </NavLink>
              <NavLink
                to={`${baseUrl}/settings`}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md hover:bg-accent ${isActive ? 'bg-accent' : ''}`
                }
              >
                <Settings className="h-4 w-4 mr-3" />
                Cài đặt
              </NavLink>
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
            <Route index element={<BusinessHome />} />
            <Route path="services" element={<BusinessServices />} />
            <Route path="staff" element={<BusinessStaff />} />
            <Route path="appointments" element={<BusinessAppointments />} />
            <Route path="appointments/:id" element={<BusinessAppointmentDetail />} />
            <Route path="customers" element={<BusinessCustomers />} />
            <Route path="analytics" element={<BusinessAnalytics />} />
            <Route path="settings" element={<BusinessSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const BusinessHome = () => {
  const { user } = useAuth();
  const { apiQuery } = useApi();
  const [stats, setStats] = useState({
    services: 0,
    appointments: 0,
    customers: 0,
    revenue: 0,
    staffCount: 0
  });

  const typedUser = user as unknown as UserWithBusiness;
  const businessId = typedUser?.business?.id || typedUser?.id;
  const businessName = typedUser?.business?.name || typedUser?.name || 'Doanh nghiệp';

  // Fetch business data
  const { data: business, isLoading: isBusinessLoading } = apiQuery(
    ['business', businessId],
    () => businessId ? businessService.getBusinessById(businessId) : Promise.resolve(null),
    {
      enabled: !!businessId,
    }
  );

  // Fetch services count
  const { data: servicesData, isLoading: isServicesLoading } = apiQuery(
    ['businessServicesCount', businessId],
    () => businessId ? serviceApiService.getBusinessOwnerServices() : Promise.resolve({ totalItems: 0, services: [] }),
    {
      enabled: !!businessId,
    }
  );

  // Fetch staff count
  const { data: staffData, isLoading: isStaffLoading } = apiQuery(
    ['staffCount', businessId],
    () => businessId ? staffService.getStaffByBusiness(businessId) : Promise.resolve([]),
    {
      enabled: !!businessId,
    }
  );

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      services: servicesData?.totalItems || 0,
      staffCount: staffData?.length || 0
    }));
  }, [servicesData, staffData]);

  // Sample data for appointments - this would be fetched from the API in a real scenario
  const recentAppointments = [
    { id: 1, customer: 'Nguyễn Văn A', service: 'Massage Thư Giãn', time: '10:00', status: 'completed' },
    { id: 2, customer: 'Trần Thị B', service: 'Chăm Sóc Da Mặt', time: '11:30', status: 'confirmed' },
    { id: 3, customer: 'Lê Văn C', service: 'Massage Svedish', time: '13:00', status: 'confirmed' },
    { id: 4, customer: 'Phạm Thị D', service: 'Liệu Pháp Hương Thơm', time: '15:30', status: 'pending' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Xin chào, {typedUser?.name || 'Quản lý'}</h1>
        <p className="text-muted-foreground">Đây là tổng quan hoạt động kinh doanh của {businessName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          label="Tổng số dịch vụ" 
          value={stats.services} 
          icon={<Briefcase className="h-4 w-4" />} 
          isLoading={isServicesLoading}
        />
        <StatsCard 
          label="Lịch hẹn hôm nay" 
          value={5} 
          icon={<Calendar className="h-4 w-4" />} 
          isLoading={false}
        />
        <StatsCard 
          label="Tổng nhân viên" 
          value={stats.staffCount} 
          icon={<Users className="h-4 w-4" />} 
          isLoading={isStaffLoading}
        />
        <StatsCard 
          label="Doanh thu tháng này" 
          value="3,240,000 VNĐ" 
          icon={<BarChart className="h-4 w-4" />} 
          isMonetary
          isLoading={false}
        />
      </div>

      <div className="bg-card rounded-lg border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Lịch hẹn hôm nay</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/business-dashboard/appointments">Xem tất cả</Link>
          </Button>
        </div>

        <div className="divide-y">
          {recentAppointments.map((appointment) => (
            <div key={appointment.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{appointment.customer}</p>
                <p className="text-sm text-muted-foreground">{appointment.service}</p>
              </div>
              <div className="text-sm">{appointment.time}</div>
              <div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  appointment.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : appointment.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status === 'completed' ? 'Đã hoàn thành' : 
                   appointment.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-lg font-medium mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button asChild>
            <Link to="/business-dashboard/services">Thêm dịch vụ mới</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/business-dashboard/appointments">Tạo lịch hẹn mới</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/business-dashboard/staff">Quản lý nhân viên</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ label, value, icon, isMonetary = false, isLoading = false }) => {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground">{label}</span>
        <div className="bg-primary/10 p-2 rounded-full text-primary">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold">
        {isLoading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
        ) : (
          isMonetary ? value : value
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
