import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Clock, Phone, Mail, Calendar, MessageSquare, Search } from 'lucide-react';
import { businessService, Business } from '@/api/services/businessService';
import { serviceApiService, Service, ServiceQueryParams } from '@/api/services/serviceApiService';
import { businessHoursService, BusinessHoursResponse } from '@/api/services/businessHoursService';
import { serviceCategoryService, ServiceCategory } from '@/api/services/serviceCategoryService';
import { translateWeekday, formatCurrency } from '@/utils/dateUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const BusinessProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHoursResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6
  });
  
  // Search and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<string>('name_asc');
  
  useEffect(() => {
    if (!id) return;
    
    const fetchBusinessData = async () => {
      try {
        setIsLoading(true);
        const businessData = await businessService.getBusinessById(id);
        setBusiness(businessData.data || businessData);
        
        // Fetch business hours
        try {
          const hoursData = await businessHoursService.getBusinessHours(id);
          setBusinessHours(hoursData);
        } catch (err) {
          console.error("Error fetching business hours:", err);
        }
        
        // Fetch service categories for this business
        try {
          const categoriesData = await serviceCategoryService.getBusinessServiceCategories(id);
          setServiceCategories(categoriesData || []);
        } catch (err) {
          console.error("Error fetching service categories:", err);
        }
        
      } catch (err) {
        console.error("Error fetching business data:", err);
        setError("Không thể tải thông tin doanh nghiệp");
        toast.error("Không thể tải thông tin doanh nghiệp");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessData();
  }, [id]);
  
  const handleTabChange = async (value: string) => {
    // Only fetch services when the services tab is selected
    if (value === 'services' && id) {
      fetchServices();
    }
  };

  const fetchServices = async () => {
    if (!id) return;
    
    try {
      setIsServicesLoading(true);
      
      // Prepare query parameters
      const params: ServiceQueryParams = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      };
      
      // Add search term if exists
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Add category filter if selected
      if (selectedCategory) {
        params.categoryIds = selectedCategory;
      }
      
      // Add sorting
      if (sortOption) {
        const [sortBy, order] = sortOption.split('_');
        params.sortBy = sortBy;
        params.order = order.toUpperCase() as 'ASC' | 'DESC';
      }
      
      const servicesData = await serviceApiService.getBusinessServices(id, params);
      
      setServices(servicesData.services || []);
      setPagination({
        currentPage: servicesData.currentPage,
        totalPages: servicesData.totalPages,
        totalItems: servicesData.totalItems,
        itemsPerPage: servicesData.itemsPerPage
      });
    } catch (err) {
      console.error("Error fetching business services:", err);
      toast.error("Không thể tải danh sách dịch vụ");
    } finally {
      setIsServicesLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    // Services will be fetched when apply filters is called
  };
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    fetchServices();
  };
  
  const handleSort = (value: string) => {
    setSortOption(value);
    fetchServices();
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    
    setPagination(prev => ({ ...prev, currentPage: page }));
    // This will trigger useEffect to fetch services with new page
  };
  
  useEffect(() => {
    if (id && !isLoading) {
      fetchServices();
    }
  }, [pagination.currentPage, sortOption, selectedCategory]);
  
  // Format business hours for display
  const formatBusinessHours = () => {
    if (!businessHours || !businessHours.formattedData) {
      return {
        openHours: [],
        closedDays: "Không có thông tin giờ làm việc"
      };
    }
    
    const { openHours, closedHours } = businessHours.formattedData;
    const openHoursArray = openHours.split('\n');
    
    return {
      openHours: openHoursArray,
      closedDays: closedHours || "Không đóng cửa ngày nào"
    };
  };
  
  const { openHours, closedDays } = formatBusinessHours();

  const calculateDisplayPrice = (price: number, discount?: number, discountType?: string) => {
    if (!discount || discount === 0) return price;
    
    if (discountType === 'percentage' || discountType === 'percent') {
      return price * (1 - discount / 100);
    } else if (discountType === 'fixed') {
      return price - discount;
    }
    
    return price;
  };

  
  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="h-64 md:h-80 w-full bg-muted animate-pulse"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    
                    <Skeleton className="h-5 w-40 mb-3" />
                    <div className="space-y-2 mb-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                    
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-40 mb-4" />
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center">
                          <Skeleton className="h-6 w-6 rounded-full mr-3" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Display error state
  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center p-8 bg-muted rounded-lg">
              <p className="text-red-500">
                {error || "Không tìm thấy doanh nghiệp"}
              </p>
              <Button asChild className="mt-4">
                <Link to="/businesses">Xem danh sách doanh nghiệp</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Translated business hours display
  const translatedBusinessHours = openHours.map(hours => {
    // Parse the hours string to extract days and times
    const match = hours.match(/(.*)\s(\d{2}:\d{2}:\d{2})\s-\s(\d{2}:\d{2}:\d{2})/);
    if (match) {
      const [_, day, openTime, closeTime] = match;
      return {
        day: translateWeekday(day),
        openTime: openTime.substring(0, 5),
        closeTime: closeTime.substring(0, 5)
      };
    }
    return { day: translateWeekday(hours), openTime: "", closeTime: "" };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Cover Image */}
        <div className="h-64 md:h-80 w-full relative">
          {business.coverImage ? (
            <img 
              src={business.coverImage} 
              alt={`${business.name} cover`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center">
              {business.logo && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg mr-4">
                  <img 
                    src={business.logo} 
                    alt={`${business.name} logo`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{business.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">4.5</span>
                    <span className="ml-1">(24 đánh giá)</span>
                  </div>
                  {business.city && (
                    <div className="flex items-center ml-4">
                      <MapPin size={18} className="mr-1" />
                      <span>{business.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="about" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="about">Thông tin</TabsTrigger>
              <TabsTrigger value="services">Dịch vụ</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>
            
            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Thông tin về {business.name}</h2>
                      <p className="text-muted-foreground mb-6">{business.description || "Không có thông tin mô tả."}</p>
                      
                      {business.createdAt && (
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Calendar size={16} className="mr-2" />
                          <span>Tham gia từ {new Date(business.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                      
                      <h3 className="font-semibold mb-3">Giờ làm việc</h3>
                      <div className="space-y-2 mb-6">
                        {translatedBusinessHours.length > 0 ? (
                          translatedBusinessHours.map((hours, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-muted-foreground">{hours.day}</span>
                              {hours.openTime && hours.closeTime ? (
                                <span>
                                  {hours.openTime} - {hours.closeTime}
                                </span>
                              ) : 'Tất cả các ngày trong tuần'}
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground">Không có thông tin giờ làm việc</div>
                        )}
                        
                        {closedDays && closedDays !== "Không đóng cửa ngày nào" && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{translateWeekday(closedDays)}</span>
                            <span>Đóng cửa</span>
                          </div>
                        )}
                      </div>
                      
                      <Link to={`/services?businessId=${id}`}>
                        <Button className="w-full">Xem tất cả dịch vụ</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Thông tin liên hệ</h3>
                      
                      <div className="space-y-4">
                        {(business.address || business.city) && (
                          <div className="flex items-center">
                            <MapPin size={18} className="mr-3 text-muted-foreground" />
                            <span>
                              {[business.address, business.district, business.ward, business.city]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {business.phone && (
                          <div className="flex items-center">
                            <Phone size={18} className="mr-3 text-muted-foreground" />
                            <span>{business.phone}</span>
                          </div>
                        )}
                        
                        {business.email && (
                          <div className="flex items-center">
                            <Mail size={18} className="mr-3 text-muted-foreground" />
                            <span>{business.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        {business.phone && (
                          <Button className="w-full">
                            <Phone className="mr-2 h-4 w-4" />
                            Gọi ngay
                          </Button>
                        )}
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Gửi tin nhắn
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Dịch vụ cung cấp</h2>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="search"
                      placeholder="Tìm kiếm dịch vụ..."
                      className="w-full sm:w-60 pr-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                  
                  <Select
                    value={sortOption}
                    onValueChange={handleSort}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name_asc">Tên: A-Z</SelectItem>
                      <SelectItem value="name_desc">Tên: Z-A</SelectItem>
                      <SelectItem value="price_asc">Giá: Thấp - Cao</SelectItem>
                      <SelectItem value="price_desc">Giá: Cao - Thấp</SelectItem>
                      <SelectItem value="rating_desc">Đánh giá: Cao nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Category Filters */}
              {serviceCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button 
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryFilter(null)}
                  >
                    Tất cả
                  </Button>
                  {serviceCategories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryFilter(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Services grid */}
              {isServicesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden h-full">
                      <div className="h-48 bg-muted animate-pulse" />
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : services.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <Dialog key={service.id}>
                        <DialogTrigger asChild>
                          <Card className="overflow-hidden h-full transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                            <div className="aspect-video w-full overflow-hidden bg-muted">
                              {service.thumbnail ? (
                                <img 
                                  src={service.thumbnail} 
                                  alt={service.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  Không có hình ảnh
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold">{service.name}</h3>
                                <span className="font-bold text-primary">
                                  {Math.round(service.price).toLocaleString('vi-VN')} VND
                                </span>
                              </div>
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  <span>{service.duration} phút</span>
                                </div>
                                {service.category && (
                                  <div className="px-2 py-0.5 bg-primary/10 rounded-full text-xs">
                                    {service.category.name}
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>{service.name}</DialogTitle>
                            <DialogDescription>
                              {service.description || "Không có mô tả chi tiết."}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Thời gian:</span>
                              <span>{service.duration} phút</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Giá:</span>
                              <span className="font-bold">{formatCurrency(service.price)}</span>
                            </div>
                            {service.category && (
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Danh mục:</span>
                                <span>{service.category.name}</span>
                              </div>
                            )}
                          </div>
                          <DialogFooter>
                            <Button asChild className="w-full">
                              <Link to={`/service/${service.id}`}>
                                Xem chi tiết
                              </Link>
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              isActive={page === pagination.currentPage}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="text-center p-8 border rounded-lg">
                  <p className="text-muted-foreground">Không có dịch vụ nào được cung cấp</p>
                </div>
              )}
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Đánh giá từ khách hàng</h2>
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium text-lg">4.5</span>
                  <span className="text-muted-foreground ml-1">(24 đánh giá)</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground">Chưa có đánh giá nào</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessProfile;
