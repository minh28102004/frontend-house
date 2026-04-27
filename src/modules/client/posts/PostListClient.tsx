"use client";
import { useMemo } from "react";
import Link from "next/link";
import { usePaginatedPosts } from "./hooks/usePosts";
import { useCategoryPosts } from "./hooks/usePosts";
import PostCardSkeleton from "./components/PostCardSkeleton";
import PostGrid from "./components/PostGrid";
import BannerPosts from "./components/BannerPosts";
import TabsPost from "./components/TabsPost";
import type { CategoryPostTree } from "./models/categories-post.model";
import { resolveMediaUrl } from "@/common/utils/mediaUrl";

const getThumbnailPath = (thumbnail: unknown): string =>
  resolveMediaUrl(thumbnail, "/placeholder.svg?height=400&width=600");

// Hàm thu thập tất cả ID/slug của danh mục và children
const collectCategoryIdentifiers = (node: CategoryPostTree): string[] => {
  if (!node) return [];
  const entries = [
    node._id,
    node.slug,
    node.name,
  ].filter(Boolean);
  const childEntries = (node.children || []).flatMap((child) => collectCategoryIdentifiers(child));
  return [...entries, ...childEntries];
};

// Hàm normalize để chuẩn hóa giá trị category
const normalize = (entry: any): string | null => {
  if (!entry) return null;
  if (typeof entry === "string" || typeof entry === "number") {
    return String(entry).toLowerCase().trim();
  }
  if (typeof entry === "object") {
    const cand = entry.slug || entry._id || entry.id || entry.name;
    return cand ? String(cand).toLowerCase().trim() : null;
  }
  return null;
};

// Lọc bài viết theo danh mục
const filterPostsByCategory = (post: any, categoryIdentifiers: string[]): boolean => {
  const cat = post.category;
  const main = Array.isArray(cat?.main) ? cat.main : [];
  const sub = Array.isArray(cat?.sub) ? cat.sub : [];

  const postCategoryValues = [...main, ...sub]
    .map(normalize)
    .filter(Boolean) as string[];

  return postCategoryValues.some((v) => categoryIdentifiers.includes(v));
};


export default function PostListClient() {
  // Lấy tất cả bài viết (lấy nhiều để đủ cho tất cả danh mục)
  const { data: paged, isLoading, error } = usePaginatedPosts(1, 500);
  const allPosts = paged?.data || [];
  const { categories } = useCategoryPosts();

  // Lấy các danh mục top-level (level 0) và sắp xếp theo sortOrder
  const topCategories = useMemo(() => {
    return (categories || [])
      .filter((cat) => cat.level === 0 && !cat.isDeleted)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [categories]);

  // Tạo danh sách danh mục với bài viết theo pattern 2, 3, 2, 3...
  const categoriesWithPosts = useMemo(() => {
    // Sắp xếp tất cả bài viết theo ngày mới nhất và loại bỏ trùng lặp
    const sortedPosts = [...new Map(allPosts.map((post) => [post.slug, post])).values()].sort(
      (a, b) =>
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
    );

    return topCategories
      .map((category, index) => {
        // Thu thập tất cả identifier của danh mục và children
        const categoryIdentifiers = collectCategoryIdentifiers(category)
          .map((v) => String(v).toLowerCase().trim());

        // Lọc bài viết thuộc danh mục này
        const categoryPosts = sortedPosts.filter((post) =>
          filterPostsByCategory(post, categoryIdentifiers)
        );

        // Xác định số lượng bài viết cần lấy theo pattern: 2, 3, 2, 3...
        // index 0: 2 bài, index 1: 3 bài, index 2: 2 bài, index 3: 3 bài...
        const postCount = index % 2 === 0 ? 2 : 3;

        // Lấy số lượng bài viết theo pattern
        const posts = categoryPosts.slice(0, postCount);

        return {
          category,
          posts,
          postCount: posts.length,
        };
      })
      .filter((item) => item.posts.length > 0); // Chỉ giữ lại danh mục có bài viết
  }, [topCategories, allPosts]);

  // 🌀 Loading ban đầu
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 md:px-6">
        <div className="mt-14 md:mt-20 mb-4">
          <TabsPost />
          <div>
            <BannerPosts />
          </div>
        </div>
        <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 md:px-6">
        <div className="mt-14 md:mt-20 mb-4">
          <TabsPost />
          <div>
            <BannerPosts />
          </div>
        </div>
        <div className="px-4">
          <div className="text-center py-10">
            <p className="text-red-500">
              Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 md:px-6">
      <div className="mt-14 md:mt-20 mb-4 md:mb-12">
        <TabsPost />
        <div>
          <BannerPosts />
        </div>
      </div>
      <div className="w-full px-4">
        <div className="mt-4 space-y-16">
          {categoriesWithPosts.map(({ category, posts }) => (
            <div key={category._id} className="w-full">
              {/* Tiêu đề danh mục */}
              <div className="mb-6">
                <div className="text-3xl md:text-6xl font-medium text-gray-900 mb-4">
                  {category.name}
                </div>
                <div className="text-lg md:text-2xl mb-2">
                  {category.description}
                </div>
              </div>

              {/* Grid bài viết - 2 hoặc 3 cột tùy theo pattern */}
              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${posts.length === 3 ? "xl:grid-cols-3" : "xl:grid-cols-2"
                  } gap-6`}
              >
                <PostGrid posts={posts} getThumbnailPath={getThumbnailPath} />
              </div>
              <div className="flex justify-center mt-10">
                <Link
                  href={`/posts/danh-muc/${category.slug || category._id}`}
                  className="bg-gray-900 rounded-full px-8 py-3 text-base text-gray-100 hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors text-center flex items-center justify-center"
                >
                  Khám phá {category.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
