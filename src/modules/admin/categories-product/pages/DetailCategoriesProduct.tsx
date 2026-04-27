"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCategoriesProductBySlug,
  getCategoriesProductById,
} from "../services/categories-product.service";
import { CategoriesProduct } from "../types/categories-product.types";
import Image from "next/image";
import ProductSortOrderManager from "../../products/components/ProductSortOrderManager";

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

const DetailCategoriesProduct = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const [category, setCategory] = useState<CategoriesProduct | null>(null);
  const [parentCategoryName, setParentCategoryName] = useState<string>("");

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        const data = await getCategoriesProductBySlug(slug);
        console.log("Danh mục lấy được:", data);
        setCategory(data);

        if (data.parentCategory) {
          console.log("Parent category value:", data.parentCategory);

          // Nếu parentCategory là object => lấy trực tiếp
          if (
            typeof data.parentCategory === "object" &&
            data.parentCategory.name
          ) {
            setParentCategoryName(data.parentCategory.name);
          }
          // Nếu là chuỗi ID
          else if (
            typeof data.parentCategory === "string" &&
            isValidObjectId(data.parentCategory)
          ) {
            try {
              const parentData = await getCategoriesProductById(
                data.parentCategory
              );
              setParentCategoryName(parentData.name);
            } catch (error) {
              console.error("Không tìm được danh mục cha theo ID:", error);
            }
          }
          // Nếu là chuỗi nhưng không phải ID => thử coi là slug
          else if (typeof data.parentCategory === "string") {
            try {
              const parentDataBySlug = await getCategoriesProductBySlug(
                data.parentCategory
              );
              setParentCategoryName(parentDataBySlug.name);
            } catch (err) {
              console.error("Không tìm thấy danh mục cha theo slug:", err);
            }
          } else {
            console.warn(
              "⚠ Dạng parentCategory không xác định:",
              data.parentCategory
            );
          }
        }
      } catch (err) {
        console.error("Không tìm thấy danh mục:", err);
      }
    };

    if (slug) {
      fetchCategoryDetail();
    }
  }, [slug]);

  if (!category)
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-700">Đang tải dữ liệu...</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Chi tiết danh mục: {category.name}
      </h1>
      {category.image && (
        <div className="mb-4">
          <strong className="block mb-2">Ảnh danh mục:</strong>
          <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-gray-300">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
      {(category.bannerImage ||
        category.bannerTitle ||
        category.bannerSubtitle ||
        category.bannerCtaLabel) && (
        <div className="mb-6 border border-gray-200 rounded-xl p-4 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-3">Banner danh mục</h2>
          {category.bannerImage ? (
            <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border border-blue-200 mb-4">
              <Image
                src={category.bannerImage}
                alt={`${category.name} banner`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              Chưa có banner cho danh mục này.
            </p>
          )}
          <div className="flex flex-col gap-2 text-sm">
            {category.bannerTitle && (
              <p>
                <strong>Tiêu đề:</strong> {category.bannerTitle}
              </p>
            )}
            {category.bannerSubtitle && (
              <p>
                <strong>Mô tả:</strong> {category.bannerSubtitle}
              </p>
            )}
            {category.bannerCtaLabel && (
              <p>
                <strong>Nút CTA:</strong> {category.bannerCtaLabel}
              </p>
            )}
            {category.bannerCtaLink && (
              <p>
                <strong>Link CTA:</strong> {category.bannerCtaLink}
              </p>
            )}
          </div>
        </div>
      )}
      <p className="mb-2">
        <strong>Slug:</strong> {category.slug}
      </p>
      <p className="mb-2">
        <strong>Mô tả:</strong> {category.description || "Không có mô tả"}
      </p>
      {category.parentCategory && (
        <p className="mb-2">
          <strong>Danh mục cha:</strong>{" "}
          {parentCategoryName ||
            (typeof category.parentCategory === "string"
              ? category.parentCategory
              : category.parentCategory?.name)}
        </p>
      )}

      {category.fullSubCategories && category.fullSubCategories.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Danh mục con:</h2>
          <ul className="list-disc pl-5">
            {category.fullSubCategories.map((sub) => (
              <li key={sub._id}>
                {sub.name} ({sub.slug})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Product Sort Order Manager */}
      <div className="mt-8">
        <ProductSortOrderManager
          categoryId={category._id || ""}
          categoryName={category.name}
        />
      </div>

      <button
        type="button"
        onClick={() => router.push("/admin/categories-product")}
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
      >
        Quay lại danh sách
      </button>
    </div>
  );
};

export default DetailCategoriesProduct;
