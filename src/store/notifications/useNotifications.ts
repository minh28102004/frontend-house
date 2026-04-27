"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socketService } from "@/config/socket";
import {
  NotificationService,
  NotificationQuery,
} from "@/modules/admin/notifications/services/notification.service";
import { useNotificationStore, selectUnreadCount, selectIsConnected } from "@/store/notifications/notificationStore";
import { toast } from "@/common/utils/toast";

/**
 * Hook Ä‘á»ƒ initialize WebSocket connection (chá»‰ gá»i 1 láº§n trong app)
 */
export const useNotificationInit = () => {
  const initialize = useNotificationStore((state) => state.initialize);
  const queryClient = useQueryClient();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Socket: refetch danh sÃ¡ch khi cÃ³ cáº­p nháº­t (trÃ¡nh lá»‡ch badge / nhiá»u hook dÃ¹ng chung store)
  useEffect(() => {
    const unsubUnread = socketService.onUnreadCountUpdate(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
    const unsubNotif = socketService.onNotification(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
    return () => {
      unsubUnread();
      unsubNotif();
    };
  }, [queryClient]);
};

/**
 * Hook Ä‘á»ƒ láº¥y sá»‘ thÃ´ng bÃ¡o chÆ°a Ä‘á»c (dÃ¹ng cho badge, sidebar)
 * Sá»­ dá»¥ng Zustand store - reactive, khÃ´ng cáº§n refetch
 */
export const useUnreadCount = () => {
  const unreadCount = useNotificationStore(selectUnreadCount);
  const isConnected = useNotificationStore(selectIsConnected);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => NotificationService.getUnreadCount(),
    staleTime: Infinity, // Chá»‰ dÃ¹ng Ä‘á»ƒ init, sau Ä‘Ã³ dÃ¹ng store
  });

  // Init unread count tá»« server khi store cÃ²n 0 (trÃ¡nh ghi Ä‘Ã¨ sá»‘ tá»« socket náº¿u API láº§n Ä‘áº§u tráº£ vá» cháº­m/cÅ©)
  useEffect(() => {
    if (data !== undefined && unreadCount === 0) {
      useNotificationStore.getState().setUnreadCount(data);
    }
  }, [data, unreadCount]);

  return {
    unreadCount,
    isConnected,
    isLoading,
    refetch,
  };
};

/**
 * Hook Ä‘á»ƒ láº¥y danh sÃ¡ch thÃ´ng bÃ¡o vá»›i real-time updates
 */
export const useNotifications = (query: NotificationQuery = {}) => {
  const markAsReadStore = useNotificationStore((state) => state.markAsRead);
  const markAllAsReadStore = useNotificationStore((state) => state.markAllAsRead);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  const queryClient = useQueryClient();

  const {
    type,
    category,
    priority,
    status,
    unreadOnly,
    recipientId,
    forAdmin: forAdminOpt,
    page,
    limit,
  } = query;

  // Phá»¥ thuá»™c primitive â€” trÃ¡nh queryKey Ä‘á»•i má»—i render khi parent truyá»n object literal má»›i
  const queryParams = useMemo((): NotificationQuery => {
    const params: NotificationQuery = {
      forAdmin: forAdminOpt !== false,
    };
    if (type !== undefined) params.type = type;
    if (category !== undefined) params.category = category;
    if (priority !== undefined) params.priority = priority;
    if (status !== undefined) params.status = status;
    if (unreadOnly !== undefined) params.unreadOnly = unreadOnly;
    if (recipientId !== undefined) params.recipientId = recipientId;
    if (page !== undefined) params.page = page;
    if (limit !== undefined) params.limit = limit;
    return params;
  }, [type, category, priority, status, unreadOnly, recipientId, forAdminOpt, page, limit]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications", "list", queryParams],
    queryFn: () => NotificationService.getAll(queryParams),
    staleTime: 30000,
  });

  // Chá»‰ Ä‘á»“ng bá»™ sá»‘ chÆ°a Ä‘á»c vÃ o store (dÃ¹ng chung badge). Danh sÃ¡ch láº¥y tá»« React Query â€” khÃ´ng ghi Ä‘Ã¨ store giá»¯a Bell / trang list.
  useEffect(() => {
    if (data) {
      setUnreadCount(data.unreadCount);
    }
  }, [data, setUnreadCount]);

  // Mark as read (API + Store)
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: (_, id) => {
      markAsReadStore(id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("KhÃ´ng thá»ƒ Ä‘Ã¡nh dáº¥u Ä‘Ã£ Ä‘á»c");
    },
  });

  // Mark all as read (API + Store)
  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      markAllAsReadStore();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("ÄÃ£ Ä‘Ã¡nh dáº¥u táº¥t cáº£ lÃ  Ä‘Ã£ Ä‘á»c");
    },
    onError: () => {
      toast.error("KhÃ´ng thá»ƒ Ä‘Ã¡nh dáº¥u táº¥t cáº£ Ä‘Ã£ Ä‘á»c");
    },
  });

  // Delete notification (API + Store)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => NotificationService.delete(id),
    onSuccess: (_, id) => {
      removeNotification(id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("ÄÃ£ xÃ³a thÃ´ng bÃ¡o");
    },
    onError: () => {
      toast.error("KhÃ´ng thá»ƒ xÃ³a thÃ´ng bÃ¡o");
    },
  });

  // Delete all read (API + Store)
  const deleteAllReadMutation = useMutation({
    mutationFn: () => NotificationService.deleteAllRead(),
    onSuccess: () => {
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("ÄÃ£ xÃ³a cÃ¡c thÃ´ng bÃ¡o Ä‘Ã£ Ä‘á»c");
    },
    onError: () => {
      toast.error("KhÃ´ng thá»ƒ xÃ³a cÃ¡c thÃ´ng bÃ¡o Ä‘Ã£ Ä‘á»c");
    },
  });

  const storeUnreadFallback = useNotificationStore(selectUnreadCount);

  return {
    notifications: data?.items ?? [],
    unreadCount: data !== undefined ? data.unreadCount : storeUnreadFallback,

    // Pagination
    total: data?.total ?? 0,
    page: query.page || 1,
    totalPages: data?.totalPages || 1,
    setPage: (pageOrFn: number | ((prev: number) => number)) => {
      const nextPage = typeof pageOrFn === "function" ? pageOrFn(query.page || 1) : pageOrFn;
      queryClient.setQueryData(["notifications", "list", { ...queryParams, page: nextPage }], data);
    },

    // Loading states
    isLoading,
    error,

    // Actions
    refetch,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    deleteNotification: (id: string) => deleteMutation.mutate(id),
    deleteAllRead: () => deleteAllReadMutation.mutate(),

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

/**
 * Hook Ä‘á»ƒ láº¥y thá»‘ng kÃª thÃ´ng bÃ¡o
 */
export const useNotificationStats = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications", "stats"],
    queryFn: () => NotificationService.getStats(),
    staleTime: 60000,
  });

  return {
    stats: data || { total: 0, unread: 0, byCategory: {}, byType: {} },
    isLoading,
    error,
    refetch,
  };
};

