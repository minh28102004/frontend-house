"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HostCategoryManager from "../components/HostCategoryManager";

const HostCategoriesPage: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/host/store")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <p className="text-sm text-gray-500 mt-1">
            Danh mục riêng của bạn — không trùng với danh mục admin / toàn hệ thống.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <a href="/host" className="text-gray-500 hover:text-green-600">Trang chủ</a>
        <span className="text-gray-400">/</span>
        <a href="/host/store" className="text-gray-500 hover:text-green-600">Cửa hàng</a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">Danh mục</span>
      </div>

      {/* Category Manager */}
      <HostCategoryManager />
    </div>
  );
};

export default HostCategoriesPage;
