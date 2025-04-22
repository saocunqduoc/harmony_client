
import { useApi } from './use-api';
import { 
  serviceApiService, 
  Service, 
  ServiceRequest, 
  ServiceQueryParams 
} from '@/api/services/serviceApiService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useServices = () => {
  const { apiQuery, apiMutation, invalidateQueries } = useApi();
  const { user } = useAuth();
  
  const businessId = user?.business?.id;

  // Get business services
  const getBusinessServices = (params?: ServiceQueryParams) => {
    return apiQuery(
      ['businessOwnerServices', JSON.stringify(params)],
      () => serviceApiService.getBusinessOwnerServices(params),
      {
        enabled: true,
      }
    );
  };

  // Create service mutation
  const createServiceMutation = apiMutation(
    (data: ServiceRequest) => serviceApiService.createService(data),
    {
      onSuccess: () => {
        toast.success('Dịch vụ đã được tạo thành công');
        invalidateQueries([['businessOwnerServices']]);
      }
    }
  );

  // Update service mutation
  const updateServiceMutation = apiMutation(
    ({ id, data }: { id: number; data: Partial<ServiceRequest> }) => 
      serviceApiService.updateService(id, data),
    {
      onSuccess: () => {
        toast.success('Dịch vụ đã được cập nhật');
        invalidateQueries([['businessOwnerServices']]);
        invalidateQueries([['serviceDetail']]);
      }
    }
  );

  // Delete service mutation
  const deleteServiceMutation = apiMutation(
    (id: number) => serviceApiService.deleteService(id),
    {
      onSuccess: () => {
        toast.success('Dịch vụ đã được xóa');
        invalidateQueries([['businessOwnerServices']]);
      }
    }
  );

  // Get service detail
  const getServiceDetail = (id: number) => {
    return apiQuery(
      ['serviceDetail', id],
      () => serviceApiService.getServiceById(id),
      {
        enabled: !!id,
      }
    );
  };

  return {
    getBusinessServices,
    getServiceDetail,
    createService: (data: ServiceRequest) => createServiceMutation.mutate(data),
    updateService: (id: number, data: Partial<ServiceRequest>) => 
      updateServiceMutation.mutate({ id, data }),
    deleteService: (id: number) => deleteServiceMutation.mutate(id),
    isCreatingService: createServiceMutation.isPending,
    isUpdatingService: updateServiceMutation.isPending,
    isDeletingService: deleteServiceMutation.isPending
  };
};
