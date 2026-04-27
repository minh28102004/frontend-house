"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HostMediaImageResponse } from "@/modules/host/media/types";
import { HostMediaUpdateDto } from "../types";
import { X, Save, Loader2 } from "lucide-react";

interface HostImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  image: HostMediaImageResponse;
  onUpdate: (slug: string, data: HostMediaUpdateDto) => Promise<boolean>;
}

export function HostImageEditModal({
  isOpen,
  onClose,
  onSuccess,
  image,
  onUpdate,
}: HostImageEditModalProps) {
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      setAlt(image.alt || "");
      setCaption(image.caption || "");
      setDescription(image.description || "");
    }
  }, [image]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const success = await onUpdate(image.slug, {
        alt,
        caption,
        description,
      });
      if (success) {
        onSuccess();
      } else {
        setError("Không thể cập nhật hình ảnh. Vui lòng thử lại.");
      }
    } catch {
      setError("Đã xảy ra lỗi khi lưu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-lg w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa hình ảnh</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={image.imageUrl}
              alt={alt || image.originalName || "Image"}
              fill
              className="object-contain"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Mô tả ngắn cho ảnh (giúp SEO)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Chú thích ngắn cho ảnh"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết hơn về ảnh"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
