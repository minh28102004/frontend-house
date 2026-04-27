"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCartModal } from "@/context/CartModalContext";
import { FiX, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

const CartModal = () => {
  const { isOpen, closeModal } = useCartModal();
  const router = useRouter();
  const {
    items,
    itemCount,
    totalPrice,
    updateCartItem,
    removeFromCart,
    isLoading,
  } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

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
      console.error("Error updating cart item:", error);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemKey);
        return next;
      });
    }
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] min-w-[300px] min-h-[70vh]  flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            GIỎ HÀNG CỦA BẠN {itemCount > 0 && `(ĐANG CÓ ${itemCount} SẢN PHẨM)`}
          </h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <FiX className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-24 h-24 mx-auto"
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
              <p className="text-gray-600 text-lg mb-2">Giỏ hàng trống</p>
              <p className="text-gray-400 text-sm">
                Hãy thêm sản phẩm vào giỏ hàng của bạn
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-900">
                      Sản phẩm
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-900">
                      Size
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-900">
                      Đơn giá
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-900">
                      Số lượng
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-gray-900">
                      Thành tiền
                    </th>
                    <th className="text-center py-3 px-3 text-sm font-semibold text-gray-900 w-10">
                      {/* Empty header for delete button */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const itemKey = `${item.productId}-${item.size}`;
                    const isUpdating = updatingItems.has(itemKey);
                    return (
                      <tr
                        key={itemKey}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        {/* Product Column */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/san-pham/${item.productSlug}`}
                              onClick={closeModal}
                              className="flex-shrink-0"
                            >
                              <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden">
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
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/san-pham/${item.productSlug}`}
                                onClick={closeModal}
                                className="block"
                              >
                                <h3 className="font-medium text-gray-900 hover:text-gray-700 mb-1">
                                  {item.productName}
                                </h3>
                              </Link>
                            </div>
                          </div>
                        </td>

                        {/* Size Column */}
                        <td className="py-3 px-3">
                          <select
                            value={item.size}
                            onChange={(e) => handleSizeChange(item.productId, item.size, e.target.value, item.quantity)}
                            disabled={isUpdating || isLoading}
                            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map((sizeOption) => (
                              <option key={sizeOption} value={sizeOption}>
                                {sizeOption}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Unit Price Column */}
                        <td className="py-3 px-3">
                          <p className="text-gray-900 font-medium text-sm">
                            {formatPrice(item.price)}
                          </p>
                        </td>

                        {/* Quantity Column */}
                        <td className="py-3 px-3">
                          <div className="flex items-center border border-gray-300 rounded w-fit">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              disabled={isUpdating || isLoading || item.quantity <= 1}
                              className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Giảm số lượng"
                            >
                              <FiMinus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                if (newQty > 0) {
                                  handleQuantityChange(item.productId, item.size, newQty);
                                }
                              }}
                              className="w-12 px-1.5 py-1.5 text-sm text-center border-0 focus:outline-none focus:ring-0"
                              min="1"
                              disabled={isUpdating || isLoading}
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              disabled={isUpdating || isLoading}
                              className="p-1.5 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Tăng số lượng"
                            >
                              <FiPlus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Subtotal Column */}
                        <td className="py-3 px-3">
                          <p className="text-gray-900 font-semibold text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </td>

                        {/* Delete Column */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.productId, item.size)}
                            disabled={isUpdating || isLoading}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            aria-label="Xóa sản phẩm"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-gray-700 text-sm">Tổng:</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 hover:border-gray-400 transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    router.push("/cart");
                  }}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
                >
                  Xem giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

