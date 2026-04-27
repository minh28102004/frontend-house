import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Notification, NotificationType, NotificationCategory, NotificationPriority, NotificationStatus } from '@/modules/admin/notifications/services/notification.service';
import { socketService, NotificationSocketPayload } from '@/config/socket';
import { toast } from '@/common/utils/toast';

export interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  initialize: () => void;
  disconnect: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[], total: number, unreadCount: number) => void;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
  clearAll: () => void;
  setError: (error: string | null) => void;
}

export const useNotificationStore = create<NotificationState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    notifications: [],
    unreadCount: 0,
    isConnected: false,
    isInitialized: false,
    loading: false,
    error: null,

    // Initialize WebSocket connection
    initialize: () => {
      const state = get();
      if (state.isInitialized && state.isConnected) return;

      const token = localStorage.getItem('token');
      if (!token) return;

      // Connect socket
      socketService.connect(token);

      // Listen for connection changes
      const unsubConnection = socketService.onConnectionChange((connected) => {
        set({ isConnected: connected });
      });

      // Listen for new notifications
      const unsubNotification = socketService.onNotification((payload: NotificationSocketPayload) => {
        // Only add if this notification is for admin
        if (payload.isForAdmin) {
          const newNotification: Notification = {
            id: payload.id,
            type: payload.type as NotificationType,
            category: payload.category as NotificationCategory,
            title: payload.title,
            message: payload.message,
            priority: (payload.priority as NotificationPriority) || NotificationPriority.NORMAL,
            status: NotificationStatus.UNREAD,
            isRead: false,
            recipientId: payload.recipientId,
            isForAdmin: payload.isForAdmin || false,
            isForUser: payload.isForUser || false,
            sendEmail: false,
            metadata: {},
            createdAt: payload.createdAt,
            updatedAt: payload.createdAt,
          };

          get().addNotification(newNotification);

          toast.success(`ThÃ´ng bÃ¡o má»›i: ${payload.title}`, {
            duration: 5000,
          });
        }
      });

      // Listen for unread count updates
      const unsubUnreadCount = socketService.onUnreadCountUpdate((count: number) => {
        set({ unreadCount: count });
      });

      // Register with user ID
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          socketService.register(user.id || user.userId);
        } catch (e) {
          // Ignore parse errors
        }
      }

      set({ isInitialized: true });

      // Store unsubscribe functions for cleanup (can be called if needed)
      return () => {
        unsubConnection();
        unsubNotification();
        unsubUnreadCount();
      };
    },

    // Disconnect socket
    disconnect: () => {
      socketService.disconnect();
      set({ isConnected: false });
    },

    // Add notification to the top of the list
    addNotification: (notification: Notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications.filter(n => n.id !== notification.id)],
        unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
      }));
    },

    // Remove notification
    removeNotification: (id: string) => {
      const notification = get().notifications.find(n => n.id === id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.isRead 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      }));
    },

    // Mark single notification as read
    markAsRead: (id: string) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true, status: NotificationStatus.READ } : n
        ),
        unreadCount: state.notifications.find(n => n.id === id)?.isRead 
          ? state.unreadCount 
          : Math.max(0, state.unreadCount - 1),
      }));
    },

    // Mark all notifications as read
    markAllAsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
          status: NotificationStatus.READ,
        })),
        unreadCount: 0,
      }));
    },

    // Set notifications from API response
    setNotifications: (notifications: Notification[], _total: number, unreadCount: number) => {
      set({ notifications, unreadCount, loading: false });
    },

    // Set unread count directly
    setUnreadCount: (count: number) => {
      set({ unreadCount: count });
    },

    // Increment unread count
    incrementUnread: () => {
      set((state) => ({ unreadCount: state.unreadCount + 1 }));
    },

    // Decrement unread count
    decrementUnread: () => {
      set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) }));
    },

    // Clear all notifications
    clearAll: () => {
      set({ notifications: [], unreadCount: 0 });
    },

    // Set error
    setError: (error: string | null) => {
      set({ error, loading: false });
    },
  }))
);

// Selectors for performance optimization
export const selectNotifications = (state: NotificationState) => state.notifications;
export const selectUnreadCount = (state: NotificationState) => state.unreadCount;
export const selectIsConnected = (state: NotificationState) => state.isConnected;
export const selectIsInitialized = (state: NotificationState) => state.isInitialized;
export const selectLoading = (state: NotificationState) => state.loading;
export const selectUnreadNotifications = (state: NotificationState) => 
  state.notifications.filter(n => !n.isRead);
export const selectNotificationsByCategory = (category: string) => (state: NotificationState) =>
  state.notifications.filter(n => n.category === category);

