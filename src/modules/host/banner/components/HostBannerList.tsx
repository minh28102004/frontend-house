"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useHostBanners } from "../hooks/useHostBanners";
import { HostBanner } from "../types";
import { HostBannerForm } from "./HostBannerForm";

export const HostBannerList: React.FC = () => {
  const { banners, loading, error, deleteBanner, toggleBanner } = useHostBanners();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<HostBanner | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  const handleEdit = (banner: HostBanner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setBannerToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (bannerToDelete) {
      deleteBanner(bannerToDelete);
      setShowDeleteConfirm(false);
      setBannerToDelete(null);
    }
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedBanner(null);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      home: "Trang chủ",
      "home-mobile": "Mobile",
      rooms: "Phòng",
      "host-banner": "Host Banner",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-sm text-gray-500 mt-1">Tổng cộng: {banners.length} banner</p>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium flex items-center gap-2"
          onClick={handleAdd}
        >
          <span>+</span>
          <span>Thêm banner mới</span>
        </button>
      </div>

      {/* Banner Grid */}
      {banners.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg mt-4">Chưa có banner nào</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            Tạo banner đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Banner Preview */}
              <div className="relative w-full aspect-video bg-gray-100">
                {banner.image ? (
                  <Image
                    src={banner.image}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">Không có hình ảnh</span>
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      banner.isActive
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {banner.isActive ? "Đang hoạt động" : "Tạm ẩn"}
                  </span>
                </div>
              </div>

              {/* Banner Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {banner.title || "Không có tiêu đề"}
                    </h3>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    {getTypeLabel(banner.type)}
                  </span>
                  {banner.link && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      Có link
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleBanner(banner._id!)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      banner.isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        banner.isActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id!)}
                      className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <HostBannerForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBanner(null);
          }}
          onSuccess={handleSuccess}
          banner={selectedBanner}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa banner này?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBannerToDelete(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded transition-colors"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};