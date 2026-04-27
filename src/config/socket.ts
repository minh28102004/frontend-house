import { io, Socket } from 'socket.io-client';
import { Notification } from '@/modules/admin/notifications/services/notification.service';

export const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class SocketService {
  private socket: Socket | null = null;
  private notificationListeners: Set<(notification: NotificationSocketPayload) => void> = new Set();
  private unreadCountListeners: Set<(count: number) => void> = new Set();
  private connectionListeners: Set<(connected: boolean) => void> = new Set();

  connect(token?: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(`${SOCKET_URL}/notifications`, {
      auth: token ? { token } : {},
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id);
      this.notifyConnectionListeners(true);

      // Register after connection
      if (token) {
        this.register(token);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      this.notifyConnectionListeners(false);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('[Socket] Connection error:', error.message);
      // Don't mark as disconnected immediately - might reconnect
      // The 'disconnect' event will be fired if connection fails completely
    });

    // Listen for notifications
    this.socket.on('notification', (data: NotificationSocketPayload) => {
      console.log('[Socket] New notification:', data);
      this.notifyNotificationListeners(data);
    });

    // Listen for unread count updates
    this.socket.on('unread-count-update', async (data: { recipientId?: string; count?: number }) => {
      console.log('[Socket] Unread count update:', data);
      // Fetch fresh unread count from server
      await this.fetchAndNotifyUnreadCount();
    });
  }

  register(userId?: string) {
    if (!this.socket?.connected) {
      console.warn('[Socket] Cannot register - not connected');
      return;
    }

    this.socket.emit('register', { userId }, (response: { event: string; data: { success: boolean } }) => {
      console.log('[Socket] Registration response:', response);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Notification listeners
  onNotification(callback: (notification: NotificationSocketPayload) => void): () => void {
    this.notificationListeners.add(callback);
    return () => this.notificationListeners.delete(callback);
  }

  // Unread count listeners
  onUnreadCountUpdate(callback: (count: number) => void): () => void {
    this.unreadCountListeners.add(callback);
    return () => this.unreadCountListeners.delete(callback);
  }

  // Connection status listeners
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionListeners.add(callback);
    return () => this.connectionListeners.delete(callback);
  }

  private notifyNotificationListeners(notification: NotificationSocketPayload) {
    this.notificationListeners.forEach((listener) => listener(notification));
  }

  private notifyUnreadCountListeners(count: number) {
    this.unreadCountListeners.forEach((listener) => listener(count));
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach((listener) => listener(connected));
  }

  private async fetchAndNotifyUnreadCount() {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${SOCKET_URL}/api/notifications/unread-count`, {
        headers,
      });
      const data = await response.json();
      this.notifyUnreadCountListeners(data.unreadCount || 0);
    } catch (error) {
      console.error('[Socket] Failed to fetch unread count:', error);
    }
  }
}

export interface NotificationSocketPayload {
  id: string;
  type: string;
  category: string;
  title: string;
  message: string;
  priority?: string;
  icon?: string;
  color?: string;
  isForAdmin?: boolean;
  isForUser?: boolean;
  recipientId?: string;
  createdAt: string;
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
