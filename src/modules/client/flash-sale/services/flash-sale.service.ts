import { FlashSale, FlashSaleListResponse } from '../models/flash-sale.model';
import { API_URL_CLIENT } from '@/config/apiRoutes';
import { apiRoutes } from '@/config/apiRoutes';

const FLASH_SALE_API = API_URL_CLIENT + apiRoutes.FLASH_SALE.BASE;

/**
 * Hàm hỗ trợ gọi API và trả về dữ liệu dạng JSON với xử lý lỗi chung.
 */
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Lỗi khi tải dữ liệu từ ${url}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Lấy danh sách flash sale (có phân trang và filter)
 */
export const getFlashSales = async (
  page: number = 1,
  limit: number = 12,
  isActive?: boolean,
  signal?: AbortSignal
): Promise<FlashSaleListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (isActive !== undefined) {
    params.append('isActive', isActive.toString());
  }

  const url = `${FLASH_SALE_API}?${params.toString()}`;
  return fetchJSON<FlashSaleListResponse>(url, { signal });
};

/**
 * Lấy danh sách flash sale đang hoạt động
 */
export const getActiveFlashSales = async (
  signal?: AbortSignal
): Promise<FlashSale[]> => {
  const url = `${FLASH_SALE_API}/active`;
  return fetchJSON<FlashSale[]>(url, { signal });
};

/**
 * Lấy chi tiết flash sale theo slug
 */
export const getFlashSaleBySlug = async (
  slug: string,
  signal?: AbortSignal
): Promise<FlashSale> => {
  const url = `${FLASH_SALE_API}/${encodeURIComponent(slug)}`;
  return fetchJSON<FlashSale>(url, { signal });
};

export const ClientFlashSaleService = {
  getFlashSales,
  getActiveFlashSales,
  getFlashSaleBySlug,
};

