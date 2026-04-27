import { HostBanner } from '@/modules/host/banner/types';
import api from '@/config/api';
import { API_URL_CLIENT } from '@/config/apiRoutes';
import { getAuthHeaders } from '@/config/api';

const API_URL = API_URL_CLIENT + '/api/bannersapi';

export interface CreateBannerDto {
  image: string;
  link?: string;
  type: 'home' | 'home-mobile' | 'rooms' | 'host-banner';
  title?: string;
  subtitle?: string;
  isActive?: boolean;
  order?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateBannerDto extends Partial<CreateBannerDto> {}

export const HostBannerService = {
  /**
   * Lấy danh sách banner của host
   */
  async getBanners(): Promise<HostBanner[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.get(API_URL, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  /**
   * Lấy chi tiết banner
   */
  async getBannerById(id: string): Promise<HostBanner> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  /**
   * Tạo banner mới cho host
   */
  async createBanner(data: CreateBannerDto): Promise<HostBanner> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.post(API_URL, data, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  /**
   * Cập nhật banner
   */
  async updateBanner(id: string, data: UpdateBannerDto): Promise<HostBanner> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.patch(`${API_URL}/${id}`, data, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  /**
   * Bật/tắt trạng thái banner
   */
  async toggleBanner(id: string): Promise<HostBanner> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.patch(`${API_URL}/${id}/toggle-active`, {}, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  /**
   * Xóa banner
   */
  async deleteBanner(id: string): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    await api.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(token),
    });
  }
};