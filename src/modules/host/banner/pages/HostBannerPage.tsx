"use client";
import React from "react";
import { HostBannerList } from "../components/HostBannerList";

export const HostBannerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <a href="/host" className="hover:text-green-600 transition-colors">
              Trang chủ
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Quản lý Banner</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các banner hiển thị trên trang chủ của bạn
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <HostBannerList />
      </div>
    </div>
  );
};