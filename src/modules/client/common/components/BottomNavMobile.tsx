"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useCartModal } from "@/context/CartModalContext";
import { useAuth } from "@/context/AuthContext";
import { FaMapMarkerAlt, FaTag, FaUser } from "react-icons/fa";

const BottomNavMobile = () => {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { openModal: openCartModal } = useCartModal();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(path);
  };

  const navItems = [
    {
      label: "Giảm giá",
      icon: FaTag,
      href: "/flash-sale",
      active: isActive("/flash-sale"),
      isCustomIcon: true,
    },
    {
      label: "Địa điểm",
      icon: FaMapMarkerAlt,
      href: "/maps",
      active: isActive("/maps"),
    },
    {
      label: "Tài khoản",
      icon: FaUser,
      href: isAuthenticated ? "/profile" : "/signin",
      active: isActive("/signin") || isActive("/profile") || isActive("/admin"),
    },
    {
      label: "Giỏ hàng",
      icon: null,
      isImage: true,
      onClick: openCartModal,
      badge: itemCount > 0 ? itemCount : null,
      active: isActive("/cart"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white z-[100] md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isItemActive = item.active;
          const isCustomIcon = (item as any).isCustomIcon;
          const isImage = (item as any).isImage;

          const content = (
            <div className="flex flex-col items-center justify-center gap-1 relative">
              <div className="relative">
                {isImage ? (
                  <Image
                    src="/img/cart.png"
                    alt={item.label}
                    width={26}
                    height={26}
                    className="hover:opacity-100 transition-opacity"
                  />
                ) : isCustomIcon && Icon ? (
                  <Icon
                    size={20}
                    className={`transition-colors ${
                      isItemActive ? "text-gray-800" : "text-black"
                    }`}
                  />
                ) : Icon ? (
                  <Icon
                    size={20}
                    className={`transition-colors ${
                      isItemActive ? "text-gray-800" : "text-black"
                    }`}
                  />
                ) : null}
                {item.badge != null && item.badge >= 0 && (
                  <span className="absolute -top-2 -right-3 min-w-[16px] h-[16px] px-1 rounded-full bg-black text-white text-[10px] font-semibold flex items-center justify-center">
                  {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] transition-colors ${
                  isItemActive ? "text-gray-800" : "text-black"
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="flex-1 h-full flex items-center justify-center"
                aria-label={item.label}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={index}
              href={item.href || "#"}
              className="flex-1 h-full flex items-center justify-center"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavMobile;
