
import { useApi } from './use-api';
import { 
  staffService, 
  Staff, 
  CreateStaffParams, 
  UpdateStaffParams,
  StaffSchedule,
  CreateScheduleParams,
  UpdateScheduleParams,
  CreateMultipleScheduleParams
} from '@/api/services/staffService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useStaff = () => {
  const { apiQuery, apiMutation, invalidateQueries } = useApi();
  const { user } = useAuth();
  
  const businessId = user?.business?.id;

  // Get all staff for the current business owner
  const { 
    data: staffList = [],
    isLoading: isLoadingStaff,
    refetch: refetchStaff
  } = apiQuery(
    ['staff', 'owner'],
    () => staffService.getOwnerStaff(),
    {
      enabled: !!user && (user?.role === 'owner' || user?.role === 'manager'),
      retry: 1,
    }
  );

  // Get business by ID for viewing other businesses (used on public pages)
  const getStaffByBusiness = (id: number) => {
    return apiQuery(
      ['staff', 'business', id],
      () => staffService.getStaffByBusiness(id),
      {
        enabled: !!id,
      }
    );
  };

  // Create staff mutation
  const createStaffMutation = apiMutation(
    (data: CreateStaffParams) => staffService.createStaff(data),
    {
      onSuccess: () => {
        toast.success('Nhân viên đã được thêm thành công');
        invalidateQueries([['staff', 'owner']]);
      }
    }
  );

  // Update staff mutation
  const updateStaffMutation = apiMutation(
    ({ staffId, params }: { staffId: number; params: UpdateStaffParams }) => 
      staffService.updateStaff(staffId, params),
    {
      onSuccess: () => {
        toast.success('Thông tin nhân viên đã được cập nhật');
        invalidateQueries([['staff', 'owner']]);
      }
    }
  );

  // Delete staff mutation
  const deleteStaffMutation = apiMutation(
    (staffId: number) => staffService.deleteStaff(staffId),
    {
      onSuccess: () => {
        toast.success('Nhân viên đã được xóa thành công');
        invalidateQueries([['staff', 'owner']]);
      }
    }
  );

  // Get staff schedule
  const getStaffSchedule = (staffId: number) => {
    return apiQuery(
      ['staffSchedule', staffId],
      () => staffService.getStaffSchedule(staffId),
      {
        enabled: !!staffId,
      }
    );
  };

  // Create staff schedule mutation
  const createScheduleMutation = apiMutation(
    (data: CreateScheduleParams) => staffService.createStaffSchedule(data),
    {
      onSuccess: (_, variables) => {
        toast.success('Lịch làm việc đã được tạo thành công');
        invalidateQueries([['staffSchedule', variables.staffId]]);
      }
    }
  );

  // Create multiple staff schedules mutation
  const createMultipleSchedulesMutation = apiMutation(
    (data: CreateMultipleScheduleParams) => staffService.createMultipleStaffSchedules(data),
    {
      onSuccess: (_, variables) => {
        toast.success('Lịch làm việc đã được tạo thành công cho nhiều ngày');
        invalidateQueries([['staffSchedule', variables.staffId]]);
      }
    }
  );

  // Update staff schedule mutation
  const updateScheduleMutation = apiMutation(
    ({ scheduleId, params }: { scheduleId: number; params: UpdateScheduleParams }) => 
      staffService.updateStaffSchedule(scheduleId, params),
    {
      onSuccess: () => {
        toast.success('Lịch làm việc đã được cập nhật');
        // Will need to invalidate with proper staffId
        invalidateQueries([['staffSchedule']]);
      }
    }
  );

  // Delete staff schedule mutation
  const deleteScheduleMutation = apiMutation(
    (scheduleId: number) => staffService.deleteStaffSchedule(scheduleId),
    {
      onSuccess: () => {
        toast.success('Lịch làm việc đã được xóa');
        // Will need to invalidate with proper staffId
        invalidateQueries([['staffSchedule']]);
      }
    }
  );

  // Update staff avatar mutation
  const updateAvatarMutation = apiMutation(
    ({ staffId, file }: { staffId: number; file: File }) => 
      staffService.updateStaffAvatar(staffId, file),
    {
      onSuccess: () => {
        toast.success('Ảnh đại diện nhân viên đã được cập nhật');
        invalidateQueries([['staff', 'owner']]);
      }
    }
  );

  return {
    staffList,
    isLoadingStaff,
    refetchStaff,
    getStaffByBusiness,
    createStaff: (data: CreateStaffParams) => createStaffMutation.mutate(data),
    updateStaff: (staffId: number, params: UpdateStaffParams) => 
      updateStaffMutation.mutate({ staffId, params }),
    deleteStaff: (staffId: number) => deleteStaffMutation.mutate(staffId),
    getStaffSchedule,
    createSchedule: (data: CreateScheduleParams) => createScheduleMutation.mutate(data),
    createMultipleSchedules: (data: CreateMultipleScheduleParams) => 
      createMultipleSchedulesMutation.mutate(data),
    updateSchedule: (scheduleId: number, params: UpdateScheduleParams) => 
      updateScheduleMutation.mutate({ scheduleId, params }),
    deleteSchedule: (scheduleId: number) => deleteScheduleMutation.mutate(scheduleId),
    updateAvatar: (staffId: number, file: File) => 
      updateAvatarMutation.mutate({ staffId, file }),
    isCreatingStaff: createStaffMutation.isPending,
    isUpdatingStaff: updateStaffMutation.isPending,
    isDeletingStaff: deleteStaffMutation.isPending,
    isCreatingSchedule: createScheduleMutation.isPending,
    isCreatingMultipleSchedules: createMultipleSchedulesMutation.isPending,
    isUpdatingSchedule: updateScheduleMutation.isPending,
    isDeletingSchedule: deleteScheduleMutation.isPending,
    isUpdatingAvatar: updateAvatarMutation.isPending
  };
};
