'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HostSeoService } from '../services/seo.service';
import { HostSeoSettings, HostSeoUpdateDto } from '../types';
import { toast } from '@/common/utils/toast';

export const useHostSeo = () => {
  const queryClient = useQueryClient();

  const {
    data: settings = {} as HostSeoSettings,
    isLoading,
    error,
    refetch: fetchSettings,
  } = useQuery<HostSeoSettings, Error>({
    queryKey: ['host-seo-settings'],
    queryFn: () => HostSeoService.getSettings(),
  });

  const [localSettings, setLocalSettings] = useState<HostSeoSettings>(settings);

  const updateMutation = useMutation({
    mutationFn: (data: HostSeoUpdateDto) => HostSeoService.updateSettings(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['host-seo-settings'] });
      const previousSettings = queryClient.getQueryData<HostSeoSettings>(['host-seo-settings']);
      queryClient.setQueryData<HostSeoSettings>(['host-seo-settings'], (old) => ({
        ...old,
        ...newData,
      }));
      setLocalSettings((prev) => ({ ...prev, ...newData }));
      return { previousSettings };
    },
    onError: (err, newData, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(['host-seo-settings'], context.previousSettings);
      }
      toast.error('Cáº­p nháº­t SEO tháº¥t báº¡i');
    },
    onSuccess: () => {
      toast.success('Cáº­p nháº­t SEO thÃ nh cÃ´ng');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['host-seo-settings'] });
    },
  });

  const updateSettings = useCallback(
    async (data: HostSeoUpdateDto) => {
      await updateMutation.mutateAsync(data);
    },
    [updateMutation]
  );

  return {
    settings: localSettings,
    loading: isLoading,
    error,
    saving: updateMutation.isPending,
    fetchSettings,
    updateSettings,
  };
};

