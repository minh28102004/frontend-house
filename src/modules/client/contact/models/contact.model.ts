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

export interface ContactSection {
  info: Contact[];
  address: Contact[];
  social: Contact[];
}
