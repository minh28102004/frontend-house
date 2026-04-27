'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: string | number
  image: string
  slug?: string
}

interface ProductNewProps {
  title?: string
  products?: Product[]
  className?: string
}

const ProductNew: React.FC<ProductNewProps> = ({
  title = 'Sản phẩm tương tự',
  products,
  className = '',
}) => {
  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
    }
    return `₫ ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/san-pham/${product.slug}`}
              className="block group"
            >
              <div className="bg-gray-50 overflow-hidden">
                <Image
                  src={product.image || '/images/product.webp'}
                  alt={product.name}
                  width={400}
                  height={600}
                  className="w-full aspect-[2/3] object-cover"
                />
              </div>
              <div className="py-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-gray-600">
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductNew
