"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HostBannerService, CreateBannerDto, UpdateBannerDto } from '../services/banner.service';
import { HostBanner } from '../types';
import { toast } from '@/common/utils/toast';

export const useHostBanners = () => {
  const queryClient = useQueryClient();

  // Get all banners
  const {
    data: banners = [],
    isLoading,
    error,
    refetch: fetchBanners,
  } = useQuery<HostBanner[], Error>({
    queryKey: ['host-banners'],
    queryFn: () => HostBannerService.getBanners(),
  });

  // Create banner mutation
  const createBannerMutation = useMutation({
    mutationFn: (data: CreateBannerDto) => HostBannerService.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-banners'] });
      toast.success('Táº¡o banner thÃ nh cÃ´ng');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Táº¡o banner tháº¥t báº¡i');
    },
  });

  // Update banner mutation
  const updateBannerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerDto }) =>
      HostBannerService.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-banners'] });
      toast.success('Cáº­p nháº­t banner thÃ nh cÃ´ng');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cáº­p nháº­t banner tháº¥t báº¡i');
    },
  });

  // Delete banner mutation
  const deleteBannerMutation = useMutation({
    mutationFn: (id: string) => HostBannerService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-banners'] });
      toast.success('XÃ³a banner thÃ nh cÃ´ng');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'XÃ³a banner tháº¥t báº¡i');
    },
  });

  // Toggle banner active mutation
  const toggleBannerMutation = useMutation({
    mutationFn: (id: string) => HostBannerService.toggleBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-banners'] });
      toast.success('Cáº­p nháº­t tráº¡ng thÃ¡i thÃ nh cÃ´ng');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Cáº­p nháº­t tráº¡ng thÃ¡i tháº¥t báº¡i');
    },
  });

  // Helper functions
  const createBanner = async (data: CreateBannerDto) => {
    return createBannerMutation.mutateAsync(data);
  };

  const updateBanner = async (id: string, data: UpdateBannerDto) => {
    return updateBannerMutation.mutateAsync({ id, data });
  };

  const deleteBanner = async (id: string) => {
    return deleteBannerMutation.mutateAsync(id);
  };

  const toggleBanner = async (id: string) => {
    return toggleBannerMutation.mutateAsync(id);
  };

  return {
    banners,
    loading: isLoading,
    error,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBanner,
  };
};
