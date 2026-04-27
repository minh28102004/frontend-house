"use client";

import { useCallback, useState } from "react";
import toast from "@/common/utils/toast";
import { hostCouponService } from "../services/coupon.service";
import { CreateCouponData, HostCoupon, HostCouponStats, UpdateCouponData } from "../types";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseHostCouponsReturn {
  coupons: HostCoupon[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  stats: HostCouponStats | null;
  fetchCoupons: (page?: number, filter?: { status?: string }) => Promise<void>;
  createCoupon: (data: CreateCouponData) => Promise<HostCoupon | null>;
  updateCoupon: (id: string, data: UpdateCouponData) => Promise<HostCoupon | null>;
  deleteCoupon: (id: string) => Promise<boolean>;
  toggleCoupon: (id: string) => Promise<HostCoupon | null>;
}

export function useHostCoupons(): UseHostCouponsReturn {
  const [coupons, setCoupons] = useState<HostCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<HostCouponStats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchCoupons = useCallback(async (page = 1, filter?: { status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hostCouponService.getAll(page, pagination.limit, filter);
      setCoupons(response.items || []);
      setPagination({
        page: response.page || page,
        limit: response.limit || pagination.limit,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / (response.limit || pagination.limit)),
      });
      const statsData = await hostCouponService.getStats();
      setStats(statsData);
    } catch (err: any) {
      const message = err?.message || "Lỗi khi tải danh sách mã giảm giá";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  const createCoupon = useCallback(async (data: CreateCouponData): Promise<HostCoupon | null> => {
    setLoading(true);
    try {
      const newCoupon = await hostCouponService.create(data);
      toast.success("Đã tạo mã giảm giá thành công");
      return newCoupon;
    } catch (err: any) {
      const message = err?.message || "Lỗi khi tạo mã giảm giá";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoupon = useCallback(async (id: string, data: UpdateCouponData): Promise<HostCoupon | null> => {
    setLoading(true);
    try {
      const updatedCoupon = await hostCouponService.update(id, data);
      toast.success("Đã cập nhật mã giảm giá");
      return updatedCoupon;
    } catch (err: any) {
      const message = err?.message || "Lỗi khi cập nhật mã giảm giá";
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCoupon = useCallback(async (id: string): Promise<boolean> => {
    try {
      await hostCouponService.delete(id);
      toast.success("Đã xóa mã giảm giá");
      return true;
    } catch (err: any) {
      const message = err?.message || "Lỗi khi xóa mã giảm giá";
      toast.error(message);
      return false;
    }
  }, []);

  const toggleCoupon = useCallback(async (id: string): Promise<HostCoupon | null> => {
    try {
      const updatedCoupon = await hostCouponService.toggleStatus(id);
      toast.success("Đã thay đổi trạng thái mã giảm giá");
      return updatedCoupon;
    } catch (err: any) {
      const message = err?.message || "Lỗi khi thay đổi trạng thái";
      toast.error(message);
      return null;
    }
  }, []);

  return {
    coupons,
    loading,
    error,
    pagination,
    stats,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCoupon,
  };
}
