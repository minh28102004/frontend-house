export type ContactType = 'text' | 'phone' | 'email' | 'url' | 'social';

export interface Contact {
  _id: string;
  section: string;
  key: string;
  label: string;
  value: string;
  type: ContactType;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  data: Contact[];
  total: number;
  page: number;
  totalPages: number;
}

export const CONTACT_SECTIONS = {
  INFO: 'info',
  ADDRESS: 'address',
  SOCIAL: 'social',
} as const;

export type ContactSection = typeof CONTACT_SECTIONS[keyof typeof CONTACT_SECTIONS];

export const CONTACT_SECTION_LABELS: Record<ContactSection, string> = {
  [CONTACT_SECTIONS.INFO]: 'Thông tin liên hệ',
  [CONTACT_SECTIONS.ADDRESS]: 'Địa chỉ',
  [CONTACT_SECTIONS.SOCIAL]: 'Mạng xã hội',
};

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  text: 'Văn bản',
  phone: 'Số điện thoại',
  email: 'Email',
  url: 'URL',
  social: 'Mạng xã hội',
};
