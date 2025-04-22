
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceCategory } from '@/api/services/serviceCategoryService';

interface ActiveFiltersProps {
  selectedCategories: string[];
  categories: ServiceCategory[];
  minRating: number | null;
  handleCategoryChange: (categoryId: number) => void;
  setMinRating: React.Dispatch<React.SetStateAction<number | null>>;
  handleClearFilters: () => void;
}

const ActiveFilters = ({
  selectedCategories,
  categories,
  minRating,
  handleCategoryChange,
  setMinRating,
  handleClearFilters,
}: ActiveFiltersProps) => {
  if (selectedCategories.length === 0 && minRating === null) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedCategories.map((categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? (
          <Badge key={categoryId} variant="outline" className="flex items-center gap-1">
            {category.name}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-4 w-4 p-0"
              onClick={() => handleCategoryChange(categoryId)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ) : null;
      })}
      
      {minRating !== null && (
        <Badge variant="outline" className="flex items-center gap-1">
          {minRating}+ Stars
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4 p-0"
            onClick={() => setMinRating(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs h-7"
        onClick={handleClearFilters}
      >
        Xóa tất cả
      </Button>
    </div>
  );
};

export default ActiveFilters;
