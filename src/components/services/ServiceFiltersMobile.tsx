
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import ServiceFilters from './ServiceFilters';
import { ServiceCategory } from '@/api/services/serviceCategoryService';

interface ServiceFiltersMobileProps {
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

const ServiceFiltersMobile = (props: ServiceFiltersMobileProps) => {
  const { selectedCategories, minRating, searchTerm, handleSearchTermChange, selectedCity } = props;
  
  // Count active filters
  const activeFiltersCount = 
    selectedCategories.length + 
    (minRating !== null ? 1 : 0) + 
    (selectedCity !== 'all_cities' ? 1 : 0) + 
    (searchTerm ? 1 : 0);
  
  return (
    <div className="md:hidden mb-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetTitle className="mb-4">Bộ lọc</SheetTitle>
          <ServiceFilters {...props} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ServiceFiltersMobile;
