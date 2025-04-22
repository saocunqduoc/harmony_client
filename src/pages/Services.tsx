
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  serviceApiService, 
  ServicesResponse, 
  ServiceQueryParams 
} from '@/api/services/serviceApiService';
import { serviceCategoryService, ServiceCategory } from '@/api/services/serviceCategoryService';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ServicesList from '@/components/services/ServicesList';
import ServiceFilters from '@/components/services/ServiceFilters';

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  
  const [services, setServices] = useState<ServicesResponse>({
    services: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10
  });
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>('0');
  const [maxPrice, setMaxPrice] = useState<string>('1000000');
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('all_cities');
  const [sortOption, setSortOption] = useState<string>('name_asc');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Flag to control when to fetch services
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // Fetch categories for filtering
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
  
  // Set initial filter values from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const minRatingParam = searchParams.get('minRating');
    const sortParam = searchParams.get('sort');
    const cityParam = searchParams.get('city');
    
    if (categoryParam) {
      const categoryIds = categoryParam.split(',');
      setSelectedCategories(categoryIds);
    }
    if (minPriceParam) setMinPrice(minPriceParam);
    if (maxPriceParam) setMaxPrice(maxPriceParam);
    if (minRatingParam) setMinRating(parseInt(minRatingParam));
    if (sortParam) setSortOption(sortParam);
    if (cityParam) setSelectedCity(cityParam);
    
    // Initial fetch based on URL params
    setShouldFetch(true);
  }, []);
  
  // Create query params object for API
  const createQueryParams = (page: number = 1): ServiceQueryParams => {
    const params: ServiceQueryParams = {
      page,
      limit: 9
    };
    
    if (searchTerm) params.search = searchTerm;
    
    if (selectedCategories.length > 0) {
      params.categoryIds = selectedCategories.join(',');
    }
    
    const minPriceNum = parseInt(minPrice);
    const maxPriceNum = parseInt(maxPrice);
    
    if (!isNaN(minPriceNum) && minPriceNum > 0) {
      params.minPrice = minPriceNum;
    }
    
    if (!isNaN(maxPriceNum) && maxPriceNum < 1000000) {
      params.maxPrice = maxPriceNum;
    }
    
    if (minRating !== null && minRating > 0) {
      params.minRating = minRating;
    }
    
    if (selectedCity && selectedCity !== 'all_cities') {
      params.city = selectedCity;
    }
    
    // Handle sorting
    if (sortOption) {
      const [field, direction] = sortOption.split('_');
      params.sortBy = field;
      params.order = direction.toUpperCase() as 'ASC' | 'DESC';
    }
    
    return params;
  };
  
  // Update URL with search params
  const updateUrl = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (parseInt(minPrice) > 0) params.set('minPrice', minPrice);
    if (parseInt(maxPrice) < 1000000) params.set('maxPrice', maxPrice);
    if (minRating !== null && minRating > 0) params.set('minRating', minRating.toString());
    if (selectedCity && selectedCity !== 'all_cities') params.set('city', selectedCity);
    if (sortOption) params.set('sort', sortOption);
    if (currentPage > 1) params.set('page', currentPage.toString());
    
    navigate({ search: params.toString() });
  };
  
  // Fetch services with filters
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const params = createQueryParams(currentPage);
      console.log("API params:", params);
      const response = await serviceApiService.getAllServices(params);
      setServices(response);
      setShouldFetch(false);
      updateUrl();
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch services when shouldFetch changes or when page changes
  useEffect(() => {
    if (shouldFetch) {
      fetchServices();
    }
  }, [shouldFetch, currentPage]);
  
  // Handle search and filter changes
  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying new filters
    setShouldFetch(true);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setMinPrice('0');
    setMaxPrice('1000000');
    setMinRating(null);
    setSelectedCity('all_cities');
    setSortOption('name_asc');
    setCurrentPage(1);
    setShouldFetch(true);
  };
  
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };
  
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };
  
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };
  
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Count active filters
  const activeFiltersCount = [
    searchTerm !== '',
    selectedCategories.length > 0,
    parseInt(minPrice) > 0,
    parseInt(maxPrice) < 1000000,
    minRating !== null,
    selectedCity !== 'all_cities'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Dịch vụ</h1>
        
        {/* Mobile filters button */}
        <div className="md:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex items-center justify-between">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </div>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <ServiceFilters 
                categories={categories}
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                handleMinPriceChange={handleMinPriceChange}
                handleMaxPriceChange={handleMaxPriceChange}
                minRating={minRating}
                setMinRating={setMinRating}
                selectedCity={selectedCity}
                handleCityChange={handleCityChange}
                searchTerm={searchTerm}
                handleSearchTermChange={handleSearchTermChange}
                handleApplyFilters={handleApplyFilters}
                handleClearFilters={handleClearFilters}
              />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar - desktop */}
          <div className="hidden lg:block">
            <div className="border rounded-md p-4 space-y-4 sticky top-20">
              <h2 className="font-semibold text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Bộ lọc
              </h2>
              
              <ServiceFilters 
                categories={categories}
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                handleMinPriceChange={handleMinPriceChange}
                handleMaxPriceChange={handleMaxPriceChange}
                minRating={minRating}
                setMinRating={setMinRating}
                selectedCity={selectedCity}
                handleCityChange={handleCityChange}
                searchTerm={searchTerm}
                handleSearchTermChange={handleSearchTermChange}
                handleApplyFilters={handleApplyFilters}
                handleClearFilters={handleClearFilters}
              />
            </div>
          </div>
          
          {/* Services grid */}
          <div className="lg:col-span-3">
            {services.totalItems > 0 && (
              <p className="mb-4 text-muted-foreground">
                Hiển thị {services.services.length} / {services.totalItems} kết quả
              </p>
            )}
            
            <ServicesList 
              services={services.services}
              isLoading={isLoading}
              error={error}
              currentPage={services.currentPage}
              totalPages={services.totalPages}
              setCurrentPage={(page) => {
                setCurrentPage(page);
                setShouldFetch(true);
              }}
              fetchServices={fetchServices}
              handleClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Services;
