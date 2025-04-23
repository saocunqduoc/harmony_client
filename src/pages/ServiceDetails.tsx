
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Map, Clock, Star, Building } from 'lucide-react';
import { serviceApiService } from '@/api/services/serviceApiService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import ServiceReviews from '@/components/services/ServiceReviews';
import ServiceBooking from '@/components/services/ServiceBooking';
import RecommendedServices from '@/components/services/RecommendedServices';

const calculateDisplayPrice = (price: number, discount?: number, discountType?: string) => {
  if (!discount || discount === 0) return price;
  
  if (discountType === 'percentage' || discountType === 'percent') {
    return price * (1 - discount / 100);
  } else if (discountType === 'fixed') {
    return price - discount;
  }
  
  return price;
};

const formatRating = (rating: number): string => {
  return Number.isInteger(rating) ? rating.toString() : rating.toFixed(1);
};

const ServiceDetails = () => {
  const { id } = useParams<{ id: any }>();
  const serviceId = id ? parseInt(id, 10) : 0;
  
  console.log('ServiceDetails - serviceId:', serviceId, 'type:', typeof serviceId);
  
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => serviceApiService.getServiceById(serviceId),
    enabled: !!serviceId && !isNaN(serviceId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!service || error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Lỗi tải dịch vụ</h1>
            <p className="mt-2">Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/services">Quay lại danh sách dịch vụ</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const finalPrice = calculateDisplayPrice(service.price, service.discount, service.discountType);
  const showDiscount = service.discount && service.discount > 0;
  const businessId = service.business ? service.business.id : null;
  
  const serviceDuration = typeof service.duration === 'string' 
    ? parseInt(service.duration, 10) 
    : Number(service.duration);

  const categoryId = service.category?.id !== undefined 
    ? (typeof service.category.id === 'string' 
        ? parseInt(service.category.id as string, 10) 
        : Number(service.category.id)) 
    : undefined;
  
    const hasRating = (service.rating?.average > 0) || (service.review?.averageRating > 0);

    const formattedRating = hasRating
      ? formatRating(service.rating?.average ?? service.review?.averageRating)
      : ' ';

  const numericBusinessId = businessId !== null 
    ? (typeof businessId === 'string' ? parseInt(businessId as string, 10) : businessId) 
    : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/services" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Quay lại danh sách dịch vụ
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{service.name}</h1>
              
              <div className="flex items-center gap-4 mt-2">
                {service.business && (
                  <Badge variant="outline" className="flex items-center gap-1 hover:bg-accent">
                    <Building className="h-3 w-3" />
                    <Link to={`/business/${service.business.id}`}>
                      {service.business.name || 'Cơ sở không xác định'}
                    </Link>
                  </Badge>
                )}
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {serviceDuration} phút
                </Badge>
                
                {hasRating && formattedRating && (
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>
                      {formattedRating} 
                      ({service.rating?.count || service.review?.count || 0} đánh giá)
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {service.thumbnail && (
              <div className="overflow-hidden rounded-xl">
                <img 
                  src={service.thumbnail} 
                  alt={service.name} 
                  className="w-full object-contain rounded-xl"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            )}
            
            <div className="mt-6">
              <Tabs defaultValue="description">
                <TabsList>
                  <TabsTrigger value="description">Mô tả</TabsTrigger>
                  <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <div className="prose max-w-none">
                    <p>{service.description || 'Không có mô tả cho dịch vụ này.'}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  <ServiceReviews 
                    serviceId={serviceId}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {service && numericBusinessId && (
            <div className="md:col-span-1">
              <div className="sticky top-20">
                <ServiceBooking 
                  serviceId={serviceId}
                  serviceName={service.name}
                  price={finalPrice}
                  duration={serviceDuration}
                  businessId={numericBusinessId}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Dịch vụ tương tự</h3>
          <RecommendedServices 
            currentServiceId={serviceId}
            categoryId={categoryId}
            limit={4}
            city={service.business?.city || ''} // Assuming the city is part of the business object
          />
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetails;
