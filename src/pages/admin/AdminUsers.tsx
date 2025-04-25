import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Edit, Trash, UserCheck, UserX, Loader2 } from 'lucide-react';
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, UserInfo, PaginationParams } from '@/api/services/adminService';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // User edit state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    status: 'active'
  });
  
  // Delete confirmation state
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Prepare query params
  const queryParams: PaginationParams = {
    page,
    limit,
    search: search || undefined,
    role: role !== 'all' ? role : undefined,
    status: status !== 'all' ? status : undefined
  };

  // Fetch users
  const { 
    data: userData,
    isLoading, 
    error
  } = useQuery({
    queryKey: ['adminUsers', queryParams],
    queryFn: async () => {
      console.log('Fetching users with params:', queryParams);
      const response = await adminService.getAllUsers(queryParams);
      console.log('AdminUsers API response:', response);
      return response;
    }
  });

  // Update user roles mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: (params: { userId: number; role: string }) => {
      console.log('Updating user role:', params);
      return adminService.updateUserRoles(params.userId, params.role);
    },
    onSuccess: (data) => {
      console.log('Role update success:', data);
      toast({
        title: "Thành công",
        description: "Vai trò người dùng đã được cập nhật"
      });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error) => {
      console.error('Role update error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật vai trò người dùng",
        variant: "destructive"
      });
    }
  });
  
  // Update user info mutation
  const updateUserMutation = useMutation({
    mutationFn: (params: { userId: number; userData: any }) => {
      return adminService.updateUser(params.userId, params.userData);
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Thông tin người dùng đã được cập nhật"
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật thông tin người dùng",
        variant: "destructive"
      });
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => {
      return adminService.deleteUser(userId);
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Người dùng đã được xóa"
      });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng",
        variant: "destructive"
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // The useQuery hook will automatically refetch when queryParams change
  };

  // Function to handle role change
  const handleRoleChange = (userId: number, newRole: string) => {
    updateUserRoleMutation.mutate({ userId, role: newRole });
  };
  
  // Function to handle user status change
  const handleStatusChange = (userId: number, newStatus: string) => {
    updateUserMutation.mutate({ 
      userId, 
      userData: { status: newStatus } 
    });
  };
  
  // Function to open edit dialog
  const openEditDialog = (user: UserInfo) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      status: user.status
    });
    setIsEditDialogOpen(true);
  };
  
  // Function to handle form field changes
  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Function to submit user edit form
  const handleEditFormSubmit = () => {
    if (!selectedUser) return;
    
    updateUserMutation.mutate({
      userId: selectedUser.id,
      userData: editFormData
    });
  };
  
  // Function to handle user deletion
  const handleDeleteUser = () => {
    if (userToDelete !== null) {
      deleteUserMutation.mutate(userToDelete);
      setUserToDelete(null);
    }
  };

  // Get users data from the API response
  const users = userData?.users || [];
  console.log('Processed users data:', users);
  const pagination = userData?.pagination;
  console.log('Pagination data:', pagination);

  // Helper function to translate role to Vietnamese
  const translateRole = (role: string) => {
    const roleMap: Record<string, string> = {
      'admin': 'Quản trị viên',
      'owner': 'Chủ doanh nghiệp',
      'manager': 'Quản lý',
      'staff': 'Nhân viên',
      'customer': 'Khách hàng'
    };
    
    return roleMap[role] || role;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm người dùng..." 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select 
          value={role} 
          onValueChange={setRole}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="admin">Quản trị viên</SelectItem>
            <SelectItem value="owner">Chủ doanh nghiệp</SelectItem>
            <SelectItem value="manager">Quản lý</SelectItem>
            <SelectItem value="staff">Nhân viên</SelectItem>
            <SelectItem value="customer">Khách hàng</SelectItem>
          </SelectContent>
        </Select>
        
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
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
              <span className="ml-2">Đang tải dữ liệu người dùng...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-red-500">
              Đã xảy ra lỗi khi tải dữ liệu người dùng
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tên</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Vai trò</th>
                    <th className="text-left py-3 px-4">Trạng thái</th>
                    <th className="text-left py-3 px-4">Ngày tham gia</th>
                    <th className="text-right py-3 px-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user: UserInfo) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={user.fullName} />
                              ) : null}
                              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.fullName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : user.role === 'owner' || user.role === 'manager'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'staff'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {translateRole(user.role)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            {/* Edit User Button */}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            {/* Role Dropdown */}
                            <Select 
                              value={user.role}
                              onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                            >
                              <SelectTrigger className="h-8 w-[120px]">
                                <SelectValue placeholder="Thay đổi vai trò" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Quản trị viên</SelectItem>
                                <SelectItem value="owner">Chủ doanh nghiệp</SelectItem>
                                <SelectItem value="manager">Quản lý</SelectItem>
                                <SelectItem value="staff">Nhân viên</SelectItem>
                                <SelectItem value="customer">Khách hàng</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {/* Status Toggle */}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleStatusChange(
                                user.id, 
                                user.status === 'active' ? 'inactive' : 'active'
                              )}
                              className={user.status === 'active' ? 'text-green-600' : 'text-red-600'}
                            >
                              {user.status === 'active' ? (
                                <UserCheck className="h-4 w-4" />
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                            </Button>
                            
                            {/* Delete User Button */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() => setUserToDelete(user.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Bạn có chắc muốn xóa người dùng này?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Thao tác này không thể hoàn tác. Người dùng {user.fullName} sẽ bị xóa vĩnh viễn khỏi hệ thống.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeleteUser}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center">
                        Không tìm thấy người dùng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {pagination && (
                <div className="flex items-center justify-between mt-4">
                  <div>
                    Hiển thị {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trên {pagination.total} người dùng
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
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật thông tin người dùng</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin cá nhân của người dùng này.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Họ tên
              </Label>
              <Input
                id="fullName"
                value={editFormData.fullName}
                onChange={(e) => handleEditFormChange('fullName', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => handleEditFormChange('email', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={editFormData.phone}
                onChange={(e) => handleEditFormChange('phone', e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Trạng thái
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox 
                  id="active" 
                  checked={editFormData.status === 'active'}
                  onCheckedChange={(checked) => {
                    handleEditFormChange('status', checked ? 'active' : 'inactive');
                  }}
                />
                <Label htmlFor="active">Người dùng đang hoạt động</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              type="submit"
              onClick={handleEditFormSubmit}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
