/**
 * Interface cho thông tin cơ bản của sản phẩm trong flash sale
 */
export interface ProductBasic {
  _id: string;
  name: string;
  slug: string;
  thumbnail?: string;
  currentPrice?: number;
  discountPrice?: number;
}

/**
 * Interface cho Flash Sale
 */
export interface FlashSale {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  startDate: string | Date;
  endDate: string | Date;
  products: string[] | ProductBasic[];
  isActive?: boolean;
  discountPercentage?: number;
  maxQuantity?: number;
  soldQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Response từ API khi lấy danh sách flash sale
 */
export interface FlashSaleListResponse {
  data: FlashSale[];
  total: number;
  page: number;
  totalPages: number;
}

