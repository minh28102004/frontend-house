"use client";

import React from "react";
import Link from "next/link";
import { ProductBasic } from "../models/flash-sale.model";

interface FlashSaleProductCardProps {
  product: ProductBasic;
  discountPercentage?: number;
}

const formatVnd = (value?: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value || 0
  );

export const FlashSaleProductCard: React.FC<FlashSaleProductCardProps> = ({
  product,
  discountPercentage = 0,
}) => {
  // Tính giá sau khi giảm
  const calculateDiscountedPrice = () => {
    if (!product.currentPrice) return 0;
    if (product.discountPrice) return product.discountPrice;
    if (discountPercentage > 0) {
      return Math.round(
        product.currentPrice * (1 - discountPercentage / 100)
      );
    }
    return product.currentPrice;
  };

  const discountedPrice = calculateDiscountedPrice();
  const hasDiscount =
    product.currentPrice && discountedPrice < product.currentPrice;
  const showDiscountBadge = hasDiscount && discountPercentage > 0;

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="block group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
    >
      {/* Badge Flash Sale - chỉ hiển thị khi discountPercentage > 0 */}
      {showDiscountBadge ? (
        <div className="relative">
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 bg-red-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-bold">
            -{discountPercentage}%
          </div>
          <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        </div>
      ) : (
        <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
      )}

      <div className="p-2 sm:p-3">
        <h3
          className="text-xs sm:text-sm font-medium line-clamp-2 mb-1.5 sm:mb-2 min-h-[2rem] sm:min-h-[2.5rem] leading-tight"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Giá */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          {hasDiscount ? (
            <>
              <span className="text-sm sm:text-base font-bold text-red-600">
                {formatVnd(discountedPrice)}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                {formatVnd(product.currentPrice)}
              </span>
            </>
          ) : (
            <span className="text-sm sm:text-base font-semibold text-gray-900">
              {product.currentPrice
                ? formatVnd(product.currentPrice)
                : "Liên hệ"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

