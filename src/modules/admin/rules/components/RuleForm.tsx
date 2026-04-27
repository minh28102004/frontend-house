'use client';

import { useState, useEffect } from 'react';
import type { Rule, CreateRulePayload, UpdateRulePayload } from '../services/rule.service';
import SunEditerUploadImage from '@/modules/admin/common/components/SunEditer';

interface Props {
  rule?: Rule | null;
  onSuccess: () => void;
  onClose: () => void;
}

const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function RuleForm({ rule, onSuccess, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<CreateRulePayload>({
    title: rule?.title || '',
    slug: rule?.slug || '',
    content: rule?.content || '',
    isPublished: rule?.isPublished ?? true,
    sortOrder: rule?.sortOrder || 0,
    language: rule?.language || 'vi',
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!rule?.slug);

  // Auto-generate slug from title when creating new
  useEffect(() => {
    if (!slugManuallyEdited && form.title && !rule) {
      setForm(prev => ({ ...prev, slug: createSlug(form.title) }));
    }
  }, [form.title, slugManuallyEdited, rule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!form.title?.trim()) {
        throw new Error('Vui lòng nhập tiêu đề');
      }
      if (!form.slug?.trim()) {
        throw new Error('Vui lòng nhập slug');
      }

      const payload: CreateRulePayload | UpdateRulePayload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        content: form.content || '',
        isPublished: form.isPublished,
        sortOrder: form.sortOrder,
        language: form.language,
      };

      if (rule) {
        const { ruleService } = await import('../services/rule.service');
        await ruleService.update(rule._id, payload);
      } else {
        const { ruleService } = await import('../services/rule.service');
        await ruleService.create(payload as CreateRulePayload);
      }

      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {rule ? 'Sửa Trang' : 'Tạo Trang Mới'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title & Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Điều khoản sử dụng"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setForm({ ...form, slug: createSlug(e.target.value) });
                setSlugManuallyEdited(true);
              }}
              placeholder="dieu-khoan-su-dung"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">URL: /rules/{form.slug || 'slug'}</p>
          </div>
        </div>

        {/* Content with SunEditor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nội dung
          </label>
          <div className="border rounded-lg overflow-hidden">
            <SunEditerUploadImage
              postData={form.content || ''}
              setPostData={(content) => setForm({ ...form, content })}
            />
          </div>
        </div>

        {/* Sort Order & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              min={0}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-slate-900 focus:ring-slate-200"
              />
              <span className="text-sm font-medium text-gray-700">Xuất bản ngay</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : rule ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
}
