import { FlashSale } from '../models/flash-sale.model';
import { API_URL_CLIENT } from '@/config/apiRoutes';
import { apiRoutes } from '@/config/apiRoutes';

const FLASH_SALE_API = API_URL_CLIENT + apiRoutes.FLASH_SALE.BASE;

// Hàm xử lý phản hồi từ API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(errorData?.message || "Lỗi khi xử lý yêu cầu");
  }
  return response.json();
};

// Hàm tạo options chung cho fetch
const fetchOptions = (method: string, data?: any) => ({
  method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: data ? JSON.stringify(data) : undefined,
});

export const FlashSaleService = {
  // Lấy danh sách flash sale có phân trang và filter
  getAll: async (
    page: number = 1,
    limit: number = 12,
    isActive?: boolean,
  ): Promise<{
    data: FlashSale[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (isActive !== undefined) {
        params.append('isActive', isActive.toString());
      }

      const response = await fetch(`${FLASH_SALE_API}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }

      const result = await handleResponse(response);

      if (!result || !result.data) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      return result;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách flash sale:", error);
      throw error;
    }
  },

  // Lấy danh sách flash sale đang hoạt động
  getActive: async (): Promise<FlashSale[]> => {
    try {
      const response = await fetch(`${FLASH_SALE_API}/active`);
      return handleResponse(response);
    } catch (error) {
      console.error("Lỗi khi lấy flash sale đang hoạt động:", error);
      throw error;
    }
  },

  // Lấy chi tiết flash sale theo slug
  getOne: async (slug: string): Promise<FlashSale> => {
    try {
      const response = await fetch(`${FLASH_SALE_API}/${slug}`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi lấy flash sale với slug ${slug}:`, error);
      throw error;
    }
  },

  // Tạo flash sale mới
  create: async (flashSale: Partial<FlashSale>): Promise<FlashSale> => {
    try {
      const flashSaleData = {
        ...flashSale,
        startDate: flashSale.startDate instanceof Date
          ? flashSale.startDate.toISOString()
          : flashSale.startDate,
        endDate: flashSale.endDate instanceof Date
          ? flashSale.endDate.toISOString()
          : flashSale.endDate,
      };

      console.log('Creating flash sale with data:', flashSaleData);
      const response = await fetch(FLASH_SALE_API, fetchOptions("POST", flashSaleData));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create flash sale error details:', {
          status: response.status,
          statusText: response.statusText,
          responseText: errorText,
          requestData: flashSaleData
        });
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Lỗi khi tạo flash sale");
        } catch (e) {
          console.log(e);
          throw new Error(`Lỗi khi tạo flash sale: ${errorText}`);
        }
      }

      return handleResponse(response);
    } catch (error) {
      console.error("Lỗi chi tiết khi tạo flash sale:", error);
      throw error;
    }
  },

  // Cập nhật flash sale
  update: async (slug: string, flashSale: Partial<FlashSale>): Promise<FlashSale> => {
    try {
      const flashSaleData = {
        ...flashSale,
        startDate: flashSale.startDate instanceof Date
          ? flashSale.startDate.toISOString()
          : flashSale.startDate,
        endDate: flashSale.endDate instanceof Date
          ? flashSale.endDate.toISOString()
          : flashSale.endDate,
      };

      const response = await fetch(
        `${FLASH_SALE_API}/${slug}`,
        fetchOptions("PUT", flashSaleData)
      );
      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi cập nhật flash sale ${slug}:`, error);
      throw error;
    }
  },

  // Xóa flash sale
  remove: async (slug: string): Promise<void> => {
    try {
      const response = await fetch(
        `${FLASH_SALE_API}/${slug}`,
        fetchOptions("DELETE")
      );
      await handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi xóa flash sale ${slug}:`, error);
      throw error;
    }
  },
};

