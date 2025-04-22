
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceApiService, Service } from '@/api/services/serviceApiService';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';

const FeaturedServicesApi = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        setIsLoading(true);
        const response = await serviceApiService.getAllServices({
          limit: 6,
          sortBy: 'rating',
          order: 'DESC'
        });
        setServices(response.services);
      } catch (err) {
        console.error('Error fetching featured services:', err);
        setError('Failed to load featured services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Featured Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden flex flex-col">
            <div className="h-48 bg-muted relative">
              {service.thumbnail ? (
                <img
                  src={service.thumbnail}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              {service.category && (
                <span className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {service.category.name}
                </span>
              )}
            </div>
            <CardContent className="p-6 flex-1">
              <h3 className="font-bold text-lg mb-1">{service.name}</h3>
              {service.business && (
                <p className="text-muted-foreground text-sm">
                  {service.business.name} {service.business.city && `· ${service.business.city}`}
                </p>
              )}
              <p className="mt-4 line-clamp-2 text-sm">
                {service.description || 'No description provided'}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
              <div className="flex items-center">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm font-medium">
                    {service.rating?.average ? service.rating.average.toFixed(1) : 'N/A'}{' '}
                    {service.rating?.count && service.rating.count > 0 && (
                      <span className="text-muted-foreground">({service.rating.count})</span>
                    )}
                  </span>
                </div>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="font-medium">${service.price}</span>
              </div>
              <Button size="sm" asChild>
                <Link to={`/service/${service.id}`}>Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button variant="outline" asChild>
          <Link to="/services">View All Services</Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedServicesApi;
