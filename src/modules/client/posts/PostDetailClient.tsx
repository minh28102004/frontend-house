"use client";

import React from "react";
import { usePostBySlug } from "./hooks/usePosts";
import FeaturedPostSkeleton from "./components/FeaturedPostSkeleton";
import PostMeta from "./components/PostMeta";
import PostThumbnail from "./components/PostThumbnail";
import PostExcerpt from "./components/PostExcerpt";
import PostContent from "./components/PostContent";
import BackToPostsLink from "./components/BackToPostsLink";
import { resolveMediaUrl } from "@/common/utils/mediaUrl";

interface PostDetailProps {
  slug: string;
}

export default function PostDetailClient({ slug }: PostDetailProps) {
  const { data: post, isLoading, isError } = usePostBySlug(slug);

  if (isLoading) {
    return (
      <div className="md:col-span-2">
        <FeaturedPostSkeleton />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="md:col-span-2">
        <p className="text-red-500">Không tìm thấy bài viết.</p>
      </div>
    );
  }

  const getThumbnailPath = (path: unknown): string =>
    resolveMediaUrl(path, "/placeholder.svg?height=800&width=1200");

  return (
    <div className="w-full max-w-5xl mx-auto px-2 md:px-6 py-6 mt-10">
      <BackToPostsLink />
      <article>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-medium mb-2">{post.title}</h1>
        </div>
        <PostMeta publishedDate={post.publishedDate} author={post.author} />
        <PostThumbnail
          src={
            getThumbnailPath(post.thumbnail) ||
            "/placeholder.svg?height=800&width=1200"
          }
          alt={post.title}
        />
        <PostExcerpt html={transformSunEditorHtml(post.excerpt)} />
        <PostContent
          html={
            post.postData && typeof post.postData === "string"
              ? transformSunEditorHtml(
                  post.postData.replace(/<p>Mô tả ngắn<\/p>/g, "")
                )
              : ""
          }
        />
      </article>
    </div>
  );
}

function transformSunEditorHtml(html: string): string {
  if (!html) return "";
  const api = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
  let out = html;
  if (api) {
    const esc = api.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(esc + "/uploads", "g"), "/uploads");
  }
  return out;
}
