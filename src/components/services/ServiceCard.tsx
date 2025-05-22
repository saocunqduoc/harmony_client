import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Service } from '@/api/services/serviceApiService';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  // Ensure the service ID is proper type for navigation
  const serviceId = typeof service.id === 'string' ? parseInt(service.id, 10) : service.id;
  
  // Log the service ID for debugging
  console.log(`ServiceCard rendering for service ID: ${serviceId}, type: ${typeof serviceId}`);
  
  // Calculate discount price
  const calculateDisplayPrice = (price: number, discount?: number, discountType?: string) => {
    if (!discount || discount === 0) return price;
    
    if (discountType === 'percentage' || discountType === 'percent') {
      return price * (1 - discount / 100);
    } else if (discountType === 'fixed') {
      return price - discount;
    }
    
    return price;
  };
  
  const displayPrice = calculateDisplayPrice(service.price, service.discount, service.discountType);
  const hasDiscount = service.discount && service.discount > 0;
  
  // Ensure rating is properly displayed
  const rating = service.rating?.average || service.review?.averageRating || 0;
  const reviewCount = service.rating?.count || service.review?.count || 0;
  
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <Link 
        to={`/service/${serviceId}`} 
        className="flex-grow flex flex-col"
        onClick={() => {
          console.log(`Navigating to service ${serviceId}`);
          if (onClick) onClick();
        }}
      >
        <div className="relative h-48 overflow-hidden">
          {service.thumbnail ? (
            <img 
              src={service.thumbnail} 
              alt={service.name} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              {service.discountType === 'fixed' 
                ? `-${service.discount?.toLocaleString()} VND` 
                : `-${service.discount}%`}
            </Badge>
          )}
        </div>
        
        <CardContent className="flex-grow p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{service.name}</h3>
          {service.business?.name && (
            <div className="flex items-center mb-2">
              {service.business.logo && (
                <img
                  src={service.business.logo}
                  alt={`${service.business.name} logo`}
                  className="h-6 w-6 rounded-full object-cover mr-2"
                />
              )}
              <span className="text-sm text-muted-foreground">{service.business.name}</span>
            </div>
          )}
          
          {rating > 0 && (
            <div className="flex items-center text-sm mb-2">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{rating % 1 === 0 ? rating : rating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1">({reviewCount})</span>
            </div>
          )}
          
          {service.business?.city && (
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {service.business.city}
            </div>
          )}
          
          {service.duration && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {service.duration} phút
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 border-t">
          <div className="flex justify-between items-center w-full">
            <div>
              {service.category?.name && (
                <Badge variant="outline" className="mr-2">
                  {service.category.name}
                </Badge>
              )}
            </div>
            <div className="text-right">
              {displayPrice !== service.price ? (
                <>
                  <div className="text-sm text-muted-foreground line-through">
                    {service.price.toLocaleString('vi-VN')} VND
                  </div>
                  <div className="font-semibold text-base">
                    {displayPrice.toLocaleString('vi-VN')} VND
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground opacity-0">
                    ''
                  </div>
                  <div className="font-semibold text-base">
                    {service.price.toLocaleString('vi-VN')} VND
                  </div>
                </>
              )}
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ServiceCard;
