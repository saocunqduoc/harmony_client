
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'Swedish Massage',
    business: 'Tranquil Spa & Wellness',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    price: '$85',
    duration: '60 min',
    rating: 4.9,
    reviews: 124,
    location: 'Downtown',
    category: 'Massage',
  },
  {
    id: 2,
    title: 'Haircut & Styling',
    business: 'Chic Hair Studio',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    price: '$65',
    duration: '45 min',
    rating: 4.8,
    reviews: 89,
    location: 'Westside',
    category: 'Hair',
  },
  {
    id: 3,
    title: 'Manicure & Pedicure',
    business: 'Polished Nail Bar',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b71e1193?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    price: '$50',
    duration: '50 min',
    rating: 4.7,
    reviews: 76,
    location: 'Midtown',
    category: 'Nails',
  },
  {
    id: 4,
    title: 'Hot Stone Massage',
    business: 'Serenity Day Spa',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    price: '$95',
    duration: '75 min',
    rating: 4.9,
    reviews: 102,
    location: 'Riverside',
    category: 'Massage',
  }
];

const FeaturedServices = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Services</h2>
          <Link to="/services">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link key={service.id} to={`/service/${service.id}`}>
              <Card className="service-card overflow-hidden h-full">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-background/90 rounded-full px-2 py-1 text-xs font-medium">
                    {service.category}
                  </div>
                </div>
                <CardHeader className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{service.title}</h3>
                      <p className="text-muted-foreground text-sm">{service.business}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{service.price}</p>
                      <p className="text-xs text-muted-foreground">{service.duration}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center text-sm">
                    <MapPin size={14} className="mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{service.location}</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-muted-foreground"></div>
                    <Clock size={14} className="mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">{service.duration}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-3 flex justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{service.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({service.reviews})</span>
                  </div>
                  <Button size="sm">Book Now</Button>
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
