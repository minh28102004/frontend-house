"use client";

import React from "react";
import { useActiveFlashSales } from "./hooks/useFlashSale";
import { FlashSaleList } from "./components/FlashSaleList";

const FlashSale = () => {
  const { flashSales, loading, error } = useActiveFlashSales();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">FLASH SALE</h1>
        <p className="text-gray-600">
          Những ưu đãi đặc biệt dành riêng cho bạn
        </p>
      </div>
      <FlashSaleList flashSales={flashSales} isLoading={loading} />
    </div>
  );
};

export default FlashSale;

