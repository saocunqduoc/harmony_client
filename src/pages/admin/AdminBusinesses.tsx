import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building, CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, BusinessInfo, PaginationParams } from '@/api/services/adminService';
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

const AdminBusinesses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Prepare query params
  const queryParams: PaginationParams = {
    page,
    limit,
    search: search || undefined,
    status: status !== 'all' ? status : undefined
  };

  // Fetch businesses
  const { 
    data: businessesData,
    isLoading, 
    error
  } = useQuery({
    queryKey: ['adminBusinesses', queryParams],
    queryFn: () => adminService.getAllBusinesses(queryParams)
  });

  // Business status update mutation would need to be implemented on the backend
  // For now, we'll simulate this with a toast notification
  const updateBusinessStatusMutation = useMutation({
    mutationFn: async ({ businessId, newStatus }: { businessId: number; newStatus: string }) => {
      // This would be a real API call in a complete implementation
      return await adminService.updateBusinessStatus(businessId, newStatus);
      // For now, let's simulate success
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Trạng thái doanh nghiệp đã được cập nhật"
      });
      queryClient.invalidateQueries({ queryKey: ['adminBusinesses'] });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái doanh nghiệp",
        variant: "destructive"
      });
    }
  });

  const handleStatusChange = (businessId: number, newStatus: string) => {
    updateBusinessStatusMutation.mutate({ businessId, newStatus });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // The useQuery hook will automatically refetch when queryParams change
  };

  // Get businesses data from the API response
  const businesses = businessesData?.businesses || [];
  const pagination = businessesData?.pagination;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý doanh nghiệp</h1>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm doanh nghiệp..." 
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
            <SelectItem value="pending">Đang chờ duyệt</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit">
          Tìm kiếm
        </Button>
      </form>

      <Card>
        {/* <CardHeader className="pb-2">
          <CardTitle className="text-lg">Doanh nghiệp</CardTitle>
        </CardHeader> */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
              <span className="ml-2">Đang tải dữ liệu doanh nghiệp...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-red-500">
              Đã xảy ra lỗi khi tải dữ liệu doanh nghiệp
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tên doanh nghiệp</th>
                    <th className="text-left py-3 px-4">Chủ sở hữu</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Địa chỉ</th>
                    <th className="text-left py-3 px-4">Trạng thái</th>
                    <th className="text-left py-3 px-4">Ngày tạo</th>
                    <th className="text-right py-3 px-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.length > 0 ? (
                    businesses.map((business: BusinessInfo) => (
                      <tr key={business.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{business.name}</td>
                        <td className="py-3 px-4">{business.owner?.fullName || "N/A"}</td>
                        <td className="py-3 px-4">{business.email || business.owner?.email}</td>
                        <td className="py-3 px-4">{business.address + ', ' + business.ward+ ', ' + business.district + ', ' + business.city}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${
                            business.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : business.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : business.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {business.status === 'active' ? 'Hoạt động' : 
                             business.status === 'inactive' ? 'Không hoạt động' : 
                             business.status === 'pending' ? 'Đang chờ duyệt' : business.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(business.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Link to={`/business/${business.id}`}>
                              <Button variant="outline" size="sm" className="text-blue-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            
                            {business.status === 'pending' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Duyệt doanh nghiệp</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bạn có chắc chắn muốn duyệt doanh nghiệp này? Việc này sẽ kích hoạt doanh nghiệp và gửi thông báo qua email.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleStatusChange(business.id, 'active')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Duyệt
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            
                            {business.status === 'active' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Vô hiệu hóa doanh nghiệp</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bạn có chắc chắn muốn vô hiệu hóa doanh nghiệp này? Việc này sẽ tạm dừng doanh nghiệp và gửi thông báo qua email.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleStatusChange(business.id, 'inactive')}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Vô hiệu hóa
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            
                            {business.status === 'inactive' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-green-600"
                                onClick={() => handleStatusChange(business.id, 'active')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center">
                        Không tìm thấy doanh nghiệp nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {pagination && (
                <div className="flex items-center justify-between mt-4">
                  <div>
                    Hiển thị {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trên {pagination.total} doanh nghiệp
                  </div>
                  <div className="flex gap-2 items-center">
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
                    {/* Jump to page input */}
                    <Input
                      type="number"
                      min={1}
                      max={pagination.totalPages}
                      value={page}
                      onChange={(e) => setPage(Number(e.target.value))}
                      className="w-16 text-center"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBusinesses;
