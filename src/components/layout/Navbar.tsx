import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Menu, LogOut, Building, Calendar, Bell, LayoutDashboard } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useApiAuth } from '@/context/ApiAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useApiAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user || !user.role) return '/dashboard';

    // Get the role
    const userRole = user.role;
    
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'owner':
        return '/business-dashboard';
      case 'manager':
        return '/manager-dashboard';
      case 'staff':
        return '/staff-dashboard';
      default:
        return '/dashboard';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Only show bookings for customers
  const showBookings = isAuthenticated && user?.role === 'customer';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-b bg-background py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-primary">Harmony</Link>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/services" className="text-foreground hover:text-primary">Dịch vụ</Link>
          <Link to="/businesses" className="text-foreground hover:text-primary">Cửa hàng</Link>
          
          {isAuthenticated && user ? (
            <>
              {showBookings && (
                <Link to="/user/bookings">
                  <Button variant="ghost" size="icon" className="relative">
                    <Calendar size={20} />
                    <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-2 text-xs">
                      0
                    </Badge>
                  </Button>
                </Link>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-auto">
                    <div className="py-2 px-3 text-sm">
                      Bạn chưa có thông báo nào.
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {getInitials(user.fullName || 'User')}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.fullName}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>
                  {showBookings && (
                    <DropdownMenuItem asChild>
                      <Link to="/user/bookings" className="cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Lịch hẹn</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Đăng nhập</Button>
              </Link>
              <Link to="/register">
                <Button>Đăng ký</Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <span className="h-6 w-6">✕</span> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 space-y-4 border-t">
          <div className="flex flex-col space-y-2">
            <Link to="/services" className="block p-2 hover:bg-accent rounded-md">Dịch vụ</Link>
            <Link to="/businesses" className="block p-2 hover:bg-accent rounded-md">Cửa hàng</Link>
            
            {isAuthenticated && user ? (
              <>
                <Link to={getDashboardLink()} className="block p-2 hover:bg-accent rounded-md flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link to="/profile" className="block p-2 hover:bg-accent rounded-md">Hồ sơ</Link>
                {showBookings && (
                  <Link to="/user/bookings" className="block p-2 hover:bg-accent rounded-md flex items-center gap-2">
                    <Calendar size={16} />
                    Lịch hẹn
                  </Link>
                )}
                <Button variant="ghost" onClick={handleLogout} className="justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block p-2 hover:bg-accent rounded-md">Đăng nhập</Link>
                <Link to="/register" className="block p-2 hover:bg-accent rounded-md">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
