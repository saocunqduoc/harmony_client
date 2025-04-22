
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'spa',
    name: 'Spa',
    icon: '💆‍♀️',
    count: 120,
  },
  {
    id: 'hair',
    name: 'Hair Salon',
    icon: '💇‍♀️',
    count: 85,
  },
  {
    id: 'nails',
    name: 'Nail Salon',
    icon: '💅',
    count: 64,
  },
  {
    id: 'massage',
    name: 'Massage',
    icon: '🧖‍♀️',
    count: 92,
  },
  {
    id: 'facial',
    name: 'Facial',
    icon: '👩‍⚕️',
    count: 48,
  },
  {
    id: 'yoga',
    name: 'Yoga',
    icon: '🧘‍♀️',
    count: 37,
  },
  {
    id: 'gym',
    name: 'Gym',
    icon: '🏋️‍♀️',
    count: 56,
  },
  {
    id: 'makeup',
    name: 'Makeup',
    icon: '💄',
    count: 29,
  },
];

const Categories = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore our selection of beauty and wellness categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/services?category=${category.id}`}>
              <Card className="service-card h-full hover:bg-accent/50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <span className="text-3xl mb-3">{category.icon}</span>
                  <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} services</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
