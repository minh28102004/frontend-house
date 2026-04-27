import api from '@/config/api';
import { Contact, ContactType } from '../models/contact.model';
import { API_URL_CLIENT } from '@/config/apiRoutes';
import { config } from '@/config/config';

const API_URL = API_URL_CLIENT + config.ROUTES.CONTACT.BASE;

export interface CreateContactDto {
  section: string;
  key: string;
  label: string;
  value: string;
  type?: ContactType;
  isActive?: boolean;
  order?: number;
}

export interface UpdateContactDto {
  section?: string;
  key?: string;
  label?: string;
  value?: string;
  type?: ContactType;
  isActive?: boolean;
  order?: number;
}

export interface BulkUpdateContactDto {
  id: string;
  section?: string;
  key?: string;
  label?: string;
  value?: string;
  type?: ContactType;
  isActive?: boolean;
  order?: number;
}

const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };
};

export const AdminContactService = {
  /**
   * Lấy danh sách contact
   */
  async getContacts(section?: string, isActive?: boolean): Promise<Contact[]> {
    const params = new URLSearchParams();
    if (section) params.append('section', section);
    if (isActive !== undefined) params.append('isActive', String(isActive));

    const response = await api.get(`${API_URL}?${params.toString()}`);
    return response.data;
  },

  /**
   * Lấy danh sách contact theo section
   */
  async getContactsBySection(section: string): Promise<Contact[]> {
    const response = await api.get(`${API_URL}/section/${section}`);
    return response.data;
  },

  /**
   * Lấy chi tiết contact
   */
  async getContactById(id: string): Promise<Contact> {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Tạo contact mới
   */
  async createContact(data: CreateContactDto): Promise<Contact> {
    const response = await api.post(API_URL, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Cập nhật contact
   */
  async updateContact(id: string, data: UpdateContactDto): Promise<Contact> {
    const response = await api.patch(`${API_URL}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Cập nhật thứ tự contact
   */
  async updateContactOrder(id: string, order: number): Promise<Contact> {
    const response = await api.patch(`${API_URL}/${id}/order`, { order }, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Toggle trạng thái active/inactive
   */
  async toggleContactActive(id: string): Promise<Contact> {
    const response = await api.patch(`${API_URL}/${id}/toggle-active`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Xóa contact
   */
  async deleteContact(id: string): Promise<void> {
    await api.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * Bulk update nhiều contacts
   */
  async bulkUpdateContacts(contacts: BulkUpdateContactDto[]): Promise<Contact[]> {
    const response = await api.patch(`${API_URL}/bulk`, contacts, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
