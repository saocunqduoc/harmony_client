
import React from 'react';
import ServiceSearchBar from './ServiceSearchBar';

interface ServiceHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleApplyFilters: () => void;
}

const ServiceHeader = ({ searchTerm, setSearchTerm, handleApplyFilters }: ServiceHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Tìm dịch vụ phù hợp</h1>
        <p className="text-lg mb-8 mx-auto max-w-2xl">
          Duyệt qua các dịch vụ chăm sóc sắc đẹp và sức khỏe để tìm đúng cái bạn đang tìm kiếm.
        </p>
        <ServiceSearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          handleSearch={handleApplyFilters}
        />
      </div>
    </div>
  );
};

export default ServiceHeader;
