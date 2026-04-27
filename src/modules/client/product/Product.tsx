"use client";

import React from 'react'
import Link from 'next/link'
import { useProductsByType } from './hooks/useProductsByType'

const formatVnd = (value?: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)

const Product = () => {
  const { groups, isLoading, error } = useProductsByType()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 h-64 rounded" />
        ))}
      </div>
    )
  }

  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      {groups.map((group) => (
        <section key={group.type} className="mb-10">
          <h2 className="text-lg font-medium text-gray-900 mb-4 uppercase">{group.type}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.products.map((p) => (
              <Link key={p.slug} href={`/san-pham/${p.slug}`} className="block group">
                <div className="bg-gray-50 overflow-hidden">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.name} className="w-full aspect-[3/4] object-cover" />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gray-200" />
                  )}
                </div>
                <div className="py-2">
                  <div className="text-sm font-medium line-clamp-2 mb-1">{p.name}</div>
                  {p.discountPrice && p.discountPrice > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatVnd(p.discountPrice)}</span>
                      {p.currentPrice && p.currentPrice > 0 && p.currentPrice !== p.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatVnd(p.currentPrice)}</span>
                      )}
                    </div>
                  ) : p.currentPrice && p.currentPrice > 0 ? (
                    <span className="text-sm font-semibold">{formatVnd(p.currentPrice)}</span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default Product
