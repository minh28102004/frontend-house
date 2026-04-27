/**
 * Interface cho thông tin danh mục
 */
export interface CategoryInfo {
  main: string;
  sub: string[];
  tags: string[];
  title?: string;
  key?: string;
  url?: string;
  mainCategoryId?: string;
  subCategoryIds?: string[];
  name?: string;
  slug?: string;
  _id?: string;
  id?: string;
}

/**
 * Interface chính cho sản phẩm
 */
export interface Product {
  _id?: string;
  name: string;
  sold?: number;
  slug: string;
  description?: string;
  currentPrice?: number;
  discountPrice?: number;

  // Thông tin hình ảnh
  thumbnail?: string;
  gallery?: string[];

  // Trạng thái và phân loại
  isVisible?: boolean;

  // Thông tin phân loại
  category?: CategoryInfo;

  // Thông tin thời gian
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;

  // Thứ tự sắp xếp trong danh mục (được lưu trong ProductCategory)
  sortOrder?: number;
}
