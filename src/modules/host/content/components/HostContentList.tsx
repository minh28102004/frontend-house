'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useHostContent } from '../hooks/useHostContent';
import type { HostContent, ContentStatus } from '../types';

interface HostContentListProps {
  onEdit?: (content: HostContent) => void;
}

const statusConfig: Record<ContentStatus, { label: string; color: string }> = {
  published: { label: 'Đã xuất bản', color: 'bg-green-100 text-green-800' },
  draft: { label: 'Bản nháp', color: 'bg-gray-100 text-gray-800' },
  pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
};

export function HostContentList({ onEdit }: HostContentListProps) {
  const {
    contents,
    loading,
    error,
    pagination,
    fetchContents,
    deleteContent,
    publishContent,
    unpublishContent,
  } = useHostContent();

  const [activeTab, setActiveTab] = useState<ContentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const status = activeTab === 'all' ? undefined : activeTab;
    fetchContents(currentPage, status, searchQuery || undefined);
  }, [fetchContents, activeTab, currentPage, searchQuery]);

  const handleTabChange = (tab: ContentStatus | 'all') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteContent(slug);
      setDeleteConfirm(null);
    } catch {
      // Error is handled in hook
    }
  };

  const handlePublishToggle = async (content: HostContent) => {
    try {
      if (content.status === 'published') {
        await unpublishContent(content.slug);
      } else {
        await publishContent(content.slug);
      }
    } catch {
      // Error is handled in hook
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchContents(1, activeTab === 'all' ? undefined : activeTab, searchQuery || undefined);
  };

  const stats = {
    total: contents.length,
    published: contents.filter((c) => c.status === 'published').length,
    draft: contents.filter((c) => c.status === 'draft').length,
    pending: contents.filter((c) => c.status === 'pending').length,
  };

  const tabs = [
    { key: 'all', label: 'Tất cả', count: pagination.total },
    { key: 'published', label: 'Đã xuất bản', count: stats.published },
    { key: 'draft', label: 'Bản nháp', count: stats.draft },
    { key: 'pending', label: 'Chờ duyệt', count: stats.pending },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Tổng bài viết</p>
          <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Đã xuất bản</p>
          <p className="text-2xl font-bold text-green-600">{stats.published}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Bản nháp</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Chờ duyệt</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tìm kiếm
          </button>
        </form>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <Link
            href="/host/content/categories"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Danh mục bài viết
          </Link>
          <Link
            href="/host/content/create"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm bài viết
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Đang tải...</p>
          </div>
        ) : contents.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có bài viết</h3>
            <p className="mt-1 text-sm text-gray-500">Bắt đầu tạo bài viết đầu tiên của bạn.</p>
            <div className="mt-6">
              <Link
                href="/host/content/create"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Tạo bài viết
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bài viết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contents.map((content) => (
                  <tr key={content._id || content.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {content.thumbnail && (
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={content.thumbnail}
                              alt={content.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{content.title}</p>
                          <p className="text-sm text-gray-500 truncate">/{content.slug}</p>
                          {content.excerpt && (
                            <p className="text-sm text-gray-400 truncate mt-1">{content.excerpt}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusConfig[content.status]?.color || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {statusConfig[content.status]?.label || content.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {content.tags && content.tags.length > 0 ? (
                          content.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Không có</span>
                        )}
                        {content.tags && content.tags.length > 3 && (
                          <span className="text-gray-400 text-xs">
                            +{content.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.createdAt
                        ? new Date(content.createdAt).toLocaleDateString('vi-VN')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/host/content/edit/${content.slug}`}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handlePublishToggle(content)}
                          className={`p-1 ${
                            content.status === 'published'
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={content.status === 'published' ? 'Hủy xuất bản' : 'Xuất bản'}
                        >
                          {content.status === 'published' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(content.slug)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Trang {pagination.page} của {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      pagination.page === page
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-500 mb-4">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HostContentList;
