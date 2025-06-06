
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationalPageService } from '@/services/operationalPageService';
import { OperationalPageRecord } from '@/types/operational.types';
import { toast } from '@/hooks/use-toast';

export const useOperationalPages = () => {
  return useQuery({
    queryKey: ['operational-pages'],
    queryFn: operationalPageService.getOperationalPages,
    staleTime: 30000,
  });
};

export const useOperationalPage = (id: string) => {
  return useQuery({
    queryKey: ['operational-page', id],
    queryFn: () => operationalPageService.getOperationalPage(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useUpdateOperationalPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OperationalPageRecord> }) =>
      operationalPageService.updateOperationalPage(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['operational-pages'] });
      queryClient.invalidateQueries({ queryKey: ['operational-page', data.id] });
      toast({
        title: 'Success',
        description: 'Operational page updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update operational page',
        variant: 'destructive',
      });
    },
  });
};

export const useCreateOperationalPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: operationalPageService.createOperationalPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operational-pages'] });
      toast({
        title: 'Success',
        description: 'Operational page created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create operational page',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteOperationalPage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: operationalPageService.deleteOperationalPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operational-pages'] });
      toast({
        title: 'Success',
        description: 'Operational page deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete operational page',
        variant: 'destructive',
      });
    },
  });
};