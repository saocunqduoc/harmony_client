import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Service } from '@/api/services/serviceApiService';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ServiceCard from './ServiceCard';
import ServiceCardLoading from './ServiceCardLoading';

interface ServicesListProps {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  fetchServices: () => void;
  handleClearFilters: () => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  isLoading,
  error,
  currentPage,
  totalPages,
  setCurrentPage,
  fetchServices,
  handleClearFilters
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  // keep input in sync with currentPage
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  // Debug log to see the service IDs and types
  console.log('Services in ServicesList:', services.map(s => ({ 
    id: s.id, 
    type: typeof s.id,
    name: s.name
  })));
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ServiceCardLoading key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="py-8">
        <CardContent className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchServices} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (services.length === 0) {
    return (
      <Card className="py-8">
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">Không tìm thấy dịch vụ nào phù hợp với bộ lọc của bạn.</p>
          <Button onClick={handleClearFilters} className="flex items-center">
            Xóa bộ lọc
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            onClick={() => {
              // Debug log when clicking a service
              console.log('Clicked service:', service.id, typeof service.id);
            }}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 gap-2">
          <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 1}>
            Trước
          </Button>
          <span className="text-sm">Trang</span>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={inputPage}
            onChange={(e) => {
              let v = parseInt(e.target.value, 10) || 1;
              if (v < 1) v = 1;
              if (v > totalPages) v = totalPages;
              setInputPage(v);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setCurrentPage(inputPage);
              }
            }}
            className="w-16 text-center p-1"
          />
          <span className="text-sm">/ {totalPages}</span>
          {/* <Button
            variant="outline"
            onClick={() => setCurrentPage(inputPage)}
          >
            Đi tới
          </Button> */}
          <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Tiếp
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
