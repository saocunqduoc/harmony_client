import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Menu, 
  LogOut, 
  Building, 
  Calendar, 
  Bell, 
  LayoutDashboard, 
  ChevronDown,
  Search
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useApiAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Track page scroll to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
        return '/business-dashboard'; // Manager uses the same dashboard as owner
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
  
  // Staff-specific menu items
  const isStaff = isAuthenticated && user?.role === 'staff';

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 border-b bg-background py-3 transition-all duration-200",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-primary mr-8">Harmony</Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/services" className={navigationMenuTriggerStyle()}>
                      Dịch vụ
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/businesses" className={navigationMenuTriggerStyle()}>
                      Cửa hàng
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          
          {/* Desktop search & actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-60">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm dịch vụ..."
                className="w-full rounded-full bg-background pl-8 pr-4 focus-visible:ring-primary"
              />
            </div>
            
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                {showBookings && (
                  <Link to="/user/bookings">
                    <Button variant="ghost" size="icon" className="relative" aria-label="Lịch hẹn">
                      <Calendar size={18} />
                      <Badge variant="destructive" className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-2 text-xs">
                        0
                      </Badge>
                    </Button>
                  </Link>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" aria-label="Thông báo">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-[300px] overflow-auto p-1">
                      <div className="py-2 px-3 text-sm text-center text-muted-foreground">
                        Bạn chưa có thông báo nào.
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative flex items-center gap-2 px-2" aria-label="Tài khoản">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.fullName || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline-block font-medium text-sm">{user.fullName?.split(' ').pop()}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.fullName}</span>
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
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer focus:bg-red-50 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button>Đăng ký</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu controls */}
          <div className="flex items-center md:hidden gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader className="mb-4">
                  <SheetTitle>Harmony</SheetTitle>
                </SheetHeader>
                
                {isAuthenticated && user && (
                  <div className="mb-6 flex items-center gap-3 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.fullName || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Link to="/services" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    Dịch vụ
                  </Link>
                  <Link to="/businesses" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                    Cửa hàng
                  </Link>
                  
                  {isAuthenticated && user ? (
                    <>
                      <Separator />
                      <Link to={getDashboardLink()} className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                        <User className="mr-2 h-5 w-5" />
                        Hồ sơ
                      </Link>
                      {showBookings && (
                        <Link to="/user/bookings" className="flex items-center py-2 px-3 rounded-md hover:bg-accent">
                          <Calendar className="mr-2 h-5 w-5" />
                          Lịch hẹn
                        </Link>
                      )}
                      <Separator />
                      <Button 
                        variant="ghost" 
                        onClick={handleLogout} 
                        className="w-full justify-start font-normal text-red-500 hover:bg-red-50 hover:text-red-500"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Đăng xuất
                      </Button>
                    </>
                  ) : (
                    <>
                      <Separator />
                      <div className="flex flex-col gap-2 pt-2">
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/login">Đăng nhập</Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link to="/register">Đăng ký</Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Mobile search bar - collapsible */}
        {isMobileSearchOpen && (
          <div className="md:hidden py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm dịch vụ..."
                className="w-full pl-10 pr-4"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
