"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { BookingClientService } from "@/modules/client/booking/services/booking.service";
import type { RoomBooking } from "@/modules/admin/rooms/types/booking.types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const statusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  pending_payment: "Chờ thanh toán",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
  completed: "Hoàn thành",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  pending_payment: "bg-orange-100 text-orange-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-gray-100 text-gray-700",
};

const BookingHistoryPage = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await BookingClientService.getMyBookings(token);
        if (!cancelled) {
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Không thể tải lịch sử đặt phòng");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: vi });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-4 mt-12 md:mt-20">
      <div className="flex items-center gap-3 mb-6 px-4 md:px-0">
        <Link
          href="/profile"
          className="text-gray-500 hover:text-black transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-black">Lịch sử đặt phòng</h1>
      </div>

      {loading && (
        <div className="text-center text-gray-500 py-8">Đang tải...</div>
      )}

      {error && (
        <div className="text-center text-red-600 py-8">{error}</div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="mb-4">Bạn chưa có đặt phòng nào.</p>
          <Link
            href="/rooms"
            className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Đặt phòng ngay
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-4 px-4 md:px-0">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-sm border p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-black">{booking.roomName}</p>
                  <p className="text-xs text-gray-500">
                    Mã đặt phòng: #{booking._id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    statusColors[booking.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {statusLabels[booking.status] || booking.status}
                </span>
              </div>

              {/* Dates */}
              <div className="flex gap-4 text-sm text-gray-600">
                <div>
                  <span className="text-gray-400">Nhận phòng:</span>{" "}
                  {formatDate(booking.checkInDate)}
                </div>
                <div>
                  <span className="text-gray-400">Trả phòng:</span>{" "}
                  {formatDate(booking.checkOutDate)}
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="text-sm text-gray-500">Tổng tiền: </span>
                <span className="font-semibold text-black">
                  {booking.totalPrice.toLocaleString()}₫
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-2">
                <Link
                  href={`/rooms/${booking.concept}`}
                  className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Xem phòng
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
