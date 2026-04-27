import { useQuery } from '@tanstack/react-query';
import { ContactService } from '../services/contact.service';
import { Contact, ContactSection } from '../models/contact.model';

export const useContact = () => {
  /**
   * Hook lấy danh sách contact theo section và trạng thái
   */
  const useGetContacts = (section?: string, isActive: boolean = true) => {
    return useQuery<Contact[], Error>({
      queryKey: ['contacts', section, isActive],
      queryFn: () => ContactService.getContacts(section, isActive),
    });
  };

  /**
   * Hook lấy danh sách contact theo section (chỉ active)
   */
  const useGetContactsBySection = (section: string) => {
    return useQuery<Contact[], Error>({
      queryKey: ['contacts-section', section],
      queryFn: () => ContactService.getContactsBySection(section),
    });
  };

  /**
   * Hook lấy tất cả contact đã active, nhóm theo section
   */
  const useGetActiveContactsGrouped = () => {
    return useQuery<ContactSection, Error>({
      queryKey: ['contacts-grouped'],
      queryFn: () => ContactService.getActiveContactsGrouped(),
    });
  };

  /**
   * Hook lấy chi tiết một contact
   */
  const useGetContactById = (id: string) => {
    return useQuery<Contact, Error>({
      queryKey: ['contact', id],
      queryFn: () => ContactService.getContactById(id),
      enabled: !!id,
    });
  };

  return {
    useGetContacts,
    useGetContactsBySection,
    useGetActiveContactsGrouped,
    useGetContactById,
  };
};
