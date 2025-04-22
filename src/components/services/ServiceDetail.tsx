import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Award, ArrowLeft, Calendar, Heart, Phone, Mail, Globe, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ServiceBooking from './ServiceBooking';
import { serviceApiService, Service } from '@/api/services/serviceApiService';
import { businessService } from '@/api/services/businessService';
import { useQuery } from '@tanstack/react-query';

interface ServiceDetailProps {
  id?: string | number;
}

const ServiceDetail = ({ id: propId }: ServiceDetailProps) => {
  const { id: paramId } = useParams<{ id: number }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  
  const rawId = propId || paramId;
  const id = rawId ? (typeof rawId === 'string' ? parseInt(rawId, 10) : rawId) : undefined;
  
  console.log('ServiceDetail - Parsed ID:', id, 'Original:', rawId, 'Type:', typeof id);

  const { data: service, isLoading, error } = useQuery({
    queryKey: ['serviceDetail', id],
    queryFn: async () => {
      try {
        if (!id) throw new Error("Invalid service ID");
        const serviceData = await serviceApiService.getServiceById(id);
        return serviceData;
      } catch (error) {
        console.error('Error fetching service details:', error);
        throw error;
      }
    },
    enabled: !!id && !isNaN(Number(id)),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            </div>
            <div className="md:w-1/3">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!service || error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="mb-4 text-red-500">{error ? 'Error loading service' : 'Không tìm thấy dịch vụ này.'}</div>
        <Button onClick={handleGoBack}>Quay lại</Button>
      </div>
    );
  }

  const calculateDisplayPrice = (price: number, discount?: number, discountType?: string) => {
    if (!discount) return price;
    
    if (discountType === 'percent' || discountType === 'percentage') {
      return price * (1 - discount / 100);
    } else if (discountType === 'fixed') {
      return price - discount;
    }
    
    return price;
  };

  const displayPrice = calculateDisplayPrice(service.price, service.discount, service.discountType);

  const serviceIdForBooking = typeof service.id === 'string' ? parseInt(service.id, 10) : service.id;
  const businessIdForBooking = service.business 
    ? (typeof service.business.id === 'string' ? parseInt(service.business.id, 10) : service.business.id) 
    : service.businessId 
      ? (typeof service.businessId === 'string' ? parseInt(service.businessId, 10) : service.businessId) 
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleGoBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      {service.thumbnail && (
        <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
          <img 
            src={service.thumbnail} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{service.name}</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              className={isFavorite ? 'text-red-500' : ''}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <div className="flex items-center mr-4">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              {service.rating?.average || service.review?.averageRating || '0'} ({service.rating?.count || service.review?.count || '0'} đánh giá)
            </div>
            <div className="flex items-center mr-4">
              <Clock className="h-4 w-4 mr-1" />
              {service.duration || '60'} phút
            </div>
            {service.category && (
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                {service.category.name}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Thông tin dịch vụ</h2>
            <p className="text-gray-700 mb-4">{service.description || 'Không có mô tả cho dịch vụ này.'}</p>
            
            <div className="md:hidden mt-6 mb-8">
              <Card className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Giá:</span>
                  <div className="text-right">
                    {service.discount ? (
                      <>
                        <div className="text-green-500 font-bold">
                          {displayPrice.toLocaleString('vi-VN')} VND
                        </div>
                        <div className="text-sm text-muted-foreground line-through">
                          {parseInt(service.price.toString()).toLocaleString('vi-VN')} VND
                        </div>
                      </>
                    ) : (
                      <div className="font-bold">
                        {parseInt(service.price.toString()).toLocaleString('vi-VN')} VND
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {service.business && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Thông tin cửa hàng</h2>
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  {service.business.logo && (
                    <div className="mr-4 w-16 h-16 rounded-full overflow-hidden">
                      <img 
                        src={service.business.logo} 
                        alt={service.business.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium">{service.business.name}</h3>
                    {service.business.address || service.business.city ? (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {service.business.address || service.business.city || 'Địa chỉ không có sẵn'}
                      </div>
                    ) : null}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex flex-col space-y-2">
                  {service.business.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${service.business.phone}`} className="hover:underline">
                        {service.business.phone}
                      </a>
                    </div>
                  )}
                  
                  {service.business.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${service.business.email}`} className="hover:underline">
                        {service.business.email}
                      </a>
                    </div>
                  )}
                  
                  {service.business.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={service.business.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {service.business.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link to={`/business/${service.business.id}`}>
                      <Building className="mr-2 h-4 w-4" />
                      Xem hồ sơ doanh nghiệp
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          )}
          
          <div className="mb-8">
            <Tabs defaultValue="reviews">
              <TabsList>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                <TabsTrigger value="faq">Câu hỏi thường gặp</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews" className="pt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Chưa có đánh giá nào.</p>
                  <Button variant="outline">
                    Viết đánh giá
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="faq" className="pt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chưa có câu hỏi nào.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="md:w-1/3">
          {service && businessIdForBooking && (
            <div className="sticky top-20">
              <Card className="bg-card rounded-lg shadow-sm p-6 mb-6 border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Giá</h3>
                  <div className="flex items-center text-lg font-bold">
                    {service.discount ? (
                      <div className="flex flex-col items-end">
                        <span className="text-green-500">
                          {displayPrice.toLocaleString('vi-VN')} VND
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {service.price.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    ) : (
                      <span>{service.price.toLocaleString('vi-VN')} VND</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Thời gian:</span>
                    <span>{service.duration} phút</span>
                  </div>
                  {service.discount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Giảm giá:</span>
                      {service.discountType === 'fixed' ? (
                        <span className="text-green-500">{service.discount.toLocaleString('vi-VN')} VND</span>
                      ) : (
                        <span className="text-green-500">{service.discount}%</span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
              
              <ServiceBooking 
                serviceId={serviceIdForBooking}
                serviceName={service.name}
                price={displayPrice}
                duration={typeof service.duration === 'string' ? parseInt(service.duration, 10) : service.duration}
                businessId={businessIdForBooking}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
