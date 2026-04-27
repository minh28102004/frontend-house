"use client";

import { useState, useCallback } from "react";
import { HostProduct, PaginationInfo } from "../types";
import { HostProductService } from "../services";

interface UseHostProductsReturn {
  products: HostProduct[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  fetchProducts: (page?: number, search?: string) => Promise<void>;
  createProduct: (data: Partial<HostProduct>) => Promise<HostProduct>;
  updateProduct: (slug: string, data: Partial<HostProduct>) => Promise<HostProduct>;
  deleteProduct: (slug: string) => Promise<void>;
  toggleFeatured: (slug: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

export const useHostProducts = (): UseHostProductsReturn => {
  const [products, setProducts] = useState<HostProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchProducts = useCallback(async (page: number = 1, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await HostProductService.getAll(page, 12, search);
      setProducts(result.data || []);
      setPagination({
        page: result.page || page,
        limit: 12,
        total: result.total || 0,
        totalPages: result.totalPages || 1,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi tải sản phẩm";
      setError(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: Partial<HostProduct>): Promise<HostProduct> => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await HostProductService.create(data);
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi tạo sản phẩm";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (slug: string, data: Partial<HostProduct>): Promise<HostProduct> => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await HostProductService.update(slug, data);
      setProducts((prev) =>
        prev.map((p) => (p.slug === slug ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi cập nhật sản phẩm";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (slug: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await HostProductService.delete(slug);
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi xóa sản phẩm";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (slug: string): Promise<void> => {
    try {
      const product = products.find((p) => p.slug === slug);
      if (!product) return;

      await HostProductService.update(slug, { isFeatured: !product.isFeatured });
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug ? { ...p, isFeatured: !p.isFeatured } : p
        )
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi cập nhật trạng thái nổi bật";
      setError(message);
      throw err;
    }
  }, [products]);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    try {
      return await HostProductService.uploadImage(file);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi upload ảnh";
      setError(message);
      throw err;
    }
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    uploadImage,
  };
};
