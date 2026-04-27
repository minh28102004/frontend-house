export interface ClientProductBasic {
  _id?: string;
  name: string;
  sold?: number;
  slug: string;
  thumbnail?: string;
  gallery?: [];
  currentPrice?: number;
  discountPrice?: number;
  description?: string;
  type?: string;
  category?: {
    main: string;
    sub?: string[];
    tags?: string[];
    slug?: string;
  };
}

export interface ClientProductListResponse {
  data: ClientProductBasic[];
  total: number;
  page: number;
  totalPages: number;
}


