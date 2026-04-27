import axios from 'axios';
import { Contact, ContactSection } from '../models/contact.model';
import { API_URL_CLIENT } from '@/config/apiRoutes';

const API_URL = API_URL_CLIENT + '/api/contactsapi';

export const ContactService = {
  /**
   * Lấy danh sách contact theo section và trạng thái active
   */
  async getContacts(section?: string, isActive: boolean = true): Promise<Contact[]> {
    const params = new URLSearchParams();
    if (section) params.append('section', section);
    if (isActive !== undefined) params.append('isActive', String(isActive));

    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
  },

  /**
   * Lấy danh sách contact theo section (chỉ active)
   */
  async getContactsBySection(section: string): Promise<Contact[]> {
    const response = await axios.get(`${API_URL}/section/${section}`);
    return response.data;
  },

  /**
   * Lấy tất cả contact đã active, nhóm theo section
   */
  async getActiveContactsGrouped(): Promise<ContactSection> {
    const contacts = await this.getContacts(undefined, true);

    const grouped: ContactSection = {
      info: [],
      address: [],
      social: [],
    };

    contacts.forEach((contact) => {
      if (contact.section === 'info' || contact.section === 'address' || contact.section === 'social') {
        grouped[contact.section].push(contact);
      }
    });

    return grouped;
  },

  /**
   * Lấy chi tiết một contact
   */
  async getContactById(id: string): Promise<Contact> {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
};
