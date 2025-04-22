
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessSettingsForm } from '@/components/business/BusinessSettingsForm';
import { BusinessHoursManager } from '@/components/business/BusinessHoursManager';
import { useBusiness } from '@/hooks/use-business';

const BusinessSettings = () => {
  const { user } = useAuth();
  const { business, refetchBusiness, isLoadingBusiness } = useBusiness();
  
  // Fetch business data when component mounts
  useEffect(() => {
    refetchBusiness();
  }, [refetchBusiness]);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cài đặt doanh nghiệp</h1>
        <p className="text-muted-foreground">Quản lý thông tin và cài đặt doanh nghiệp của bạn</p>
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Thông tin doanh nghiệp</TabsTrigger>
          <TabsTrigger value="hours">Giờ làm việc</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="mt-6">
          <BusinessSettingsForm />
        </TabsContent>
        
        <TabsContent value="hours" className="mt-6">
          <BusinessHoursManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessSettings;
