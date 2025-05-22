import React, { useState, useEffect } from 'react';
import { useStaff } from '@/hooks/use-staff';
import { useApiAuth } from '@/context/ApiAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateStaffParams, UpdateStaffParams, Staff } from '@/api/services/staffService';
import StaffList from '@/components/staff/StaffList';
import StaffForm from '@/components/staff/StaffForm';
import StaffScheduleManager from '@/components/staff/StaffScheduleManager';
import { Card, CardContent } from '@/components/ui/card';

const BusinessStaff = () => {
  const { user } = useApiAuth();
  const currentRole = user?.role?.toLowerCase() ?? '';
  const isManager = currentRole === 'manager';
  
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    staffList,
    pagination,
    isLoadingStaff,
    refetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    isCreatingStaff,
    isUpdatingStaff,
    isDeletingStaff
  } = useStaff(page, limit);
  
  const [activeTab, setActiveTab] = useState(isManager ? 'staff' : 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Fetch staff list when component mounts or page changes
  useEffect(() => {
    refetchStaff();
  }, [refetchStaff, page]);

  // Filter staff by role
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    // normalize each staff item’s role
    const staffRole = staff.user.role?.toLowerCase() || '';
    // if I’m a manager, only show staff
    if (isManager) {
      return staffRole === 'staff' && matchesSearch;
    }
    if (activeTab === 'all') return matchesSearch;
    return staffRole === activeTab && matchesSearch;
  });

  // Handle adding new staff
  const handleAddStaff = (data: CreateStaffParams) => {
    createStaff(data);
    if (!isCreatingStaff) {
      setIsAddStaffOpen(false);
    }
  };

  // Handle updating staff
  const handleUpdateStaff = (data: UpdateStaffParams) => {
    if (!selectedStaff) return;
    updateStaff(selectedStaff.id, data);
    if (!isUpdatingStaff) {
      setSelectedStaff(null);
    }
  };

  // Handle deleting staff
  const handleDeleteStaff = (staffId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
      deleteStaff(staffId);
    }
  };

  // Handle opening schedule manager
  const handleOpenSchedule = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsScheduleOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
          <p className="text-muted-foreground">Quản lý đội ngũ nhân viên và lịch làm việc</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Add staff dialog */}
          <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm nhân viên mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin nhân viên mới. Mật khẩu sẽ được tạo tự động và gửi qua email.
                </DialogDescription>
              </DialogHeader>
              <StaffForm
                onSubmit={handleAddStaff}
                isSubmitting={isCreatingStaff}
                // force role when manager
                fixedRole={isManager ? 'staff' : undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {!isManager && (
            <>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="manager">Quản lý</TabsTrigger>
            </>
          )}
          <TabsTrigger value="staff">Nhân viên</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoadingStaff ? (
            <Card>
              <CardContent className="p-6 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Đang tải danh sách nhân viên...</span>
              </CardContent>
            </Card>
          ) : (
            <StaffList 
              staffList={filteredStaff} 
              isLoading={isLoadingStaff} 
              onEdit={setSelectedStaff}
              onDelete={handleDeleteStaff}
              onManageSchedule={handleOpenSchedule}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* pagination controls */}
      {pagination && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <Button variant="outline" size="icon" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Edit staff dialog */}
      {selectedStaff && (
        <Dialog 
          open={!!selectedStaff && !isScheduleOpen} 
          onOpenChange={(open) => !open && setSelectedStaff(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
              <DialogDescription>
                Chỉnh sửa vị trí và chuyên môn của nhân viên.
              </DialogDescription>
            </DialogHeader>
            <StaffForm 
              onSubmit={handleUpdateStaff} 
              initialData={{
                position: selectedStaff.position,
                specialization: selectedStaff.specialization
              }}
              isEdit
              isSubmitting={isUpdatingStaff}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Staff schedule dialog */}
      {selectedStaff && (
        <Dialog 
          open={isScheduleOpen} 
          onOpenChange={(open) => { 
            setIsScheduleOpen(open);
            if (!open) setSelectedStaff(null);
          }}
        >
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Lịch làm việc: {selectedStaff.user.fullName}</DialogTitle>
              <DialogDescription>
                Quản lý lịch làm việc hàng tuần của nhân viên.
              </DialogDescription>
            </DialogHeader>
            <StaffScheduleManager staffId={selectedStaff.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BusinessStaff;
