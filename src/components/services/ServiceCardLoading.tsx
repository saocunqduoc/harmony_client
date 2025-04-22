
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceCardLoading = () => {
  return (
    <Card className="overflow-hidden h-full">
      <Skeleton className="h-36 w-full" />
      <CardContent className="p-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <div className="flex items-center mt-1">
          <Skeleton className="h-3 w-3 rounded-full mr-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
      <CardFooter className="px-3 py-2 border-t flex justify-between items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-7 w-16" />
      </CardFooter>
    </Card>
  );
};

export default ServiceCardLoading;
