'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ProductImagesProps {
  images?: string[]
  alt?: string
}

const ProductImages: React.FC<ProductImagesProps> = ({
  images = [],
  alt,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-100 flex items-center justify-center text-sm text-gray-500">
        Chưa có hình ảnh sản phẩm
      </div>
    )
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 mb-4">
        <Image
          src={images[activeIndex]}
          alt={`${alt} ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 w-16 h-20 bg-gray-100 overflow-hidden ${
                index === activeIndex ? 'ring-2 ring-gray-900' : ''
              }`}
            >
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                width={64}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImages
