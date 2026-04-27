"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useHostMedia } from "@/modules/host/media/hooks/useHostMedia";
import { HostMediaImageResponse } from "@/modules/host/media/types";
import Image from "next/image";
import { HostImageEditModal } from "./HostImageEditModal";
import {
  Upload,
  Trash2,
  X,
  Copy,
  Check,
  Search,
  Grid,
  FolderOpen,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

export function HostMediaLibrary() {
  const {
    images,
    loading,
    error,
    hasMore,
    uploading,
    deleting,
    fetchImages,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    updateImage,
    selectedImages,
    toggleSelect,
  } = useHostMedia();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingImage, setEditingImage] = useState<HostMediaImageResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    fetchImages(1);
  }, [fetchImages]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        fetchImages(images.length > 0 ? Math.ceil(images.length / 60) + 1 : 1);
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, fetchImages, images.length]);

  const filteredImages = images.filter(image => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      image.originalName?.toLowerCase().includes(query) ||
      image.alt?.toLowerCase().includes(query) ||
      image.slug?.toLowerCase().includes(query)
    );
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadImage(file);
        event.target.value = "";
      }
    },
    [uploadImage]
  );

  const handleMultiFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length > 0) {
        uploadMultipleImages(files);
        event.target.value = "";
      }
    },
    [uploadMultipleImages]
  );

  const handleCopyUrl = useCallback((image: HostMediaImageResponse, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(image.location || image.imageUrl);
    setCopiedSlug(image.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  }, []);

  const handleEditClick = useCallback((image: HostMediaImageResponse, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingImage(image);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback(
    (image: HostMediaImageResponse, e: React.MouseEvent) => {
      e.stopPropagation();
      setImagesToDelete([image.slug]);
      setShowDeleteConfirm(true);
    },
    []
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedImages.size > 0) {
      const slugs = images
        .filter(img => selectedImages.has(img.slug))
        .map(img => img.slug);
      setImagesToDelete(slugs);
      setShowDeleteConfirm(true);
    }
  }, [selectedImages, images]);

  const confirmDelete = useCallback(() => {
    imagesToDelete.forEach(slug => {
      deleteImage(slug);
    });
    setShowDeleteConfirm(false);
    setImagesToDelete([]);
  }, [imagesToDelete, deleteImage]);

  const handleSelectAll = useCallback(() => {
    if (selectedImages.size === filteredImages.length) {
      selectedImages.forEach(slug => toggleSelect(slug));
    } else {
      filteredImages.forEach(img => {
        if (!selectedImages.has(img.slug)) {
          toggleSelect(img.slug);
        }
      });
    }
  }, [filteredImages, selectedImages, toggleSelect]);

  if (loading && images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="mb-2">Có lỗi xảy ra khi tải ảnh.</p>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => fetchImages(1)}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thư viện ảnh của tôi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng: {images.length} hình ảnh
            {selectedImages.size > 0 && ` | Đã chọn: ${selectedImages.size}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            id="host-single-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            ref={fileInputRef}
          />
          <label
            htmlFor="host-single-upload"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Đang tải..." : "Tải ảnh lên"}
          </label>

          <input
            type="file"
            id="host-multi-upload"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleMultiFileChange}
            disabled={uploading}
            ref={multiFileInputRef}
          />
          <label
            htmlFor="host-multi-upload"
            className="px-4 py-2 bg-white hover:bg-gray-50 text-green-700 border border-green-600 rounded-lg transition-colors font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            Tải nhiều ảnh
          </label>

          {selectedImages.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa đã chọn ({selectedImages.size})
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, alt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filteredImages.length > 0 && (
          <button
            onClick={handleSelectAll}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedImages.size === filteredImages.length
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {selectedImages.size === filteredImages.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
        )}
      </div>

      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FolderOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            {searchQuery ? "Không tìm thấy hình ảnh nào" : "Chưa có hình ảnh nào trong thư viện"}
          </p>
          {!searchQuery && (
            <label
              htmlFor="host-single-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              Tải ảnh đầu tiên
            </label>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image._id}
              className={`group relative bg-white rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                selectedImages.has(image.slug)
                  ? "border-green-500 ring-2 ring-green-500"
                  : "border-gray-200 hover:border-green-400"
              }`}
            >
              <button
                onClick={(e) => toggleSelect(image.slug)}
                className={`absolute top-2 left-2 z-10 w-6 h-6 rounded border-2 transition-all ${
                  selectedImages.has(image.slug)
                    ? "bg-green-600 border-green-600"
                    : "bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100"
                }`}
              >
                {selectedImages.has(image.slug) && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </button>

              <div className="relative aspect-square">
                <Image
                  src={image.imageUrl}
                  alt={image.alt || image.originalName || "Image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              <div className="p-2">
                <p className="text-xs text-gray-600 truncate font-medium">
                  {image.originalName || image.slug}
                </p>
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => handleCopyUrl(image, e)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Sao chép URL"
                >
                  {copiedSlug === image.slug ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={(e) => handleEditClick(image, e)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit3 className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={(e) => handleDeleteClick(image, e)}
                  className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {loading && (
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          )}
        </div>
      )}

      {!hasMore && images.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <span className="text-sm text-gray-500">
            Đã hiển thị {images.length} hình ảnh
          </span>
        </div>
      )}

      {isEditModalOpen && editingImage && (
        <HostImageEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingImage(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditingImage(null);
          }}
          image={editingImage}
          onUpdate={updateImage}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Bạn có chắc chắn muốn xóa {imagesToDelete.length === 1 ? "hình ảnh này" : `${imagesToDelete.length} hình ảnh`}?
              <br />
              <span className="text-red-500 text-sm">Hành động này không thể hoàn tác.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setImagesToDelete([]);
                }}
                className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
