
import { useApi } from './use-api';
import { 
  businessService, 
  Business, 
  UpdateBusinessRequest 
} from '@/api/services/businessService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useBusiness = () => {
  const { apiQuery, apiMutation, invalidateQueries } = useApi();
  const { user } = useAuth();
  
  const businessId = user?.business?.id;

  // Get business details using owner endpoint for authenticated business owners
  const { 
    data: business,
    isLoading: isLoadingBusiness,
    refetch: refetchBusiness
  } = apiQuery(
    ['business', 'owner'],
    () => businessService.getBusinessOwner(),
    {
      enabled: !!user && (user.role === 'owner' || user.role === 'manager'),
      retry: 1,
    }
  );

  // Get business by ID for viewing other businesses (used on public pages)
  const getBusinessById = (id: number) => {
    return apiQuery(
      ['business', id],
      () => businessService.getBusinessById(id),
      {
        enabled: !!id,
      }
    );
  };

  // Update business mutation - use the 'owner' endpoint
  const updateBusinessMutation = apiMutation(
    (data: UpdateBusinessRequest) => businessService.updateBusiness(data),
    {
      onSuccess: () => {
        toast.success('Thông tin doanh nghiệp đã được cập nhật');
        invalidateQueries([['business', 'owner']]);
      }
    }
  );

  // Upload business logo
  const uploadBusinessLogoMutation = apiMutation(
    (logoFile: File) => businessService.uploadBusinessLogo(logoFile),
    {
      onSuccess: () => {
        toast.success('Logo doanh nghiệp đã được cập nhật');
        invalidateQueries([['business', 'owner']]);
      }
    }
  );

  // Upload business cover image
  const uploadBusinessCoverMutation = apiMutation(
    (coverFile: File) => businessService.uploadBusinessCover(coverFile),
    {
      onSuccess: () => {
        toast.success('Ảnh bìa doanh nghiệp đã được cập nhật');
        invalidateQueries([['business', 'owner']]);
      }
    }
  );

  // Get business services
  const { 
    data: businessServices = [],
    isLoading: isLoadingServices 
  } = apiQuery(
    ['businessServices', businessId],
    () => businessId 
      ? businessService.getBusinessServices(businessId)
      : Promise.resolve([]),
    {
      enabled: !!businessId,
    }
  );

  return {
    business,
    businessServices,
    isLoadingBusiness,
    isLoadingServices,
    refetchBusiness,
    getBusinessById,
    updateBusiness: (data: UpdateBusinessRequest) => updateBusinessMutation.mutate(data),
    uploadBusinessLogo: (file: File) => uploadBusinessLogoMutation.mutate(file),
    uploadBusinessCover: (file: File) => uploadBusinessCoverMutation.mutate(file),
    isUpdatingBusiness: updateBusinessMutation.isPending,
    isUploadingLogo: uploadBusinessLogoMutation.isPending,
    isUploadingCover: uploadBusinessCoverMutation.isPending
  };
};
