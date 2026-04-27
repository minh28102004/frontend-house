import { useState, useEffect, useCallback } from "react";
import { FlashSale } from "../models/flash-sale.model";
import { FlashSaleService } from "../services/flash-sale.service";
import { ProductService } from "@/modules/admin/products/services/product.service";
import { Product } from "@/modules/admin/products/models/product.model";

export const useFlashSale = () => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [flashSaleDetail, setFlashSaleDetail] = useState<FlashSale | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 📌 Lấy danh sách flash sale (có phân trang và filter)
  const fetchFlashSales = useCallback(async (
    page: number = 1,
    isActive?: boolean,
  ) => {
    setIsLoading(true);
    try {
      const data = await FlashSaleService.getAll(page, 12, isActive);
      setFlashSales(data.data);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 📌 Lấy danh sách sản phẩm để chọn
  const fetchProducts = useCallback(async () => {
    try {
      const data = await ProductService.getBasicInfo(1, 1000);
      setProducts(data.data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // 📌 Lấy chi tiết flash sale theo slug
  const getFlashSaleBySlug = useCallback(async (slug: string) => {
    setIsLoading(true);
    try {
      const data = await FlashSaleService.getOne(slug);
      setFlashSaleDetail(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 📌 Tạo flash sale mới
  const createFlashSale = useCallback(
    async (flashSale: Partial<FlashSale>) => {
      try {
        await FlashSaleService.create(flashSale);
        await fetchFlashSales();
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [fetchFlashSales]
  );

  // 📌 Cập nhật flash sale
  const updateFlashSale = useCallback(
    async (slug: string, flashSale: Partial<FlashSale>) => {
      try {
        await FlashSaleService.update(slug, flashSale);
        await fetchFlashSales();
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [fetchFlashSales]
  );

  // 📌 Xóa flash sale
  const deleteFlashSale = useCallback(
    async (slug: string) => {
      try {
        await FlashSaleService.remove(slug);
        await fetchFlashSales();
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    },
    [fetchFlashSales]
  );

  // 📌 Gọi API khi component mount
  useEffect(() => {
    fetchProducts();
    fetchFlashSales(1);
  }, [fetchProducts, fetchFlashSales]);

  return {
    flashSales,
    products,
    flashSaleDetail,
    isLoading,
    error,
    currentPage,
    totalPages,
    fetchFlashSales,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
    getFlashSaleBySlug,
    fetchProducts,
  };
};

