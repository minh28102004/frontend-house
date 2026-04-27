'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { apiRoutes } from '@/config/apiRoutes';
import api from '@/config/api';
import styles from './ServicesModal.module.css';
import RoomChatPanel from './RoomChatPanel';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  children?: Category[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  currentPrice?: number;
  discountPrice?: number;
}

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Booking đang lưu trú — dùng cho tab Chat với lễ tân */
  bookingId?: string | null;
  roomName?: string | null;
}

export default function ServicesModal({
  isOpen,
  onClose,
  bookingId = null,
  roomName = null,
}: ServicesModalProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'chat' | 'store'>('store');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { addToCart, itemCount } = useCart();

  // Fetch categories
  useEffect(() => {
    if (!isOpen || activeTab !== 'store') return;

    const fetchCategories = async () => {
      try {
        const res = await api.get<Category[]>(apiRoutes.CATEGORIES_PRODUCT.GET_ALL);
        setCategories(res.data);
      } catch {
        // silently fail
      }
    };
    fetchCategories();
  }, [isOpen, activeTab]);

  // Fetch products by category
  const fetchProductsByCategory = useCallback(async (category: Category) => {
    setSelectedCategory(category);
    setLoadingProducts(true);
    try {
      // GET /api/productsapi?category=<categoryId>&page=1
      const url = `${apiRoutes.PRODUCTS.GET_ALL(1)}&category=${category._id}`;
      const res = await api.get<{ data: Product[] }>(url);
      setProducts(res.data?.data ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product._id, 1, {
        productSlug: product.slug,
        productName: product.name,
        productThumbnail: product.thumbnail,
        price: product.discountPrice ?? product.currentPrice ?? 0,
        size: 'M',
      });
    } catch {
      // silently fail
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const t = {
    vi: {
      services: 'Dịch vụ',
      chat: 'Chat',
      store: 'Cửa hàng',
      allProducts: 'Tất cả sản phẩm',
      loadingProducts: 'Đang tải sản phẩm...',
      addToCart: 'Thêm vào giỏ',
      addedToCart: 'Đã thêm!',
      noProducts: 'Không có sản phẩm nào.',
      cart: 'Giỏ hàng',
      viewCart: 'Xem giỏ hàng',
    },
    en: {
      services: 'Services',
      chat: 'Chat',
      store: 'Store',
      allProducts: 'All products',
      loadingProducts: 'Loading products...',
      addToCart: 'Add to cart',
      addedToCart: 'Added!',
      noProducts: 'No products found.',
      cart: 'Cart',
      viewCart: 'View cart',
    },
  };

  const txt = t[language === 'vi' ? 'vi' : 'en'];

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'store' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('store')}
            >
              {txt.store}
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'chat' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              {txt.chat}
            </button>
          </div>
          <div className={styles.headerActions}>
            {itemCount > 0 && (
              <Link href="/cart" className={styles.cartBadge} onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                <span className={styles.cartCount}>{itemCount}</span>
              </Link>
            )}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'store' && (
            <div className={styles.storeLayout}>
              {/* Sidebar: Categories */}
              <div className={styles.categorySidebar}>
                <button
                  className={`${styles.categoryItem} ${!selectedCategory ? styles.categoryItemActive : ''}`}
                  onClick={() => {
                    setSelectedCategory(null);
                    setProducts([]);
                  }}
                >
                  {txt.allProducts}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    className={`${styles.categoryItem} ${selectedCategory?._id === cat._id ? styles.categoryItemActive : ''}`}
                    onClick={() => fetchProductsByCategory(cat)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className={styles.productsArea}>
                {loadingProducts ? (
                  <div className={styles.loadingWrap}>
                    <div className={styles.spinner} />
                    <p>{txt.loadingProducts}</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className={styles.emptyWrap}>
                    <p>{txt.noProducts}</p>
                    <Link href="/san-pham" className={styles.shopLink} onClick={onClose}>
                      {txt.allProducts} →
                    </Link>
                  </div>
                ) : (
                  <div className={styles.productGrid}>
                    {products.map((product) => (
                      <div key={product._id} className={styles.productCard}>
                        <Link
                          href={`/san-pham/${product.slug}`}
                          className={styles.productImageWrap}
                          onClick={onClose}
                        >
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={product.name}
                              fill
                              className={styles.productImage}
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          ) : (
                            <div className={styles.productImagePlaceholder} />
                          )}
                          {(product.discountPrice ?? product.currentPrice) && (
                            <div className={styles.productPrice}>
                              {formatPrice(product.discountPrice ?? product.currentPrice)}
                            </div>
                          )}
                        </Link>
                        <div className={styles.productInfo}>
                          <Link
                            href={`/san-pham/${product.slug}`}
                            className={styles.productName}
                            onClick={onClose}
                          >
                            {product.name}
                          </Link>
                          <div className={styles.productPriceRow}>
                            {product.discountPrice ? (
                              <>
                                <span className={styles.priceNew}>
                                  {formatPrice(product.discountPrice)}
                                </span>
                                <span className={styles.priceOld}>
                                  {formatPrice(product.currentPrice)}
                                </span>
                              </>
                            ) : (
                              <span className={styles.priceNew}>
                                {formatPrice(product.currentPrice)}
                              </span>
                            )}
                          </div>
                          <button
                            className={styles.addToCartBtn}
                            onClick={() => handleAddToCart(product)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                            </svg>
                            {txt.addToCart}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className={styles.chatWrap}>
              <RoomChatPanel bookingId={bookingId} roomName={roomName ?? undefined} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
