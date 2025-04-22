
import React, { useState, useEffect } from 'react';
import { X, Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/api/services/locationService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCategory } from '@/api/services/serviceCategoryService';
import axios from 'axios';

interface ServiceFiltersProps {
  categories: ServiceCategory[];
  selectedCategories: string[];
  handleCategoryChange: (categoryId: number) => void;
  minPrice: number | string;
  maxPrice: number | string;
  handleMinPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minRating: number | null;
  setMinRating: React.Dispatch<React.SetStateAction<number | null>>;
  selectedCity: string;
  handleCityChange: (city: string) => void;
  searchTerm: string;
  handleSearchTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleApplyFilters: () => void;
  handleClearFilters: () => void;
}

interface Province {
  id: number;
  name: string;
  type: number;
  typeText: string;
  slug: string;
}

const ServiceFilters = ({
  categories,
  selectedCategories,
  handleCategoryChange,
  minPrice,
  maxPrice,
  handleMinPriceChange,
  handleMaxPriceChange,
  minRating,
  setMinRating,
  selectedCity,
  handleCityChange,
  searchTerm,
  handleSearchTermChange,
  handleApplyFilters,
  handleClearFilters,
}: ServiceFiltersProps) => {
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);

  // Fetch provinces from the API when search term changes
  useEffect(() => {
    const fetchProvinces = async () => {
      if (citySearchTerm.trim().length === 0) {
        setIsLoadingProvinces(true);
        try {
          const response = await axios.get('https://open.oapi.vn/location/provinces');
          if (response.data && response.data.data) {
            setProvinces(response.data.data);
          }
        } catch (error) {
          console.error('Error fetching provinces:', error);
        } finally {
          setIsLoadingProvinces(false);
        }
        return;
      }
      
      setIsLoadingProvinces(true);
      try {
        const response = await axios.get(`https://open.oapi.vn/location/provinces?query=${citySearchTerm}`);
        if (response.data && response.data.data) {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error('Error searching provinces:', error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    // Debounce the search
    const timer = setTimeout(() => {
      fetchProvinces();
    }, 300);

    return () => clearTimeout(timer);
  }, [citySearchTerm]);

  // Load initial provinces
  useEffect(() => {
    const fetchInitialProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const response = await axios.get('https://open.oapi.vn/location/provinces');
        if (response.data && response.data.data) {
          setProvinces(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching initial provinces:', error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    fetchInitialProvinces();
  }, []);

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tìm kiếm</Label>
        <div className="relative">
          <Input
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Thành phố</h3>
        <div className="relative">
          <Input
            placeholder="Tìm kiếm/thành phố..."
            value={citySearchTerm}
            onChange={(e) => setCitySearchTerm(e.target.value)}
            className="mb-2"
          />
          <div className="max-h-60 overflow-y-auto border rounded-md">
            <div className="p-2 hover:bg-accent rounded-md cursor-pointer" onClick={() => handleCityChange('all_cities')}>
              <Checkbox 
                id="all-cities"
                checked={selectedCity === 'all_cities'}
                className="mr-2"
              />
              <label htmlFor="all-cities">Tất cả</label>
            </div>
            {provinces.map((province) => (
              <div 
                key={province.id} 
                className="p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => handleCityChange(province.name)}
              >
                <Checkbox 
                  id={`city-${province.id}`}
                  checked={selectedCity === province.name}
                  className="mr-2"
                />
                <label htmlFor={`city-${province.id}`}>{province.name}</label>
              </div>
            ))}
            {isLoadingProvinces && <div className="p-2 text-center text-muted-foreground">Đang tải...</div>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Danh mục</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox 
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <label 
                htmlFor={`category-${category.id}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Khoảng giá</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Giá thấp nhất</Label>
            <Input
              type="number"
              placeholder="0 VND"
              min={0}
              value={minPrice}
              onChange={handleMinPriceChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Giá cao nhất</Label>
            <Input
              type="number"
              placeholder="1.000.000 VND"
              min={0}
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Đánh giá</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox 
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={() => setMinRating(prev => prev === rating ? null : rating)}
              />
              <label 
                htmlFor={`rating-${rating}`}
                className="ml-2 flex items-center cursor-pointer"
              >
                {renderStarRating(rating)}
                <span className="ml-2 text-sm">& trở lên</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={handleApplyFilters}>Tìm kiếm</Button>
        <Button variant="outline" onClick={handleClearFilters}>Xóa bộ lọc</Button>
      </div>
    </div>
  );
};

export default ServiceFilters;
