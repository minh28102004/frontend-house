"use client";

import { useCallback, useEffect, useState } from "react";
import { MapsAdminService, type AdminMapItem } from "../services/maps.service";

interface UseMapsOptions {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export function useMaps(options: UseMapsOptions = {}) {
  const { page: initialPage = 1, limit = 10, isActive } = options;

  const [items, setItems] = useState<AdminMapItem[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await MapsAdminService.getAll(page, limit, isActive);
      setItems(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      setError(e.message || "Lỗi tải danh sách maps");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, isActive]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const create = useCallback(async (payload: Partial<AdminMapItem>) => {
    await MapsAdminService.create(payload);
    await fetchList();
  }, [fetchList]);

  const update = useCallback(async (id: string, payload: Partial<AdminMapItem>) => {
    await MapsAdminService.update(id, payload);
    await fetchList();
  }, [fetchList]);

  const remove = useCallback(async (id: string) => {
    await MapsAdminService.remove(id);
    await fetchList();
  }, [fetchList]);

  return {
    items,
    page,
    total,
    totalPages,
    isLoading,
    error,
    setPage,
    fetchList,
    create,
    update,
    remove,
  };
}

export function useMapDetail(id?: string) {
  const [item, setItem] = useState<AdminMapItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await MapsAdminService.getOne(id);
      setItem(res);
    } catch (e: any) {
      setError(e.message || "Lỗi tải chi tiết maps");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  return { item, isLoading, error, refetch: fetchOne };
}


