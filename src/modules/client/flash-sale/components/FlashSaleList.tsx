"use client";

import React from "react";
import { FlashSale } from "../models/flash-sale.model";
import { FlashSaleCard } from "./FlashSaleCard";

interface FlashSaleListProps {
  flashSales: FlashSale[];
  showProducts?: boolean;
  maxProductsPerSale?: number;
  isLoading?: boolean;
}

export const FlashSaleList: React.FC<FlashSaleListProps> = ({
  flashSales,
  showProducts = false,
  maxProductsPerSale = 4,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-200" />
          <div className="p-6 md:p-8 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (flashSales.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không có flash sale nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Chỉ hiển thị 1 card đầu tiên, full width */}
      {flashSales.length > 0 && (
        <FlashSaleCard
          key={flashSales[0].slug || flashSales[0]._id}
          flashSale={flashSales[0]}
          showProducts={showProducts}
          maxProducts={maxProductsPerSale}
        />
      )}
    </div>
  );
};

