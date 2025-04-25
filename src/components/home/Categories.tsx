import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ServiceCategory, serviceCategoryService } from '@/api/services/serviceCategoryService';
import { Skeleton } from '@/components/ui/skeleton';
import { getIconByCategory } from '@/utils/categoryIcons';

const Categories = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await serviceCategoryService.getServiceCategories({
          limit: 8 // Limit to 8 categories for display
        });
        setCategories(response.serviceCategories || []);
      } catch (err) {
        console.error('Error fetching service categories:', err);
        setError('Không thể tải danh mục');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error || (categories.length === 0 && !isLoading)) {
    return null; // Don't show section if there's an error or no categories
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Duyệt Theo Danh Mục</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Khám phá bộ sưu tập danh mục làm đẹp và chăm sóc sức khỏe của chúng tôi
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading ? (
            // Show skeleton loading UI
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Skeleton className="h-12 w-12 rounded-full mb-3" />
                  <Skeleton className="h-6 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            // Show actual categories
            categories.map((category) => (
              <Link key={category.id} to={`/services?category=${category.id}&sort=name_asc`}>
                <Card className="service-card h-full hover:bg-accent/50">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <span className="text-3xl mb-3">{category.icon || getIconByCategory(category.name)}</span>
                    <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.serviceCount || ' '}</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
