"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/config/api";

/**
 * Gửi đường dẫn Next.js lên backend để thống kê hiển thị /app/... (không chỉ /api/cartapi).
 */
function TrafficPageViewReporterInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !pathname) return;
    const qs = searchParams?.toString();
    const full = qs ? `${pathname}?${qs}` : pathname;
    if (lastPath.current === full) return;
    lastPath.current = full;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    void api
      .post("/api/traffic/page-view", { path: full }, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: (s) => s === 204 || s === 200,
      })
      .catch(() => {});
  }, [isAuthenticated, pathname, searchParams]);

  return null;
}

export function TrafficPageViewReporter() {
  return (
    <Suspense fallback={null}>
      <TrafficPageViewReporterInner />
    </Suspense>
  );
}
