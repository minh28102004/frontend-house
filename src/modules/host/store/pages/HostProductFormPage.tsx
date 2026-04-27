"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import HostProductForm from "../components/HostProductForm";
import { HostProductService } from "../services";
import { HostProduct } from "../types";

const HostProductFormPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string | undefined;
  const isEditMode = slug && slug !== "new";

  const [initialData, setInitialData] = useState<HostProduct | undefined>(undefined);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isEditMode && slug) {
      const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
          const product = await HostProductService.getBySlug(slug);
          setInitialData(product);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Lỗi khi tải sản phẩm");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isEditMode, slug]);

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
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode ? "Cập nhật thông tin sản phẩm" : "Điền thông tin sản phẩm mới"}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <a href="/host" className="text-gray-500 hover:text-green-600">Trang chủ</a>
        <span className="text-gray-400">/</span>
        <a href="/host/store" className="text-gray-500 hover:text-green-600">Cửa hàng</a>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">
          {isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-gray-500">Đang tải thông tin sản phẩm...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p className="font-medium">Đã xảy ra lỗi</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => router.push("/host/store")}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Quay lại cửa hàng
          </button>
        </div>
      )}

      {/* Form */}
      {!loading && !error && (
        <HostProductForm
          initialData={initialData}
          mode={isEditMode ? "edit" : "create"}
        />
      )}
    </div>
  );
};

export default HostProductFormPage;
