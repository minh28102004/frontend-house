import { HostQrSettings, HostVietQrConfig } from '../types';
import api from '@/config/api';
import { API_URL_CLIENT } from '@/config/apiRoutes';
import { getAuthHeaders } from '@/config/api';

const API_URL = API_URL_CLIENT + '/api/usersapi/host-qr';

export interface UpdateQrSettingsDto {
  vietQr?: Partial<HostVietQrConfig>;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
}

export const HostQrCodeService = {
  /**
   * Lấy cài đặt QR code của host
   */
  async getSettings(): Promise<HostQrSettings> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.get(API_URL, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  /**
   * Cập nhật cài đặt QR code của host
   */
  async updateSettings(data: UpdateQrSettingsDto): Promise<HostQrSettings> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.patch(API_URL, data, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },
};
