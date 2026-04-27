"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useHostCategories } from "../hooks";
import { HostCategory } from "../types";
import { HostCategoryService } from "../services";
import Image from "next/image";

const HostCategoryManager: React.FC = () => {
  const { categories, loading, error, fetchCategories } = useHostCategories();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<HostCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    title: "",
    description: "",
    parentCategory: "",
    sortOrder: 0,
    isActive: true,
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const mainCategories = categories.filter((cat) => !cat.parentId && cat._id !== editingCategory?._id);

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      title: "",
      description: "",
      parentCategory: "",
      sortOrder: 0,
      isActive: true,
      image: "",
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleEdit = (category: HostCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      title: category.title || "",
      description: category.description || "",
      parentCategory: typeof category.parentCategory === "string" ? category.parentCategory : "",
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive ?? true,
      image: category.image || "",
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleDelete = async (category: HostCategory) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      try {
        await HostCategoryService.delete(category.slug);
        fetchCategories();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Lỗi khi xóa danh mục";
        alert(message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Vui lòng nhập tên danh mục");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const slug = formData.slug || formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const payload = {
        name: formData.name.trim(),
        slug,
        title: formData.title || undefined,
        description: formData.description || undefined,
        parentCategory: formData.parentCategory || undefined,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
        image: formData.image || undefined,
      };

      if (editingCategory) {
        await HostCategoryService.update(editingCategory.slug, payload);
      } else {
        await HostCategoryService.create(payload);
      }

      setShowForm(false);
      fetchCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi lưu danh mục";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const getSubCategories = (parentId: string): HostCategory[] => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h2>
          <p className="text-sm text-gray-500 mt-1">Sắp xếp và quản lý danh mục sản phẩm</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm danh mục
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    name: e.target.value,
                    slug: e.target.value !== editingCategory?.name ? generateSlug(e.target.value) : formData.slug
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                  placeholder="Ví dụ: Đồ gia dụng"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Slug <span className="text-gray-400 font-normal">(tự động tạo)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  placeholder="slug-danh-muc"
                />
                <p className="text-xs text-gray-400 mt-1">URL thân thiện: /danh-muc/slug-danh-muc</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Danh mục cha <span className="text-gray-400 font-normal">(tùy chọn)</span>
                </label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                >
                  <option value="">-- Không có (Danh mục chính) --</option>
                  {mainCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">Chọn danh mục cha nếu đây là danh mục con</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Trạng thái
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {formData.isActive ? "Hoạt động" : "Tắt"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mô tả <span className="text-gray-400 font-normal">(tùy chọn)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Mô tả ngắn về danh mục..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {editingCategory ? "Cập nhật" : "Tạo mới"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-gray-500">Đang tải danh mục...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có danh mục nào</h3>
          <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm danh mục đầu tiên của bạn</p>
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Thêm danh mục đầu tiên
          </button>
        </div>
      )}

      {/* Category List */}
      {!loading && categories.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="divide-y divide-gray-100">
            {categories
              .filter((cat) => !cat.parentId)
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
              .map((category) => {
                const subCategories = getSubCategories(category._id).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                return (
                  <div key={category._id} className="p-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {category.image ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                            <Image src={category.image} alt={category.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{category.name}</p>
                            {category.isActive === false && (
                              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">Tắt</span>
                            )}
                            {subCategories.length > 0 && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                                {subCategories.length} con
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                            <span className="font-mono">/{category.slug}</span>
                            <span className="text-gray-300">|</span>
                            <span>Thứ tự: {category.sortOrder ?? 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Sub categories */}
                    {subCategories.length > 0 && (
                      <div className="ml-16 mt-3 space-y-2">
                        {subCategories.map((subCat) => (
                          <div key={subCat._id} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                              <span className="text-gray-300 text-lg">└</span>
                              {subCat.image ? (
                                <div className="relative w-8 h-8 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                                  <Image src={subCat.image} alt={subCat.name} fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-700">{subCat.name}</p>
                                  {subCat.isActive === false && (
                                    <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">Tắt</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 font-mono">/{subCat.slug}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEdit(subCat)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Sửa"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(subCat)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HostCategoryManager;
