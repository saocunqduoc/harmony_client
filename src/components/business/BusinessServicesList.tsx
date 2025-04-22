
import React, { useState, useEffect } from 'react';
import { serviceApiService, ServicesResponse, ServiceQueryParams, Service } from '@/api/services/serviceApiService';
import { serviceCategoryService, ServiceCategory } from '@/api/services/serviceCategoryService';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Clock, Search, Filter, ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/dateUtils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BusinessServicesListProps {
  businessId: number;
}

const BusinessServicesList = ({ businessId }: BusinessServicesListProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
  });
  
  // Search and filter state
  const [searchParams, setSearchParams] = useState<ServiceQueryParams>({
    page: 1,
    limit: 6,
    sortBy: 'name',
    order: 'ASC',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Get categories for filtering
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await serviceCategoryService.getAllServiceCategories();
        setCategories(response.serviceCategories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch services with filters
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const params: ServiceQueryParams = {
          ...searchParams,
          search: searchTerm || undefined,
          categoryIds: selectedCategoryId || undefined
        };
        
        // Đảm bảo tham số search được truyền vào API request
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        console.log("Business services search params:", params);
        
        const response = await serviceApiService.getBusinessServices(businessId, params);
        setServices(response.services || []);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          itemsPerPage: response.itemsPerPage,
        });
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [businessId, searchParams, searchTerm, selectedCategoryId]);

  // Handle search input
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('search') as string;
    setSearchTerm(searchQuery);
    
    setSearchParams(prev => ({
      ...prev,
      page: 1, // Reset to first page on new search
    }));
  };

  // Handle sorting
  const handleSort = (value: string) => {
    let sortBy = 'name';
    let order: 'ASC' | 'DESC' = 'ASC';
    
    switch(value) {
      case 'name_asc':
        sortBy = 'name';
        order = 'ASC';
        break;
      case 'name_desc':
        sortBy = 'name';
        order = 'DESC';
        break;
      case 'price_asc':
        sortBy = 'price';
        order = 'ASC';
        break;
      case 'price_desc':
        sortBy = 'price';
        order = 'DESC';
        break;
      case 'rating_desc':
        sortBy = 'rating';
        order = 'DESC';
        break;
    }
    
    setSearchParams(prev => ({
      ...prev,
      sortBy,
      order,
    }));
  };
  
  // Handle category filter
  const handleCategoryFilter = (value: string) => {
    setSelectedCategoryId(value);
    setSearchParams(prev => ({
      ...prev,
      page: 1, // Reset to first page on new filter
    }));
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    
    setSearchParams(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  // Show loading skeletons
  if (isLoading && pagination.currentPage === 1) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="w-full md:w-1/2">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && !isLoading && services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">{error}</p>
        <Button 
          onClick={() => setSearchParams({page: 1, limit: 6})} 
          variant="outline" 
          className="mt-4"
        >
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="w-full md:w-1/2 relative">
          <Input 
            type="search" 
            name="search" 
            placeholder="Tìm kiếm dịch vụ..." 
            className="pr-10"
            defaultValue={searchTerm}
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-full px-3"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="flex gap-2">
          <Select 
            onValueChange={handleCategoryFilter} 
            defaultValue=""
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            onValueChange={handleSort} 
            defaultValue="name_asc"
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
      
      {/* Services grid */}
      {services.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-lg mb-4">Không tìm thấy dịch vụ nào phù hợp với tìm kiếm của bạn</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategoryId('');
              setSearchParams({
                page: 1,
                limit: 6,
                sortBy: 'name',
                order: 'ASC',
              });
            }}
          >
            Xóa bộ lọc
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link key={service.id} to={`/service/${service.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={service.thumbnail || "https://placehold.co/600x400?text=No+Image"} 
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    {service.rating && (
                      <div className="absolute top-2 right-2 bg-background/80 rounded-md px-2 py-1 flex items-center text-sm">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating.average.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground ml-1">({service.rating.count})</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{service.name}</h3>
                    {service.category && (
                      <p className="text-sm text-muted-foreground truncate">
                        {service.category.name}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-sm">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{service.duration} phút</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <p className="font-medium text-primary">
                      {formatCurrency(service.price)}
                    </p>
                    <Button size="sm">Đặt lịch</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={pageNumber === pagination.currentPage}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {pagination.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                {pagination.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => handlePageChange(pagination.totalPages)}
                    >
                      {pagination.totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                
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
      )}
    </div>
  );
};

export default BusinessServicesList;
