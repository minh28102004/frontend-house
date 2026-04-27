"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  useCategoryBySlug,
  useProductsByCategory,
} from "./hooks/useClientProducts";
import Product from "../common/components/ProductMobile";
import { Product as ProductType } from "./services/client.product.service";
import CategoryHeroBanner from "./components/CategoryHeroBanner";

function ProductCard({
  product,
  onClick,
}: {
  product: ProductType;
  onClick?: () => void;
}) {
  return (
    <article
      className="relative bg-white h-full"
      onClick={onClick}
      itemScope
      itemType="https://schema.org/Product"
    >
      <Product
        p={{
          _id: product._id,
          name: product.name,
          slug: product.slug,
          thumbnail: product.thumbnail,
          gallery: product.gallery,
          currentPrice: product.currentPrice,
          discountPrice: product.discountPrice,
        }}
      />
    </article>
  );
}

export default function ProductListMobileSection({ slug }: { slug: string }) {
  const isAllProducts = !slug;
  const { category, loading: loadingCategory } = useCategoryBySlug(slug || "");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const hasRestoredFromCache = useRef(false);
  const scrollToRestore = useRef<number | null>(null);
  const hasScrolled = useRef(false);
  const isLoadingForScroll = useRef(false); // Flag để tránh load quá nhiều lần
  const currentSlugRef = useRef<string | null>(null); // Track slug hiện tại để phát hiện khi quay lại

  const storageKey = useMemo(
    () => `product-list-mobile-scroll-${slug || "all"}`,
    [slug]
  );

  const { products, loading, error, totalPages } = useProductsByCategory(
    isAllProducts ? null : category,
    slug || null,
    page,
  );

  // Điều khiển hành vi scroll mặc định của trình duyệt khi dùng nút Back
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  // Khôi phục cache (sản phẩm đã load, trang hiện tại, hasMore, scrollY)
  // Chỉ restore scroll position nếu có flag đánh dấu quay lại từ trang chi tiết
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (!saved) {
        currentSlugRef.current = slug || "all";
        return;
      }

      const parsed = JSON.parse(saved) as {
        scrollY?: number;
        products?: ProductType[];
        page?: number;
        hasMore?: boolean;
        shouldRestoreScroll?: boolean; // Flag đánh dấu cần restore scroll
      };

      // Kiểm tra xem có flag đánh dấu quay lại từ trang chi tiết không
      const shouldRestore = parsed.shouldRestoreScroll === true;

      if (Array.isArray(parsed.products) && parsed.products.length > 0) {
        setAllProducts(parsed.products);
      }
      if (typeof parsed.page === "number" && parsed.page > 1) {
        setPage(parsed.page);
      }
      if (typeof parsed.hasMore === "boolean") {
        setHasMore(parsed.hasMore);
      }

      // Chỉ restore scrollY nếu có flag shouldRestoreScroll
      // Điều này đảm bảo chỉ restore khi quay lại từ trang chi tiết
      if (shouldRestore && typeof parsed.scrollY === "number") {
        scrollToRestore.current = parsed.scrollY;
        hasScrolled.current = false;
        isLoadingForScroll.current = false; // Reset flag khi restore
        // KHÔNG xóa flag ở đây, sẽ xóa sau khi scroll hoàn thành
      } else {
        // Nếu không có flag, không restore scroll position
        scrollToRestore.current = null;
        hasScrolled.current = false;
      }

      hasRestoredFromCache.current = shouldRestore;
      currentSlugRef.current = slug || "all";
    } catch {
      // ignore JSON / storage errors
      currentSlugRef.current = slug || "all";
    }
  }, [storageKey, slug]);

  // Scroll về vị trí đã lưu sau khi DOM đã render xong
  // Scroll về vị trí đã click bất kể page là bao nhiêu
  // Tự động load thêm products nếu cần để đạt đến vị trí đó
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (scrollToRestore.current === null) return;
    if (hasScrolled.current && !isLoadingForScroll.current) return; // Đã scroll và không đang load để scroll

    // Đợi cho đến khi không còn loading và đã có products
    if (loading && page === 1) return;
    if (allProducts.length === 0) return;

    const targetY = scrollToRestore.current;

    // Sử dụng requestAnimationFrame để đảm bảo DOM đã render trước khi kiểm tra
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Tính chiều cao tối đa có thể scroll hiện tại
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const maxScrollableHeight = Math.max(0, scrollHeight - clientHeight);

        // Nếu targetY vượt quá chiều cao hiện có, cần load thêm products
        if (targetY > maxScrollableHeight + 50 && scrollToRestore.current === targetY) { // Cho phép sai số 50px
          // Chưa có đủ products, cần load thêm
          if (!loading && hasMore && page < totalPages && !isLoadingForScroll.current) {
            isLoadingForScroll.current = true;
            setPage((prev) => prev + 1);
            return; // Chờ load thêm products, sẽ chạy lại useEffect khi products được load
          }
        }

        // Đã có đủ products hoặc không còn products để load, thực hiện scroll
        if (scrollToRestore.current === targetY && !hasScrolled.current) {
          isLoadingForScroll.current = false; // Reset flag

          // Scroll về vị trí target
          window.scrollTo({
            top: targetY,
            behavior: "auto",
          });

          // Đánh dấu đã scroll
          hasScrolled.current = true;

          // Kiểm tra lại sau một chút để đảm bảo scroll thành công
          // (Next.js có thể scroll về đầu trang sau đó)
          setTimeout(() => {
            const finalY = window.scrollY || window.pageYOffset || 0;

            if (Math.abs(finalY - targetY) > 20 && scrollToRestore.current === targetY) {
              // Nếu bị scroll về đầu trang hoặc vị trí khác, scroll lại một lần nữa
              window.scrollTo({
                top: targetY,
                behavior: "auto",
              });

              // Đợi thêm một chút rồi clear và xóa flag
              setTimeout(() => {
                scrollToRestore.current = null;
                isLoadingForScroll.current = false;
                // Xóa flag shouldRestoreScroll sau khi scroll hoàn thành
                try {
                  const saved = sessionStorage.getItem(storageKey);
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    sessionStorage.setItem(
                      storageKey,
                      JSON.stringify({
                        ...parsed,
                        shouldRestoreScroll: false,
                      })
                    );
                  }
                } catch {
                  // ignore storage errors
                }
              }, 100);
            } else {
              // Đã ở đúng vị trí, clear và xóa flag
              scrollToRestore.current = null;
              isLoadingForScroll.current = false;
              // Xóa flag shouldRestoreScroll sau khi scroll hoàn thành
              try {
                const saved = sessionStorage.getItem(storageKey);
                if (saved) {
                  const parsed = JSON.parse(saved);
                  sessionStorage.setItem(
                    storageKey,
                    JSON.stringify({
                      ...parsed,
                      shouldRestoreScroll: false,
                    })
                  );
                }
              } catch {
                // ignore storage errors
              }
            }
          }, 555);
        }
      });
    });
  }, [allProducts.length, loading, page, hasMore, totalPages, storageKey]);

  const handleProductClick = useCallback(() => {
    if (typeof window === "undefined") return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    try {
      const saved = sessionStorage.getItem(storageKey);
      let parsed: {
        scrollY?: number;
        products?: ProductType[];
        page?: number;
        hasMore?: boolean;
        shouldRestoreScroll?: boolean;
      } = {};
      if (saved) {
        parsed = JSON.parse(saved);
      }

      // Lưu scrollY và đánh dấu cần restore khi quay lại
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          ...parsed,
          scrollY,
          shouldRestoreScroll: true, // Đánh dấu cần restore scroll khi quay lại
        })
      );
    } catch {
      // ignore storage errors
    }
  }, [storageKey]);

  // Accumulate products for infinite scroll
  useEffect(() => {
    if (!loading) {
      if (page === 1) {
        setAllProducts(products);
      } else {
        setAllProducts((prev) => {
          // Dùng Map theo _id để loại bỏ sản phẩm trùng
          const map = new Map<string, ProductType>();

          prev.forEach((p) => {
            if (p._id) {
              map.set(p._id, p);
            }
          });

          products.forEach((p) => {
            if (p._id) {
              map.set(p._id, p);
            }
          });

          return Array.from(map.values());
        });
      }
      setHasMore(page < totalPages);
    }
  }, [products, loading, page, totalPages]);

  // Lưu cache danh sách sản phẩm + trạng thái phân trang mỗi khi thay đổi
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem(storageKey);
      let parsed: {
        scrollY?: number;
        shouldRestoreScroll?: boolean;
      } = {};
      if (saved) {
        parsed = JSON.parse(saved);
      }

      // Giữ nguyên scrollY và shouldRestoreScroll khi lưu products, page, hasMore
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          ...parsed,
          products: allProducts,
          page,
          hasMore,
        })
      );
    } catch {
      // ignore JSON / storage errors
    }
  }, [allProducts, page, hasMore, storageKey]);

  // Reset when category changes
  useEffect(() => {
    // Nếu slug thay đổi (chuyển sang danh mục khác), reset tất cả
    if (currentSlugRef.current !== null && currentSlugRef.current !== (slug || "all")) {
      // Đây là danh mục mới, không phải quay lại từ trang chi tiết
      // Xóa flag shouldRestoreScroll của danh mục cũ nếu có
      try {
        const oldStorageKey = `product-list-mobile-scroll-${currentSlugRef.current}`;
        const saved = sessionStorage.getItem(oldStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          sessionStorage.setItem(
            oldStorageKey,
            JSON.stringify({
              ...parsed,
              shouldRestoreScroll: false, // Xóa flag của danh mục cũ
            })
          );
        }
      } catch {
        // ignore storage errors
      }

      setPage(1);
      setAllProducts([]);
      setHasMore(true);
      hasScrolled.current = false;
      scrollToRestore.current = null;
      hasRestoredFromCache.current = false;
      currentSlugRef.current = slug || "all";
      return;
    }

    // Nếu đã khôi phục từ cache (quay lại từ trang chi tiết) thì không reset,
    // chỉ reset khi thực sự đổi sang category khác mà không có cache.
    if (hasRestoredFromCache.current) {
      hasRestoredFromCache.current = false; // Reset flag để lần sau có thể restore lại
      return;
    }

    // Nếu category._id thay đổi nhưng slug không đổi (có thể là reload hoặc update)
    // Chỉ reset nếu chưa có cache
    setPage(1);
    setAllProducts([]);
    setHasMore(true);
    hasScrolled.current = false; // Reset scroll flag khi category thay đổi
  }, [category?._id, slug]);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
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
            <section className="grid grid-cols-2 gap-2">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={handleProductClick}
                />
              ))}
            </section>
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
