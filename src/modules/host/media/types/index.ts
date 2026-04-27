export interface HostMediaImage {
  _id?: string;
  url: string;
  filename: string;
  slug: string;
  alt?: string;
  caption?: string;
  description?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  folder?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HostMediaImageResponse {
  _id: string;
  originalName: string;
  imageUrl: string;
  location: string;
  slug: string;
  alt: string;
  caption?: string;
  description?: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  folder?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HostMediaPaginatedResponse {
  images: HostMediaImageResponse[];
  total: number;
  hasMore: boolean;
}

export interface HostMediaUpdateDto {
  alt?: string;
  caption?: string;
  description?: string;
}
