import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/use-api';
import { 
  Input, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter, 
  Textarea, 
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  RadioGroup,
  RadioGroupItem
} from '@/components/ui';
import { 
  Search, 
  Plus, 
  PencilLine, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowLeft, ArrowRight, Image as ImageIcon,
  PercentIcon,
  DollarSign
} from 'lucide-react';
import { serviceApiService, Service, ServiceRequest } from '@/api/services/serviceApiService';
import { serviceCategoryService, ServiceCategory } from '@/api/services/serviceCategoryService';
import { toast } from 'sonner';

interface UserWithBusiness {
  id: number;
  business?: {
    id: number;
  };
}

const BusinessServices = () => {
  const { user } = useAuth();
  const { apiQuery, apiMutation, invalidateQueries } = useApi();
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [editThumbnailPreview, setEditThumbnailPreview] = useState<string | null>(null);
  
  const [newService, setNewService] = useState<Partial<ServiceRequest>>({
    name: '',
    description: '',
    price: 0,
    duration: 60,
    categoryId: 0,
    discount: 0,
    discountType: 'percentage'
  });
  
  const [editService, setEditService] = useState<Partial<ServiceRequest>>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);

  const typedUser = user as unknown as UserWithBusiness;
  const businessId = typedUser?.business?.id;

  const { 
    data: servicesResponse, 
    isLoading: isLoadingServices,
    refetch: refetchServices
  } = apiQuery(
    ['businessServices', JSON.stringify({ page, limit, search: searchTerm })],
    () => serviceApiService.getBusinessOwnerServices({ 
      page: page.toString(), 
      limit: limit.toString(),
      search: searchTerm || undefined
    }),
    {
      enabled: true,
    }
  );
  
  const services = servicesResponse?.services || [];
  const totalPages = servicesResponse?.totalPages || 1;

  const { data: categoriesResponse } = apiQuery(
    ['serviceCategories'],
    () => serviceCategoryService.getAllServiceCategories(),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
  
  const categories = categoriesResponse?.serviceCategories || [];

  const createServiceMutation = apiMutation(
    (serviceData: ServiceRequest) => serviceApiService.createService(serviceData),
    {
      onSuccess: () => {
        toast.success('Dịch vụ đã được tạo thành công');
        setIsAddOpen(false);
        resetNewServiceForm();
        invalidateQueries([['businessServices']]);
      }
    }
  );

  const updateServiceMutation = apiMutation(
    ({ id, data }: { id: number; data: Partial<ServiceRequest> }) => 
      serviceApiService.updateService(id, data),
    {
      onSuccess: () => {
        toast.success('Dịch vụ đã được cập nhật');
        setIsEditOpen(false);
        setSelectedService(null);
        setEditService({});
        setEditThumbnailPreview(null);
        setEditThumbnailFile(null);
        invalidateQueries([['businessServices']]);
      }
    }
  );

  const deleteServiceMutation = apiMutation(
    (id: number) => serviceApiService.deleteService(id),
    {
      onSuccess: () => {
        toast.success('Dịch vụ đã được xóa');
        invalidateQueries([['businessServices']]);
      }
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetchServices();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const handleNewServiceChange = (key: keyof ServiceRequest, value: any) => {
    if (key === 'categoryId') {
      const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
      setNewService(prev => ({ ...prev, [key]: numericValue }));
    } else {
      setNewService(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleEditServiceChange = (key: keyof ServiceRequest, value: any) => {
    if (key === 'categoryId') {
      const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
      setEditService(prev => ({ ...prev, [key]: numericValue }));
    } else {
      setEditService(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateDiscount = (price: number, discount: number, discountType: string): boolean => {
    if (discountType === 'percentage' && discount >= 100) {
      toast.error('Giảm giá theo phần trăm phải nhỏ hơn 100%');
      return false;
    }
    
    if (discountType === 'fixed' && discount >= price) {
      toast.error('Giảm giá cứng phải nhỏ hơn giá dịch vụ');
      return false;
    }
    
    return true;
  };

  const createService = () => {
    if (!newService.name || !newService.price || !newService.duration || !newService.categoryId) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newService.discount && newService.discountType) {
      if (!validateDiscount(newService.price, newService.discount, newService.discountType)) {
        return;
      }
    }

    const formData: ServiceRequest = {
      ...newService as ServiceRequest,
      thumbnail: thumbnailFile || undefined
    };

    createServiceMutation.mutate(formData);
  };

  const updateService = () => {
    if (!selectedService) return;
    
    const formData: Partial<ServiceRequest> = { ...editService };
    
    if (editService.discount !== undefined && editService.discountType && editService.price) {
      if (!validateDiscount(editService.price, editService.discount, editService.discountType)) {
        return;
      }
    }
    
    if (editThumbnailFile) {
      formData.thumbnail = editThumbnailFile;
    }
    
    const serviceId = typeof selectedService.id === 'string' 
      ? parseInt(selectedService.id, 10) 
      : selectedService.id;
      
    updateServiceMutation.mutate({ 
      id: serviceId, 
      data: formData 
    });
  };

  const deleteService = (id: number | string) => {
    if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      deleteServiceMutation.mutate(numericId);
    }
  };

  const resetNewServiceForm = () => {
    setNewService({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      categoryId: 0,
      discount: 0,
      discountType: 'percentage'
    });
    setThumbnailPreview(null);
    setThumbnailFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setEditService({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      categoryId: service.categoryId,
      discount: service.discount || 0,
      discountType: service.discountType || 'percentage'
    });
    setEditThumbnailPreview(service.thumbnail || null);
    setIsEditOpen(true);
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản lý dịch vụ</h1>
          <p className="text-muted-foreground">Xem và quản lý các dịch vụ của doanh nghiệp</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm dịch vụ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm dịch vụ mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết về dịch vụ mới của bạn
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Tên dịch vụ</Label>
                <Input 
                  id="name" 
                  placeholder="Nhập tên dịch vụ" 
                  value={newService.name}
                  onChange={(e) => handleNewServiceChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea 
                  id="description" 
                  placeholder="Mô tả chi tiết về dịch vụ" 
                  value={newService.description}
                  onChange={(e) => handleNewServiceChange('description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VNĐ)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    min="0"
                    value={newService.price}
                    onChange={(e) => handleNewServiceChange('price', Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Thời lượng (phút)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    min="15" 
                    step="15"
                    value={newService.duration}
                    onChange={(e) => handleNewServiceChange('duration', Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select 
                  value={newService.categoryId} 
                  onValueChange={(value) => handleNewServiceChange('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.map((category: ServiceCategory) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Loại giảm giá</Label>
                <RadioGroup 
                  value={newService.discountType} 
                  onValueChange={(value) => handleNewServiceChange('discountType', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="flex items-center">
                      <PercentIcon className="h-4 w-4 mr-1" />
                      Giảm theo phần trăm (%)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Giảm giá cứng (VND)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Giảm giá {newService.discountType === 'percentage' ? '(%)' : '(VND)'}</Label>
                <Input 
                  id="discount" 
                  type="number" 
                  min="0"
                  max={newService.discountType === 'percentage' ? "99" : undefined}
                  value={newService.discount}
                  onChange={(e) => handleNewServiceChange('discount', Number(e.target.value))}
                />
                {newService.discountType === 'percentage' && (
                  <p className="text-xs text-muted-foreground">* Giảm giá theo phần trăm phải nhỏ hơn 100%</p>
                )}
                {newService.discountType === 'fixed' && (
                  <p className="text-xs text-muted-foreground">* Giảm giá cứng phải nhỏ hơn giá dịch vụ</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Hình ảnh</Label>
                <div className="flex items-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Chọn ảnh
                  </Button>
                  <Input 
                    id="thumbnail" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleThumbnailChange}
                  />
                  {thumbnailPreview ? (
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Chưa chọn ảnh</span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
              <Button 
                type="submit" 
                onClick={createService}
                disabled={createServiceMutation.isPending}
              >
                {createServiceMutation.isPending ? 'Đang tạo...' : 'Tạo dịch vụ'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="max-w-sm"
            />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          {isLoadingServices ? (
            <div className="text-center p-4">Đang tải...</div>
          ) : services.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-lg text-muted-foreground mb-4">Không tìm thấy dịch vụ nào</p>
              <Button onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm dịch vụ đầu tiên
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Tên dịch vụ</th>
                    <th className="text-left py-3 px-4 font-medium">Danh mục</th>
                    <th className="text-right py-3 px-4 font-medium">Giá</th>
                    <th className="text-right py-3 px-4 font-medium">Thời lượng</th>
                    <th className="text-right py-3 px-4 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {service.thumbnail ? (
                            <img 
                              src={service.thumbnail} 
                              alt={service.name} 
                              className="w-10 h-10 rounded object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{service.name}</p>
                            {service.description && (
                              <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {service.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {service.category ? service.category.name : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {service.discount ? (
                          <div>
                            <span className="text-green-500">{formatCurrency(service.price - (service.discountType === 'fixed' ? service.discount : (service.price * service.discount / 100)))}</span>
                            <div className="text-xs text-muted-foreground line-through">
                              {formatCurrency(service.price)}
                            </div>
                          </div>
                        ) : (
                          formatCurrency(service.price)
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {service.duration} phút
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(service)}
                          >
                            <PencilLine className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteService(service.id)}
                            disabled={deleteServiceMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {totalPages > 1 && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Trang {page} / {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho dịch vụ
            </DialogDescription>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên dịch vụ</Label>
                <Input 
                  id="edit-name" 
                  placeholder="Nhập tên dịch vụ" 
                  value={editService.name || ''}
                  onChange={(e) => handleEditServiceChange('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea 
                  id="edit-description" 
                  placeholder="Mô tả chi tiết về dịch vụ" 
                  value={editService.description || ''}
                  onChange={(e) => handleEditServiceChange('description', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Giá (VNĐ)</Label>
                  <Input 
                    id="edit-price" 
                    type="number" 
                    min="0"
                    value={editService.price || 0}
                    onChange={(e) => handleEditServiceChange('price', Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Thời lượng (phút)</Label>
                  <Input 
                    id="edit-duration" 
                    type="number" 
                    min="15" 
                    step="15"
                    value={editService.duration || 60}
                    onChange={(e) => handleEditServiceChange('duration', Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Danh mục</Label>
                <Select 
                  value={editService.categoryId || ''} 
                  onValueChange={(value) => handleEditServiceChange('categoryId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.map((category: ServiceCategory) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Loại giảm giá</Label>
                <RadioGroup 
                  value={editService.discountType || 'percentage'} 
                  onValueChange={(value) => handleEditServiceChange('discountType', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="edit-percentage" />
                    <Label htmlFor="edit-percentage" className="flex items-center">
                      <PercentIcon className="h-4 w-4 mr-1" />
                      Giảm theo phần trăm (%)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="edit-fixed" />
                    <Label htmlFor="edit-fixed" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Giảm giá cứng (VND)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-discount">Giảm giá {editService.discountType === 'fixed' ? '(VND)' : '(%)'}</Label>
                <Input 
                  id="edit-discount" 
                  type="number" 
                  min="0"
                  max={editService.discountType === 'percentage' ? "99" : undefined}
                  value={editService.discount || 0}
                  onChange={(e) => handleEditServiceChange('discount', Number(e.target.value))}
                />
                {editService.discountType === 'percentage' && (
                  <p className="text-xs text-muted-foreground">* Giảm giá theo phần trăm phải nhỏ hơn 100%</p>
                )}
                {editService.discountType === 'fixed' && (
                  <p className="text-xs text-muted-foreground">* Giảm giá cứng phải nhỏ hơn giá dịch vụ</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-thumbnail">Hình ảnh</Label>
                <div className="flex items-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Thay đổi ảnh
                  </Button>
                  <Input 
                    id="edit-thumbnail" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    ref={editFileInputRef}
                    onChange={handleEditThumbnailChange}
                  />
                  {editThumbnailPreview ? (
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <img 
                        src={editThumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Không có ảnh</span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
            <Button 
              type="submit" 
              onClick={updateService}
              disabled={updateServiceMutation.isPending}
            >
              {updateServiceMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessServices;
