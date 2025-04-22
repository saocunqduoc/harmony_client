
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BusinessCTA = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-harmony-800 to-harmony-600 rounded-xl p-8 md:p-12 text-white">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Own a Beauty or Wellness Business?</h2>
              <p className="text-white/90 max-w-xl">
                Join Harmony to reach new customers, streamline your booking process, 
                and grow your business. Our platform helps you manage appointments, 
                process payments, and build your online presence.
              </p>
            </div>
            <div>
              <Link to="/business/register">
                <Button size="lg" variant="secondary" className="w-full md:w-auto">
                  List Your Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessCTA;
