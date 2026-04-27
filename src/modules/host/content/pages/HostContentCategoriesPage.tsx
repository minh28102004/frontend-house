'use client';

import { HostContentCategoryManager } from '../components/HostContentCategoryManager';

export const HostContentCategoriesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Danh mục bài viết</h1>
        <p className="text-gray-500">Quản lý danh mục cho bài viết của bạn</p>
      </div>

      {/* Category Manager */}
      <HostContentCategoryManager />
    </div>
  );
};

export default HostContentCategoriesPage;
