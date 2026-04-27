import React from 'react';
import type { Metadata } from 'next';
import CartPage from '@/modules/client/cart/CartPage';

export const metadata: Metadata = {
  title: 'Giỏ hàng',
  description: 'Xem và quản lý giỏ hàng của bạn trước khi thanh toán.',
};

export default function CartRoutePage() {
  return <CartPage />;
}
