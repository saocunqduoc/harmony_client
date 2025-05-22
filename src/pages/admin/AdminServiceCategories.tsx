import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Edit, Trash, Plus, Loader2 } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, ServiceCategoryInfo } from '@/api/services/adminService';
import { useToast } from '@/components/ui/use-toast';

const AdminServiceCategories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryInfo | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    icon: ''
  });

  // Query for categories
  const { 
    data: categoriesData,
    isLoading
  } = useQuery({
    queryKey: ['adminCategories', search, status, page],
    queryFn: () => adminService.getAllCategories({
      search,
      status: status !== 'all' ? status : undefined,
      page,
      limit
    })
  });

  // Create mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: typeof formData) => adminService.createCategory(data),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Danh mục đã được tạo",
      });
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      resetFormData();
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo danh mục",
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<typeof formData> }) => 
      adminService.updateCategory(id, data),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Danh mục đã được cập nhật",
      });
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      resetFormData();
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật danh mục",
        variant: "destructive",
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active',
      icon: ''
    });
  };

  const openCreateDialog = () => {
    resetFormData();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (category: ServiceCategoryInfo) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      status: category.status,
      icon: category.icon || ''
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: ServiceCategoryInfo) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateCategory = () => {
    if (formData.name.trim() === '') {
      toast({
        title: "Thông báo",
        description: "Tên danh mục không được để trống",
        variant: "destructive",
      });
      return;
    }
    
    createCategoryMutation.mutate(formData);
  };

  const handleUpdateCategory = () => {
    if (!selectedCategory) return;
    
    if (formData.name.trim() === '') {
      toast({
        title: "Thông báo",
        description: "Tên danh mục không được để trống",
        variant: "destructive",
      });
      return;
    }
    
    updateCategoryMutation.mutate({
      id: selectedCategory.id,
      data: formData
    });
  };

  // Get categories data safely
  const categories = categoriesData?.items || [];
  const pagination = categoriesData || {
    totalItems: 0,
    totalPages: 1,
    currentPage: page,
    itemsPerPage: limit
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý danh mục dịch vụ</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm danh mục..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={status} 
          onValueChange={setStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          Tìm kiếm
        </Button>
      </form>

      <Card>
        {/* <CardHeader className="pb-2">
          <CardTitle className="text-lg">Danh sách danh mục</CardTitle>
        </CardHeader> */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tên danh mục</th>
                    <th className="text-left py-3 px-4">Mô tả</th>
                    <th className="text-left py-3 px-4">Trạng thái</th>
                    <th className="text-right py-3 px-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? categories.map((category) => (
                    <tr key={category.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">
                        {category.icon && (
                          <span className="mr-2">{category.icon}</span>
                        )}
                        {category.name}
                      </td>
                      <td className="py-3 px-4">
                        {category.description || 'Không có mô tả'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          category.status === 'active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                            : 'bg-red-100 text-red-800 hover:bg-red-100'
                        }>
                          {category.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-6 text-center">
                        Không tìm thấy danh mục nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div>
                    Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trên {pagination.totalItems} danh mục
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= pagination.totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm danh mục dịch vụ mới</DialogTitle>
            <DialogDescription>
              Điền các thông tin bên dưới để tạo danh mục dịch vụ mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                placeholder="Nhập tên danh mục"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description" 
                placeholder="Nhập mô tả về danh mục"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Tùy chọn)</Label>
              <Input 
                id="icon" 
                placeholder="Nhập icon (emoji hoặc mã Unicode)"
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Hủy</Button>
            <Button 
              onClick={handleCreateCategory}
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : 'Tạo danh mục'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin danh mục dịch vụ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên danh mục <span className="text-red-500">*</span></Label>
              <Input 
                id="edit-name" 
                placeholder="Nhập tên danh mục"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description" 
                placeholder="Nhập mô tả về danh mục"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icon (Tùy chọn)</Label>
              <Input 
                id="edit-icon" 
                placeholder="Nhập icon (emoji hoặc mã Unicode)"
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
            <Button 
              onClick={handleUpdateCategory}
              disabled={updateCategoryMutation.isPending}
            >
              {updateCategoryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServiceCategories;