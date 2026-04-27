"use client";

import React, { useMemo } from "react";
import { usePaginatedPosts } from "../hooks/usePosts";
import { useCategoryPosts } from "@/modules/admin/categories-post/hooks/useCategoriesPost";
import type { CategoryPostTree } from "@/modules/admin/categories-post/models/categories-post.model";
import type { Post } from "../models/post.model";
import PostGrid from "../components/PostGrid";
import BannerPosts from "../components/BannerPosts";
import TabsPostDetail from "../components/TabsPostDetail";
import { resolveMediaUrl } from "@/common/utils/mediaUrl";

function getThumbnailPath(thumbnail: unknown): string {
  return resolveMediaUrl(thumbnail, "/placeholder.svg?height=400&width=600");
}

export default function CategoryPostsPage({ slug }: { slug?: string }) {
  // Load posts (first 100 for simplicity)
  const { data: paged } = usePaginatedPosts(1, 100);
  const posts: Post[] = paged?.data || [];

  // Load categories
  const { categories, isLoading: catLoading } = useCategoryPosts();

  // Find category name by slug
  const selectedCategoryMeta = useMemo(() => {
    if (!slug || !categories?.length) return undefined;
    const stack: CategoryPostTree[] = [...categories];
    while (stack.length) {
      const item = stack.pop()!;
      if (item.slug === slug || item._id === slug) {
        return { name: item.name, slug: item.slug, id: item._id };
      }
      if (item.children?.length) stack.push(...item.children);
    }
    return undefined;
  }, [slug, categories]);

  // Filter posts by category name (match main/sub arrays)
  const filteredPosts = useMemo(() => {
    if (!slug) return posts;

    const normalize = (entry: any) => {
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

    const targets = [
      selectedCategoryMeta?.slug,
      selectedCategoryMeta?.id,
      selectedCategoryMeta?.name,
    ]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase().trim());

    return posts.filter((p) => {
      const main = (p.category?.main || []) as any[];
      const sub = (p.category?.sub || []) as any[];
      const values = [...main, ...sub].map(normalize).filter(Boolean) as string[];
      return values.some((v) => targets.includes(v));
    });
  }, [posts, slug, selectedCategoryMeta]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 md:px-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">

        {/* Posts grid right */}
        <section className="flex-1">
          <div className="mt-14 md:mt-20 mb-4 md:mb-12">
            <TabsPostDetail />
            <div>
              <BannerPosts />
            </div>
          </div>
          {filteredPosts.length === 0 ? (
            <p className="text-gray-500 text-center">Chưa có bài viết.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PostGrid posts={filteredPosts} getThumbnailPath={getThumbnailPath} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}