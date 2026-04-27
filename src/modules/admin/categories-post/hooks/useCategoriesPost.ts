// 📁 src/modules/categories-post/hooks/useCategoriesPost.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import CategoryPostService from "../services/categories-post.service";
import {
  CategoryPostTree,
  CreateCategoryPostDto,
  UpdateCategoryPostDto,
} from "../models/categories-post.model";

interface CategoryPostsData {
  categories: CategoryPostTree[];
  total: number;
}

/**
 * Hook lấy cây danh mục theo slug (đệ quy)
 */
export const useCategoryPostTree = (
  slug: string
): UseQueryResult<CategoryPostTree> => {
  return useQuery<CategoryPostTree>({
    queryKey: ["category-posts", slug],
    queryFn: async () => {
      const res = await CategoryPostService.getOne(slug);
      return res.data;
    },
    enabled: !!slug,
  });
};

/**
 * Hook quản lý danh sách & thao tác CRUD danh mục bài viết
 */
export const useCategoryPosts = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery<CategoryPostsData>({
    queryKey: ["category-posts", page, limit],
    queryFn: async () => {
      const res = await CategoryPostService.findAll({ page, limit });
      return {
        categories: res.data,
        total: res.total || 0
      };
    },
  });

  // Tạo danh mục mới
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryPostDto) =>
      CategoryPostService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-posts"] });
    },
  });

  // Cập nhật danh mục theo slug
  const updateMutation = useMutation({
    mutationFn: (params: { slug: string; data: UpdateCategoryPostDto }) =>
      CategoryPostService.update(params.slug, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-posts"] });
    },
  });

  // Xóa mềm
  const softDeleteMutation = useMutation({
    mutationFn: (slug: string) => CategoryPostService.softDelete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-posts"] });
    },
  });

  // Xóa vĩnh viễn
  const hardDeleteMutation = useMutation({
    mutationFn: (slug: string) => CategoryPostService.hardDelete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-posts"] });
    },
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    softDeleteMutation,
    hardDeleteMutation,
    total: listQuery.data?.total || 0,
    categories: listQuery.data?.categories || [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    error: listQuery.error,
  };
};
