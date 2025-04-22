
import React from 'react';
import { Search, Calendar, Star } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Discover Services',
    description: 'Browse through a wide range of wellness and beauty services from top-rated providers.'
  },
  {
    icon: Calendar,
    title: 'Book Appointment',
    description: 'Select a convenient time slot and book your appointment with just a few clicks.'
  },
  {
    icon: Star,
    title: 'Enjoy & Review',
    description: 'Enjoy your service and share your experience by leaving a review afterward.'
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How Harmony Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Book your next beauty or wellness appointment in three simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 bg-primary/10 p-4 rounded-full">
                <step.icon size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
