"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AdminUser,
  UserStats,
  UpdateUserPayload,
  CreateUserPayload,
  AdminUserService,
} from "../services/admin-user.service";

export const useUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    banned: 0,
    admins: 0,
    newThisMonth: 0,
  });
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminUserService.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Lỗi khi tải danh sách người dùng",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await AdminUserService.getStats();
      setStats(data);
    } catch {
      // Stats fail silently
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  const createUser = async (payload: CreateUserPayload): Promise<boolean> => {
    try {
      await AdminUserService.create(payload);
      await fetchUsers();
      await fetchStats();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Lỗi khi tạo người dùng",
      );
      return false;
    }
  };

  const updateUser = async (
    id: string,
    payload: UpdateUserPayload,
  ): Promise<boolean> => {
    try {
      await AdminUserService.update(id, payload);
      await fetchUsers();
      await fetchStats();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Lỗi khi cập nhật người dùng",
      );
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      await AdminUserService.delete(id);
      await fetchUsers();
      await fetchStats();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Lỗi khi xóa người dùng",
      );
      return false;
    }
  };

  return {
    users,
    loading,
    error,
    stats,
    statsLoading,
    fetchUsers,
    fetchStats,
    createUser,
    updateUser,
    deleteUser,
  };
};
