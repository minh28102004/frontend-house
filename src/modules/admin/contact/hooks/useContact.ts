"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminContactService, CreateContactDto, UpdateContactDto, BulkUpdateContactDto } from '../services/contact.service';
import { Contact } from '../models/contact.model';
import { toast } from '@/common/utils/toast';

export const useAdminContact = () => {
  const queryClient = useQueryClient();

  const useGetContacts = (section?: string, isActive?: boolean) => {
    return useQuery<Contact[], Error>({
      queryKey: ['admin-contacts', section, isActive],
      queryFn: () => AdminContactService.getContacts(section, isActive),
    });
  };

  const useGetContactsBySection = (section: string) => {
    return useQuery<Contact[], Error>({
      queryKey: ['admin-contacts-section', section],
      queryFn: () => AdminContactService.getContactsBySection(section),
    });
  };

  const useGetContactById = (id: string) => {
    return useQuery<Contact, Error>({
      queryKey: ['admin-contact', id],
      queryFn: () => AdminContactService.getContactById(id),
      enabled: !!id,
    });
  };

  const useCreateContact = () => {
    return useMutation({
      mutationFn: (data: CreateContactDto) => AdminContactService.createContact(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
        toast.success('Táº¡o liÃªn há»‡ thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Táº¡o liÃªn há»‡ tháº¥t báº¡i');
      },
    });
  };

  const useUpdateContact = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: UpdateContactDto }) =>
        AdminContactService.updateContact(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
        toast.success('Cáº­p nháº­t liÃªn há»‡ thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cáº­p nháº­t liÃªn há»‡ tháº¥t báº¡i');
      },
    });
  };

  const useBulkUpdateContacts = () => {
    return useMutation({
      mutationFn: (contacts: BulkUpdateContactDto[]) =>
        AdminContactService.bulkUpdateContacts(contacts),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
        toast.success('Cáº­p nháº­t nhiá»u liÃªn há»‡ thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cáº­p nháº­t tháº¥t báº¡i');
      },
    });
  };

  const useToggleContactActive = () => {
    return useMutation({
      mutationFn: (id: string) => AdminContactService.toggleContactActive(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
        toast.success('Cáº­p nháº­t tráº¡ng thÃ¡i thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cáº­p nháº­t tháº¥t báº¡i');
      },
    });
  };

  const useDeleteContact = () => {
    return useMutation({
      mutationFn: (id: string) => AdminContactService.deleteContact(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
        toast.success('XÃ³a liÃªn há»‡ thÃ nh cÃ´ng');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'XÃ³a liÃªn há»‡ tháº¥t báº¡i');
      },
    });
  };

  return {
    useGetContacts,
    useGetContactsBySection,
    useGetContactById,
    useCreateContact,
    useUpdateContact,
    useBulkUpdateContacts,
    useToggleContactActive,
    useDeleteContact,
  };
};

