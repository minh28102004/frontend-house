import { HostCategory } from "../types";
import { apiRoutes } from "@/config/apiRoutes";

const CATEGORY_API = apiRoutes.CATEGORIES_PRODUCT.BASE;
const HOST_CAT = apiRoutes.CATEGORIES_PRODUCT.HOST_ME;

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

export const HostCategoryService = {
  getAll: async (): Promise<HostCategory[]> => {
    try {
      const response = await fetch(HOST_CAT.ALL, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status}`);
      }

      const result = await handleResponse(response);
      return result.data || result || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
      throw error;
    }
  },

  getMainCategories: async (): Promise<HostCategory[]> => {
    try {
      const response = await fetch(HOST_CAT.MAIN, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status}`);
      }

      const result = await handleResponse(response);
      return result.data || result || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh mục chính:", error);
      throw error;
    }
  },

  getSubCategories: async (parentId: string): Promise<HostCategory[]> => {
    try {
      const response = await fetch(HOST_CAT.SUB(parentId), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status}`);
      }

      const result = await handleResponse(response);
      return result.data || result || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh mục con:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<HostCategory> => {
    try {
      const response = await fetch(HOST_CAT.BY_ID(id), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi lấy danh mục ${id}:`, error);
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<HostCategory> => {
    try {
      const response = await fetch(HOST_CAT.BY_SLUG(slug), {
        method: "GET",
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi lấy danh mục ${slug}:`, error);
      throw error;
    }
  },

  create: async (data: {
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
  }): Promise<{ message: string }> => {
    try {
      const response = await fetch(CATEGORY_API, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Lỗi API: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      throw error;
    }
  },

  update: async (slug: string, data: {
    name?: string;
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
  }): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${CATEGORY_API}/${slug}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Lỗi API: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi cập nhật danh mục ${slug}:`, error);
      throw error;
    }
  },

  delete: async (slug: string): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${CATEGORY_API}/${slug}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Lỗi API: ${response.status}`);
      }

      return handleResponse(response);
    } catch (error) {
      console.error(`Lỗi khi xóa danh mục ${slug}:`, error);
      throw error;
    }
  },
};
