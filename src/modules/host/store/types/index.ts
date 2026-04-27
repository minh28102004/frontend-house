export interface HostProduct {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  categoryId?: string;
  categoryName?: string;
  stock: number;
  isActive: boolean;
  isFeatured?: boolean;
  sku?: string;
  unit?: string;
  createdAt?: Date;
  updatedAt?: Date;
  thumbnail?: string;
  gallery?: string[];
  currentPrice?: number;
  discountPrice?: number;
  sold?: number;
  isVisible?: boolean;
  category?: {
    main?: string;
    sub?: string[];
    mainCategoryId?: string;
    subCategoryIds?: string[];
    name?: string;
    slug?: string;
  };
}

export interface HostCategory {
  _id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string;
  parentId?: string;
  parentCategory?: string | null;
  children?: HostCategory[];
  order?: number;
  level?: number;
  isActive?: boolean;
  image?: string;
  bannerImage?: string;
  bannerMobileImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerCtaLabel?: string;
  bannerCtaLink?: string;
  sortOrder?: number;
  hostId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  title?: string;
  description?: string;
  parentCategory?: string;
  sortOrder?: number;
  isActive?: boolean;
  image?: string;
  bannerImage?: string;
  bannerMobileImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerCtaLabel?: string;
  bannerCtaLink?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  gallery?: string[];
  stock: number;
  isActive: boolean;
  isFeatured?: boolean;
  sku?: string;
  unit?: string;
  category?: {
    main?: string;
    sub?: string[];
    mainCategoryId?: string;
    subCategoryIds?: string[];
    name?: string;
    slug?: string;
  };
}
