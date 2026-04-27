"use client";

import React from "react";
import { FlashSale } from "../models/flash-sale.model";
import { CountdownTimer } from "./CountdownTimer";
import { FlashSaleProductCard } from "./FlashSaleProductCard";
import { ProductBasic } from "../models/flash-sale.model";

interface FlashSaleDetailProps {
  flashSale: FlashSale;
}

export const FlashSaleDetail: React.FC<FlashSaleDetailProps> = ({
  flashSale,
}) => {
  const isActive = () => {
    const now = new Date();
    const startDate = new Date(flashSale.startDate);
    const endDate = new Date(flashSale.endDate);
    return flashSale.isActive && startDate <= now && endDate >= now;
  };

  const getProducts = (): ProductBasic[] => {
    if (!flashSale.products || flashSale.products.length === 0) return [];
    
    return flashSale.products.filter(
      (p): p is ProductBasic => typeof p === "object" && p !== null
    );
  };

  const products = getProducts();
  const active = isActive();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header Section với gradient đẹp */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 shadow-xl overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 md:mb-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
                  {flashSale.name}
                </h1>
                {active && (
                  <span className="bg-white text-gray-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold animate-pulse whitespace-nowrap self-start sm:self-auto border border-gray-300">
                    🔥 ĐANG DIỄN RA
                  </span>
                )}
              </div>
              {flashSale.description && (
                <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-4 leading-relaxed">
                  {flashSale.description}
                </p>
              )}
              {/* {flashSale.discountPercentage && flashSale.discountPercentage > 0 && (
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg shadow-lg">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                    Giảm đến {flashSale.discountPercentage}%
                  </span>
                </div>
              )} */}
            </div>
          </div>

          {active && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 mt-4 border border-gray-600">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap text-gray-200">
                  ⏰ Kết thúc sau:
                </span>
                <div className="overflow-x-auto -mx-2 px-2">
                  <CountdownTimer endDate={flashSale.endDate} className="text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      {products.length > 0 ? (
        <div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {products.map((product) => (
              <FlashSaleProductCard
                key={product._id || product.slug}
                product={product}
                discountPercentage={flashSale.discountPercentage}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 md:py-20 bg-gray-50 rounded-xl">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium mb-2">
              Chưa có sản phẩm trong flash sale này
            </p>
            <p className="text-gray-400 text-sm sm:text-base">
              Vui lòng quay lại sau
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

