"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  productId: string;
  productSlug: string;
  productName: string;
  productThumbnail?: string;
  price: number;
  className?: string;
}

export const AddToCartButton = ({
  productId,
  productSlug,
  productName,
  productThumbnail,
  price,
  className = "",
}: AddToCartButtonProps) => {
  const { addToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addToCart(productId, 1, {
        productSlug,
        productName,
        productThumbnail,
        price,
      });
      // Có thể thêm toast notification ở đây
      alert("Đã thêm vào giỏ hàng!");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      alert(error.message || "Lỗi khi thêm vào giỏ hàng");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || isLoading}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isAdding || isLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
    </button>
  );
};

