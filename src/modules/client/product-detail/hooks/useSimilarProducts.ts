"use client";

import { useState, useEffect } from "react";
import { getProductsByMainCategory, Product } from "@/modules/client/product/services/client.product.service";

/**
 * Hook để lấy sản phẩm tương tự (cùng danh mục chính, loại trừ sản phẩm hiện tại)
 * @param mainCategory Tên danh mục chính
 * @param currentProductSlug Slug của sản phẩm hiện tại (để loại trừ)
 * @param limit Số lượng sản phẩm tương tự muốn lấy (mặc định là 4, null để lấy tất cả)
 * @returns { products, loading, error }
 */
export const useSimilarProducts = (
  mainCategory: string | undefined,
  currentProductSlug: string,
  limit: number | null = 4
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mainCategory) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSimilarProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let allProducts: Product[] = [];
        let currentPage = 1;
        let hasMore = true;

        // Lấy tất cả sản phẩm từ nhiều trang nếu cần
        while (hasMore) {
          const response = await getProductsByMainCategory(mainCategory, currentPage, signal);

          // Lọc ra sản phẩm tương tự (cùng danh mục chính, loại trừ sản phẩm hiện tại)
          const filteredProducts = response.data.filter(
            (product) => product.slug !== currentProductSlug
          );

          allProducts = [...allProducts, ...filteredProducts];

          // Kiểm tra xem còn trang nào không
          hasMore = currentPage < response.totalPages &&
            (limit === null || allProducts.length < limit);

          // Nếu đã đủ số lượng cần lấy thì dừng
          if (limit !== null && allProducts.length >= limit) {
            allProducts = allProducts.slice(0, limit);
            hasMore = false;
          } else {
            currentPage++;
          }
        }

        setProducts(allProducts);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải sản phẩm tương tự!");
          console.error("Error fetching similar products:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();

    return () => {
      controller.abort();
    };
  }, [mainCategory, currentProductSlug, limit]);

  return { products, loading, error };
};

