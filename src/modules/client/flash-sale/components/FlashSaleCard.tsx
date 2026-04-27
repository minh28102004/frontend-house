"use client";

import React from "react";
import Link from "next/link";
import { FlashSale } from "../models/flash-sale.model";
import { CountdownTimer } from "./CountdownTimer";
import { FlashSaleProductCard } from "./FlashSaleProductCard";
import { ProductBasic } from "../models/flash-sale.model";

interface FlashSaleCardProps {
  flashSale: FlashSale;
  showProducts?: boolean;
  maxProducts?: number;
}

export const FlashSaleCard: React.FC<FlashSaleCardProps> = ({
  flashSale,
  showProducts = true,
  maxProducts = 8,
}) => {
  const isActive = () => {
    const now = new Date();
    const startDate = new Date(flashSale.startDate);
    const endDate = new Date(flashSale.endDate);
    return (
      flashSale.isActive && startDate <= now && endDate >= now
    );
  };

  const getProducts = (): ProductBasic[] => {
    if (!flashSale.products || flashSale.products.length === 0) return [];
    
    // Lọc chỉ lấy các object đã populate (không phải ObjectId string hoặc null)
    const populatedProducts = flashSale.products
      .filter((p): p is ProductBasic => {
        // Kiểm tra nếu là object và không phải null, và có thuộc tính _id hoặc slug
        return typeof p === "object" && p !== null && ('_id' in p || 'slug' in p || 'name' in p);
      })
      .slice(0, maxProducts);
    
    return populatedProducts;
  };

  const products = getProducts();
  const active = isActive();
  
  // Đếm tổng số sản phẩm trong flash sale
  // Nếu products là mảng ObjectId (string) hoặc object đã populate, đều đếm được
  const totalProducts = Array.isArray(flashSale.products) 
    ? flashSale.products.filter(p => p !== null && p !== undefined).length
    : 0;

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 mx-2 md:mx-0">
      {/* Header với gradient đẹp */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white p-4 md:p-6 lg:p-8">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2 md:mb-3">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white">{flashSale.name}</h3>
                {active && (
                  <span className="bg-white text-gray-900 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-bold animate-pulse whitespace-nowrap self-start sm:self-auto border border-gray-300">
                    🔥 ĐANG DIỄN RA
                  </span>
                )}
              </div>
              {flashSale.description && (
                <p className="text-gray-200 text-xs sm:text-sm md:text-base mb-3 md:mb-4 leading-relaxed">{flashSale.description}</p>
              )}
              {/* {flashSale.discountPercentage && flashSale.discountPercentage > 0 && (
                <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Giảm đến {flashSale.discountPercentage}%</span>
                </div>
              )} */}
            </div>
          </div>
          
          {active && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 md:p-4 mt-3 md:mt-4 border border-gray-600">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <span className="text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap text-gray-200">⏰ Kết thúc sau:</span>
                <div className="overflow-x-auto -mx-2 px-2">
                  <CountdownTimer endDate={flashSale.endDate} className="text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {showProducts && totalProducts > 0 && products.length > 0 && (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gray-50">
          <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              Sản phẩm Flash Sale {totalProducts > 0 && `(${totalProducts})`}
            </h4>
            {totalProducts > maxProducts && (
              <Link
                href={`/hang-moi/${flashSale.slug}`}
                className="text-gray-700 hover:text-gray-900 font-medium text-xs sm:text-sm md:text-base transition-colors whitespace-nowrap"
              >
                Xem tất cả →
              </Link>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {products.map((product) => (
              <FlashSaleProductCard
                key={product._id || product.slug}
                product={product}
                discountPercentage={flashSale.discountPercentage}
              />
            ))}
          </div>
          
          {totalProducts > maxProducts && (
            <div className="mt-4 sm:mt-6 text-center">
              <Link
                href={`/hang-moi/${flashSale.slug}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Xem tất cả {totalProducts} sản phẩm</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Footer - View All Button (khi không show products) */}
      {!showProducts && totalProducts > 0 && (
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
          <Link
            href={`/hang-moi/${flashSale.slug}`}
            className="block w-full text-center bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Xem chi tiết {totalProducts} sản phẩm →
          </Link>
        </div>
      )}
      
      {/* Hiển thị thông báo nếu không có sản phẩm */}
      {showProducts && totalProducts === 0 && (
        <div className="p-6 sm:p-8 bg-gray-50 text-center">
          <p className="text-gray-500 text-sm sm:text-base">
            Chưa có sản phẩm trong flash sale này
          </p>
        </div>
      )}
    </div>
  );
};

