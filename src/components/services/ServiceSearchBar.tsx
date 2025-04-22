
import React, { KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ServiceSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

const ServiceSearchBar = ({ searchTerm, setSearchTerm, handleSearch }: ServiceSearchBarProps) => {
  // Handle Enter key press
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Tìm kiếm dịch vụ..."
        className="pl-10 pr-12 h-12 rounded-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button 
        className="absolute right-1 top-1 rounded-full"
        size="sm"
        onClick={handleSearch}
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default ServiceSearchBar;
