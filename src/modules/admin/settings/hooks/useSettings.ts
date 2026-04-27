"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SettingsService,
  PaymentSettingsService,
  Setting,
  PaymentSettings,
  VietQrSettings,
} from '../services/settings.service';
import { toast } from '@/common/utils/toast';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const useGetAllSettings = () => {
    return useQuery<Setting[], Error>({
      queryKey: ['admin-settings'],
      queryFn: () => SettingsService.getAll(),
    });
  };

  const useGetSettingsByCategory = (category: string) => {
    return useQuery<Setting[], Error>({
      queryKey: ['admin-settings', category],
      queryFn: () => SettingsService.getByCategory(category),
      enabled: !!category,
    });
  };

  const useGetPaymentSettings = () => {
    return useQuery<PaymentSettings, Error>({
      queryKey: ['admin-payment-settings'],
      queryFn: () => PaymentSettingsService.getPaymentSettings(),
    });
  };

  const useUpdateSetting = () => {
    return useMutation({
      mutationFn: ({ key, data }: { key: string; data: { value: string; description?: string; isActive?: boolean } }) =>
        SettingsService.update(key, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        queryClient.invalidateQueries({ queryKey: ['admin-payment-settings'] });
        toast.success('Cáº­p nháº­t cáº¥u hÃ¬nh thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cáº­p nháº­t cáº¥u hÃ¬nh tháº¥t báº¡i');
      },
    });
  };

  const useSavePaymentSettings = () => {
    return useMutation({
      mutationFn: (data: PaymentSettings) => PaymentSettingsService.savePaymentSettings(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        queryClient.invalidateQueries({ queryKey: ['admin-payment-settings'] });
        toast.success('LÆ°u cáº¥u hÃ¬nh thanh toÃ¡n thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'LÆ°u cáº¥u hÃ¬nh tháº¥t báº¡i');
      },
    });
  };

  const useSaveVnpaySettings = () => {
    return useMutation({
      mutationFn: (vnpay: PaymentSettings['vnpay']) => PaymentSettingsService.saveVnpaySettings(vnpay),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        queryClient.invalidateQueries({ queryKey: ['admin-payment-settings'] });
        toast.success('ÄÃ£ lÆ°u cáº¥u hÃ¬nh VNPay');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'LÆ°u VNPay tháº¥t báº¡i');
      },
    });
  };

  const useSaveVietQrSettings = () => {
    return useMutation({
      mutationFn: (vietqr: VietQrSettings) => PaymentSettingsService.saveVietQrSettings(vietqr),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        queryClient.invalidateQueries({ queryKey: ['admin-payment-settings'] });
        toast.success('ÄÃ£ lÆ°u cáº¥u hÃ¬nh VietQR');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'LÆ°u VietQR tháº¥t báº¡i');
      },
    });
  };

  const useSaveGeneralSettings = () => {
    return useMutation({
      mutationFn: (paymentExpiryMinutes: string) =>
        PaymentSettingsService.saveGeneralSettings(paymentExpiryMinutes),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        queryClient.invalidateQueries({ queryKey: ['admin-payment-settings'] });
        toast.success('ÄÃ£ lÆ°u cáº¥u hÃ¬nh chung');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'LÆ°u cáº¥u hÃ¬nh chung tháº¥t báº¡i');
      },
    });
  };

  const useBulkUpdateSettings = () => {
    return useMutation({
      mutationFn: (settings: { key: string; value: string }[]) =>
        SettingsService.bulkUpdate(settings),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        queryClient.invalidateQueries({ queryKey: ['admin-payment-settings'] });
        toast.success('Cáº­p nháº­t cáº¥u hÃ¬nh thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cáº­p nháº­t cáº¥u hÃ¬nh tháº¥t báº¡i');
      },
    });
  };

  const useInitializeSettings = () => {
    return useMutation({
      mutationFn: () => SettingsService.initialize(),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
        queryClient.invalidateQueries({ queryKey: ['admin-payment-settings'] });
        toast.success(data.message || 'Khá»Ÿi táº¡o cáº¥u hÃ¬nh thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Khá»Ÿi táº¡o cáº¥u hÃ¬nh tháº¥t báº¡i');
      },
    });
  };

  return {
    useGetAllSettings,
    useGetSettingsByCategory,
    useGetPaymentSettings,
    useUpdateSetting,
    useSavePaymentSettings,
    useSaveVnpaySettings,
    useSaveVietQrSettings,
    useSaveGeneralSettings,
    useBulkUpdateSettings,
    useInitializeSettings,
  };
};

