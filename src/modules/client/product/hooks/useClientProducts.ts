"use client";

import { useState, useEffect } from "react";
import {
  getMainCategories,
  getSubCategoriesByParentId,
  getAllCategories,
  getAllProducts,
  getProductsByMainCategory,
  getProductsBySubCategory,
  getCategoryBySlug,
  getProductsByCategorySlug,
  Category,
  Product,
} from "../services/client.product.service";

// Simple in-memory cache for product categories
const productCategoryCache: {
  mainCategories: Category[] | null;
  allCategories: Category[] | null;
  subCategories: Record<string, Category[]>;
} = {
  mainCategories: null,
  allCategories: null,
  subCategories: {},
};

const getCachedMainProductCategories = () => productCategoryCache.mainCategories;
const setCachedMainProductCategories = (data: Category[]) => {
  productCategoryCache.mainCategories = data;
};

const getCachedSubProductCategories = (parentId: string) =>
  productCategoryCache.subCategories[parentId] || null;
const setCachedSubProductCategories = (parentId: string, data: Category[]) => {
  productCategoryCache.subCategories[parentId] = data;
};

const getCachedAllCategories = () => productCategoryCache.allCategories;
const setCachedAllCategories = (data: Category[]) => {
  productCategoryCache.allCategories = data;
};

/**
 * ✅ Hook để lấy tất cả danh mục một lần và cache lại
 * Hỗ trợ tìm subcategories từ dữ liệu đã có thay vì gọi API từng lần
 */
export const useAllCategories = () => {
  const [allCategories, setAllCategories] = useState<Category[]>(
    getCachedAllCategories() || []
  );
  const [loading, setLoading] = useState(!getCachedAllCategories());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getCachedAllCategories()) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const data = await getAllCategories(signal);
        setCachedAllCategories(data);
        setAllCategories(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải danh mục!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  /**
   * Helper function để lấy danh mục cha (level = 0, isActive = true)
   */
  const getMainCategories = (): Category[] => {
    return allCategories.filter(
      (cat) => cat.level === 0 && cat.isActive === true
    );
  };

  /**
   * Helper function để lấy subcategories theo parentId từ dữ liệu đã có
   */
  const getSubCategoriesByParentId = (parentId: string): Category[] => {
    if (!parentId) return [];

    const parentIdStr = parentId.toString();
    return allCategories.filter((cat) => {
      // parentCategory có thể là string (ObjectId) hoặc object (Category)
      const parent = cat.parentCategory;
      if (!parent) return false;

      if (typeof parent === "string") {
        return parent === parentIdStr || parent.toString() === parentIdStr;
      }
      if (typeof parent === "object" && parent !== null) {
        const parentIdFromObj = (parent as Category)._id || (parent as Category).id;
        return parentIdFromObj?.toString() === parentIdStr;
      }
      return false;
    }).filter((cat) => cat.isActive === true)
      .sort((a, b) => {
        // Sắp xếp theo sortOrder nếu có
        const orderA = a.sortOrder ?? 0;
        const orderB = b.sortOrder ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        // Nếu sortOrder bằng nhau, sắp xếp theo tên
        return a.name.localeCompare(b.name);
      });
  };

  /**
   * Helper function để tìm category theo ID
   */
  const getCategoryById = (id: string): Category | undefined => {
    const idStr = id.toString();
    return allCategories.find(
      (cat) => (cat._id || cat.id) === idStr
    );
  };

  return {
    allCategories,
    mainCategories: getMainCategories(),
    getSubCategoriesByParentId,
    getCategoryById,
    loading,
    error,
  };
};

export const useMainCategories = () => {
  const [categories, setCategories] = useState<Category[]>(
    getCachedMainProductCategories() || []
  );
  const [loading, setLoading] = useState(!getCachedMainProductCategories());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getCachedMainProductCategories()) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const data = await getMainCategories(signal);
        setCachedMainProductCategories(data);
        setCategories(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải danh mục!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  return { categories, loading, error };
};

export const useSubCategories = (parentId: string) => {
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!parentId) {
      setSubCategories([]);
      setLoading(false);
      return;
    }

    // Kiểm tra cache trước
    const cachedData = getCachedSubProductCategories(parentId);
    if (cachedData) {
      // Có cache, sử dụng cache ngay
      setSubCategories(cachedData);
      setLoading(false);
      setError(null);
      return;
    }

    // Không có cache, fetch từ API
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const data = await getSubCategoriesByParentId(parentId, signal);
        setCachedSubProductCategories(parentId, data);
        setSubCategories(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải danh mục con!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [parentId]);

  return { subCategories, loading, error };
};

export const useAllProducts = (page: number = 1) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const limit = 18; // Tăng từ 12 lên 18 sản phẩm mỗi trang
        const response = await getAllProducts(page, limit, signal);
        setProducts(response.data);
        setTotalPages(response.totalPages);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải danh sách sản phẩm!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [page]);

  return { products, loading, error, totalPages };
};

export const useProductsByMainCategory = (
  mainCategory: string | null,
  page: number = 1
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      if (!mainCategory) {
        setProducts([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await getProductsByMainCategory(
          mainCategory,
          page,
          controller.signal
        );

        setProducts((prev) =>
          page === 1 ? response.data : [...prev, ...response.data]
        );
        setTotalPages(response.totalPages);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Lỗi khi tải dữ liệu.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [mainCategory, page]);

  return { products, loading: isLoading, error, totalPages };
};

export const useProductsBySubCategory = (
  subCategory: string | null,
  page: number = 1
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subCategory) return;

    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductsBySubCategory(subCategory, page);
        setProducts(response.data);
        setTotalPages(response.totalPages);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(
            err.message || "Không thể tải danh sách sản phẩm theo danh mục phụ!"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [subCategory, page]);

  return { products, loading, error, totalPages };
};

export const useCategoryBySlug = (slug: string | null) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setCategory(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryBySlug(slug, signal);
        setCategory(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải thông tin danh mục!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
    return () => controller.abort();
  }, [slug]);

  return { category, loading, error };
};

export const useProductsByCategory = (
  category: Category | null,
  slug: string | null,
  page: number,
  filters: Record<string, any> = {}
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        if (page === 1) {
          setProducts([]);
        }

        let response;
        const limit = 18; // Tăng từ 12 lên 18 sản phẩm mỗi trang

        if (!slug) {
          response = await getAllProducts(page, limit, controller.signal);
        } else {
          const categoryIdentifier = category?.slug || category?.name || slug;
          response = await getProductsByCategorySlug(
            categoryIdentifier,
            page,
            limit,
            controller.signal
          );
        }

        setProducts(response.data);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("Lỗi khi tải dữ liệu sản phẩm.");
          console.error("Error fetching products:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [category?._id, slug, page]);

  return { products, loading, error, totalPages };
};

/**
 * Hook to fetch category info by slug.
 * @param slug Slug of the category.
 * @returns { category, loading, error }
 */
export function useCategoryBySlugMainAndSubCategory(slug: string, mainCategory: string, subCategory: string, page: number = 1) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    return () => {
      isMounted = false;
    };
  }, [slug, mainCategory, subCategory, page]);

  return { products, loading, error };
}
