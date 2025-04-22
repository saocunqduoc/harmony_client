
import { useState } from 'react';
import { useApi } from './use-api';
import { 
  businessHoursService, 
  BusinessHours, 
  BusinessHoursRequest, 
  MultipleBusinessHoursRequest 
} from '@/api/services/businessHoursService';
import { toast } from 'sonner';

export const useBusinessHours = (businessId?: string) => {
  const { apiQuery, apiMutation, invalidateQueries } = useApi();
  const [loading, setLoading] = useState(false);

  // Get business hours
  const { 
    data: businessHours = [], 
    isLoading: isLoadingHours,
    refetch: refetchHours
  } = apiQuery(
    ['businessHours', businessId],
    () => businessHoursService.getOwnerHours(),
    {
      enabled: true,
    }
  );

  // Create business hours mutation
  const createHoursMutation = apiMutation(
    (data: BusinessHoursRequest) => businessHoursService.createBusinessHours(data),
    {
      onSuccess: () => {
        toast.success('Giờ làm việc đã được tạo thành công');
        invalidateQueries([['businessHours', businessId]]);
      }
    }
  );

  // Create multiple business hours mutation
  const createMultipleHoursMutation = apiMutation(
    (data: MultipleBusinessHoursRequest) => businessHoursService.addBusinessHoursForMultipleDays(data),
    {
      onSuccess: () => {
        toast.success('Giờ làm việc đã được tạo thành công cho nhiều ngày');
        invalidateQueries([['businessHours', businessId]]);
      }
    }
  );

  // Update business hours mutation
  const updateHoursMutation = apiMutation(
    ({ id, data }: { id: number; data: BusinessHoursRequest }) => 
      businessHoursService.updateBusinessHours(id, data),
    {
      onSuccess: () => {
        toast.success('Giờ làm việc đã được cập nhật');
        invalidateQueries([['businessHours', businessId]]);
      }
    }
  );

  // Delete business hours mutation
  const deleteHoursMutation = apiMutation(
    (id: number) => businessHoursService.deleteBusinessHours(id),
    {
      onSuccess: () => {
        toast.success('Giờ làm việc đã được xóa');
        invalidateQueries([['businessHours', businessId]]);
      }
    }
  );

  return {
    businessHours,
    isLoadingHours,
    refetchHours,
    createHours: (data: BusinessHoursRequest) => createHoursMutation.mutate(data),
    createMultipleHours: (data: MultipleBusinessHoursRequest) => createMultipleHoursMutation.mutate(data),
    updateHours: (id: number, data: BusinessHoursRequest) => updateHoursMutation.mutate({ id, data }),
    deleteHours: (id: number) => deleteHoursMutation.mutate(id),
    isCreatingHours: createHoursMutation.isPending,
    isCreatingMultipleHours: createMultipleHoursMutation.isPending,
    isUpdatingHours: updateHoursMutation.isPending,
    isDeletingHours: deleteHoursMutation.isPending
  };
};
