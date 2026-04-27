'use client';

import React, { useState, useEffect } from 'react';
import { useHostContentCategories } from '../hooks/useHostContentCategories';
import { HostContentCategory, CreateCategoryData } from '../types';

interface HostContentCategoryManagerProps {
  onSelectCategory?: (category: HostContentCategory) => void;
}

export const HostContentCategoryManager: React.FC<HostContentCategoryManagerProps> = ({
  onSelectCategory,
}) => {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategory,
  } = useHostContentCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<HostContentCategory | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    slug: '',
    description: '',
    parent: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent: '',
      order: 0,
      isActive: true,
    });
    setEditingCategory(null);
  };

  const handleOpenModal = (category?: HostContentCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        parent: category.parent || '',
        order: category.order || 0,
        isActive: category.isActive,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory?._id) {
        await updateCategory(editingCategory._id, formData);
      } else {
        await createCategory(formData);
      }
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      console.error('Lỗi khi lưu danh mục:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      setDeleteConfirm(null);
      fetchCategories();
    } catch (err) {
      console.error('Lỗi khi xóa danh mục:', err);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleCategory(id);
    } catch (err) {
      console.error('Lỗi khi toggle danh mục:', err);
    }
  };

  // Render tree structure
  const renderCategoryTree = (parentId?: string, level = 0): React.ReactNode => {
    const filteredCategories = categories.filter(cat => cat.parent === parentId);
    
    return filteredCategories.map(category => (
      <div key={category._id} style={{ marginLeft: `${level * 24}px` }}>
        <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg mb-2 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">{category.order || 0}</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{category.name}</p>
              <p className="text-xs text-gray-500">/{category.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {category.isActive ? 'Hoạt động' : 'Tắt'}
            </span>
            <button
              onClick={() => handleOpenModal(category)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sửa"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setDeleteConfirm(category._id!)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        {renderCategoryTree(category._id, level + 1)}
      </div>
    ));
  };

  // Get parent options (excluding current category and its children)
  const getParentOptions = () => {
    const rootCategories = categories.filter(cat => !cat.parent && (!editingCategory || cat._id !== editingCategory._id));
    return rootCategories;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Danh mục bài viết</h3>
          <p className="text-sm text-gray-500">{categories.length} danh mục</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm danh mục
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading && categories.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-3">{error}</p>
            <button
              onClick={fetchCategories}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 mb-3">Chưa có danh mục nào</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Tạo danh mục đầu tiên
            </button>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {renderCategoryTree(undefined)}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="duoc-tao-tu-dong"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
                <select
                  value={formData.parent || ''}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                >
                  <option value="">-- Không có --</option>
                  {getParentOptions().map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                  rows={3}
                  placeholder="Mô tả ngắn về danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  min={0}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Hoạt động</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingCategory ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Xóa danh mục?</h3>
            <p className="text-gray-500 mb-6">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
