'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface ProductSidebarProps {
  productId?: string
  productSlug?: string
  productName?: string
  productThumbnail?: string
  sold?: number
  currentPrice?: string | number
  discountPrice?: string | number
  description?: string
  mainCategory?: string
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  productId,
  productSlug,
  productName,
  productThumbnail,
  sold,
  currentPrice,
  discountPrice,
  description,
  mainCategory,
}) => {
  const { addToCart, isLoading: isCartLoading } = useCart()
  const [selectedSize, setSelectedSize] = useState('M')
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL']

  const formatPrice = (value?: string | number) => {
    const numValue = typeof value === 'number' ? value : (value != null && value !== '' ? parseFloat(String(value)) : 0)
    if (numValue <= 0) return ''
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numValue)
  }

  const numCurrentPrice = typeof currentPrice === 'number' ? currentPrice : (currentPrice != null && currentPrice !== '' ? parseFloat(String(currentPrice)) : 0)
  const numDiscountPrice = typeof discountPrice === 'number' ? discountPrice : (discountPrice != null && discountPrice !== '' ? parseFloat(String(discountPrice)) : 0)

  const hasPrice = (numCurrentPrice > 0) || (numDiscountPrice > 0)

  const normalizeCategory = (category?: string) => {
    if (!category) return ''
    return category.toLowerCase().replace(/[_\s-]/g, '').replace(/á/g, 'a')
  }

  const normalizedCategory = normalizeCategory(mainCategory)
  const showSizeGuide = normalizedCategory && (
    normalizedCategory === 'vest' ||
    normalizedCategory === 'aosomi'
  )

  const handleAddToCart = async () => {
    if (!productId) {
      alert('Thông tin sản phẩm không đầy đủ')
      return
    }

    try {
      setIsAddingToCart(true)
      const price = numDiscountPrice > 0 ? numDiscountPrice : numCurrentPrice

      await addToCart(productId, 1, {
        productSlug,
        productName,
        productThumbnail,
        price: price || 0,
        size: selectedSize
      })

      alert('Đã thêm vào giỏ hàng!')
    } catch (error: any) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-medium text-gray-900">
        {productName}
      </h1>

      {sold !== undefined && sold > 0 && (
        <p className="text-sm text-gray-500">Đã bán: {sold}</p>
      )}

      {/* Price */}
      {hasPrice ? (
        numDiscountPrice > 0 ? (
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-medium text-gray-900">
              {formatPrice(discountPrice)}
            </span>
            {numCurrentPrice > 0 && numCurrentPrice !== numDiscountPrice && (
              <span className="text-base text-gray-400 line-through">
                {formatPrice(currentPrice)}
              </span>
            )}
          </div>
        ) : numCurrentPrice > 0 ? (
          <div className="text-2xl font-medium text-gray-900">
            {formatPrice(currentPrice)}
          </div>
        ) : null
      ) : null}

      {/* Size Selection */}
      {showSizeGuide && (
        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-gray-700">Kích cỡ</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm border rounded ${
                  selectedSize === size
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart || isCartLoading || !productId}
        className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
      </button>

      {/* Description */}
      {description && (
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Mô tả</h3>
          <div
            className="text-sm text-gray-600 space-y-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
    </div>
  )
}

export default ProductSidebar
