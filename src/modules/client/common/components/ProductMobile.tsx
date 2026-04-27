"use client";

import React from 'react'
import Link from 'next/link'

const formatVnd = (value?: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

interface ModelProduct {
  _id?: string;
  name: string;
  slug: string;
  thumbnail?: string;
  gallery?: string[];
  currentPrice?: number;
  discountPrice?: number;
  type?: string;
}

type ProductProps = {
  p: ModelProduct;
  isLarge?: boolean;
};

const Product = ({ p, isLarge = false }: ProductProps) => {
  const { _id, name, slug, thumbnail, currentPrice, discountPrice } = p;

  return (
    <Link key={_id || slug} href={`/san-pham/${slug}`} className="block group">
      <div className="bg-gray-50 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="w-full aspect-[3/4] object-cover"
          />
        ) : (
          <div className="w-full aspect-[3/4] bg-gray-200" />
        )}
      </div>
      <div className="py-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-gray-600">{name}</h3>
        {discountPrice && discountPrice > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{formatVnd(discountPrice)}</span>
            {currentPrice && currentPrice > 0 && currentPrice !== discountPrice && (
              <span className="text-xs text-gray-400 line-through">{formatVnd(currentPrice)}</span>
            )}
          </div>
        ) : currentPrice && currentPrice > 0 ? (
          <span className="text-sm font-semibold text-gray-900">{formatVnd(currentPrice)}</span>
        ) : null}
      </div>
    </Link>
  )
}

export default Product
