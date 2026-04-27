'use client';

import { useEffect, useState } from 'react';
import { useTags, HostTag } from '../services/useTags';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function HostTagsManager() {
  const { tags, loading, error, fetchTags, createTag, updateTag, deleteTag, clearError } = useTags();

  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<HostTag | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleNameChange = (value: string) => {
    setFormName(value);
    if (editingTag) return;
    // Tạo mới: xóa hết tên thì xóa slug + cho phép auto-slug lại
    if (!value.trim()) {
      setFormSlug('');
      setSlugEdited(false);
      return;
    }
    if (!slugEdited) {
      setFormSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setFormSlug(generateSlug(value));
    setSlugEdited(true);
  };

  const openCreate = () => {
    setEditingTag(null);
    setFormName('');
    setFormSlug('');
    setSlugEdited(false);
    setShowForm(true);
    clearError();
  };

  const openEdit = (tag: HostTag) => {
    setEditingTag(tag);
    setFormName(tag.name);
    setFormSlug(tag.slug);
    setSlugEdited(true);
    setShowForm(true);
    clearError();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTag(null);
    setFormName('');
    setFormSlug('');
    setSlugEdited(false);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    clearError();

    try {
      if (editingTag) {
        await updateTag(editingTag.slug, { name: formName.trim(), slug: formSlug.trim() || undefined });
      } else {
        await createTag({ name: formName.trim(), slug: formSlug.trim() || undefined });
      }
      closeForm();
    } catch {
      // error set in hook
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteTag(slug);
      setDeleteConfirm(null);
    } catch {
      setDeleteConfirm(null);
    }
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Thẻ (Tags)</h1>
          <p className="text-gray-500 mt-1">Tạo và quản lý thẻ cho bài viết</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm Tag
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700 font-bold">×</button>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tag..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && tags.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : filteredTags.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? 'Không tìm thấy tag nào.' : 'Chưa có tag nào. Bấm "Thêm Tag" để tạo.'}
                  </td>
                </tr>
              ) : (
                filteredTags.map((tag) => (
                  <tr key={tag.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        #{tag.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tag.slug}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => openEdit(tag)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(tag.slug)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Count */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
          Tổng: {filteredTags.length} tag{tags.length !== filteredTags.length ? ` (lọc từ ${tags.length})` : ''}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="host-tag-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="host-tag-modal-title"
              className="text-lg font-semibold text-gray-900 tracking-tight mb-5"
            >
              {editingTag ? 'Sửa tag' : 'Thêm tag mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ví dụ: Du lịch"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={formSlug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  disabled={!editingTag && !formName.trim()}
                  className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder={formName.trim() ? 'tu-dong-hoac-nhap' : 'Nhập tên tag trước'}
                />
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Đường dẫn URL cho tag. Để trống khi lưu sẽ tự tạo từ tên.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving || !formName.trim()}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                >
                  {saving ? 'Đang lưu...' : editingTag ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Bạn có chắc muốn xóa tag{' '}
              <strong>
                #
                {tags.find((t) => t.slug === deleteConfirm)?.name ?? deleteConfirm}
              </strong>
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
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

export default HostTagsManager;
