
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { serviceApiService } from '@/api/services/serviceApiService';
import ServiceCard from './ServiceCard';
import ServiceCardLoading from './ServiceCardLoading';

interface RecommendedServicesProps {
  currentServiceId?: number;
  categoryId?: number;
  limit?: number;
  city?: string;
}

const RecommendedServices: React.FC<RecommendedServicesProps> = ({ 
  currentServiceId, 
  categoryId,
  limit = 4,
  city
}) => {
  // Ensure categoryId is properly parsed as a number if it's a string
  const effectiveCategoryId = categoryId !== undefined 
    ? (typeof categoryId === 'string' ? parseInt(categoryId as string, 10) : categoryId) 
    : undefined;

  // Ensure currentServiceId is a number
  const effectiveCurrentServiceId = currentServiceId !== undefined 
    ? (typeof currentServiceId === 'string' ? parseInt(currentServiceId as string, 10) : currentServiceId)
    : undefined;

  console.log('RecommendedServices - params:', { 
    currentServiceId: effectiveCurrentServiceId, 
    categoryId: effectiveCategoryId, 
    limit, 
    city 
  });

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['recommendedServices', effectiveCategoryId, limit, city],
    queryFn: () => serviceApiService.getRecommendedServices(effectiveCategoryId, limit, city),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(limit)].map((_, index) => (
          <ServiceCardLoading key={index} />
        ))}
      </div>
    );
  }

  if (error || !services || services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recommended services available.</p>
      </div>
    );
  }

  // Filter out the current service if needed
  const filteredServices = services.filter(service => 
    effectiveCurrentServiceId === undefined || service.id !== effectiveCurrentServiceId
  );

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No other services available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredServices.slice(0, limit).map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

export default RecommendedServices;
