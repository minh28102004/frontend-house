"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHostProducts } from "../hooks";
import { HostProduct } from "../types";

interface HostProductListProps {
  onEdit?: (product: HostProduct) => void;
  onDelete?: (slug: string) => void;
}

const HostProductList: React.FC<HostProductListProps> = ({ onEdit, onDelete }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    deleteProduct,
    toggleFeatured,
  } = useHostProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);

  const pageFromUrl = useMemo(() => {
    const raw = searchParams.get("page");
    const parsed = raw ? Number.parseInt(raw, 10) : 1;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [searchParams]);

  const setPageInUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    fetchProducts(pageFromUrl);
  }, [pageFromUrl, fetchProducts]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      fetchProducts(1);
      return;
    }
    setIsSearching(true);
    await fetchProducts(1, searchTerm);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setDeletingSlug(slug);
      try {
        await deleteProduct(slug);
      } finally {
        setDeletingSlug(null);
      }
    }
  };

  const handleToggleFeatured = async (slug: string) => {
    setTogglingSlug(slug);
    try {
      await toggleFeatured(slug);
    } finally {
      setTogglingSlug(null);
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (typeof price !== "number") return "";
    return price.toLocaleString("vi-VN");
  };

  const getCategoryLine = (product: HostProduct) => {
    const raw =
      product.categoryName ||
      product.category?.name ||
      product.category?.main ||
      product.category?.slug ||
      "";
    return typeof raw === "string" ? raw.trim() : "";
  };

  const pageNumbers = useMemo(() => {
    const total = pagination.totalPages;
    const current = pageFromUrl;
    if (total <= 1) return [] as Array<number | "ellipsis">;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1) as Array<number | "ellipsis">;
    }

    const delta = 1;
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);
    const items: Array<number | "ellipsis"> = [1];

    if (left > 2) items.push("ellipsis");
    for (let p = left; p <= right; p += 1) items.push(p);
    if (right < total - 1) items.push("ellipsis");

    items.push(total);
    return items;
  }, [pagination.totalPages, pageFromUrl]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Tìm kiếm
        </button>
        <button
          onClick={() => router.push("/host/store/products/new")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      )}

      {/* Product Table */}
      {!loading && products.length === 0 && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có sản phẩm nào</h3>
          <p className="text-gray-500 mb-4">Bắt đầu bán hàng bằng cách thêm sản phẩm mới</p>
          <button
            onClick={() => router.push("/host/store/products/new")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Thêm sản phẩm đầu tiên
          </button>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Ảnh
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên sản phẩm
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Giá
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Tồn kho
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Nổi bật
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.slug || product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <img
                        src={product.thumbnail || "/images/default-thumbnail.png"}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {getCategoryLine(product) || "Chưa có danh mục"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {formatPrice(product.currentPrice || product.price)}đ
                      </div>
                      {product.discountPrice && product.discountPrice < (product.currentPrice || product.price) && (
                        <div className="text-xs text-gray-400 line-through">
                          {formatPrice(product.currentPrice || product.price)}đ
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${(product.stock || 0) > 0 ? "text-gray-900" : "text-red-600"}`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.slug!)}
                        disabled={togglingSlug === product.slug}
                        className={`p-1.5 rounded-full transition-colors ${
                          product.isFeatured
                            ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => router.push(`/host/store/products/${product.slug}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug!)}
                          disabled={deletingSlug === product.slug}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Trang {pagination.page} / {pagination.totalPages} ({pagination.total} sản phẩm)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPageInUrl(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                {pageNumbers.map((item, idx) => {
                  if (item === "ellipsis") {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={item}
                      onClick={() => setPageInUrl(item)}
                      className={`px-3 py-1 rounded-lg border text-sm ${
                        item === pagination.page
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPageInUrl(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HostProductList;
