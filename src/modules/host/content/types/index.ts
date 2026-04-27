export type CategoryStatus = 'active' | 'inactive';

export type ContentStatus = 'draft' | 'pending' | 'published';

export interface HostContent {
  _id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  status: ContentStatus;
  tags?: string[];
  category?: {
    main: string[];
    sub: string[];
  };
  author?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}

export interface CreateContentData {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  status?: ContentStatus;
  tags?: string[];
  category?: {
    main?: string[];
    sub?: string[];
  };
  publishedAt?: string;
}

export interface UpdateContentData extends Partial<CreateContentData> {}

export interface ContentListResponse {
  data: HostContent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ContentFilters {
  page?: number;
  limit?: number;
  status?: ContentStatus;
  search?: string;
}

export interface HostContentCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  level: number;
  order?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  parent?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  parent?: string;
  order?: number;
  isActive?: boolean;
}
