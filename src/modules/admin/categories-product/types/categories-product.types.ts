export interface CategoriesProduct {
  _id: string;
  name: string;
  title?: string;
  slug: string;
  description?: string;
  // Can be an ObjectId string, a slug string, an embedded object, or null
  parentCategory?:
  | string
  | {
    _id: string;
    name: string;
    slug: string;
  }
  | null;
  children: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  subCategories?: string[];
  // When fully populated from backend for detail views
  fullSubCategories?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  level?: number; // Thêm level
  isActive?: boolean; // Thêm trạng thái hoạt động
  image?: string; // URL ảnh danh mục (không bắt buộc)
  sortOrder?: number; // Thứ tự hiển thị danh mục
  bannerImage?: string;
  bannerMobileImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerCtaLabel?: string;
  bannerCtaLink?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number; // Thêm version
}
