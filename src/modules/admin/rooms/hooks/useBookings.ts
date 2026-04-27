"use client";

import { useEffect, useState, useCallback } from "react";
import { RoomBooking, BookingQueryDto, BookingListResponse } from "../types/booking.types";
import { BookingService } from "../services/booking.service";

export const useBookings = () => {
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

  const   fetchBookings = useCallback(async (params?: BookingQueryDto) => {
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
    fetchBookings(filters);
  }, [fetchBookings, filters]);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await BookingService.update(id, { status: status as any });
      await fetchBookings(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi cập nhật trạng thái");
      return false;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await BookingService.cancel(id);
      await fetchBookings(filters);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi hủy đặt phòng");
      return false;
    }
  };

  const applyFilters = (newFilters: BookingQueryDto) => {
    setFilters(newFilters);
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
