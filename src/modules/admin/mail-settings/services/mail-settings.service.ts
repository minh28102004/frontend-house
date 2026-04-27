import api from '@/config/api';
import { API_URL_CLIENT, apiRoutes } from '@/config/apiRoutes';

const API_URL = API_URL_CLIENT + '/api/admin/mail-settings';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`
});

export interface MailSettings {
  _id?: string;
  id: string;
  senderEmail: string;
  senderName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  smtpSecure: boolean;
  notificationEmail: string;
  emailNotificationsEnabled: boolean;
  orderNotificationsEnabled: boolean;
  contactNotificationsEnabled: boolean;
  bookingNotificationsEnabled: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateMailSettingsDto {
  senderEmail?: string;
  senderName?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  notificationEmail?: string;
  emailNotificationsEnabled?: boolean;
  orderNotificationsEnabled?: boolean;
  contactNotificationsEnabled?: boolean;
  bookingNotificationsEnabled?: boolean;
  isActive?: boolean;
}

export const MailSettingsService = {
  async get(): Promise<MailSettings> {
    const response = await api.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async update(data: UpdateMailSettingsDto): Promise<MailSettings> {
    const response = await api.put(API_URL, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  async getNotificationEmail(): Promise<{ notificationEmail: string }> {
    const response = await api.get(`${API_URL}/notification-email`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
