'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import styles from './MenuMobile.module.css';

interface MenuMobileProps {
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/mobile/indexMobile' },
  { label: 'Phòng', href: '/mobile/roomsMobile' },
  { label: 'Giới thiệu', href: '/mobile/aboutMobile' },
  { label: 'Liên hệ', href: '/mobile/contactMobile' },
  { label: 'Tin tức', href: '/mobile/newsMobile' },
];

const ArrowIcon = () => (
  <svg
    className={styles.drawerLinkArrow}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function MenuMobile({
  subtitle = 'Homestay boutique sáng tạo',
  ctaText = 'Đặt phòng ngay',
  ctaHref = '/booking',
}: MenuMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scrollPositionRef = useRef(0);
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  const openMenu = () => {
    scrollPositionRef.current =
      window.pageYOffset || document.documentElement.scrollTop;
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.top = `-${scrollPositionRef.current}px`;
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollPositionRef.current);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    if (isOpen) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
    };
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);

  return (
    <header className={styles.header} role="banner">
      <div className={styles.headerInner}>

        {/* Brand */}
        <Link href="/mobile/indexMobile" className={styles.brand} aria-label="Another House — home">
          <img
            src="/img/logo2.png"
            className={styles.brandLogo}
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
          />
          <div className={styles.brandText}>
            <div className={styles.brandName}>Another House</div>
            <div className={styles.brandSub}>{subtitle}</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.navDesktop} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkCurrent : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className={styles.actionsDesktop}>
          <Link href={ctaHref} className={styles.cta}>
            <span className={styles.ctaSpan}>{ctaText}</span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`${styles.toggle} ${isOpen ? styles.toggleActive : ''}`}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-controls="ahDrawer"
          type="button"
          onClick={openMenu}
        >
          <div className={styles.toggleIcon}>
            <span className={styles.toggleLine} />
            <span className={styles.toggleLine} />
            <span className={styles.toggleLine} />
          </div>
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      {/* Mobile Drawer */}
      <nav
        id="ahDrawer"
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className={styles.drawerHead}>
          <div className={styles.drawerTitle}>Menu</div>
          <button
            className={styles.drawerClose}
            aria-label="Close menu"
            type="button"
            onClick={closeMenu}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className={styles.drawerNav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.drawerLink} ${isActive(link.href) ? styles.drawerLinkCurrent : ''}`}
              onClick={() => setTimeout(closeMenu, 100)}
            >
              {link.label}
              <ArrowIcon />
            </Link>
          ))}
        </div>

        <div
          className={styles.drawerLang}
          role="group"
          aria-label={language === 'vi' ? 'Chọn ngôn ngữ' : 'Choose language'}
        >
          <span className={styles.drawerLangLabel}>
            {language === 'vi' ? 'Ngôn ngữ' : 'Language'}
          </span>
          <div className={styles.drawerLangToggle}>
            <button
              type="button"
              className={`${styles.drawerLangBtn} ${language === 'vi' ? styles.drawerLangBtnActive : ''}`}
              aria-pressed={language === 'vi'}
              onClick={() => setLanguage('vi')}
            >
              Tiếng Việt
            </button>
            <button
              type="button"
              className={`${styles.drawerLangBtn} ${language === 'en' ? styles.drawerLangBtnActive : ''}`}
              aria-pressed={language === 'en'}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
          </div>
        </div>

        <div className={styles.drawerFooter}>
          <Link
            href="/cart"
            className={styles.drawerCartLink}
            onClick={() => setTimeout(closeMenu, 100)}
          >
            <span>{language === 'vi' ? 'Giỏ hàng' : 'Cart'}</span>
            {itemCount > 0 && (
              <span className={styles.drawerCartBadge} aria-hidden>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated && (
            <div className={styles.drawerAccountLinks}>
              <Link
                href="/profile"
                className={styles.drawerAccountLink}
                onClick={() => setTimeout(closeMenu, 100)}
              >
                {language === 'vi' ? 'Hồ sơ tài khoản' : 'My account'}
              </Link>
              <Link
                href="/my-room"
                className={styles.drawerAccountLink}
                onClick={() => setTimeout(closeMenu, 100)}
              >
                {language === 'vi' ? 'Phòng của bạn' : 'Your room'}
              </Link>
            </div>
          )}
          <Link href="/login" className={styles.drawerLogin} onClick={() => setTimeout(closeMenu, 100)}>
            Login
          </Link>
          <Link href={ctaHref} className={styles.drawerCta} onClick={() => setTimeout(closeMenu, 100)}>
            {ctaText}
          </Link>
          <div className={styles.drawerTagline}>
            Boutique mood · Minimal luxury · Unique concepts
          </div>
        </div>
      </nav>
    </header>
  );
}