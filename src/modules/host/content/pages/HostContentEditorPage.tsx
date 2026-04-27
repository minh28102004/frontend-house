'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import HostContentForm from '../components/HostContentForm';
import { fetchContentBySlug } from '../services/content.service';
import type { HostContent } from '../types';

export function HostContentEditorPage() {
  const params = useParams();
  const rawSlug = params?.slug ?? params?.concept;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const isEditing = slug && slug !== 'new';
  const [initialData, setInitialData] = useState<HostContent | undefined>(undefined);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetchContentBySlug(slug)
        .then((data) => setInitialData(data))
        .catch((error) => console.error('Failed to fetch content:', error))
        .finally(() => setLoading(false));
    }
  }, [slug, isEditing]);

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/host/content" className="text-green-600 hover:text-green-700">
              Bài viết
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-600">
            {isEditing ? 'Chỉnh sửa' : 'Tạo mới'}
          </li>
        </ol>
      </nav>

      {/* Form */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-500">Đang tải...</span>
        </div>
      ) : (
        <HostContentForm slug={isEditing ? slug : undefined} initialData={initialData} />
      )}
    </div>
  );
}

export default HostContentEditorPage;
