import React, { useState, useEffect, useRef } from 'react';
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
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const citySearchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Basic cities query
  const { data: allCities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: locationService.getCities
  });

  // Get filtered cities from the API based on search query
  const { data: filteredProvinces = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ['filteredCities', citySearchQuery],
    queryFn: async () => {
      if (!citySearchQuery || citySearchQuery.length < 1) return [];
      
      try {
        const response = await locationService.getProvinces({ query: citySearchQuery });
        return response.data;
      } catch (error) {
        console.error('Error searching cities:', error);
        return [];
      }
    },
    enabled: citySearchQuery.length >= 1
  });

  // Map filtered provinces to just city names for display
  const filteredCities = filteredProvinces.map(province => province.name);

  // Cities to display in dropdown
  const citiesToDisplay = citySearchQuery.length >= 1 ? filteredCities : allCities;

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
    navigate(`/services?category=${categoryId}&sort=name_asc`);
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

  // Maintain input focus when dropdown content updates
  useEffect(() => {
    if (citySearchInputRef.current) {
      citySearchInputRef.current.focus();
    }
  }, [filteredCities]);

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
                    <SelectTrigger className="h-full">
                      <div className="flex items-center">
                        <MapPin size={18} className="text-muted-foreground mr-2" />
                        <SelectValue placeholder="Location" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search location..."
                          value={citySearchQuery}
                          onChange={(e) => setCitySearchQuery(e.target.value)}
                          className="mb-2"
                          ref={citySearchInputRef}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <SelectItem value="all_locations">All Locations</SelectItem>
                      {isLoadingCities ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
                      ) : citiesToDisplay.length === 0 ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">No locations found</div>
                      ) : (
                        citiesToDisplay.map((city) => (
                          <SelectItem key={city} value={city || `city-${Math.random()}`}>{city}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
