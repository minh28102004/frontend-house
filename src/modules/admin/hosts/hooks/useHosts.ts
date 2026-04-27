"use client";

import { useState, useEffect, useCallback } from "react";
import {
  HostUser,
  HostStats,
  HostAdminDetailResponse,
  AdminNote,
  AdminHostService,
} from "../services/host.service";

export const useHosts = () => {
  const [hosts, setHosts] = useState<HostUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<HostStats>({
    total: 0,
    active: 0,
    inactive: 0,
    banned: 0,
    newThisMonth: 0,
  });
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  const fetchHosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminHostService.getAll();
      setHosts(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi tải danh sách chủ nhà",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await AdminHostService.getStats();
      setStats(data);
    } catch {
      // silent
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHosts();
    void fetchStats();
  }, [fetchHosts, fetchStats]);

  const updateHost = async (
    id: string,
    payload: { status?: string; fullName?: string; phone?: string },
  ): Promise<boolean> => {
    try {
      await AdminHostService.updateStatus(id, payload);
      await fetchHosts();
      await fetchStats();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi cập nhật chủ nhà",
      );
      return false;
    }
  };

  const banHost = async (id: string, reason: string): Promise<boolean> => {
    try {
      await AdminHostService.ban(id, reason);
      await fetchHosts();
      await fetchStats();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi khóa chủ nhà",
      );
      return false;
    }
  };

  const unbanHost = async (id: string, reason?: string): Promise<boolean> => {
    try {
      await AdminHostService.unban(id, reason);
      await fetchHosts();
      await fetchStats();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi mở khóa chủ nhà",
      );
      return false;
    }
  };

  const approveHost = async (id: string, note?: string): Promise<boolean> => {
    try {
      await AdminHostService.approve(id, note);
      await fetchHosts();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi phê duyệt chủ nhà",
      );
      return false;
    }
  };

  const rejectHost = async (id: string, reason: string): Promise<boolean> => {
    try {
      await AdminHostService.reject(id, reason);
      await fetchHosts();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi từ chối chủ nhà",
      );
      return false;
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: string): Promise<boolean> => {
    try {
      await AdminHostService.bulkUpdateStatus(ids, status);
      await fetchHosts();
      await fetchStats();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi cập nhật hàng loạt",
      );
      return false;
    }
  };

  const flagHost = async (id: string, reason: string): Promise<boolean> => {
    try {
      await AdminHostService.flag(id, reason);
      await fetchHosts();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi đánh dấu chủ nhà",
      );
      return false;
    }
  };

  const unflagHost = async (id: string): Promise<boolean> => {
    try {
      await AdminHostService.unflag(id);
      await fetchHosts();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi bỏ đánh dấu",
      );
      return false;
    }
  };

  const sendNotification = async (
    id: string,
    title: string,
    message: string,
    sendEmail: boolean = false,
  ): Promise<boolean> => {
    try {
      await AdminHostService.sendNotification(id, title, message, sendEmail);
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi gửi thông báo",
      );
      return false;
    }
  };

  return {
    hosts,
    loading,
    error,
    stats,
    statsLoading,
    fetchHosts,
    fetchStats,
    updateHost,
    banHost,
    unbanHost,
    approveHost,
    rejectHost,
    bulkUpdateStatus,
    flagHost,
    unflagHost,
    sendNotification,
  };
};

// Hook for single host details
export const useHostDetails = (hostId: string) => {
  const [host, setHost] = useState<HostUser | null>(null);
  const [details, setDetails] = useState<HostAdminDetailResponse | null>(null);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHost = useCallback(async () => {
    if (!hostId) return;
    setLoading(true);
    setError(null);
    try {
      const [detailsPayload, notesData] = await Promise.all([
        AdminHostService.getFullDetails(hostId),
        AdminHostService.getNotes(hostId),
      ]);
      setHost(detailsPayload.host);
      setDetails(detailsPayload);
      setNotes(notesData);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi tải thông tin chủ nhà",
      );
    } finally {
      setLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    void fetchHost();
  }, [fetchHost]);

  const createNote = async (
    content: string,
    type: "info" | "warning" | "important" = "info",
    isPinned: boolean = false,
  ): Promise<boolean> => {
    try {
      await AdminHostService.createNote(hostId, content, type, isPinned);
      await fetchHost();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi tạo ghi chú",
      );
      return false;
    }
  };

  const deleteNote = async (noteId: string): Promise<boolean> => {
    try {
      await AdminHostService.deleteNote(noteId);
      await fetchHost();
      return true;
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Lỗi khi xóa ghi chú",
      );
      return false;
    }
  };

  return {
    host,
    details,
    notes,
    loading,
    error,
    fetchHost,
    createNote,
    deleteNote,
  };
};
