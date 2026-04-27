'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SunEditerUploadImage from '@/modules/admin/common/components/SunEditer';
import { useImages } from '@/common/hooks/useImages';
import {
  contentService,
  fetchContentBySlug,
} from '../services/content.service';
import type {
  HostContent,
  CreateContentData,
  ContentStatus,
} from '../types';

/** Loại bỏ domain từ HTML, chỉ giữ phần relative */
const removeDomain = (html: string): string =>
  html.replace(new RegExp(`${process.env.NEXT_PUBLIC_API_URL}`, 'g'), '');

interface HostContentFormProps {
  slug?: string;
  initialData?: HostContent;
}

const HostContentForm: React.FC<HostContentFormProps> = ({
  slug,
  initialData,
}) => {
  const router = useRouter();
  const { uploadImage: uploadThumbnail } = useImages();

  const [title, setTitle] = useState('');
  const [slugInput, setSlugInput] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [postData, setPostData] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [publishedTime, setPublishedTime] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEdit = !!slug;

  // Load initial data when editing
  useEffect(() => {
    if (isEdit && initialData) {
      setTitle(initialData.title || '');
      setSlugInput(initialData.slug || '');
      setExcerpt(
        (initialData.excerpt || '').replace(
          /src="\/uploads/g,
          `src="${process.env.NEXT_PUBLIC_API_URL}/uploads`
        )
      );
      setPostData(
        (initialData.content || '').replace(
          /src="\/uploads/g,
          `src="${process.env.NEXT_PUBLIC_API_URL}/uploads`
        )
      );
      setThumbnailUrl(initialData.thumbnail || '');
      setSelectedTags(initialData.tags || []);

      // parse publishedAt
      const dt = initialData.publishedAt
        ? new Date(initialData.publishedAt)
        : new Date();
      const y = dt.getUTCFullYear();
      const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
      const d = String(dt.getUTCDate()).padStart(2, '0');
      const hh = String(dt.getUTCHours()).padStart(2, '0');
      const mm = String(dt.getUTCMinutes()).padStart(2, '0');
      setPublishedDate(`${y}-${m}-${d}`);
      setPublishedTime(`${hh}:${mm}`);
    } else {
      // defaults cho bài mới: ngày hôm nay
      const now = new Date();
      const y = now.getUTCFullYear();
      const m = String(now.getUTCMonth() + 1).padStart(2, '0');
      const d = String(now.getUTCDate()).padStart(2, '0');
      setPublishedDate(`${y}-${m}-${d}`);
      setPublishedTime('09:00');
    }
  }, [isEdit, initialData]);

  // Auto-generate slug from title when creating new post
  useEffect(() => {
    if (!isEdit && title && !slugInput) {
      const auto = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlugInput(auto);
    }
  }, [title, isEdit, slugInput]);

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !selectedTags.includes(tag)) {
        setSelectedTags((prev) => [...prev, tag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: FormEvent, action?: ContentStatus) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Tiêu đề không được để trống!');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    // published ISO
    let publishedISO = new Date().toISOString();
    if (publishedDate && publishedTime) {
      try {
        const [yy, mm, dd] = publishedDate.split('-').map(Number);
        const [hh, min] = publishedTime.split(':').map(Number);
        publishedISO = new Date(Date.UTC(yy, mm - 1, dd, hh, min)).toISOString();
      } catch {
        // keep current
      }
    }

    // upload thumbnail
    let thumbUrl = thumbnailUrl;
    if (thumbnailFile) {
      try {
        const result = await uploadThumbnail(thumbnailFile);
        if (result?.url) {
          thumbUrl = result.url;
        }
      } catch {
        setFormError('Upload ảnh đại diện thất bại');
        setIsSubmitting(false);
        return;
      }
    }

    const payload: CreateContentData = {
      title: title.trim(),
      slug: slugInput.trim(),
      excerpt: removeDomain(excerpt),
      content: removeDomain(postData),
      thumbnail: thumbUrl,
      tags: selectedTags,
      publishedAt: publishedISO,
      status: action || 'draft',
    };

    try {
      if (isEdit && slug) {
        await contentService.update(slug, payload);
        alert('Cập nhật bài viết thành công!');
        router.push('/host/content');
      } else {
        await contentService.create(payload);
        alert('Tạo bài viết thành công!');
        router.push('/host/content');
      }
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Lưu bài viết thất bại'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const thumbPreview =
    thumbnailFile
      ? URL.createObjectURL(thumbnailFile)
      : thumbnailUrl
        ? `${process.env.NEXT_PUBLIC_API_URL || ''}${thumbnailUrl}`
        : '';

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-lg bg-white shadow">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT — 8/12 */}
        <div className="md:w-8/12 space-y-6">
          {/* Tiêu đề */}
          <div>
            <label className="block font-medium mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block font-medium mb-1">Đường dẫn URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-green-500"
                placeholder="slug-bai-viet"
              />
              <button
                type="button"
                onClick={() => {
                  if (title) {
                    const auto = title
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[đĐ]/g, 'd')
                      .replace(/[^a-zA-Z0-9\s-]/g, '')
                      .trim()
                      .replace(/\s+/g, '-')
                      .replace(/-+/g, '-');
                    setSlugInput(auto);
                  }
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Auto
              </button>
            </div>
          </div>

          {/* Tóm tắt (SunEditor) */}
          <div>
            <label className="block font-medium mb-1">Tóm tắt</label>
            <SunEditerUploadImage
              postData={excerpt}
              setPostData={setExcerpt}
            />
          </div>

          {/* Nội dung chính (SunEditor) */}
          <div>
            <label className="block font-medium mb-1">Nội dung</label>
            <SunEditerUploadImage
              postData={postData}
              setPostData={setPostData}
            />
          </div>

          {/* Ngày giờ đăng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Ngày đăng</label>
              <input
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Giờ đăng</label>
              <input
                type="time"
                value={publishedTime}
                onChange={(e) => setPublishedTime(e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          </div>

          {/* Ảnh đại diện */}
          <div>
            <label className="block font-medium mb-1">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            {thumbPreview && (
              <Image
                src={thumbPreview}
                alt="preview"
                className="w-24 h-24 mt-2 rounded shadow object-cover"
                width={96}
                height={96}
              />
            )}
          </div>
        </div>

        {/* RIGHT — 4/12 */}
        <div className="md:w-4/12 space-y-6">
          {/* Thẻ (Tags) */}
          <div>
            <h3 className="font-semibold mb-2">Thẻ (Tags)</h3>
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full border px-3 py-2 rounded text-sm"
              placeholder="Nhấn Enter để thêm tag"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {formError && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {formError}
        </div>
      )}

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-4">
        <button
          type="button"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-300 rounded shadow-lg hover:bg-gray-400 disabled:opacity-50"
          onClick={() => router.push('/host/content')}
        >
          Hủy
        </button>
        <button
          type="button"
          disabled={isSubmitting || !title.trim()}
          className="px-4 py-2 bg-gray-600 text-white rounded shadow-lg hover:bg-gray-700 disabled:opacity-50"
          onClick={(e) => handleSubmit(e as unknown as FormEvent, 'draft')}
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu bản nháp'}
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="px-6 py-2 bg-green-600 text-white rounded shadow-lg hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi duyệt / Xuất bản'}
        </button>
      </div>
    </form>
  );
};

export default HostContentForm;
