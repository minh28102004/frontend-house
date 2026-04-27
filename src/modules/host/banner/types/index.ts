// Re-export or define host-specific banner type
export interface HostBanner {
  _id?: string;
  image: string;
  link?: string;
  type: 'home' | 'home-mobile' | 'rooms' | 'host-banner';
  title?: string;
  subtitle?: string;
  isActive: boolean;
  order?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}