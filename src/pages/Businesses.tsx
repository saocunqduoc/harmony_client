import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BusinessLoginForm from '@/components/auth/BusinessLoginForm';
import BusinessRegisterForm from '@/components/auth/BusinessRegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BusinessList } from "../components/business/BusinessList";
import { Helmet } from "react-helmet";

const Businesses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Businesses - Harmony Scheduling</title>
      </Helmet>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Business Portal</h1>
          <p className="text-muted-foreground">
            Login to your business account or register a new business
          </p>
        </div>
        
        <Tabs defaultValue="register" className="max-w-md mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <BusinessLoginForm />
          </TabsContent>
          <TabsContent value="register">
            <BusinessRegisterForm />
          </TabsContent>
        </Tabs>

        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Explore Businesses</h1>
            <p className="text-gray-600">Discover businesses available for booking services</p>
          </div>
          
          <BusinessList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Businesses;
