
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/api/client";
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions 
} from "@tanstack/react-query";

/**
 * Custom hook to simplify API requests with React Query
 */
export const useApi = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Enhanced query hook with error handling
   */
  const apiQuery = <TData, TError = ApiError>(
    queryKey: string[],
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError, TData, string[]>, "queryKey" | "queryFn">
  ) => {
    return useQuery({
      queryKey,
      queryFn,
      ...options,
      meta: {
        ...options?.meta,
        onError: (error: any) => {
          // Show error toast if error occurs
          if (error instanceof ApiError) {
            toast({
              title: "Error",
              description: error.message || "An error occurred",
              variant: "destructive",
            });
          }
        }
      }
    });
  };

  /**
   * Enhanced mutation hook with error handling
   */
  const apiMutation = <TData, TVariables, TError = ApiError>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">
  ) => {
    return useMutation({
      mutationFn,
      ...options,
      onError: (error: any, variables, context) => {
        // Show error toast if not handled elsewhere
        if (error instanceof ApiError) {
          toast({
            title: "Error",
            description: error.message || "An error occurred",
            variant: "destructive",
          });
        }
        // Call the original onError if provided
        if (options?.onError) {
          options.onError(error as TError, variables, context);
        }
      }
    });
  };

  /**
   * Invalidate multiple query keys
   */
  const invalidateQueries = (queryKeys: string[][]) => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  return {
    apiQuery,
    apiMutation,
    invalidateQueries,
    queryClient
  };
};
