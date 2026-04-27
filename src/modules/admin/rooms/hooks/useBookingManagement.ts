"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RoomBooking, BookingQueryDto, BookingListResponse } from "../types/booking.types";
import { BookingService } from "../services/booking.service";

export const useBookingStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [pendingRes, confirmedRes, completedRes, cancelledRes] = await Promise.all([
        BookingService.getAllAdmin({ status: "pending", limit: 1 }),
        BookingService.getAllAdmin({ status: "confirmed", limit: 1 }),
        BookingService.getAllAdmin({ status: "completed", limit: 1 }),
        BookingService.getAllAdmin({ status: "cancelled", limit: 1 }),
      ]);

      const pendingTotal = pendingRes.total;
      const confirmedTotal = confirmedRes.total;
      const completedTotal = completedRes.total;
      const cancelledTotal = cancelledRes.total;

      const allRes: BookingListResponse = await BookingService.getAllAdmin({ limit: 1 });
      const allPages = Math.ceil(allRes.total / 100);

      let revenue = 0;
      for (let page = 1; page <= allPages; page++) {
        const res: BookingListResponse = await BookingService.getAllAdmin({ page, limit: 100 });
        res.data.forEach((b) => {
          if (b.status === "completed" || b.status === "confirmed") {
            revenue += b.totalPrice || 0;
          }
        });
      }

      setStats({
        total: pendingTotal + confirmedTotal + completedTotal + cancelledTotal,
        pending: pendingTotal,
        confirmed: confirmedTotal,
        completed: completedTotal,
        cancelled: cancelledTotal,
        totalRevenue: revenue,
      });
    } catch {
      // silently fail for stats
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};

export const useBookingsWithFilters = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<BookingQueryDto>({});

  const fetchBookings = useCallback(async (params?: BookingQueryDto) => {
    setLoading(true);
    setError(null);
    try {
      const response: BookingListResponse = await BookingService.getAllAdmin(params);
      setBookings(response.data);
      setPagination({
        page: response.page,
        limit: 10,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi tải danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = { ...filters, page: filters.page || 1, limit: 10 };
    fetchBookings(params);
  }, [fetchBookings, filters]);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await BookingService.update(id, { status: status as any });
      await fetchBookings({ ...filters, page: filters.page || 1 });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi cập nhật trạng thái");
      return false;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await BookingService.cancel(id);
      await fetchBookings({ ...filters, page: filters.page || 1 });
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi hủy đặt phòng");
      return false;
    }
  };

  const applyFilters = (newFilters: BookingQueryDto) => {
    setFilters((prev) => ({ ...newFilters, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return {
    bookings,
    loading,
    error,
    pagination,
    filters,
    fetchBookings,
    updateBookingStatus,
    cancelBooking,
    applyFilters,
    clearFilters,
    goToPage,
  };
};

export const useBookingExport = () => {
  const exportCSV = (bookings: RoomBooking[], filename: string = "bookings") => {
    const headers = [
      "STT",
      "Khách hàng",
      "Email",
      "SĐT",
      "Phòng",
      "Concept",
      "Check-in",
      "Check-out",
      "Số khách",
      "Tổng giá",
      "Trạng thái",
      "CCCD Mặt trước",
      "CCCD Mặt sau",
      "Ngày đặt",
    ];

    const rows = bookings.map((b, i) => [
      i + 1,
      b.guestName,
      b.guestEmail,
      b.guestPhone,
      b.roomName,
      b.concept,
      new Date(b.checkInDate).toLocaleDateString("vi-VN"),
      new Date(b.checkOutDate).toLocaleDateString("vi-VN"),
      b.numberOfGuests || 1,
      b.totalPrice,
      STATUS_LABELS[b.status as keyof typeof STATUS_LABELS] || b.status,
      b.cccdFront || "",
      b.cccdBack || "",
      b.createdAt ? new Date(b.createdAt).toLocaleDateString("vi-VN") : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { exportCSV };
};

const STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
  completed: "Hoàn thành",
} as const;
