"use client";

import { HostMediaLibrary } from "@/modules/host/media/components/HostMediaLibrary";
import { HostImageUploader } from "@/modules/host/media/components/HostImageUploader";
import { useHostMedia } from "@/modules/host/media/hooks/useHostMedia";
import { Upload } from "lucide-react";

export default function HostMediaPage() {
  const { uploadImage, uploadMultipleImages, uploading } = useHostMedia();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thư viện ảnh</h1>
          <p className="mt-2 text-gray-600">
            Quản lý hình ảnh của bạn
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tải ảnh mới lên
          </h2>
          <HostImageUploader
            onUpload={uploadImage}
            multiple={false}
            className="max-w-2xl"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <HostMediaLibrary />
        </div>
      </div>
    </div>
  );
}
