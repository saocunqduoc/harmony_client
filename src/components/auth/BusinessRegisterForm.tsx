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
  name: z.string().min(2, 'Tên doanh nghiệp phải có ít nhất 2 ký tự'),
  email: z.string().email('Vui lòng nhập một email hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  ward: z.string().min(1, 'Vui lòng chọn phường/xã'),
  district: z.string().min(1, 'Vui lòng chọn quận/huyện'),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
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

  // Lấy danh sách tỉnh/thành phố
  const { data: provincesData } = useQuery({
    queryKey: ['provinces', searchProvinceQuery],
    queryFn: () => locationService.getProvinces({ 
      query: searchProvinceQuery, 
      page: 0, 
      size: 63 
    }),
  });

  // Lấy danh sách quận/huyện dựa trên tỉnh/thành phố đã chọn
  const { data: districtsData } = useQuery({
    queryKey: ['districts', selectedProvinceId, searchDistrictQuery],
    queryFn: () => locationService.getDistricts(
      selectedProvinceId, 
      { query: searchDistrictQuery }
    ),
    enabled: !!selectedProvinceId,
  });

  // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
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

  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = (provinceId: number) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId('');

    // Tìm tên tỉnh/thành phố và đặt vào form
    const province = provinces.find(p => p.code === provinceId);
    if (province) {
      form.setValue('city', province.name);
      form.setValue('district', '');
      form.setValue('ward', '');
    }
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (districtId: number) => {
    setSelectedDistrictId(districtId);
    
    // Tìm tên quận/huyện và đặt vào form
    const district = districts.find(d => d.code === districtId);
    if (district) {
      form.setValue('district', district.name);
      form.setValue('ward', '');
    }
  };

  // Xử lý khi chọn phường/xã
  const handleWardChange = (wardId: number) => {
    // Tìm tên phường/xã và đặt vào form
    const ward = wards.find(w => w.code === wardId);
    if (ward) {
      form.setValue('ward', ward.name);
    }
  };

  const onSubmit = async (values: BusinessRegisterFormValues) => {
    try {
      setIsLoading(true);
      
      // Đảm bảo tất cả các giá trị cần thiết được truyền vào
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
      
      // toast.success('Đăng ký doanh nghiệp thành công', {
      //   description: 'Đơn đăng ký của bạn đã được gửi để xem xét. Bạn sẽ được thông báo khi đơn được phê duyệt.'
      // });
      
      navigate('/businesses');
    } catch (error) {
      console.error('Business registration failed:', error);
      // toast.error('Đăng ký thất bại', {
      //   description: error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn'
      // });
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
                <FormLabel>Tên doanh nghiệp</FormLabel>
                <FormControl>
                  <Input placeholder="Tên doanh nghiệp của bạn" {...field} />
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
                <FormLabel>Email doanh nghiệp</FormLabel>
                <FormControl>
                  <Input placeholder="doanhnghiep@example.com" type="email" {...field} />
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
                <FormLabel>Điện thoại doanh nghiệp</FormLabel>
                <FormControl>
                  <Input placeholder="Số điện thoại" {...field} />
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
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Địa chỉ đường phố" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormItem>
              <FormLabel>Tỉnh/Thành phố</FormLabel>
              <Select onValueChange={handleProvinceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <Input 
                    placeholder="Tìm tỉnh/thành phố..."
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
              <FormLabel>Quận/Huyện</FormLabel>
              <Select 
                onValueChange={handleDistrictChange} 
                disabled={!selectedProvinceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  <Input 
                    placeholder="Tìm quận/huyện..."
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
              <FormLabel>Phường/Xã</FormLabel>
              <Select 
                onValueChange={handleWardChange} 
                disabled={!selectedDistrictId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  <Input 
                    placeholder="Tìm phường/xã..."
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
            {isLoading ? 'Đang gửi...' : 'Đăng ký doanh nghiệp'}
          </Button>
        </form>
      </Form>
      
      <div className="text-sm text-center text-muted-foreground">
        Khi đăng ký, doanh nghiệp của bạn sẽ được đội ngũ của chúng tôi xem xét trước khi phê duyệt.
      </div>
    </div>
  );
};

export default BusinessRegisterForm;
