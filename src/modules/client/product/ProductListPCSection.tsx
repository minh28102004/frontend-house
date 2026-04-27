"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  useCategoryBySlug,
  useProductsByCategory,
} from "./hooks/useClientProducts";
import Product from "../common/components/ProductDesktop";
import { Product as ProductType } from "./services/client.product.service";
import CategoryHeroBanner from "./components/CategoryHeroBanner";

function ProductList({ products }: { products: ProductType[] }) {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Product
            key={product._id}
            p={{
              _id: product._id,
              name: product.name,
              slug: product.slug,
              thumbnail: product.thumbnail,
              currentPrice: product.currentPrice,
              discountPrice: product.discountPrice,
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default function ProductListPCSection({ slug }: { slug: string }) {
  const isAllProducts = !slug;
  const { category, loading: loadingCategory } = useCategoryBySlug(slug || "");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const hasRestoredFromCache = useRef(false);

  const storageKey = useMemo(
    () => `product-list-pc-scroll-${slug || "all"}`,
    [slug]
  );

  const { products, loading, error, totalPages } = useProductsByCategory(
    isAllProducts ? null : category,
    slug || null,
    page,
  );

  // Accumulate products for infinite scroll
  useEffect(() => {
    if (!loading) {
      if (page === 1) {
        setAllProducts(products);
      } else {
        setAllProducts((prev) => {
          const map = new Map<string, ProductType>();
          prev.forEach((p) => {
            if (p._id) map.set(p._id, p);
          });
          products.forEach((p) => {
            if (p._id) map.set(p._id, p);
          });
          return Array.from(map.values());
        });
      }
      setHasMore(page < totalPages);
    }
  }, [products, loading, page, totalPages]);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => prev + 1);
          }
        },
        { rootMargin: '400px 0px', threshold: 0.1 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const sortedProducts = useMemo(() => {
    const copy = [...allProducts];
    const getLowestPrice = (product: ProductType) => {
      return product.discountPrice || product.currentPrice || product.basePrice || 0;
    };
    switch (sortOption) {
      case "price-asc":
        return copy.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
      case "price-desc":
        return copy.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
      case "newest":
        return copy.sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
        );
      case "oldest":
        return copy.sort(
          (a, b) =>
            new Date(a.publishedAt || a.createdAt).getTime() -
            new Date(b.publishedAt || b.createdAt).getTime()
        );
      default:
        return copy;
    }
  }, [allProducts, sortOption]);

  if (!isAllProducts && loadingCategory) {
    return (
      <main className="p-4 text-center text-gray-500 text-sm">
        Đang tải danh mục sản phẩm...
      </main>
    );
  }

  return (
    <div>
      <CategoryHeroBanner category={category} isAllProducts={isAllProducts} />
      <main className="space-y-4 mt-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {loading && page === 1 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            Đang tải sản phẩm...
          </div>
        ) : !loading && allProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">
            Không có sản phẩm nào trong danh mục này.
          </p>
        ) : (
          <>
            <ProductList products={sortedProducts} />
            {hasMore && <div ref={loadMoreRef} className="h-10" />}
            {loading && page > 1 && (
              <p className="text-center text-sm text-gray-400">Đang tải thêm...</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
