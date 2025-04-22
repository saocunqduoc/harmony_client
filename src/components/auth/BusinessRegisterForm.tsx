
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { businessService } from '@/api/services/businessService';
import { locationService } from '@/api/services/locationService';

const businessRegisterSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  ward: z.string().min(1, 'Please select a ward'),
  district: z.string().min(1, 'Please select a district'),
  city: z.string().min(1, 'Please select a city'),
});

type BusinessRegisterFormValues = z.infer<typeof businessRegisterSchema>;

const BusinessRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [searchProvinceQuery, setSearchProvinceQuery] = useState('');
  const [searchDistrictQuery, setSearchDistrictQuery] = useState('');
  const [searchWardQuery, setSearchWardQuery] = useState('');
  const navigate = useNavigate();

  const form = useForm<BusinessRegisterFormValues>({
    resolver: zodResolver(businessRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
    },
  });

  // Fetch provinces
  const { data: provincesData } = useQuery({
    queryKey: ['provinces', searchProvinceQuery],
    queryFn: () => locationService.getProvinces({ 
      query: searchProvinceQuery, 
      page: 0, 
      size: 63 
    }),
  });

  // Fetch districts based on selected province
  const { data: districtsData } = useQuery({
    queryKey: ['districts', selectedProvinceId, searchDistrictQuery],
    queryFn: () => locationService.getDistricts(
      selectedProvinceId, 
      { query: searchDistrictQuery }
    ),
    enabled: !!selectedProvinceId,
  });

  // Fetch wards based on selected district
  const { data: wardsData } = useQuery({
    queryKey: ['wards', selectedDistrictId, searchWardQuery],
    queryFn: () => locationService.getWards(
      selectedDistrictId, 
      { query: searchWardQuery }
    ),
    enabled: !!selectedDistrictId,
  });

  const provinces = provincesData?.data || [];
  const districts = districtsData?.data || [];
  const wards = wardsData?.data || [];

  // Handle province selection
  const handleProvinceChange = (provinceId: number) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId('');

    // Find the province name and set it in the form
    const province = provinces.find(p => p.code === provinceId);
    if (province) {
      form.setValue('city', province.name);
      form.setValue('district', '');
      form.setValue('ward', '');
    }
  };

  // Handle district selection
  const handleDistrictChange = (districtId: number) => {
    setSelectedDistrictId(districtId);
    
    // Find the district name and set it in the form
    const district = districts.find(d => d.code === districtId);
    if (district) {
      form.setValue('district', district.name);
      form.setValue('ward', '');
    }
  };

  // Handle ward selection
  const handleWardChange = (wardId: number) => {
    // Find the ward name and set it in the form
    const ward = wards.find(w => w.code === wardId);
    if (ward) {
      form.setValue('ward', ward.name);
    }
  };

  const onSubmit = async (values: BusinessRegisterFormValues) => {
    try {
      setIsLoading(true);
      
      // Make sure all required values are passed
      const businessData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        ward: values.ward,
        district: values.district,
        city: values.city,
      };
      
      await businessService.applyBusiness(businessData);
      
      toast.success('Business registration successful', {
        description: 'Your business application has been submitted for review. You will be notified when it is approved.'
      });
      
      navigate('/businesses');
    } catch (error) {
      console.error('Business registration failed:', error);
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Business Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl>
                  <Input placeholder="business@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={handleProvinceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <Input 
                    placeholder="Search provinces..."
                    className="mb-2"
                    value={searchProvinceQuery}
                    onChange={(e) => setSearchProvinceQuery(e.target.value)}
                  />
                  {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.city && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.city.message}</p>
              )}
            </FormItem>
            
            <FormItem>
              <FormLabel>District</FormLabel>
              <Select 
                onValueChange={handleDistrictChange} 
                disabled={!selectedProvinceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <Input 
                    placeholder="Search districts..."
                    className="mb-2"
                    value={searchDistrictQuery}
                    onChange={(e) => setSearchDistrictQuery(e.target.value)}
                  />
                  {districts.map((district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.district && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.district.message}</p>
              )}
            </FormItem>
            
            <FormItem>
              <FormLabel>Ward</FormLabel>
              <Select 
                onValueChange={handleWardChange} 
                disabled={!selectedDistrictId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  <Input 
                    placeholder="Search wards..."
                    className="mb-2"
                    value={searchWardQuery}
                    onChange={(e) => setSearchWardQuery(e.target.value)}
                  />
                  {wards.map((ward) => (
                    <SelectItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.ward && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.ward.message}</p>
              )}
            </FormItem>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Apply to Register Business'}
          </Button>
        </form>
      </Form>
      
      <div className="text-sm text-center text-muted-foreground">
        By applying, your business will be reviewed by our team before approval.
      </div>
    </div>
  );
};

export default BusinessRegisterForm;
