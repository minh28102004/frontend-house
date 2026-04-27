"use client";

import { useState, useCallback, useEffect } from "react";
import { HostCategory } from "../types";
import { HostCategoryService } from "../services";

interface UseHostCategoriesReturn {
  categories: HostCategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  mainCategories: HostCategory[];
  getSubCategories: (parentId: string) => Promise<HostCategory[]>;
}

export const useHostCategories = (): UseHostCategoriesReturn => {
  const [categories, setCategories] = useState<HostCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await HostCategoryService.getAll();
      setCategories(result || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi tải danh mục";
      setError(message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const mainCategories = categories.filter((cat) => cat.level === 0 || !cat.parentId);

  const getSubCategories = useCallback(async (parentId: string): Promise<HostCategory[]> => {
    try {
      const result = await HostCategoryService.getSubCategories(parentId);
      return result;
    } catch (err) {
      console.error("Lỗi khi lấy danh mục con:", err);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    mainCategories,
    getSubCategories,
  };
};
