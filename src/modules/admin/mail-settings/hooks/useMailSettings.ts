"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MailSettingsService,
  MailSettings,
  UpdateMailSettingsDto,
} from '../services/mail-settings.service';
import { toast } from '@/common/utils/toast';

export const useMailSettings = () => {
  const queryClient = useQueryClient();

  const useGetMailSettings = () => {
    return useQuery<MailSettings, Error>({
      queryKey: ['admin-mail-settings'],
      queryFn: () => MailSettingsService.get(),
    });
  };

  const useUpdateMailSettings = () => {
    return useMutation({
      mutationFn: (data: UpdateMailSettingsDto) => MailSettingsService.update(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-mail-settings'] });
        toast.success('LÆ°u cáº¥u hÃ¬nh email thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'LÆ°u cáº¥u hÃ¬nh email tháº¥t báº¡i');
      },
    });
  };

  return {
    useGetMailSettings,
    useUpdateMailSettings,
  };
};

