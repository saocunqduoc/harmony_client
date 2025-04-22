
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/api/services/locationService';
import { serviceCategoryService } from '@/api/services/serviceCategoryService';
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [locationsOpen, setLocationsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: locationService.getCities
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ['serviceCategories'],
    queryFn: () => serviceCategoryService.getAllServiceCategories()
  });

  const categories = categoriesResponse?.serviceCategories || [];

  // Handle search with location
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    if (location) {
      params.append('city', location);
    }
    
    navigate(`/services?${params.toString()}`);
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/services?categoryIds=${categoryId}`);
  };

  // Handle keyboard shortcuts for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLocationsOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="hero-gradient py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-harmony-800 to-harmony-600">
            Book Wellness Services with Ease
          </h1>
          <p className="text-lg md:text-xl mb-8 text-foreground/80">
            Discover and schedule spa, salon, and wellness services all in one place.
            Book appointments that fit your schedule.
          </p>
          
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center px-3 bg-muted rounded-md">
                  <Search size={18} className="text-muted-foreground mr-2" />
                  <Input 
                    type="text" 
                    placeholder="What service are you looking for?"
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
                <div className="md:w-[180px]">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-full" onClick={() => setLocationsOpen(true)}>
                      <div className="flex items-center">
                        <MapPin size={18} className="text-muted-foreground mr-2" />
                        <SelectValue placeholder="Location" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_locations">All Locations</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <CommandDialog open={locationsOpen} onOpenChange={setLocationsOpen}>
                    <CommandInput placeholder="Search location..." />
                    <CommandList>
                      <CommandGroup heading="Locations">
                        <CommandItem
                          value="all_locations" 
                          onSelect={() => {
                            setLocation("");
                            setLocationsOpen(false);
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>All Locations</span>
                        </CommandItem>
                        {cities.map((city) => (
                          <CommandItem
                            key={city}
                            value={city}
                            onSelect={() => {
                              setLocation(city);
                              setLocationsOpen(false);
                            }}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            <span>{city}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </CommandDialog>
                </div>
              </div>
              <Button size="lg" onClick={handleSearch} className="w-full">
                Search
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button 
                key={category.id}
                variant="outline" 
                className="rounded-full"
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
