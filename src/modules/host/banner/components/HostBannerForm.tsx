"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HostBanner } from "../types";
import { useHostBanners } from "../hooks/useHostBanners";

interface HostBannerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banner?: HostBanner | null;
}

export const HostBannerForm: React.FC<HostBannerFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  banner,
}) => {
  const { createBanner, updateBanner } = useHostBanners();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
    type: "host-banner" as "home" | "home-mobile" | "rooms" | "host-banner",
    isActive: true,
  });

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || "",
        image: banner.image || "",
        link: banner.link || "",
        type: banner.type || "host-banner",
        isActive: banner.isActive ?? true,
      });
    } else {
      setFormData({
        title: "",
        image: "",
        link: "",
        type: "host-banner",
        isActive: true,
      });
    }
  }, [banner, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (banner?._id) {
        await updateBanner(banner._id, formData);
      } else {
        await createBanner(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving banner:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {banner?._id ? "Chỉnh sửa Banner" : "Thêm Banner mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
              placeholder="Nhập tiêu đề banner"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Hình ảnh
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.image && (
              <div className="mt-2 relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => {}}
                />
              </div>
            )}
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link (tùy chọn)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
              placeholder="https://example.com"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại Banner
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors bg-white"
            >
              <option value="host-banner">Host Banner</option>
              <option value="home">Trang chủ</option>
              <option value="home-mobile">Mobile</option>
              <option value="rooms">Phòng</option>
            </select>
          </div>

          {/* Active */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    formData.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
              <span className="ml-3 text-sm text-gray-700">Kích hoạt</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};