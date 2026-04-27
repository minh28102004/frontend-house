"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OrderCard from "@/modules/client/history-order/components/OrderCard";
import { OrderService } from "@/modules/client/history-order/services/history-order.service";
import type { Order } from "@/modules/client/history-order/types/order";
import { UserService } from "@/modules/auth/users/services/user.service";
import { PointsService, type PointsInfo } from "@/modules/client/points/services/points.service";
import UserRankCard from "@/modules/client/points/components/UserRankCard";
import CouponExchangeSection from "@/modules/client/points/components/CouponExchangeSection";

interface MeHeader {
  fullName: string;
  email: string;
  avatar: string;
}

function normalizeAvatarSrc(raw: string | undefined | null): string | undefined {
  if (!raw || !String(raw).trim()) {
    return undefined;
  }
  const s = String(raw).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) {
    return s;
  }
  if (s.startsWith("/")) {
    return s;
  }
  return `/${s}`;
}

export default function ProfilePage() {
  const pathname = usePathname();
  const { user, isAuthenticated, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meHeader, setMeHeader] = useState<MeHeader | null>(null);
  const [pointsInfo, setPointsInfo] = useState<PointsInfo | null>(null);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const handlePointsExchangeSuccess = (newPoints: number) => {
    if (pointsInfo) {
      setPointsInfo({
        ...pointsInfo,
        points: newPoints,
      });
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!isAuthenticated || !token) {
        setMeHeader(null);
        return;
      }

      try {
        const me = await UserService.getCurrentUser();
        if (cancelled) {
          return;
        }
        setMeHeader({
          fullName: me.fullName,
          email: me.email,
          avatar: me.avatar,
        });
      } catch {
        if (cancelled) {
          return;
        }
        setMeHeader(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, pathname]);

  // Fetch points info
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!isAuthenticated || !token) {
        setPointsInfo(null);
        return;
      }

      try {
        setPointsLoading(true);
        const data = await PointsService.getMyPoints();
        if (!cancelled) {
          setPointsInfo(data);
        }
      } catch {
        if (!cancelled) {
          setPointsInfo(null);
        }
      } finally {
        if (!cancelled) setPointsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, pathname]);

  useEffect(() => {
    setAvatarBroken(false);
  }, [meHeader?.avatar, user?.avatar]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!isAuthenticated || !token) {
        setOrders([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await OrderService.getMyOrderHistory(token);
        if (!cancelled) {
          const sortedOrders = Array.isArray(data)
            ? [...data].sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              ).slice(0, 3)
            : [];
          setOrders(sortedOrders);
        }
      } catch (e: any) {
        if (!cancelled) {
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            "Không thể tải đơn hàng";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  let displayName: string;
  if (meHeader && meHeader.fullName) {
    displayName = meHeader.fullName;
  } else if (user && user.fullName) {
    displayName = user.fullName;
  } else if (user && user.email) {
    displayName = user.email;
  } else {
    displayName = "Chưa có tên";
  }

  let displayEmail: string;
  if (meHeader && meHeader.email) {
    displayEmail = meHeader.email;
  } else if (user && user.email) {
    displayEmail = user.email;
  } else {
    displayEmail = "";
  }

  let avatarSrc: string | undefined;
  if (meHeader && meHeader.avatar) {
    avatarSrc = normalizeAvatarSrc(meHeader.avatar);
  } else if (user && user.avatar) {
    avatarSrc = normalizeAvatarSrc(user.avatar);
  }
  if (avatarBroken) {
    avatarSrc = undefined;
  }

  const initialsSource = meHeader && meHeader.fullName ? meHeader.fullName : user && user.fullName ? user.fullName : displayEmail;
  const initials = initialsSource
    ? initialsSource
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 md:px-0 mt-12 md:mt-20">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={() => setAvatarBroken(true)}
              />
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {initials}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-black truncate">
              {displayName}
            </h1>
            <p className="text-sm text-gray-500 truncate">{displayEmail}</p>
          </div>

          {/* Edit Button */}
          <Link
            href="/profile/edit"
            className="flex-shrink-0 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Chỉnh sửa profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Rank & Points Card */}
      {isAuthenticated && pointsInfo && (
        <>
          <div className="mb-6">
            <UserRankCard data={pointsInfo} />
          </div>

          {/* Coupon Exchange Section */}
          <CouponExchangeSection
            currentPoints={pointsInfo.points}
            onExchangeSuccess={handlePointsExchangeSuccess}
          />
        </>
      )}

      {/* Menu Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Đơn hàng */}
        <Link
          href="/account/orders"
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-black">Đơn hàng</p>
              <p className="text-xs text-gray-500">Xem đơn đã đặt</p>
            </div>
          </div>
        </Link>

        {/* Lịch sử đặt phòng */}
        <Link
          href="/profile/bookings"
          className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-black">Đặt phòng</p>
              <p className="text-xs text-gray-500">Lịch sử thuê phòng</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      {isAuthenticated && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-black">Đơn hàng gần đây</h2>
            {orders.length > 0 && (
              <Link
                href="/account/orders"
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Xem tất cả
              </Link>
            )}
          </div>

          {loading && (
            <div className="text-sm text-gray-500 py-4">Đang tải...</div>
          )}

          {error && <div className="text-sm text-red-600 py-4">{error}</div>}

          {!loading && !error && orders.length === 0 && (
            <div className="text-sm text-gray-500 py-4">
              Bạn chưa có đơn hàng nào
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
