'use client'

import ProductImages from './components/ProductImages'
import ProductSidebar from './components/ProductSidebar'
import ProductNew from './components/ProductNew'
import { useProducts } from './hooks/useProducts'
import { useSimilarProducts } from './hooks/useSimilarProducts'
import MobileProductActions from './components/MobileProductActions'

interface ProductDetailProps {
  slug: string
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const { data, isLoading, error } = useProducts(slug)

  const mainCategory = data?.category?.main || data?.category?.slug
  const { products: similarProducts } = useSimilarProducts(mainCategory, slug, null)

  if (isLoading) return <div className="container py-20">Đang tải...</div>
  if (error || !data) return <div className="container py-20">Không tìm thấy sản phẩm</div>

  const images = [
    ...(data.thumbnail ? [data.thumbnail] : []),
    ...(data.gallery || []),
  ].filter(Boolean).filter(
    (url, i, arr) => arr.indexOf(url) === i,
  )

  const mappedSimilarProducts = similarProducts.map(p => ({
    id: p._id,
    name: p.name,
    price: p.discountPrice || p.currentPrice || 0,
    image: p.thumbnail || "/images/product.webp",
    slug: p.slug
  }))

  const buyPrice = data.discountPrice || data.currentPrice || 0

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT — images */}
          <div>
            <ProductImages images={images} alt={data.name} />
          </div>

          {/* RIGHT — sidebar */}
          <div>
            <ProductSidebar
              productId={data._id}
              productSlug={data.slug}
              productName={data.name}
              productThumbnail={data.thumbnail}
              sold={data.sold}
              currentPrice={data.currentPrice}
              discountPrice={data.discountPrice}
              description={data.description}
              mainCategory={mainCategory}
            />
          </div>
        </div>
      </div>

      {mappedSimilarProducts.length > 0 && (
        <div className="mt-12">
          <ProductNew products={mappedSimilarProducts} />
        </div>
      )}

      {/* Mobile actions */}
      <div className="md:hidden">
        {data._id && data.slug && data.name && (
          <MobileProductActions
            productId={data._id}
            productSlug={data.slug}
            productName={data.name}
            productThumbnail={data.thumbnail}
            price={buyPrice}
          />
        )}
      </div>
    </div>
  )
}
