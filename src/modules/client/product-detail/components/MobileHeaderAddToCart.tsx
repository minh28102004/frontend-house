'use client'

import React from 'react'
import { useCart } from '@/context/CartContext'
import { FiShoppingBag } from 'react-icons/fi'

interface MobileHeaderAddToCartProps {
  productId: string
  productSlug: string
  productName: string
  productThumbnail?: string
  price: number
}

export default function MobileHeaderAddToCart({
  productId,
  productSlug,
  productName,
  productThumbnail,
  price,
}: MobileHeaderAddToCartProps) {
  const { addToCart, isLoading } = useCart()
  const [isAdding, setIsAdding] = React.useState(false)

  const handleAdd = async () => {
    try {
      setIsAdding(true)
      await addToCart(productId, 1, {
        productSlug,
        productName,
        productThumbnail,
        price,
      })
      alert('Đã thêm vào giỏ hàng!')
    } catch (e: any) {
      alert(e?.message || 'Lỗi khi thêm vào giỏ hàng')
    } finally {
      setIsAdding(false)
    }
  }

  // Nút icon đơn giản, không fixed vị trí, không style cố định
  return (
    <button
      onClick={handleAdd}
      disabled={isAdding || isLoading}
      aria-label="Thêm vào giỏ hàng"
      style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
    >
      <FiShoppingBag size={22} className="text-gray-700" />
    </button>
  )
}
