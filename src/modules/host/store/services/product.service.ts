import { HostProduct, CreateProductData, PaginationInfo } from "../types";
import { API_URL_CLIENT } from "@/config/apiRoutes";
import { apiRoutes } from "@/config/apiRoutes";

const PRODUCT_API = API_URL_CLIENT + apiRoutes.PRODUCTS.BASE;
const HOST_PRODUCT_ME = API_URL_CLIENT + apiRoutes.PRODUCTS.HOST_ME;
const IMAGE_UPLOAD_API = API_URL_CLIENT + apiRoutes.IMAGES.UPLOAD;

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("token") : ""}`,
});

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Lỗi khi xử lý yêu cầu");
  }
  return response.json();
};

export const HostProductService = {
  getAll: async (
    page: number = 1,
    limit: number = 12,
    search?: string
  ): Promise<{ data: HostProduct[]; total: number; page: number; totalPages: number }> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`${HOST_PRODUCT_ME}?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status}`);
      }

      const result = await handleResponse(response);
      return result;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<HostProduct> => {
    try {
      const response = await fetch(
        API_URL_CLIENT + apiRoutes.PRODUCTS.HOST_ME_BY_SLUG(slug),
        {
        method: "GET",
        headers: getAuthHeaders(),
        },
      );
      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi lấy sản phẩm ${slug}:`, error);
      throw error;
    }
  },

  create: async (product: Partial<CreateProductData>): Promise<HostProduct> => {
    try {
      const response = await fetch(HOST_PRODUCT_ME, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Lỗi khi tạo sản phẩm");
        } catch {
          throw new Error(`Lỗi khi tạo sản phẩm: ${errorText}`);
        }
      }

      return handleResponse(response);
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      throw error;
    }
  },

  update: async (slug: string, product: Partial<HostProduct>): Promise<HostProduct> => {
    try {
      const response = await fetch(
        API_URL_CLIENT + apiRoutes.PRODUCTS.HOST_ME_BY_SLUG(slug),
        {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(product),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || "Lỗi khi cập nhật sản phẩm");
        } catch {
          throw new Error(`Lỗi khi cập nhật sản phẩm: ${errorText}`);
        }
      }

      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi cập nhật sản phẩm ${slug}:`, error);
      throw error;
    }
  },

  delete: async (slug: string): Promise<void> => {
    try {
      const response = await fetch(
        API_URL_CLIENT + apiRoutes.PRODUCTS.HOST_ME_BY_SLUG(slug),
        {
        method: "DELETE",
        headers: getAuthHeaders(),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Lỗi khi xóa sản phẩm");
      }
    } catch (error) {
      console.error(`Lỗi khi xóa sản phẩm ${slug}:`, error);
      throw error;
    }
  },

  toggleFeatured: async (slug: string): Promise<HostProduct> => {
    try {
      const response = await fetch(
        API_URL_CLIENT + apiRoutes.PRODUCTS.HOST_ME_BY_SLUG(slug),
        {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ isFeatured: true }),
        },
      );
      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi toggle featured ${slug}:`, error);
      throw error;
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(IMAGE_UPLOAD_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("token") : ""}`,
        },
        body: formData,
      });

      const result = await handleResponse(response);
      if (!result.imageUrl) throw new Error("Không tìm thấy URL ảnh");
      return result.imageUrl;
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      throw error;
    }
  },
};
