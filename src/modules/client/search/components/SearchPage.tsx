"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { IoSearchOutline, IoCloseOutline } from "react-icons/io5";
import { API_URL_CLIENT, apiRoutes } from "@/config/apiRoutes";

interface Product {
  _id?: string;
  name: string;
  slug: string;
  thumbnail?: string;
  currentPrice?: number;
  discountPrice?: number;
}

const formatVnd = (value?: number | string | null) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numValue == null || isNaN(numValue) || numValue <= 0) return '';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numValue);
};

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNewest, setIsLoadingNewest] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isUpdatingFromUserInput = useRef(false);
  const isInitialized = useRef(false);
  const expectedUrlValue = useRef<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserTyping = useRef(false);

  const popularCategories = [
    { label: "Romantic", slug: "romantic" },
    { label: "Sky", slug: "sky" },
    { label: "Cinema", slug: "cinema" },
    { label: "Nature", slug: "nature" },
    { label: "Minimal", slug: "minimal" },
  ];

  // Initialize from URL params on mount and when URL changes externally (browser navigation)
  useEffect(() => {
    const q = searchParams.get('q') || '';

    // On first mount, always initialize from URL
    if (!isInitialized.current) {
      isInitialized.current = true;
      setSearchTerm(q);
      expectedUrlValue.current = q;
      if (q.trim()) {
        searchProducts(q.trim());
      } else {
        fetchNewestProducts();
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return;
    }

    // If we're updating from user input and URL matches what we set, ignore it
    if (isUpdatingFromUserInput.current && q === expectedUrlValue.current) {
      return;
    }

    // Don't sync from URL if user is actively typing (debounce timer exists)
    // This prevents losing user input while they're typing
    if (debounceTimerRef.current || isUserTyping.current) {
      return;
    }

    // Only sync if URL changed externally (browser navigation)
    // Compare with trimmed version since URL always has trimmed values
    const currentTrimmed = searchTerm.trim();
    if (q !== currentTrimmed) {
      setSearchTerm(q);
      expectedUrlValue.current = q;
      if (q.trim()) {
        searchProducts(q.trim());
      } else {
        fetchNewestProducts();
      }
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchNewestProducts = async () => {
    setIsLoadingNewest(true);
    try {
      const response = await fetch(
        `${API_URL_CLIENT}${apiRoutes.PRODUCTS.GET_ALL_BASIC_INFO(1)}`,
        { cache: 'no-store' }
      );
      if (response.ok) {
        const data = await response.json();
        setNewestProducts((data.data || []).slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching newest products:", error);
    } finally {
      setIsLoadingNewest(false);
    }
  };

  const searchProducts = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL_CLIENT}${apiRoutes.PRODUCTS.SEARCH(query, 1)}`,
        { cache: 'no-store' }
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search - update URL with trimmed value, but keep raw input in state
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = searchTerm.trim();

    // Mark that user is typing
    isUserTyping.current = true;

    if (!trimmed) {
      setSearchResults([]);
      fetchNewestProducts();
      // Only update URL if it's not already empty
      if (searchParams.get('q')) {
        const handler = setTimeout(() => {
          isUpdatingFromUserInput.current = true;
          expectedUrlValue.current = '';
          router.replace('/search', { scroll: false });
          setTimeout(() => {
            isUpdatingFromUserInput.current = false;
            isUserTyping.current = false;
          }, 200);
        }, 350);
        debounceTimerRef.current = handler;
      } else {
        isUserTyping.current = false;
      }
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
      };
    }

    const handler = setTimeout(() => {
      searchProducts(trimmed);
      // Only update URL if the trimmed value is different from current URL param
      const currentQ = searchParams.get('q') || '';
      if (trimmed !== currentQ) {
        isUpdatingFromUserInput.current = true;
        expectedUrlValue.current = trimmed;
        const params = new URLSearchParams();
        params.set('q', trimmed);
        router.replace(`/search?${params.toString()}`, { scroll: false });
        setTimeout(() => {
          isUpdatingFromUserInput.current = false;
          isUserTyping.current = false;
        }, 200);
      } else {
        isUserTyping.current = false;
      }
      debounceTimerRef.current = null;
    }, 350);

    debounceTimerRef.current = handler;

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      fetchNewestProducts();
      router.replace('/search', { scroll: false });
      return;
    }
    searchProducts(searchTerm.trim());
    const params = new URLSearchParams();
    params.set('q', searchTerm.trim());
    router.push(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    fetchNewestProducts();
    router.replace('/search', { scroll: false });
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="container mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto px-6">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  // Tăng độ lớn thanh search trên mobile: py-3 => py-4, sm:py-4 => sm:py-5
                  className="w-full border border-black rounded-full py-4 sm:py-5 pl-12 sm:pl-14 pr-12 sm:pr-14 text-base outline-none focus:border-black transition-colors"
                  value={searchTerm}
                  onChange={(e) => {
                    isUserTyping.current = true;
                    setSearchTerm(e.target.value);
                  }}
                  style={{
                    height: undefined,
                    fontSize: '16px', // Prevent iOS Safari auto-zoom on focus
                  }}
                />
                <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <IoSearchOutline className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={clearSearch}
                  >
                    <IoCloseOutline className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}
              </div>
            </form>
            {/* Popular category shortcuts */}
            {popularCategories.length > 0 && (
              <div className="mt-4 space-y-4 py-8">
                <div className="text-[13px] uppercase tracking-wide text-gray-500">
                  Các từ khóa phổ biến
                </div>
                <div className="flex flex-wrap gap-3 text-sm gap-10">
                  {popularCategories.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      className="py-1 text-sm sm:text-base transition py-4"
                      onClick={() => router.push(`/danh-muc/${item.slug}`)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

              </div>
            )}
            <hr className="border-gray-200" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {searchResults.length > 0 || isLoading ? (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-14">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="text-xl mb-6 text-gray-800 font-futura">
                    Kết quả tìm kiếm cho "{searchTerm}" ({searchResults.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id || product.slug}
                        href={`/san-pham/${product.slug}`}
                        className="block group overflow-hidden transition-all"
                      >
                        <div className="aspect-[3.33/5] bg-gray-50 overflow-hidden">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="p-3">
                          <div
                            className="text-sm font-medium line-clamp-2 mb-1"
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          {(() => {
                            const discountPriceFormatted = formatVnd(product.discountPrice);
                            const currentPriceFormatted = formatVnd(product.currentPrice);
                            const hasValidPrice = discountPriceFormatted || currentPriceFormatted;

                            if (!hasValidPrice) return null;

                            return (
                              <div className="flex items-center gap-2 flex-wrap">
                                {discountPriceFormatted ? (
                                  <>
                                    <span className="text-[13px] font-semibold text-gray-900">
                                      {discountPriceFormatted}
                                    </span>
                                    {currentPriceFormatted && product.currentPrice !== product.discountPrice && (
                                      <span className="text-[12px] text-gray-500 line-through">
                                        {currentPriceFormatted}
                                      </span>
                                    )}
                                  </>
                                ) : currentPriceFormatted ? (
                                  <span className="text-[13px] font-semibold text-gray-900">
                                    {currentPriceFormatted}
                                  </span>
                                ) : null}
                              </div>
                            );
                          })()}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                    <IoSearchOutline size={36} className="text-gray-400" />
                  </div>
                  <p className="text-xl font-medium mb-2">
                    Không tìm thấy sản phẩm phù hợp
                  </p>
                  <p className="text-sm text-gray-400">
                    Hãy thử từ khóa khác hoặc duyệt qua danh mục
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {isLoadingNewest ? (
                <div className="flex items-center justify-center py-14">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : newestProducts.length > 0 ? (
                <div>
                  <div className="text-lg mb-8 text-gray-800 font-futura px-6">
                    Sản phẩm mới nhất
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {newestProducts.map((product) => (
                      <Link
                        key={product._id || product.slug}
                        href={`/san-pham/${product.slug}`}
                        // Remove border and rounded-lg to make card no border radius (not bo góc)
                        className="block group overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="p-3">
                          <div
                            className="text-sm font-medium line-clamp-2 mb-1 text-center"
                            title={product.name}
                          >
                            {product.name}
                          </div>
                          {(() => {
                            const discountPriceFormatted = formatVnd(product.discountPrice);
                            const currentPriceFormatted = formatVnd(product.currentPrice);
                            const hasValidPrice = discountPriceFormatted || currentPriceFormatted;

                            if (!hasValidPrice) return null;

                            return (
                              <div className="flex items-center gap-2 flex-wrap justify-center">
                                {discountPriceFormatted ? (
                                  <>
                                    <span className="text-[13px] font-semibold text-gray-900 text-center">
                                      {discountPriceFormatted}
                                    </span>
                                    {currentPriceFormatted && product.currentPrice !== product.discountPrice && (
                                      <span className="text-[12px] text-gray-500 line-through text-center">
                                        {currentPriceFormatted}
                                      </span>
                                    )}
                                  </>
                                ) : currentPriceFormatted ? (
                                  <span className="text-[13px] font-semibold text-gray-900 text-center">
                                    {currentPriceFormatted}
                                  </span>
                                ) : null}
                              </div>
                            );
                          })()}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-gray-500">
                  <p className="text-xl">Không có sản phẩm nào</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
