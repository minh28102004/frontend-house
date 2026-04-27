'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

export default function CartPage() {
  const router = useRouter();
  const { items, totalPrice, itemCount, updateCartItem, removeFromCart, isLoading } = useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleQuantityChange = async (productId: string, size: string, newQty: number) => {
    if (newQty < 1) return;
    const key = `${productId}-${size}`;
    setUpdatingItems((p) => new Set(p).add(key));
    try {
      await updateCartItem(productId, newQty, size);
    } finally {
      setUpdatingItems((p) => {
        const n = new Set(p);
        n.delete(key);
        return n;
      });
    }
  };

  const handleSizeChange = async (
    productId: string,
    currentSize: string,
    newSize: string,
    quantity: number,
  ) => {
    if (currentSize === newSize) return;
    const key = `${productId}-${currentSize}`;
    setUpdatingItems((p) => new Set(p).add(key));
    try {
      await updateCartItem(productId, quantity, currentSize, newSize);
    } finally {
      setUpdatingItems((p) => {
        const n = new Set(p);
        n.delete(key);
        return n;
      });
    }
  };

  const handleRemove = async (productId: string, size: string) => {
    const key = `${productId}-${size}`;
    setUpdatingItems((p) => new Set(p).add(key));
    try {
      await removeFromCart(productId, size);
    } finally {
      setUpdatingItems((p) => {
        const n = new Set(p);
        n.delete(key);
        return n;
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-gray-300"
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Giá» hÃ ng trá»‘ng</h2>
          <p className="text-gray-500 mb-8">Báº¡n chÆ°a cÃ³ sáº£n pháº©m nÃ o trong giá» hÃ ng.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Tiáº¿p tá»¥c mua sáº¯m
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Giá» hÃ ng</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {itemCount} sáº£n pháº©m
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-slate-900 hover:text-slate-600 flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Tiáº¿p tá»¥c mua sáº¯m
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => {
              const key = `${item.productId}-${item.size}`;
              const isUpdating = updatingItems.has(key);
              return (
                <div
                  key={key}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
                >
                  {/* Image */}
                  <Link
                    href={`/san-pham/${item.productSlug}`}
                    className="flex-shrink-0 w-24 h-28 sm:w-28 sm:h-32 bg-gray-100 rounded-xl overflow-hidden relative"
                  >
                    {item.productThumbnail ? (
                      <Image
                        src={item.productThumbnail}
                        alt={item.productName}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-200"
                        sizes="120px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <Link
                        href={`/san-pham/${item.productSlug}`}
                        className="block font-semibold text-gray-900 text-sm sm:text-base hover:text-green-700 transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        Size:{' '}
                        <select
                          value={item.size}
                          onChange={(e) =>
                            handleSizeChange(item.productId, item.size, e.target.value, item.quantity)
                          }
                          disabled={isUpdating || isLoading}
                          className="font-medium text-gray-700 border border-gray-200 rounded-md px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900/20 disabled:opacity-50"
                        >
                          {SIZES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      {/* Price */}
                      <p className="text-sm sm:text-base font-bold text-green-700">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, item.size, item.quantity - 1)
                          }
                          disabled={
                            isUpdating || isLoading || item.quantity <= 1
                          }
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Giáº£m"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-gray-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.productId, item.size, item.quantity + 1)
                          }
                          disabled={isUpdating || isLoading}
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="TÄƒng"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.productId, item.size)}
                        disabled={isUpdating || isLoading}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="XÃ³a"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6">
              <h2 className="text-base font-semibold text-gray-900">TÃ³m táº¯t Ä‘Æ¡n hÃ ng</h2>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sá»‘ lÆ°á»£ng sáº£n pháº©m</span>
                  <span className="font-medium text-gray-900">{itemCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Táº¡m tÃ­nh</span>
                  <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Tá»•ng cá»™ng</span>
                  <span className="text-lg font-bold text-green-700">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                GiÃ¡ Ä‘Ã£ bao gá»“m VAT. PhÃ­ ship Ä‘Æ°á»£c tÃ­nh khi giao hÃ ng.
              </p>

              <button
                onClick={() => router.push('/checkout')}
                className="mt-5 w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 active:bg-slate-950 transition-colors flex items-center justify-center gap-2"
              >
                Tiáº¿n hÃ nh thanh toÃ¡n
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <Link
                href="/"
                className="mt-3 w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Tiáº¿p tá»¥c mua sáº¯m
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

