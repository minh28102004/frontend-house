import React from 'react'
import ProductDetail from '@/modules/client/product-detail/ProductDetail'
import type { Metadata } from 'next'
import { config } from '@/config/config'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const res = await fetch(`${config.API_URL}${config.ROUTES.PRODUCTS.GET_BY_SLUG(slug)}`, {
      // Revalidate periodically; adjust as needed
      next: { revalidate: 300 },
      // Avoid sending cookies for public data
      credentials: 'omit',
      cache: 'force-cache',
    })
    
    if (!res.ok) {
      return { 
        title: 'SẢN PHẨM',
        description: 'Chi tiết sản phẩm'
      }
    }
    
    const product = await res.json()
    
    // Lấy tên sản phẩm - đây là thông tin chính cho metadata
    const productName = product?.name ? product.name.toUpperCase() : 'SẢN PHẨM'
    
    // Lấy mô tả sản phẩm và làm sạch HTML tags
    const rawDesc: string | undefined = typeof product?.description === 'string' ? product.description : undefined
    const plainDesc = rawDesc 
      ? rawDesc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160) 
      : `Xem chi tiết sản phẩm ${productName}`
    
    // Lấy ảnh thumbnail hoặc ảnh đầu tiên trong gallery
    const ogImage: string | undefined = (() => {
      // Ưu tiên thumbnail
      let thumb: unknown = product?.thumbnail
      
      // Nếu không có thumbnail, lấy ảnh đầu tiên trong gallery
      if (!thumb && Array.isArray(product?.gallery) && product.gallery.length > 0) {
        thumb = product.gallery[0]
      }
      
      if (typeof thumb !== 'string' || !thumb) return undefined
      
      // Nếu là URL đầy đủ thì trả về luôn
      if (/^https?:\/\//i.test(thumb)) return thumb
      
      // Xử lý relative path
      const path = thumb.startsWith('/') ? thumb : `/${thumb}`
      const base = config.API_URL || config.APP_URL
      if (!base) return undefined
      
      return `${base.replace(/\/$/, '')}${path}`
    })()

    // Tạo URL canonical
    const canonicalUrl = `${config.APP_URL || ''}/san-pham/${slug}`

    return {
      title: productName,
      description: plainDesc,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: productName,
        description: plainDesc,
        images: ogImage ? [ogImage] : undefined,
        type: 'website',
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: productName,
        description: plainDesc,
        images: ogImage ? [ogImage] : undefined,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for product:', error)
    return { 
      title: 'SẢN PHẨM',
      description: 'Chi tiết sản phẩm'
    }
  }
}

export default async function ProductDetailApp({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <ProductDetail slug={slug} />
    </div>
  )
}
