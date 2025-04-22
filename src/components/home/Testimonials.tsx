
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    text: 'Booking through Harmony has completely changed how I schedule my spa appointments. The interface is intuitive and I love being able to see reviews before booking.',
    service: 'Spa Treatment',
  },
  {
    id: 2,
    name: 'Michael Chen',
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
    rating: 5,
    text: 'As someone with a busy schedule, Harmony makes it so easy to find and book services that fit into my calendar. The reminders are also super helpful!',
    service: 'Haircut & Styling',
  },
  {
    id: 3,
    name: 'Alexis Rivera',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    text: 'I discovered some amazing local salons through Harmony that I wouldn\'t have found otherwise. The booking process is seamless and customer service is excellent.',
    service: 'Manicure & Pedicure',
  },
  {
    id: 4,
    name: 'David Williams',
    image: 'https://randomuser.me/api/portraits/men/62.jpg',
    rating: 5,
    text: 'The convenience of managing all my wellness appointments in one place is fantastic. I particularly appreciate being able to reschedule with just a few taps.',
    service: 'Massage Therapy',
  },
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="h-12 w-12 rounded-full mr-4 object-cover"
          />
          <div>
            <h4 className="font-medium">{testimonial.name}</h4>
            <p className="text-sm text-muted-foreground">{testimonial.service}</p>
          </div>
        </div>
        
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}
            />
          ))}
        </div>
        
        <p className="text-muted-foreground">"{testimonial.text}"</p>
      </CardContent>
    </Card>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-accent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Read testimonials from customers who have used Harmony to book their services
          </p>
        </div>
        
        <Carousel className="w-full">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6">
            <CarouselPrevious className="relative static mr-2" />
            <CarouselNext className="relative static ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
