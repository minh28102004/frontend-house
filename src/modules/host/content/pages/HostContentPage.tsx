'use client';

import { HostContentList } from '../components/HostContentList';

export function HostContentPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bài viết</h1>
        <p className="text-gray-500 mt-1">Quản lý nội dung trang cửa hàng của bạn</p>
      </div>
      <HostContentList />
    </div>
  );
}

export default HostContentPage;
