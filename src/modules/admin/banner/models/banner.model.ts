export interface Banner {
  _id: string;
  imagePath: string;
  type: 'home' | 'home-mobile' | 'posts' | 'products' | 'contact';
  backgroundType?: 'video' | 'image';
  isActive: boolean;
  order: number;
  link?: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BannerResponse {
  data: Banner[];
  total: number;
  page: number;
  totalPages: number;
}