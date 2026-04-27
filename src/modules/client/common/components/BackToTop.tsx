"use client";

import React, { useState, useEffect } from "react";
import { FiChevronUp } from "react-icons/fi";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
      {/* Nhãn: nền olive + chữ cream để luôn đọc được trên mọi nền */}
      <span
        className={`pointer-events-none rounded-md bg-olive px-2 py-0.5 text-xs font-semibold tracking-wide text-cream shadow-md ring-1 ring-white/30 transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        Lên đầu
      </span>

      <button
        type="button"
        onClick={scrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Cuộn lên đầu trang"
        className="pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-full bg-olive text-cream shadow-lg shadow-black/25 ring-2 ring-white/40 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#4d563b] hover:shadow-xl hover:shadow-black/30 active:translate-y-0 active:scale-100 md:h-12 md:w-12"
      >
        <FiChevronUp className="relative z-10 h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default BackToTop;
