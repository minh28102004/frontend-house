"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCartModal } from "@/context/CartModalContext";
import { FiX } from "react-icons/fi";

const CartModalMobile = () => {
  const { isOpen, closeModal } = useCartModal();
  const router = useRouter();
  const {
    items,
    itemCount,
    totalPrice,
    removeFromCart,
    updateCartItem,
    isLoading,
  } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleRemoveItem = async (productId: string, size: string) => {
    const itemKey = `${productId}-${size}`;
    setUpdatingItems((prev) => new Set(prev).add(itemKey));
    try {
      await removeFromCart(productId, size);
    } catch (error) {
      console.error("Error removing cart item:", error);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  };

  const handleSizeChange = async (productId: string, currentSize: string, newSize: string, quantity: number) => {
    if (currentSize === newSize) return;

    const itemKey = `${productId}-${currentSize}`;
    setUpdatingItems((prev) => new Set(prev).add(itemKey));
    try {
      await updateCartItem(productId, quantity, currentSize, newSize);
    } catch (error) {
      console.error("Error updating size:", error);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  };

  const handleQuantityChange = async (productId: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const itemKey = `${productId}-${size}`;
    setUpdatingItems((prev) => new Set(prev).add(itemKey));
    try {
      await updateCartItem(productId, newQuantity, size);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] md:hidden"
      onClick={closeModal}
    >
      {/* Backdrop - chỉ che phần dưới header */}
      <div className="fixed inset-0 bg-black/50 z-[10001]" style={{ top: '64px' }} />

      {/* Modal Content - Dropdown from header */}
      <div
        className="fixed top-[64px] left-0 right-0 bg-white w-full max-h-[calc(100vh-64px)] flex flex-col shadow-xl animate-slide-down"
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 10001 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            GIỎ HÀNG CỦA TÔI {itemCount > 0 && `(${itemCount})`}
          </h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <FiX className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-20 h-20 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-base mb-2">Giỏ hàng trống</p>
              <p className="text-gray-400 text-sm">
                Hãy thêm sản phẩm vào giỏ hàng của bạn
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemKey = `${item.productId}-${item.size}`;
                const isUpdating = updatingItems.has(itemKey);
                return (
                  <div
                    key={itemKey}
                    className="flex gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/san-pham/${item.productSlug}`}
                      onClick={closeModal}
                      className="flex-shrink-0"
                    >
                      <div className="w-20 h-24 bg-gray-100 rounded overflow-hidden">
                        {item.productThumbnail ? (
                          <img
                            src={item.productThumbnail}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/san-pham/${item.productSlug}`}
                          onClick={closeModal}
                          className="block"
                        >
                          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                            {item.productName}
                          </h3>
                        </Link>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          {/* Size Selector */}
                          <div>
                            <select
                              id={`size-select-${itemKey}`}
                              value={item.size}
                              onChange={(e) => handleSizeChange(item.productId, item.size, e.target.value, item.quantity)}
                              disabled={isUpdating || isLoading}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map((sizeOption) => (
                                <option key={sizeOption} value={sizeOption}>
                                  {sizeOption}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.size, item.quantity - 1)}
                              disabled={isUpdating || isLoading || item.quantity <= 1}
                              className="px-2 py-1 border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value);
                                if (newQty >= 1) {
                                  handleQuantityChange(item.productId, item.size, newQty);
                                }
                              }}
                              disabled={isUpdating || isLoading}
                              className="w-12 text-center border-t border-b border-gray-300 py-1 text-xs focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                              min="1"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.size, item.quantity + 1)}
                              disabled={isUpdating || isLoading}
                              className="px-2 py-1 border border-gray-300 rounded-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          <p className="font-semibold text-gray-900">
                            Giá/sp: {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="flex-shrink-0 flex items-start">
                      <button
                        onClick={() => handleRemoveItem(item.productId, item.size)}
                        disabled={isUpdating || isLoading}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Xóa sản phẩm"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Tạm tính:</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                Tiếp tục mua sắm
              </button>
              <button
                onClick={() => {
                  closeModal();
                  router.push("/cart");
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                Xem giỏ hàng
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CartModalMobile;
