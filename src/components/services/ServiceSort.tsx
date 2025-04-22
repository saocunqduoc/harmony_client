
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export type SortOption = {
  label: string;
  value: string;
  order: 'ASC' | 'DESC';
};

interface ServiceSortProps {
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  isLoading: boolean;
  servicesCount: number;
  sortOptions: SortOption[];
}

const ServiceSort = ({ sortOption, setSortOption, isLoading, servicesCount, sortOptions }: ServiceSortProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <p className="text-sm text-muted-foreground mb-2 sm:mb-0">
        {isLoading ? 'Đang tải...' : `Hiển thị ${servicesCount} dịch vụ`}
      </p>
      
      <div className="flex items-center">
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        <select 
          className="bg-transparent border-none text-sm focus:outline-none cursor-pointer pr-8"
          value={sortOptions.findIndex(option => 
            option.value === sortOption.value && option.order === sortOption.order
          ).toString()}
          onChange={(e) => setSortOption(sortOptions[parseInt(e.target.value)])}
        >
          {sortOptions.map((option, index) => (
            <option key={index} value={index}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ServiceSort;
