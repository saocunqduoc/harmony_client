
import { useState, useEffect } from 'react';
import { useBusiness } from '@/hooks/use-business';
import { UpdateBusinessRequest } from '@/api/services/businessService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building, MapPin, ReceiptText, Mail, Phone } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/api/services/locationService';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const BusinessSettingsForm = () => {
  const { 
    business, 
    isLoadingBusiness, 
    refetchBusiness,
    updateBusiness, 
    isUpdatingBusiness,
    uploadBusinessLogo,
    uploadBusinessCover,
    isUploadingLogo,
    isUploadingCover
  } = useBusiness();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [searchProvinceQuery, setSearchProvinceQuery] = useState('');
  const [searchDistrictQuery, setSearchDistrictQuery] = useState('');
  const [searchWardQuery, setSearchWardQuery] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<UpdateBusinessRequest>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      description: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      taxCode: '',
      latitude: '',
      longitude: '',
    }
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

  // Fetch business data when component mounts
  useEffect(() => {
    refetchBusiness();
  }, [refetchBusiness]);

  // Update form values when business data loads
  useEffect(() => {
    if (business) {
      // Reset form with business data
      reset({
        name: business.name || '',
        email: business.email || '',
        phone: business.phone || '',
        description: business.description || '',
        address: business.address || '',
        city: business.city || '',
        district: business.district || '',
        ward: business.ward || '',
        taxCode: business.taxCode || '',
        latitude: business.latitude || '',
        longitude: business.longitude || '',
      });
    }
  }, [business, reset]);

  // Handle province selection
  const handleProvinceChange = (provinceId: number) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId('');

    // Find the province name and set it in the form
    const province = provinces.find(p => p.code === provinceId);
    if (province) {
      setValue('city', province.name);
      setValue('district', '');
      setValue('ward', '');
    }
  };

  // Handle district selection
  const handleDistrictChange = (districtId: number) => {
    setSelectedDistrictId(districtId);
    
    // Find the district name and set it in the form
    const district = districts.find(d => d.code === districtId);
    if (district) {
      setValue('district', district.name);
      setValue('ward', '');
    }
  };

  // Handle ward selection
  const handleWardChange = (wardId: number) => {
    // Find the ward name and set it in the form
    const ward = wards.find(w => w.code === wardId);
    if (ward) {
      setValue('ward', ward.name);
    }
  };

  const onSubmit = (data: UpdateBusinessRequest) => {
    updateBusiness(data);
    setIsEditing(false);
  };

  const handleLogoUpdate = (logoBlob: Blob) => {
    // Convert Blob to File
    const file = new File([logoBlob], 'business-logo.jpg', { type: 'image/jpeg' });
    uploadBusinessLogo(file);
  };

  const handleCoverUpdate = (coverBlob: Blob) => {
    // Convert Blob to File
    const file = new File([coverBlob], 'business-cover.jpg', { type: 'image/jpeg' });
    uploadBusinessCover(file);
  };

  if (isLoadingBusiness) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thông tin doanh nghiệp</CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin doanh nghiệp</CardTitle>
        <CardDescription>Cập nhật thông tin cơ bản của doanh nghiệp</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <CardContent>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="basic">
              <Building className="h-4 w-4 mr-2" />
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger value="visuals">
              <ReceiptText className="h-4 w-4 mr-2" />
              Hình ảnh
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit(onSubmit)} id="basic-info-form">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên doanh nghiệp</Label>
                  <Input
                    id="name"
                    disabled={!isEditing || isUpdatingBusiness}
                    {...register('name', { required: 'Vui lòng nhập tên doanh nghiệp' })}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email liên hệ</Label>
                    <Input
                      id="email"
                      type="email"
                      disabled={!isEditing || isUpdatingBusiness}
                      {...register('email', { 
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email không hợp lệ'
                        }
                      })}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      disabled={!isEditing || isUpdatingBusiness}
                      {...register('phone')}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    disabled={!isEditing || isUpdatingBusiness}
                    className="min-h-32"
                    {...register('description')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    disabled={!isEditing || isUpdatingBusiness}
                    {...register('address')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Thành phố/Tỉnh</Label>
                    {isEditing ? (
                      <Select 
                        onValueChange={handleProvinceChange}
                        disabled={!isEditing || isUpdatingBusiness}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thành phố" />
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
                    ) : (
                      <Input
                        id="city"
                        disabled={true}
                        {...register('city')}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quận/Huyện</Label>
                    {isEditing ? (
                      <Select 
                        onValueChange={handleDistrictChange} 
                        disabled={!selectedProvinceId || !isEditing || isUpdatingBusiness}
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
                    ) : (
                      <Input
                        id="district"
                        disabled={true}
                        {...register('district')}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Phường/Xã</Label>
                    {isEditing ? (
                      <Select 
                        onValueChange={handleWardChange} 
                        disabled={!selectedDistrictId || !isEditing || isUpdatingBusiness}
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
                    ) : (
                      <Input
                        id="ward"
                        disabled={true}
                        {...register('ward')}
                      />
                    )}
                  </div>
                </div>
                
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Vĩ độ (Latitude)</Label>
                    <Input
                      id="latitude"
                      disabled={!isEditing || isUpdatingBusiness}
                      {...register('latitude')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Kinh độ (Longitude)</Label>
                    <Input
                      id="longitude"
                      disabled={!isEditing || isUpdatingBusiness}
                      {...register('longitude')}
                    />
                  </div>
                </div> */}
                
                <div className="space-y-2">
                  <Label htmlFor="taxCode">Mã số thuế</Label>
                  <Input
                    id="taxCode"
                    disabled={!isEditing || isUpdatingBusiness}
                    {...register('taxCode')}
                  />
                </div>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="visuals" className="space-y-6 mt-4">
            <div className="space-y-6">
              <ImageUpload
                label="Logo doanh nghiệp"
                currentImage={business?.logo || null}
                onImageUpdate={handleLogoUpdate}
                aspectRatio={1}
                height={200}
              />
              
              <ImageUpload
                label="Ảnh bìa doanh nghiệp"
                currentImage={business?.coverImage || null}
                onImageUpdate={handleCoverUpdate}
                aspectRatio={16/9}
                height={250}
              />
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {activeTab === "basic" && (
            isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset to original values
                    reset({
                      name: business?.name || '',
                      email: business?.email || '',
                      phone: business?.phone || '',
                      description: business?.description || '',
                      address: business?.address || '',
                      city: business?.city || '',
                      district: business?.district || '',
                      ward: business?.ward || '',
                      taxCode: business?.taxCode || '',
                      latitude: business?.latitude || '',
                      longitude: business?.longitude || '',
                    });
                  }}
                  disabled={isUpdatingBusiness}
                >
                  Hủy
                </Button>
                <Button type="submit" form="basic-info-form" disabled={isUpdatingBusiness}>
                  {isUpdatingBusiness && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Chỉnh sửa thông tin
              </Button>
            )
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
};
