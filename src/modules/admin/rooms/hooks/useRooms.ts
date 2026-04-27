"use client";

import { useEffect, useState, useCallback } from "react";
import { Room, PaginatedRoomResponse } from "../types/room.types";
import { RoomService } from "../services/room.service";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchRooms = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response: PaginatedRoomResponse = await RoomService.getAllAdmin(page, limit);
      setRooms(response.rooms);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms(pagination.page, pagination.limit);
  }, [fetchRooms]);

  const createRoom = async (roomData: any) => {
    setLoading(true);
    setError(null);
    try {
      await RoomService.create(roomData);
      await fetchRooms(pagination.page, pagination.limit);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi tạo phòng");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (concept: string, roomData: any) => {
    setLoading(true);
    setError(null);
    try {
      await RoomService.update(concept, roomData);
      await fetchRooms(pagination.page, pagination.limit);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi cập nhật phòng");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (concept: string) => {
    try {
      await RoomService.toggleVisibility(concept);
      await fetchRooms(pagination.page, pagination.limit);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi thay đổi trạng thái");
      return false;
    }
  };

  const deleteRoom = async (concept: string) => {
    try {
      await RoomService.delete(concept);
      await fetchRooms(pagination.page, pagination.limit);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi khi xóa phòng");
      return false;
    }
  };

  return {
    rooms,
    loading,
    error,
    pagination,
    fetchRooms,
    createRoom,
    updateRoom,
    toggleVisibility,
    deleteRoom,
  };
};
