"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HostQrCodeService, UpdateQrSettingsDto } from '../services/qrcode.service';
import { HostQrSettings } from '../types';
import { toast } from '@/common/utils/toast';

export const useHostQrCode = () => {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading: loading,
    error,
    refetch: fetchSettings,
  } = useQuery<HostQrSettings, Error>({
    queryKey: ['host-qr-settings'],
    queryFn: () => HostQrCodeService.getSettings(),
    initialData: {
      vietQr: {
        bankBin: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        template: 'compact',
        isActive: false,
      },
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: UpdateQrSettingsDto) => HostQrCodeService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-qr-settings'] });
      toast.success('LÆ°u cÃ i Ä‘áº·t thÃ nh cÃ´ng');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'LÆ°u cÃ i Ä‘áº·t tháº¥t báº¡i');
    },
  });

  const updateSettings = async (data: UpdateQrSettingsDto) => {
    return updateSettingsMutation.mutateAsync(data);
  };

  return {
    settings: settings || {
      vietQr: {
        bankBin: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        template: 'compact',
        isActive: false,
      },
    },
    loading,
    error,
    saving: updateSettingsMutation.isPending,
    fetchSettings,
    updateSettings,
  };
};

