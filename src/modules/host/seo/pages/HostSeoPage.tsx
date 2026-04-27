'use client';

import React from 'react';
import { HostSeoForm } from '../components/HostSeoForm';

export const HostSeoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <a href="/host" className="hover:text-green-600 transition-colors">
              Trang chủ
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Cài đặt SEO & Marketing</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt SEO & Marketing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các cài đặt SEO, branding và công cụ marketing cho cửa hàng của bạn
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <HostSeoForm />
      </div>
    </div>
  );
};
