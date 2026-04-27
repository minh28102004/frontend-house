"use client";

import React, { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HostProduct, HostCategory } from "../types";
import { useHostProducts, useHostCategories } from "../hooks";
import SunEditerUploadImage from "@/modules/admin/common/components/SunEditer";

interface HostProductFormProps {
  initialData?: HostProduct;
  mode: "create" | "edit";
}

interface SelectedCategory {
  id: string;
  name: string;
  slug: string;
  level?: number;
}

const HostProductForm: React.FC<HostProductFormProps> = ({ initialData, mode }) => {
  const router = useRouter();
  const { createProduct, updateProduct, uploadImage } = useHostProducts();
  const { categories, loading: categoriesLoading } = useHostCategories();

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [showSlugEdit, setShowSlugEdit] = useState(false);
  const [description, setDescription] = useState(
    initialData?.description || "<div><p><b>THÔNG TIN SẢN PHẨM:</b></p></div>"
  );

  const [currentPrice, setCurrentPrice] = useState(initialData?.currentPrice || initialData?.price || 0);
  const [discountPrice, setDiscountPrice] = useState(initialData?.discountPrice || 0);
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [unit, setUnit] = useState(initialData?.unit || "cái");
  const [sku, setSku] = useState(initialData?.sku || "");

  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || initialData?.images || []);

  const [selectedCategories, setSelectedCategories] = useState<SelectedCategory[]>([]);
  const [isVisible, setIsVisible] = useState(initialData?.isVisible !== undefined ? !initialData.isVisible : true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const mainCategories = useMemo(() => categories.filter((cat) => cat.level === 0 || !cat.parentId), [categories]);

  useEffect(() => {
    if (initialData?.category && categories.length > 0) {
      const mainCategory = categories.find(
        (c) => c.slug === initialData.category?.main || c.name === initialData.category?.main
      );

      if (mainCategory) {
        setSelectedCategories([{
          id: mainCategory._id || "",
          name: mainCategory.name,
          slug: mainCategory.slug || "",
          level: mainCategory.level,
        }]);
      }
    }
  }, [initialData?.category, categories]);

  useEffect(() => {
    if (mode === "create" && !initialData?.slug && name) {
      const generatedSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [name, mode, initialData?.slug]);

  const handleCategoryChange = useCallback((category: HostCategory, checked: boolean) => {
    const normalized: SelectedCategory = {
      id: category._id,
      name: category.name,
      slug: category.slug || "",
      level: category.level ?? 0,
    };

    setSelectedCategories((prev) => {
      if (checked) {
        const exists = prev.some((c) => c.id === normalized.id);
        if (exists) return prev;
        return [...prev, normalized];
      }
      return prev.filter((c) => c.id !== normalized.id);
    });
  }, []);

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setIsUploadingImages(true);
      const imageUrl = await uploadImage(file);
      setIsUploadingImages(false);
      return imageUrl || "";
    } catch {
      setIsUploadingImages(false);
      setErrorMsg("Lỗi khi tải ảnh lên");
      return "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (!name || !slug) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const mainCategory = selectedCategories.find((cat) => {
        const category = categories.find((c) => c._id === cat.id);
        return category?.level === 0;
      }) || selectedCategories[0];

      const mainCategoryFromDb = mainCategory ? categories.find((c) => c._id === mainCategory.id) : null;

      const productData: Partial<HostProduct> = {
        name,
        slug,
        description,
        currentPrice,
        discountPrice,
        price: currentPrice,
        originalPrice: discountPrice,
        thumbnail,
        gallery,
        images: gallery,
        stock,
        unit,
        sku,
        isVisible: !isVisible,
        isActive: !isVisible,
        isFeatured,
        category: mainCategory ? {
          main: mainCategory.slug || mainCategoryFromDb?.slug || "",
          sub: [],
          mainCategoryId: mainCategory.id || mainCategoryFromDb?._id || "",
          name: mainCategory.name || mainCategoryFromDb?.name || "",
          slug: mainCategory.slug || mainCategoryFromDb?.slug || "",
        } : undefined,
      };

      if (mode === "create") {
        await createProduct(productData);
      } else {
        await updateProduct(initialData!.slug!, productData);
      }

      router.push("/host/store");
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  placeholder="Nhập tên sản phẩm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                {mode === "edit" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 break-all">{slug}</span>
                    <button
                      type="button"
                      onClick={() => setShowSlugEdit(!showSlugEdit)}
                      className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                    >
                      {showSlugEdit ? "Đóng" : "Sửa"}
                    </button>
                  </div>
                ) : null}
                {(mode === "create" || showSlugEdit) && (
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="ten-san-pham"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Mô tả sản phẩm</h3>
            <SunEditerUploadImage postData={description} setPostData={setDescription} />
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Hình ảnh</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = await handleImageUpload(file);
                      if (url) setThumbnail(url);
                    }
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {thumbnail && (
                  <div className="mt-2 relative inline-block">
                    <img src={thumbnail} alt="Thumbnail" className="w-32 h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setThumbnail("")}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thư viện ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    setIsUploadingImages(true);
                    const urls = await Promise.all(files.map((file) => handleImageUpload(file)));
                    setGallery([...gallery, ...urls.filter((url) => url)]);
                    setIsUploadingImages(false);
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {gallery.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setGallery(gallery.filter((_, i) => i !== index))}
                          className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Trạng thái</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Ẩn sản phẩm</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Sản phẩm nổi bật</span>
              </label>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Giá & Kho hàng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                <input
                  type="number"
                  min={0}
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (VNĐ)</label>
                <input
                  type="number"
                  min={0}
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="cái, kg, hộp..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Mã sản phẩm"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Danh mục</h3>
            {categoriesLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {mainCategories.map((category) => (
                  <label key={category._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.some((c) => c.id === category._id)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
                {mainCategories.length === 0 && (
                  <p className="text-sm text-gray-500">Chưa có danh mục nào</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          disabled={isSubmitting || isUploadingImages}
        >
          {isSubmitting ? "Đang lưu..." : mode === "create" ? "Tạo sản phẩm" : "Cập nhật"}
        </button>
      </div>
    </form>
  );
};

export default HostProductForm;
