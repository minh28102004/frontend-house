import { Post, PostStatus } from "../models/post.model";
import { Category } from "../models/post.model";

import { config } from "@/config/config";
import { API_URL_CLIENT } from "@/config/apiRoutes";

const POST_API = API_URL_CLIENT + config.ROUTES.POSTS.BASE;
const CATEGORY_POST_API = API_URL_CLIENT + config.ROUTES.CATEGORIES_POST.BASE;

// 🔧 Hàm xử lý phản hồi trả về từ API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Lỗi từ máy chủ");
  }
  return response.json();
};

// 🔧 Hàm tạo options fetch chung (data giờ phải là object)
const fetchOptions = (method: string, data?: unknown): RequestInit => ({
  method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: data ? JSON.stringify(data) : undefined,
});

// 📦 Service quản lý bài viết
export const PostService = {
  /**
   * 📤 Tạo bài viết mới
   */
  create: async (post: Partial<Post>): Promise<Post> => {
    const response = await fetch(POST_API, fetchOptions("POST", post));
    return handleResponse(response);
  },

  /**
   * Lấy danh sách bài viết có phân trang
   * @param includeHidden Có bao gồm bài viết ẩn hay không
   */
  getAll: async (
    page: number,
    limit: number = 10,
    includeHidden = false
  ): Promise<{ data: Post[]; total: number }> => {
    const response = await fetch(`${POST_API}?page=${page}&limit=${limit}&includeHidden=${includeHidden}`);
    return handleResponse(response);
  },

  /**
   * 🔍 Chi tiết 1 bài theo slug
   * @param includeHidden Có bao gồm bài viết ẩn hay không
   */
  getOne: async (slug: string, includeHidden = false): Promise<Post> => {
    const response = await fetch(`${POST_API}/${slug}?includeHidden=${includeHidden}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return handleResponse(response);
  },

  /**
   * ✏️ Cập nhật bài viết
   */
  update: async (slug: string, post: Partial<Post>): Promise<Post> => {
    const response = await fetch(
      `${POST_API}/${slug}`,
      fetchOptions("PATCH", post)
    );
    return handleResponse(response);
  },

  /**
   * 🗑️ Xóa mềm
   */
  softDelete: async (slug: string): Promise<void> => {
    const response = await fetch(`${POST_API}/${slug}`, fetchOptions("DELETE"));
    return handleResponse(response);
  },

  /**
   * Xóa tạm thời
   */
  hardDelete: async (slug: string): Promise<void> => {
    const response = await fetch(
      `${POST_API}/${slug}`,
      // `${POST_API}/${slug}/force`,
      fetchOptions("DELETE")
    );
    return handleResponse(response);
  },

  /**
   * 📂 Lấy full cây category-post (pagin vòng while)
   */
  getAllCategories: async (): Promise<{ data: Category[] }> => {
    const allCategories: Category[] = [];
    let page = 1;
    const limit = 10;

    while (true) {
      const response = await fetch(
        `${CATEGORY_POST_API}?page=${page}&limit=${limit}`
      );
      const result = await handleResponse(response);

      if (!Array.isArray(result.data)) break;
      allCategories.push(...result.data);
      if (result.data.length < limit) break;
      page++;
    }

    return { data: allCategories };
  },

  /**
   * 👤 Lấy danh sách bài viết của user đang đăng nhập
   */
  getMyPosts: async (
    page = 1,
    limit = 10,
    userId: string
  ): Promise<{ data: Post[]; total: number }> => {
    const response = await fetch(
      `${POST_API}/my-posts?userId=${userId}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return handleResponse(response);
  },

  /**
   * 🔍 Tìm kiếm bài viết theo tên (có phân trang)
   * @param includeHidden Có bao gồm bài viết ẩn hay không
   */
  search: async (
    searchTerm: string,
    page = 1,
    limit = 10,
    includeHidden = false
  ): Promise<{ data: Post[]; total: number }> => {
    // Nếu searchTerm trống, trả về danh sách bài viết bình thường
    if (!searchTerm?.trim()) {
      return PostService.getAll(page, limit, includeHidden);
    }

    try {
      const response = await fetch(
        `${POST_API}?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm.trim())}&includeHidden=${includeHidden}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bài viết:", error);
      throw new Error("Không thể tìm kiếm bài viết. Vui lòng thử lại sau.");
    }
  },

  /**
   * 📊 Lấy danh sách bài viết theo trạng thái phê duyệt
   * @param status Trạng thái phê duyệt (draft, pending, approved, rejected)
   * @param includeHidden Có bao gồm bài viết ẩn hay không
   */
  getByStatus: async (
    status: PostStatus,
    page = 1,
    limit = 10,
    includeHidden = false
  ): Promise<{ data: Post[]; total: number }> => {
    const response = await fetch(
      `${POST_API}/by-status/${status}?page=${page}&limit=${limit}&includeHidden=${includeHidden}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return handleResponse(response);
  },

  /**
   * 👁️ Cập nhật trạng thái hiển thị của bài viết
   * @param slug Slug của bài viết
   * @param isVisible Trạng thái hiển thị mới (true/false)
   */
  updateVisibility: async (slug: string, isVisible: boolean): Promise<Post> => {
    const response = await fetch(
      `${POST_API}/${slug}/visibility`,
      fetchOptions("PATCH", { isVisible })
    );
    return handleResponse(response);
  },

  /**
   * Cập nhật trạng thái phê duyệt của bài viết
   * @param slug Slug của bài viết
   * @param status Trạng thái phê duyệt mới
   */
  updateStatus: async (slug: string, status: PostStatus): Promise<Post> => {
    const response = await fetch(
      `${POST_API}/${slug}/status`,
      fetchOptions("PATCH", { status })
    );
    return handleResponse(response);
  },
};

// 👇 Export từng hàm để hook dùng
export const createPost = PostService.create;
export const getPosts = PostService.getAll;
export const getPostBySlug = PostService.getOne;
export const updatePost = PostService.update;
export const softDeletePost = PostService.softDelete;
export const hardDeletePost = PostService.hardDelete;
export const getAllCategories = PostService.getAllCategories;
export const searchPosts = PostService.search;
export const getMyPosts = PostService.getMyPosts;
export const getPostsByStatus = PostService.getByStatus;
export const updatePostVisibility = PostService.updateVisibility;
export const updatePostStatus = PostService.updateStatus;
