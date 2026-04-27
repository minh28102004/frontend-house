"use client";

import React, { useState, useEffect } from "react";
import { ProductService } from "../services/product.service";
import { Product } from "../models/product.model";
import Image from "next/image";

interface ProductSortOrderManagerProps {
  categoryId: string;
  categoryName: string;
}

interface ProductWithSortOrder extends Product {
  sortOrder?: number;
}

const ProductSortOrderManager: React.FC<ProductSortOrderManagerProps> = ({
  categoryId,
  categoryName,
}) => {
  const [products, setProducts] = useState<ProductWithSortOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load products for this category
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const result = await ProductService.getByCategoryId(categoryId, 1, 1000);
        // Sort by sortOrder first, then by createdAt
        const sortedProducts = result.data.sort((a: ProductWithSortOrder, b: ProductWithSortOrder) => {
          const aOrder = a.sortOrder ?? 999999;
          const bOrder = b.sortOrder ?? 999999;
          if (aOrder !== bOrder) {
            return aOrder - bOrder;
          }
          // If sortOrder is the same, sort by createdAt
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate; // Newest first
        });
        setProducts(sortedProducts);
      } catch (error: any) {
        setMessage({ type: "error", text: `Lỗi khi tải sản phẩm: ${error.message}` });
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadProducts();
    }
  }, [categoryId]);

  // Handle drag and drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const dragIndex = draggedIndex;
    if (dragIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newProducts = [...products];
    const draggedItem = newProducts[dragIndex];
    newProducts.splice(dragIndex, 1);
    newProducts.splice(dropIndex, 0, draggedItem);

    // Update sortOrder based on new position
    const updatedProducts = newProducts.map((product, index) => ({
      ...product,
      sortOrder: index + 1,
    }));

    setProducts(updatedProducts);
    setDraggedIndex(null);
  };

  // Save sort orders
  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const productSortOrders = products.map((product, index) => ({
        productId: product._id || "",
        sortOrder: index + 1,
      }));

      await ProductService.setProductSortOrders(categoryId, productSortOrders);
      setMessage({ type: "success", text: "Đã cập nhật thứ tự sản phẩm thành công!" });

      // Reload lại danh sách sản phẩm sau khi lưu thành công
      const result = await ProductService.getByCategoryId(categoryId, 1, 1000);
      // Sort by sortOrder first, then by createdAt
      const sortedProducts = result.data.sort((a: ProductWithSortOrder, b: ProductWithSortOrder) => {
        const aOrder = a.sortOrder ?? 999999;
        const bOrder = b.sortOrder ?? 999999;
        if (aOrder !== bOrder) {
          return aOrder - bOrder;
        }
        // If sortOrder is the same, sort by createdAt
        const aDate = new Date(a.createdAt || 0).getTime();
        const bDate = new Date(b.createdAt || 0).getTime();
        return bDate - aDate; // Newest first
      });
      setProducts(sortedProducts);
    } catch (error: any) {
      setMessage({ type: "error", text: `Lỗi khi lưu: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  // Manual sort order input
  const handleSortOrderChange = (index: number, value: number) => {
    const newProducts = [...products];
    newProducts[index].sortOrder = value;
    // Re-sort products
    const sortedProducts = newProducts.sort((a, b) => {
      const aOrder = a.sortOrder ?? 999999;
      const bOrder = b.sortOrder ?? 999999;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });
    setProducts(sortedProducts);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Quản lý thứ tự sản phẩm - {categoryName}
        </h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Đang lưu..." : "Lưu thứ tự"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-gray-600">Chưa có sản phẩm nào trong danh mục này.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((product, index) => (
            <div
              key={product._id || index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-move transition-colors ${
                draggedIndex === index ? "opacity-50" : ""
              }`}
            >
              <div className="flex-shrink-0">
                <span className="text-gray-400 text-sm">⋮⋮</span>
              </div>

              <div className="flex-shrink-0">
                <div className="relative w-16 h-16 rounded overflow-hidden border border-gray-200">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.name || ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">Slug: {product.slug}</p>
                {product.currentPrice && (
                  <p className="text-sm text-gray-600">
                    Giá: {product.currentPrice.toLocaleString("vi-VN")}đ
                  </p>
                )}
              </div>

              <div className="flex-shrink-0 flex items-center gap-2">
                <label className="text-sm text-gray-600">Thứ tự:</label>
                <input
                  type="number"
                  min="1"
                  value={product.sortOrder ?? index + 1}
                  onChange={(e) =>
                    handleSortOrderChange(index, parseInt(e.target.value) || 1)
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>💡 Hướng dẫn:</p>
        <ul className="list-disc list-inside mt-1 flex flex-col gap-1">
          <li>Kéo thả các sản phẩm để thay đổi thứ tự</li>
          <li>Hoặc nhập số thứ tự trực tiếp vào ô input</li>
          <li>Nhấn "Lưu thứ tự" để áp dụng thay đổi</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductSortOrderManager;

