"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";

interface HostImageUploaderProps {
  onUpload: (file: File) => Promise<string | null>;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function HostImageUploader({
  onUpload,
  accept = "image/*",
  multiple = false,
  className = "",
}: HostImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!validImageTypes.includes(file.type)) {
      setError("Vui lòng chọn file hình ảnh (JPEG, PNG, GIF, WebP, SVG)");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Kích thước file không được vượt quá 10MB");
      return false;
    }
    return true;
  };

  const uploadFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;

      try {
        setUploading(true);
        setUploadProgress(0);
        setError(null);

        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const result = await onUpload(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (result) {
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
          }, 500);
        } else {
          setError("Upload thất bại. Vui lòng thử lại.");
          setUploading(false);
          setUploadProgress(0);
        }
      } catch {
        setError("Đã xảy ra lỗi khi upload. Vui lòng thử lại.");
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        if (multiple) {
          files.forEach((file) => uploadFile(file));
        } else {
          uploadFile(files[0]);
        }
      }
    },
    [multiple, uploadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        if (multiple) {
          files.forEach((file) => uploadFile(file));
        } else {
          uploadFile(files[0]);
        }
      }
      e.target.value = "";
    },
    [multiple, uploadFile]
  );

  return (
    <div className={`${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
        } ${uploading ? "pointer-events-none opacity-75" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="host-uploader-input"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-3" />
            <p className="text-gray-600 font-medium">Đang tải lên...</p>
            <div className="w-full max-w-xs mt-3 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <label
              htmlFor="host-uploader-input"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-700 font-medium mb-1">
                Kéo thả hình ảnh vào đây
              </p>
              <p className="text-gray-500 text-sm mb-3">
                hoặc nhấn để chọn file
              </p>
              <p className="text-gray-400 text-xs">
                Định dạng: JPEG, PNG, GIF, WebP, SVG (tối đa 10MB)
              </p>
            </label>
          </>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
