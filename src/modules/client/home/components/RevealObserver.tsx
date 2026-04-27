"use client";

import { useEffect } from "react";

/**
 * Gắn IntersectionObserver vào tất cả phần tử `.reveal-fade-up`
 * trong container được chỉ định (mặc định document).
 */
export default function RevealObserver({
  rootMargin = "0px 0px -80px 0px",
  threshold = 0.12,
}: {
  rootMargin?: string;
  threshold?: number;
}) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal-fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return null;
}
