
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BusinessLoginForm from '@/components/auth/BusinessLoginForm';
import BusinessRegisterForm from '@/components/auth/BusinessRegisterForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Businesses = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Business Portal</h1>
          <p className="text-muted-foreground">
            Login to your business account or register a new business
          </p>
        </div>
        
        <Tabs defaultValue="login" className="max-w-md mx-auto">
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
      </main>
      <Footer />
    </div>
  );
};

export default Businesses;
