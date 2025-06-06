
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { statusPageComponentsService } from '@/services/statusPageComponentsService';
import { StatusPageComponentRecord } from '@/types/statusPageComponents.types';
import { toast } from '@/hooks/use-toast';

export const useStatusPageComponents = () => {
  return useQuery({
    queryKey: ['status-page-components'],
    queryFn: statusPageComponentsService.getStatusPageComponents,
    staleTime: 30000,
  });
};

export const useStatusPageComponentsByOperationalId = (operationalStatusId: string) => {
  return useQuery({
    queryKey: ['status-page-components', operationalStatusId],
    queryFn: () => statusPageComponentsService.getStatusPageComponentsByOperationalId(operationalStatusId),
    enabled: !!operationalStatusId,
    staleTime: 30000,
  });
};

export const useCreateStatusPageComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: statusPageComponentsService.createStatusPageComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-page-components'] });
      toast({
        title: 'Success',
        description: 'Status page component created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create status page component',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteStatusPageComponent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: statusPageComponentsService.deleteStatusPageComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['status-page-components'] });
      toast({
        title: 'Success',
        description: 'Status page component deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete status page component',
        variant: 'destructive',
      });
    },
  });
};