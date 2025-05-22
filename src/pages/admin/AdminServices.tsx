import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, EyeIcon, CheckCircle, XCircle, Loader2, ShieldCheck, ShieldX, CheckSquare } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/api/services/adminService';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';

const AdminServices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [verification, setVerification] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showBatchVerifyDialog, setShowBatchVerifyDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'rejected'>('verified');
  const [rejectReason, setRejectReason] = useState('');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [batchVerificationStatus, setBatchVerificationStatus] = useState<'verified' | 'rejected'>('verified');
  const [batchRejectReason, setBatchRejectReason] = useState('');

  // Query for services
  const { 
    data: servicesData,
    isLoading
  } = useQuery({
    queryKey: ['adminServices', search, status, verification, page],
    queryFn: () => adminService.getAllServices({
      search,
      status: status !== 'all' ? status : undefined,
      // verification: verification !== 'all' ? verification : undefined,
      page,
      limit
    })
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ serviceId, status }: { serviceId: number, status: string }) => 
      adminService.updateServiceStatus(serviceId, status),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Trạng thái dịch vụ đã được cập nhật",
      });
      queryClient.invalidateQueries({ queryKey: ['adminServices'] });
      setShowStatusDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái dịch vụ",
        variant: "destructive",
      });
    }
  });

  // // Verify service mutation
  // const verifyServiceMutation = useMutation({
  //   mutationFn: ({ serviceId, status, reason }: { serviceId: number, status: 'verified' | 'rejected', reason?: string }) => 
  //     adminService.verifyService(serviceId, status, reason),
  //   onSuccess: () => {
  //     toast({
  //       title: "Thành công",
  //       description: verificationStatus === 'verified' 
  //         ? "Dịch vụ đã được xác thực thành công" 
  //         : "Dịch vụ đã bị từ chối xác thực",
  //     });
  //     queryClient.invalidateQueries({ queryKey: ['adminServices'] });
  //     setShowVerifyDialog(false);
  //     setRejectReason('');
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Lỗi",
  //       description: "Không thể xác thực dịch vụ",
  //       variant: "destructive",
  //     });
  //   }
  // });

  // // Batch verify services mutation
  // const batchVerifyServicesMutation = useMutation({
  //   mutationFn: ({ serviceIds, status, reason }: { serviceIds: number[], status: 'verified' | 'rejected', reason?: string }) => 
  //     adminService.batchVerifyServices(serviceIds, status, reason),
  //   onSuccess: () => {
  //     toast({
  //       title: "Thành công",
  //       description: batchVerificationStatus === 'verified' 
  //         ? `${selectedServices.length} dịch vụ đã được xác thực thành công` 
  //         : `${selectedServices.length} dịch vụ đã bị từ chối xác thực`,
  //     });
  //     queryClient.invalidateQueries({ queryKey: ['adminServices'] });
  //     setShowBatchVerifyDialog(false);
  //     setBatchRejectReason('');
  //     setSelectedServices([]);
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Lỗi",
  //       description: "Không thể xác thực dịch vụ hàng loạt",
  //       variant: "destructive",
  //     });
  //   }
  // });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const openStatusUpdateDialog = (service: any, newStatus: string) => {
    setSelectedService(service);
    setNewStatus(newStatus);
    setShowStatusDialog(true);
  };

  const openVerifyDialog = (service: any, status: 'verified' | 'rejected') => {
    setSelectedService(service);
    setVerificationStatus(status);
    setShowVerifyDialog(true);
  };

  const handleUpdateStatus = () => {
    if (selectedService && newStatus) {
      updateStatusMutation.mutate({
        serviceId: selectedService.id,
        status: newStatus
      });
    }
  };

  // const handleVerifyService = () => {
  //   if (selectedService) {
  //     verifyServiceMutation.mutate({
  //       serviceId: selectedService.id,
  //       status: verificationStatus,
  //       reason: verificationStatus === 'rejected' ? rejectReason : undefined
  //     });
  //   }
  // };

  const toggleSelectService = (serviceId: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAllServices = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services.map(service => service.id));
    }
  };

  const openBatchVerifyDialog = (status: 'verified' | 'rejected') => {
    setBatchVerificationStatus(status);
    setShowBatchVerifyDialog(true);
  };

  // const handleBatchVerifyServices = () => {
  //   if (selectedServices.length > 0) {
  //     batchVerifyServicesMutation.mutate({
  //       serviceIds: selectedServices,
  //       status: batchVerificationStatus,
  //       reason: batchVerificationStatus === 'rejected' ? batchRejectReason : undefined
  //     });
  //   }
  // };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  // // Get verification status badge
  // const getVerificationBadge = (verification: string) => {
  //   switch (verification) {
  //     case 'verified':
  //       return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Đã xác thực</Badge>;
  //     case 'rejected':
  //       return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Từ chối</Badge>;
  //     case 'pending':
  //       return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Chờ xác thực</Badge>;
  //     default:
  //       return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Chưa xác thực</Badge>;
  //   }
  // };

  // Get services data safely
  const services = servicesData?.items || [];
  const pagination = servicesData?.pagination || {
    totalItems: 0,
    totalPages: 1,
    currentPage: page,
    itemsPerPage: limit
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý dịch vụ</h1>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm dịch vụ..." 
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
        
        <Select 
          value={verification} 
          onValueChange={setVerification}
        >
          {/* <SelectTrigger className="w-[200px]"> */}
            {/* <SelectValue placeholder="Lọc theo xác thực" /> */}
          {/* </SelectTrigger> */}
          {/* <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="verified">Đã xác thực</SelectItem>
            <SelectItem value="rejected">Từ chối xác thực</SelectItem>
            <SelectItem value="pending">Chờ xác thực</SelectItem>
            <SelectItem value="unverified">Chưa xác thực</SelectItem>
          </SelectContent> */}
        </Select>

        <Button type="submit">
          Tìm kiếm
        </Button>
      </form>

      <Card>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-harmony-600" />
              <span className="ml-2">Đang tải dữ liệu dịch vụ...</span>
            </div>
          ) : (
            <>
              {/* Batch actions */}
              {selectedServices.length > 0 && (
                <div className="bg-muted p-3 rounded-md mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium">{selectedServices.length} dịch vụ được chọn</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600"
                      onClick={() => openBatchVerifyDialog('verified')}
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Xác thực hàng loạt
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-600"
                      onClick={() => openBatchVerifyDialog('rejected')}
                    >
                      <ShieldX className="h-4 w-4 mr-2" />
                      Từ chối hàng loạt
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-gray-600"
                      onClick={() => setSelectedServices([])}
                    >
                      Bỏ chọn tất cả
                    </Button>
                  </div>
                </div>
              )}
            
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 w-8">
                        {/* <div className="flex items-center h-4">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={services.length > 0 && selectedServices.length === services.length}
                            onChange={handleSelectAllServices}
                          />
                        </div> */}
                      </th>
                      <th className="text-left py-3 px-4">Tên dịch vụ</th>
                      <th className="text-left py-3 px-4">Doanh nghiệp</th>
                      <th className="text-left py-3 px-4">Danh mục</th>
                      <th className="text-left py-3 px-4">Giá</th>
                      <th className="text-left py-3 px-4">Trạng thái</th>
                      {/* <th className="text-left py-3 px-4">Xác thực</th> */}
                      <th className="text-right py-3 px-4">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length > 0 ? services.map((service) => (
                      <tr key={service.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-2 w-8">
                          {/* <div className="flex items-center h-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => toggleSelectService(service.id)}
                              // Only allow selection of services that aren't already verified or rejected
                              disabled={service.verification === 'verified' || service.verification === 'rejected'}
                            />
                          </div> */}
                        </td>
                        <td className="py-3 px-4 font-medium">{service.name}</td>
                        <td className="py-3 px-4">{service.business?.name || 'N/A'}</td>
                        <td className="py-3 px-4">{service.category?.name || 'N/A'}</td>
                        <td className="py-3 px-4">{formatPrice(service.price)}</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            service.status === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : 'bg-red-100 text-red-800 hover:bg-red-100'
                          }>
                            {service.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </Badge>
                        </td>
                        {/* <td className="py-3 px-4">
                          {getVerificationBadge(service.verification || 'unverified')}
                        </td> */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={service.status === 'active' ? 'text-red-500' : 'text-green-500'}
                              onClick={() => openStatusUpdateDialog(
                                service, 
                                service.status === 'active' ? 'inactive' : 'active'
                              )}
                            >
                              {service.status === 'active' ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            
                            {/* Verify buttons - only show if not already verified or rejected */}
                            {/* {service.verification !== 'verified' && service.verification !== 'rejected' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-blue-500"
                                  onClick={() => openVerifyDialog(service, 'verified')}
                                  title="Xác thực dịch vụ"
                                >
                                  <ShieldCheck className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-orange-500"
                                  onClick={() => openVerifyDialog(service, 'rejected')}
                                  title="Từ chối xác thực"
                                >
                                  <ShieldX className="h-4 w-4" />
                                </Button>
                              </>
                            )} */}
                            
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/service/${service.id}`}>
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Xem
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={8} className="py-6 text-center">
                          Không tìm thấy dịch vụ nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trên {pagination.totalItems} dịch vụ
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
                      {/* new page number buttons */}
                      {Array.from({ length: pagination.totalPages }, (_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page >= pagination.totalPages}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newStatus === 'active' ? 'Kích hoạt dịch vụ' : 'Vô hiệu hóa dịch vụ'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {newStatus === 'active'
                ? `Bạn có chắc chắn muốn kích hoạt dịch vụ "${selectedService?.name}"?`
                : `Bạn có chắc chắn muốn vô hiệu hóa dịch vụ "${selectedService?.name}"?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateStatus}
              disabled={updateStatusMutation.isPending}
              className={newStatus === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                newStatus === 'active' ? 'Kích hoạt' : 'Vô hiệu hóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Verification Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationStatus === 'verified' ? 'Xác thực dịch vụ' : 'Từ chối xác thực'}
            </DialogTitle>
            <DialogDescription>
              {verificationStatus === 'verified'
                ? `Bạn có chắc chắn muốn xác thực dịch vụ "${selectedService?.name}"?`
                : `Vui lòng cung cấp lý do từ chối xác thực dịch vụ "${selectedService?.name}".`
              }
            </DialogDescription>
          </DialogHeader>

          {verificationStatus === 'rejected' && (
            <div className="py-4">
              <Textarea
                placeholder="Lý do từ chối xác thực..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowVerifyDialog(false)}
            >
              Hủy
            </Button>
            {/* <Button
              onClick={handleVerifyService}
              disabled={verificationStatus === 'rejected' && !rejectReason.trim() || verifyServiceMutation.isPending}
              className={verificationStatus === 'verified' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              {verifyServiceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                verificationStatus === 'verified' ? 'Xác thực' : 'Từ chối xác thực'
              )}
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Verification Dialog */}
      <Dialog open={showBatchVerifyDialog} onOpenChange={setShowBatchVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {batchVerificationStatus === 'verified' ? 'Xác thực hàng loạt' : 'Từ chối xác thực hàng loạt'}
            </DialogTitle>
            <DialogDescription>
              {batchVerificationStatus === 'verified'
                ? `Bạn có chắc chắn muốn xác thực ${selectedServices.length} dịch vụ đã chọn?`
                : `Vui lòng cung cấp lý do từ chối xác thực ${selectedServices.length} dịch vụ đã chọn.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {batchVerificationStatus === 'rejected' && (
            <Textarea
              placeholder="Lý do từ chối xác thực..."
              value={batchRejectReason}
              onChange={(e) => setBatchRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBatchVerifyDialog(false)}
            >
              Hủy
            </Button>
            {/* <Button
              onClick={handleBatchVerifyServices}
              disabled={
                batchVerifyServicesMutation.isPending || 
                (batchVerificationStatus === 'rejected' && !batchRejectReason.trim())
              }
              className={batchVerificationStatus === 'verified' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'}
            >
              {batchVerifyServicesMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                batchVerificationStatus === 'verified' ? 'Xác thực' : 'Từ chối'
              )}
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;
