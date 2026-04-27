import { HostSeoSettings, HostSeoUpdateDto } from '../types';
import api from '@/config/api';
import { getAuthHeaders } from '@/config/api';

const API_URL = '/api/host/settings/seo';

export const HostSeoService = {
  async getSettings(): Promise<HostSeoSettings> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.get<HostSeoSettings>(API_URL, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  async updateSettings(data: HostSeoUpdateDto): Promise<HostSeoSettings> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await api.patch<HostSeoSettings>(API_URL, data, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },
};
