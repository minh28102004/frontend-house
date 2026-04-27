'use client';

import React from 'react';
import { HostSeoSettings } from '../types';

interface SeoPreviewProps {
  settings: Partial<HostSeoSettings>;
}

export const SeoPreview: React.FC<SeoPreviewProps> = ({ settings }) => {
  const title = settings.metaTitle || settings.storeName || 'Tiêu đề trang của bạn';
  const description = settings.metaDescription || settings.storeDescription || 'Mô tả meta sẽ hiển thị ở đây. Hãy viết mô tả ngắn gọn và hấp dẫn để thu hút người dùng nhấp vào.';
  const url = settings.canonicalUrl || 'https://your-store.com';

  const truncatedTitle = title.length > 60 ? title.slice(0, 60) + '...' : title;
  const truncatedDesc = description.length > 160 ? description.slice(0, 160) + '...' : description;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Xem trước Google Search</h3>
      </div>
      <div className="p-4">
        <div className="border border-blue-100 rounded-lg p-4 bg-white">
          <div className="flex items-start gap-3">
            {settings.ogImage && (
              <div className="flex-shrink-0 w-20 h-20 rounded bg-gray-100 overflow-hidden">
                <img
                  src={settings.ogImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-blue-700 text-sm truncate mb-1">{url}</div>
              <div className="text-green-700 text-xl font-medium hover:underline cursor-pointer truncate">
                {truncatedTitle}
              </div>
              <div className="text-gray-600 text-sm leading-snug mt-1">
                {truncatedDesc}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-1">Tiêu đề</div>
            <div className="text-gray-900">
              {title.length}/60 ký tự
              {title.length > 60 && (
                <span className="text-red-500 ml-2">- Vượt quá giới hạn!</span>
              )}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500 mb-1">Mô tả</div>
            <div className="text-gray-900">
              {description.length}/160 ký tự
              {description.length > 160 && (
                <span className="text-red-500 ml-2">- Vượt quá giới hạn!</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};