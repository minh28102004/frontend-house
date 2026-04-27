"use client";

import React from "react";
import Link from "next/link";
import { useActiveFlashSales } from "../hooks/useFlashSale";
import { FlashSaleCard } from "./FlashSaleCard";

interface FlashSaleSectionProps {
  title?: string;
  maxItems?: number;
  showProducts?: boolean;
  maxProductsPerSale?: number;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  title = "Flash Sale",
  maxItems = 3,
  showProducts = true,
  maxProductsPerSale = 4,
}) => {
  const { flashSales, loading, error } = useActiveFlashSales();

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: maxItems }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !flashSales || flashSales.length === 0) {
    return null; // Không hiển thị gì nếu không có flash sale
  }

  const displayFlashSales = flashSales.slice(0, maxItems);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        {flashSales.length > maxItems && (
          <Link
            href="/flash-sale"
            className="text-gray-700 hover:text-gray-900 font-medium text-sm md:text-base"
          >
            Xem tất cả →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayFlashSales.map((flashSale) => (
          <FlashSaleCard
            key={flashSale.slug || flashSale._id}
            flashSale={flashSale}
            showProducts={showProducts}
            maxProducts={maxProductsPerSale}
          />
        ))}
      </div>
    </section>
  );
};

