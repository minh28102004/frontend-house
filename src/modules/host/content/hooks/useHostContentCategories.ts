'use client';

import { useState, useCallback } from 'react';
import { HostContentCategory, CreateCategoryData, UpdateCategoryData } from '../types';
import { HostCategoryService } from '../services/category.service';

export const useHostContentCategories = () => {
  const [categories, setCategories] = useState<HostContentCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await HostCategoryService.getAll();
      setCategories(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CreateCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await HostCategoryService.create(data);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi tạo danh mục';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: UpdateCategoryData) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await HostCategoryService.update(id, data);
      setCategories(prev => prev.map(cat => cat._id === id ? updated : cat));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await HostCategoryService.delete(id);
      setCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi xóa';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await HostCategoryService.toggleActive(id);
      setCategories(prev => prev.map(cat => cat._id === id ? updated : cat));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi khi cập nhật';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategory,
  };
};
