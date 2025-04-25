import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { serviceApiService, Service } from '@/api/services/serviceApiService';
import { formatCurrency } from '@/utils/dateUtils';
import { ca } from 'date-fns/locale';

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        setIsLoading(true);
        // Get featured services from the API
        const response = await serviceApiService.getFeaturedServices();
        
        setServices(response);
      } catch (err) {
        console.error('Error fetching featured services:', err);
        setError('Không thể tải dịch vụ nổi bật');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Dịch Vụ Nổi Bật</h2>
            <Button variant="ghost" disabled>Xem Tất Cả</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="service-card overflow-hidden h-full flex flex-col">
                <div className="flex items-center justify-center h-48 bg-muted">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
                <CardHeader className="py-3 animate-pulse">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="py-2 animate-pulse">
                  <div className="h-4 bg-muted rounded w-full"></div>
                </CardContent>
                <CardFooter className="pt-0 pb-3 animate-pulse">
                  <div className="h-8 bg-muted rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || services.length === 0) {
    return null; // Don't show the section if there are no services
  }

  const calculateDisplayPrice = (price: number, discount?: number, discountType?: string) => {
    if (!discount || discount === 0) return price;
    
    if (discountType === 'percentage' || discountType === 'percent') {
      return price * (1 - discount / 100);
    } else if (discountType === 'fixed') {
      return price - discount;
    }
    
    return price;
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Dịch Vụ Nổi Bật</h2>
          <Link to="/services">
            <Button variant="ghost">Xem Tất Cả</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link key={service.id} to={`/service/${service.id}`}>
              <Card className="service-card overflow-hidden h-full">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={service.thumbnail || 'https://placehold.co/600x400?text=No+Image'}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-background/90 rounded-full px-2 py-1 text-xs font-medium">
                    {service?.category || 'Danh mục'}
                  </div>
                </div>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{service.name}</h3>
                      <p className="text-muted-foreground text-sm">{service.business?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground line-through">
                        {service.discount ? formatCurrency(service.price) : ''}
                      </p>
                      <p className="font-semibold">{formatCurrency(calculateDisplayPrice(service.price, service.discount, service.discountType))}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center text-sm">
                    <MapPin size={14} className="mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{service.business?.city || 'Địa điểm'}</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-muted-foreground"></div>
                    <Clock size={14} className="mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{service.duration} phút</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-3 flex justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">
                      {parseFloat(service.averageRating) || ''}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({service.reviewCount || ''})
                    </span>
                  </div>
                  <Button size="sm">Đặt Ngay</Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
