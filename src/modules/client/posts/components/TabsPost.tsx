"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { useCategoryPosts } from "../hooks/usePosts";

const TabsPost: React.FC = () => {
  const { categories, isLoading, isError } = useCategoryPosts();
  const pathname = usePathname();
  const mobileDetailsRef = useRef<HTMLDetailsElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [initialTop, setInitialTop] = useState(0);

  // Lấy các danh mục level 0 (top-level) để hiển thị tab
  const topCategories = useMemo(() => {
    return (categories || []).filter((cat) => cat.level === 0 && !cat.isDeleted);
  }, [categories]);

  // Xác định tab active dựa trên URL
  const activeTab = useMemo(() => {
    if (pathname === "/posts") return "all";
    const match = pathname.match(/^\/posts\/danh-muc\/(.+)$/);
    if (match) return match[1];
    return "all";
  }, [pathname]);

  const tabItems = useMemo(
    () => [
      { label: "Another House Stories", slug: "all" },
      ...topCategories.map((cat) => ({
        label: cat.name,
        slug: cat.slug || (cat as any)._id, // fallback dùng _id nếu slug trống
        raw: cat,
      })),
    ],
    [topCategories]
  );

  const activeLabel = useMemo(() => {
    return tabItems.find((item) => item.slug === activeTab)?.label || "Another House Stories";
  }, [activeTab, tabItems]);

  const handleMobileClose = () => {
    if (mobileDetailsRef.current) {
      mobileDetailsRef.current.open = false;
    }
  };

  const getTabHref = (slug: string) => {
    if (slug === "all") return "/posts";
    return `/posts/danh-muc/${slug}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!tabsRef.current) return;

      // Lưu vị trí ban đầu lần đầu tiên
      if (initialTop === 0 && tabsRef.current) {
        const rect = tabsRef.current.getBoundingClientRect();
        setInitialTop(rect.top + window.scrollY);
        return;
      }

      // Khi scroll xuống vượt qua vị trí ban đầu, set sticky
      if (window.scrollY >= initialTop && initialTop > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    // Set initial position sau khi component mount
    const timer = setTimeout(() => {
      if (tabsRef.current && initialTop === 0) {
        const rect = tabsRef.current.getBoundingClientRect();
        setInitialTop(rect.top + window.scrollY);
      }
    }, 100);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [initialTop]);

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col items-center justify-center px-4"
    >

      {/* Mobile: Accordion header */}
      <div className="w-full md:hidden">
        <div className="mb-5 text-5xl md:text-7xl font-medium text-gray-900 text-center font-futura mt-10">
          Maison <br /> Another House
        </div>
        <details
          ref={mobileDetailsRef}
          className={`group border-b border-gray-200 py-3 ${isSticky ? "fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4" : ""}`}
        >
          <summary className="flex items-center justify-between text-base font-medium text-gray-900 list-none cursor-pointer outline-none marker:hidden [&::-webkit-details-marker]:hidden">
            <span>
              {activeLabel}
            </span>
            <FiChevronDown className="text-xl transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div className="flex flex-col mt-3 space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              ))
            ) : isError ? (
              <button
                className="relative text-base font-normal tracking-wide text-black cursor-default text-left"
                disabled
              >
                Tất cả
              </button>
            ) : (
              tabItems.map((item) => {
                const isActive = item.slug === activeTab;
                return (
                  <Link
                    key={item.slug}
                    href={getTabHref(item.slug)}
                    role="tab"
                    aria-selected={isActive}
                    onClick={handleMobileClose}
                    className={`text-left text-base font-normal transition-colors py-4 border-b border-gray-200 ${isActive ? "text-black border-b-2 border-black" : "text-gray-700 hover:text-black"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })
            )}
          </div>
        </details>
      </div>

      {/* Desktop: Tabs */}
      <div className="hidden md:flex flex-col items-center justify-center w-full">
        <div className="mb-5 text-4xl md:text-6xl font-medium text-gray-900 text-center p-16">
          {activeLabel}
        </div>
        <div
          ref={tabsRef}
          className={`w-full ${isSticky ? "fixed top-0 left-0 right-0 z-50 bg-white py-4" : ""}`}
        >
          {isLoading ? (
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 border-b border-gray-200 pb-3 w-full">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 border-b border-gray-200 pb-3">
              <button
                className="relative text-base md:text-lg font-normal tracking-wide text-black cursor-default"
                disabled
              >
                Tất cả
                <span className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 h-[2px] w-full md:w-[110%] bg-black" />
              </button>
            </div>
          ) : (
            <div
              className={`flex flex-wrap items-center justify-center text-center gap-6 md:gap-8 ${isSticky ? "pt-3 pb-3" : "pb-6 "}`}
              role="tablist"
              aria-label="Danh mục bài viết"
            >
              {tabItems.map((item) => {
                const isActive = item.slug === activeTab;
                return (
                  <Link
                    key={item.slug}
                    href={getTabHref(item.slug)}
                    role="tab"
                    aria-selected={isActive}
                    className={`relative text-base md:text-base font-normal tracking-wide transition-colors ${isActive ? "text-black" : "text-gray-700 hover:text-black"
                      }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 h-[2px] w-full md:w-[110%] bg-black" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabsPost;