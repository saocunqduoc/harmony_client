
import React, { useState, useEffect } from 'react';
import { useStaff } from '@/hooks/use-staff';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Search, Loader2 } from 'lucide-react';
import { CreateStaffParams, UpdateStaffParams, Staff } from '@/api/services/staffService';
import StaffList from '@/components/staff/StaffList';
import StaffForm from '@/components/staff/StaffForm';
import StaffScheduleManager from '@/components/staff/StaffScheduleManager';
import { Card, CardContent } from '@/components/ui/card';

const BusinessStaff = () => {
  const { user } = useAuth();
  
  const {
    staffList,
    isLoadingStaff,
    refetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    isCreatingStaff,
    isUpdatingStaff,
    isDeletingStaff
  } = useStaff();
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Fetch staff list when component mounts
  useEffect(() => {
    refetchStaff();
  }, [refetchStaff]);

  // Filter staff by role
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return staff.user.role === activeTab && matchesSearch;
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
              <StaffForm onSubmit={handleAddStaff} isSubmitting={isCreatingStaff} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="manager">Quản lý</TabsTrigger>
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
