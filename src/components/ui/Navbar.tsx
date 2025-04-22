
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, Bell, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useApiAuth } from '@/context/ApiAuthContext';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Input } from './input';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useApiAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Xây dựng URL tìm kiếm với tham số search
      navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm('');
      }
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

  return (
    <nav className="border-b bg-background py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-primary">Harmony</Link>
        
        {/* Search Bar - Only on larger screens */}
        <div className="hidden md:block flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Tìm kiếm dịch vụ, cửa hàng..."
              className="w-full pl-4 pr-10"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/services" className="text-foreground hover:text-primary">Dịch vụ</Link>
          <Link to="/businesses" className="text-foreground hover:text-primary">Cửa hàng</Link>
          
          {isAuthenticated && user ? (
            <>
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
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{getInitials(user.fullName || 'User')}</AvatarFallback>
                    </Avatar>
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
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <span>Lịch hẹn</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
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
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 space-y-4 border-t">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Input
              type="search"
              placeholder="Tìm kiếm dịch vụ, cửa hàng..."
              className="w-full pl-4 pr-10"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="flex flex-col space-y-2">
            <Link to="/services" className="block p-2 hover:bg-accent rounded-md">Dịch vụ</Link>
            <Link to="/businesses" className="block p-2 hover:bg-accent rounded-md">Cửa hàng</Link>
            
            {isAuthenticated && user ? (
              <>
                <Link to="/profile" className="block p-2 hover:bg-accent rounded-md">Hồ sơ</Link>
                <Link to="/dashboard" className="block p-2 hover:bg-accent rounded-md">Lịch hẹn</Link>
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
