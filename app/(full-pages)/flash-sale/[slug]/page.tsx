"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useFlashSaleBySlug } from "@/modules/client/flash-sale/hooks/useFlashSale";
import { FlashSaleDetail } from "@/modules/client/flash-sale/components/FlashSaleDetail";

const FlashSaleDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const { flashSale, loading, error } = useFlashSaleBySlug(slug);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600 py-12">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!flashSale) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy flash sale</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <FlashSaleDetail flashSale={flashSale} />
    </div>
  );
};

export default FlashSaleDetailPage;

