"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminBannerService, CreateBannerDto, UpdateBannerDto } from '../services/banner.service';
import { Banner } from '../models/banner.model';
import { toast } from '@/common/utils/toast';

export const useAdminBanner = () => {
  const queryClient = useQueryClient();

  // Query hooks
  const useGetBanners = (type?: string, isActive?: boolean) => {
    return useQuery<Banner[], Error>({
      queryKey: ['admin-banners', type, isActive],
      queryFn: () => AdminBannerService.getBanners(type, isActive),
    });
  };

  const useGetBannerById = (id: string) => {
    return useQuery<Banner, Error>({
      queryKey: ['admin-banner', id],
      queryFn: () => AdminBannerService.getBannerById(id),
      enabled: !!id,
    });
  };

  // Mutation hooks
  const useCreateBanner = () => {
    return useMutation({
      mutationFn: (data: CreateBannerDto) => AdminBannerService.createBanner(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        toast.success('Táº¡o banner thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Táº¡o banner tháº¥t báº¡i');
      },
    });
  };

  const useUpdateBanner = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateBannerDto }) =>
        AdminBannerService.updateBanner(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        toast.success('Cáº­p nháº­t banner thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cáº­p nháº­t banner tháº¥t báº¡i');
      },
    });
  };

  const useUpdateBannerOrder = () => {
    return useMutation({
      mutationFn: ({ id, order }: { id: string; order: number }) =>
        AdminBannerService.updateBannerOrder(id, order),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        toast.success('Cáº­p nháº­t thá»© tá»± banner thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cáº­p nháº­t thá»© tá»± banner tháº¥t báº¡i');
      },
    });
  };

  const useToggleBannerActive = () => {
    return useMutation({
      mutationFn: (id: string) => AdminBannerService.toggleBannerActive(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        toast.success('Cáº­p nháº­t tráº¡ng thÃ¡i banner thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cáº­p nháº­t tráº¡ng thÃ¡i banner tháº¥t báº¡i');
      },
    });
  };

  const useDeleteBanner = () => {
    return useMutation({
      mutationFn: (id: string) => AdminBannerService.deleteBanner(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
        toast.success('XÃ³a banner thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'XÃ³a banner tháº¥t báº¡i');
      },
    });
  };

  return {
    useGetBanners,
    useGetBannerById,
    useCreateBanner,
    useUpdateBanner,
    useUpdateBannerOrder,
    useToggleBannerActive,
    useDeleteBanner,
  };
};
