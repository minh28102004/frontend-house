export interface ClientProductBasic {
  _id?: string;
  name: string;
  slug: string;
  thumbnail?: string;
  currentPrice?: number;
  discountPrice?: number;
  type?: string;
}

export interface ClientProductListResponse {
  data: ClientProductBasic[];
  total: number;
  page: number;
  totalPages: number;
}


