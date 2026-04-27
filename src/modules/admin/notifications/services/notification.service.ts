import { API_URL, api } from '@/config/api';

/**
 * Notification Types
 */
export enum NotificationType {
  // Orders
  ORDER_NEW = 'order_new',
  ORDER_PAID = 'order_paid',
  ORDER_CANCELLED = 'order_cancelled',
  ORDER_STATUS_CHANGED = 'order_status_changed',

  // Bookings
  BOOKING_NEW = 'booking_new',
  BOOKING_PAID = 'booking_paid',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',

  // Users
  USER_REGISTERED = 'user_registered',
  USER_LOGIN = 'user_login',

  // Contact & Chat
  CONTACT_NEW = 'contact_new',
  CHAT_MESSAGE = 'chat_message',

  // Payment
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',

  // System
  SYSTEM = 'system',
}

/**
 * Notification Categories
 */
export enum NotificationCategory {
  ORDER = 'order',
  BOOKING = 'booking',
  USER = 'user',
  CONTACT = 'contact',
  PAYMENT = 'payment',
  SYSTEM = 'system',
}

/**
 * Notification Priority
 */
export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Notification Status
 */
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

/**
 * Notification Interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  isRead: boolean;
  recipientId?: string;
  senderId?: string;
  relatedId?: string;
  relatedModel?: string;
  metadata: Record<string, unknown>;
  icon?: string;
  color?: string;
  readAt?: string;
  isForAdmin: boolean;
  isForUser: boolean;
  sendEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Notification Stats
 */
export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<string, { total: number; unread: number }>;
  byType: Record<string, { total: number; unread: number }>;
}

/**
 * Query Parameters
 */
export interface NotificationQuery {
  type?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  unreadOnly?: boolean;
  recipientId?: string;
  forAdmin?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Paginated Response
 */
export interface NotificationResponse {
  items: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

const BASE = '/api/notifications';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

/**
 * Get all notifications
 */
export const getNotifications = async (
  query: NotificationQuery = {}
): Promise<NotificationResponse> => {
  const params = new URLSearchParams();
  
  if (query.type) params.append('type', query.type);
  if (query.category) params.append('category', query.category);
  if (query.priority) params.append('priority', query.priority);
  if (query.status) params.append('status', query.status);
  if (query.unreadOnly) params.append('unreadOnly', 'true');
  if (query.recipientId) params.append('recipientId', query.recipientId);
  if (query.forAdmin !== false) params.append('forAdmin', 'true');
  if (query.page) params.append('page', String(query.page));
  if (query.limit) params.append('limit', String(query.limit));

  const response = await api.get<NotificationResponse>(
    `${BASE}?${params.toString()}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Get notification by ID
 */
export const getNotificationById = async (id: string): Promise<Notification> => {
  const response = await api.get<Notification>(`${BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Get unread count
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get<{ unreadCount: number }>(
    `${BASE}/unread-count`,
    { headers: getAuthHeaders() }
  );
  return response.data.unreadCount;
};

/**
 * Get notification stats
 */
export const getNotificationStats = async (): Promise<NotificationStats> => {
  const response = await api.get<NotificationStats>(`${BASE}/stats`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await api.put<Notification>(`${BASE}/${id}/read`, undefined, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<{ modifiedCount: number }> => {
  const response = await api.put<{ modifiedCount: number }>(
    `${BASE}/read-all`,
    undefined,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Delete notification
 */
export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
};

/**
 * Delete all read notifications
 */
export const deleteAllRead = async (): Promise<{ deletedCount: number }> => {
  const response = await api.delete<{ deletedCount: number }>(
    `${BASE}/read-all`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Notification Service
 */
export const NotificationService = {
  getAll: getNotifications,
  getById: getNotificationById,
  getUnreadCount,
  getStats: getNotificationStats,
  markAsRead,
  markAllAsRead,
  delete: deleteNotification,
  deleteAllRead,
};

/**
 * Category Labels
 */
export const categoryLabels: Record<NotificationCategory, string> = {
  [NotificationCategory.ORDER]: 'Đơn hàng',
  [NotificationCategory.BOOKING]: 'Đặt phòng',
  [NotificationCategory.USER]: 'Người dùng',
  [NotificationCategory.CONTACT]: 'Liên hệ',
  [NotificationCategory.PAYMENT]: 'Thanh toán',
  [NotificationCategory.SYSTEM]: 'Hệ thống',
};

/**
 * Type Labels
 */
export const typeLabels: Record<NotificationType, string> = {
  [NotificationType.ORDER_NEW]: 'Đơn hàng mới',
  [NotificationType.ORDER_PAID]: 'Đơn hàng đã thanh toán',
  [NotificationType.ORDER_CANCELLED]: 'Đơn hàng bị hủy',
  [NotificationType.ORDER_STATUS_CHANGED]: 'Trạng thái đơn hàng thay đổi',
  [NotificationType.BOOKING_NEW]: 'Đặt phòng mới',
  [NotificationType.BOOKING_PAID]: 'Đặt phòng đã thanh toán',
  [NotificationType.BOOKING_CONFIRMED]: 'Đặt phòng được xác nhận',
  [NotificationType.BOOKING_CANCELLED]: 'Đặt phòng bị hủy',
  [NotificationType.USER_REGISTERED]: 'Người dùng đăng ký mới',
  [NotificationType.USER_LOGIN]: 'Người dùng đăng nhập',
  [NotificationType.CONTACT_NEW]: 'Liên hệ mới',
  [NotificationType.CHAT_MESSAGE]: 'Tin nhắn chat',
  [NotificationType.PAYMENT_SUCCESS]: 'Thanh toán thành công',
  [NotificationType.PAYMENT_FAILED]: 'Thanh toán thất bại',
  [NotificationType.SYSTEM]: 'Thông báo hệ thống',
};

/**
 * Category Colors
 */
export const categoryColors: Record<NotificationCategory, string> = {
  [NotificationCategory.ORDER]: '#10B981',
  [NotificationCategory.BOOKING]: '#8B5CF6',
  [NotificationCategory.USER]: '#3B82F6',
  [NotificationCategory.CONTACT]: '#F59E0B',
  [NotificationCategory.PAYMENT]: '#10B981',
  [NotificationCategory.SYSTEM]: '#6B7280',
};
