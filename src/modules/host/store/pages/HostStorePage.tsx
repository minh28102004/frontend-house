"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHostProducts } from "../hooks";
import HostProductList from "../components/HostProductList";

const HostStorePage: React.FC = () => {
  const router = useRouter();
  const { products, loading } = useHostProducts();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isVisible !== false).length;
  const featuredProducts = products.filter((p) => p.isFeatured).length;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cửa hàng của tôi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Chỉ hiển thị sản phẩm do bạn đăng — không dùng chung kho sản phẩm admin.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/host/store/categories")}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Danh mục
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "-" : totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "-" : activeProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sản phẩm nổi bật</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "-" : featuredProducts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <HostProductList />
    </div>
  );
};

export default HostStorePage;
