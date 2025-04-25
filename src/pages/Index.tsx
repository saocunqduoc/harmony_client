import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedServices from '@/components/home/FeaturedServices';
import HowItWorks from '@/components/home/HowItWorks';
import Categories from '@/components/home/Categories';
import Testimonials from '@/components/home/Testimonials';
import BusinessCTA from '@/components/home/BusinessCTA';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedServices />
        <HowItWorks />
        <Categories />
        <Testimonials />
        <BusinessCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
