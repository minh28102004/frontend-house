'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from './MenuPc.module.css';

interface MenuPcProps {
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  logoSrc?: string;
}

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Phòng', href: '/rooms' },
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Liên hệ', href: '/contact' },
  { label: 'Tin tức', href: '/posts' },
];

const DRAWER_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Phòng', href: '/rooms' },
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Liên hệ', href: '/contact' },
  { label: 'Tin tức', href: '/posts' },
];

const MenuPc: React.FC<MenuPcProps> = ({
  subtitle = 'Homestay boutique sáng tạo',
  ctaText = 'Đặt phòng ngay',
  ctaHref = '/booking',
  logoSrc = '/img/logo2.png',
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, hasAdminAccess } = useAuth();
  const { itemCount } = useCart();
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dashboardHref = user?.role === 'host' ? '/host' : '/admin';

  const openDrawer = () => {
    setIsDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    document.body.style.overflow = '';
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserMenuOpen((prev) => !prev);
  };

  const closeUserMenu = () => setIsUserMenuOpen(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        closeUserMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header className={styles.header} role="banner">
        <div className={styles.headerInner}>
          {/* Brand */}
          <Link href="/" className={styles.brand} aria-label="Another House — home">
            <div className={styles.brandMark}>
              <img src={logoSrc} className={styles.brandImg} alt="" aria-hidden="true" width={58} height={58} />
            </div>
            <div className={styles.brandText}>
              <div className={styles.brandName}>Another House</div>
              <div className={styles.brandSub}>{subtitle}</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop user menu */}
          <div className={styles.actions} ref={userMenuRef}>
            {/* Book now */}
            <Link href={ctaHref} className={styles.cta}>
              <span>{ctaText}</span>
            </Link>

            {/* User button */}
            <button
              type="button"
              className={styles.userBtn}
              onClick={toggleUserMenu}
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              {user?.avatar?.trim() ? (
                <img src={user.avatar.trim()} alt="" className={styles.userAvatar} width={32} height={32} />
              ) : (
                <svg
                  className={styles.userIconSvg}
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className={styles.userMenu}>
                {isAuthenticated ? (
                  <>
                    <div className={styles.userMenuHeader}>
                     <div className={styles.userMenuName}>{user?.fullName || 'Người dùng'}</div>
                      <div className={styles.userMenuEmail}>{user?.email}</div>
                    </div>
                    <div className={styles.userMenuDivider} />
                    <Link href="/profile" className={styles.userMenuItem} onClick={closeUserMenu}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {language === 'vi' ? 'Hồ sơ tài khoản' : 'My Account'}
                    </Link>
                    <Link href="/my-room" className={styles.userMenuItem} onClick={closeUserMenu}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
                      </svg>
                      {language === 'vi' ? 'Phòng của bạn' : 'Your room'}
                    </Link>
                    <Link href="/cart" className={styles.userMenuItem} onClick={closeUserMenu}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <span className={styles.userMenuItemLabel}>{language === 'vi' ? 'Giỏ hàng' : 'Cart'}</span>
                      {itemCount > 0 && (
                        <span className={styles.userMenuBadge} aria-label={language === 'vi' ? `${itemCount} sản phẩm` : `${itemCount} items`}>
                          {itemCount > 99 ? '99+' : itemCount}
                        </span>
                      )}
                    </Link>
                    {hasAdminAccess() && (
                      <Link href={dashboardHref} className={styles.userMenuItem} onClick={closeUserMenu}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"/>
                          <rect x="14" y="3" width="7" height="7"/>
                          <rect x="14" y="14" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        {language === 'vi' ? 'Trang quản trị' : 'Admin Panel'}
                      </Link>
                    )}
                    <div className={styles.userMenuDivider} />
                    <button type="button" className={styles.langMenuItem} onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      {language === 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English'}
                    </button>
                    <div className={styles.userMenuDivider} />
                    <button
                      type="button"
                      className={styles.userMenuItem}
                      onClick={() => { logout(); closeUserMenu(); }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      {language === 'vi' ? 'Đăng xuất' : 'Sign out'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className={styles.userMenuHeader}>
                      <div className={styles.userMenuName}>{language === 'vi' ? 'Khách' : 'Guest'}</div>
                      <div className={styles.userMenuEmail}>{language === 'vi' ? 'Chào bạn!' : 'Welcome!'}</div>
                    </div>
                    <div className={styles.userMenuDivider} />
                    <Link href="/signin" className={styles.userMenuItem} onClick={closeUserMenu}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                      {language === 'vi' ? 'Đăng nhập' : 'Sign in'}
                    </Link>
                    <Link href="/signup" className={styles.userMenuItem} onClick={closeUserMenu}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <line x1="20" y1="8" x2="20" y2="14"/>
                        <line x1="23" y1="11" x2="17" y2="11"/>
                      </svg>
                      {language === 'vi' ? 'Đăng ký' : 'Sign up'}
                    </Link>
                    <Link href="/cart" className={styles.userMenuItem} onClick={closeUserMenu}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <span className={styles.userMenuItemLabel}>{language === 'vi' ? 'Giỏ hàng' : 'Cart'}</span>
                      {itemCount > 0 && (
                        <span className={styles.userMenuBadge} aria-label={language === 'vi' ? `${itemCount} sản phẩm` : `${itemCount} items`}>
                          {itemCount > 99 ? '99+' : itemCount}
                        </span>
                      )}
                    </Link>
                    <div className={styles.userMenuDivider} />
                    <button type="button" className={styles.langMenuItem} onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                      {language === 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.toggle}
            onClick={openDrawer}
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
            aria-controls="ahDrawer"
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
              <path d="M4 7h16M4 12h10M4 17h16" />
            </svg>
          </button>
        </div>

        {/* Overlay */}
        <div
          className={`${styles.overlay} ${isDrawerOpen ? styles.overlayOpen : ''}`}
          onClick={closeDrawer}
          aria-hidden="true"
        />

        {/* Mobile drawer */}
        <div
          id="ahDrawer"
          className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className={styles.drawerHead}>
            <div className={styles.drawerTitle}>Another House</div>
            <button className={styles.drawerClose} onClick={closeDrawer} aria-label="Close menu">
              <svg
                width="16"
                height="16"
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

          <nav className={styles.drawerNav} aria-label="Mobile navigation">
            {DRAWER_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`${styles.drawerLink} ${isActive(link.href) ? styles.drawerLinkActive : ''}`}
              >
                {link.label}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          <div className={styles.drawerFooter}>
            <Link href={ctaHref} className={styles.drawerCta}>
              {ctaText}
            </Link>
             <div className={styles.drawerTagline}>
               Không gian tinh tế &nbsp;·&nbsp; Sang trọng tối giản &nbsp;·&nbsp; Khái niệm độc đáo
             </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default MenuPc;
