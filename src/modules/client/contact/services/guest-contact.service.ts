import api from '@/config/api';
import { API_URL_CLIENT } from '@/config/apiRoutes';

const API_URL = API_URL_CLIENT + '/api/contactsapi';

export interface GuestContactDto {
  name: string;
  email: string;
  phone: string;
  message: string;
  section?: string;
  label?: string;
  value?: string;
}

export const GuestContactService = {
  async submit(data: GuestContactDto): Promise<any> {
    const response = await api.post(`${API_URL}/submit`, data);
    return response.data;
  },
};
