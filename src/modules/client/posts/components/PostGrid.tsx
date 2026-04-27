"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import PostCard from "./PostCard";
import type { Post } from "../models/post.model";

interface PostGridProps {
  posts: Post[];
  getThumbnailPath: (thumbnail: any) => string;
}

// Component wrapper để đo chiều cao tiêu đề và quyết định maxLines
export default function PostGrid({ posts, getThumbnailPath }: PostGridProps) {
  const [maxLines, setMaxLines] = useState<number>(2);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Đợi một chút để đảm bảo DOM đã render xong và layout đã ổn định
    const timer = setTimeout(() => {
      let hasMultiLine = false;

      posts.forEach((post, index) => {
        const titleElement = titleRefs.current[index];
        if (!titleElement || hasMultiLine) return;

        // Tạo element tạm để đo chiều cao thực tế của tiêu đề (không có line-clamp)
        const tempDiv = document.createElement("div");
        const computedStyle = window.getComputedStyle(titleElement);

        // Lấy chiều rộng thực tế của title element
        const width = titleElement.offsetWidth;

        tempDiv.style.cssText = `
          position: absolute;
          visibility: hidden;
          width: ${width}px;
          font-size: ${computedStyle.fontSize};
          font-weight: ${computedStyle.fontWeight};
          font-family: ${computedStyle.fontFamily};
          line-height: ${computedStyle.lineHeight};
          padding: ${computedStyle.padding};
          margin: ${computedStyle.margin};
          word-wrap: break-word;
          white-space: normal;
          overflow: visible;
        `;
        tempDiv.textContent = post.title;
        document.body.appendChild(tempDiv);

        const actualHeight = tempDiv.offsetHeight;

        // Đo chiều cao của 1 dòng
        tempDiv.textContent = "A";
        const singleLineHeight = tempDiv.offsetHeight;

        document.body.removeChild(tempDiv);

        // Nếu chiều cao thực tế lớn hơn 1.2 lần chiều cao 1 dòng, có nghĩa là có nhiều hơn 1 dòng
        if (actualHeight > singleLineHeight * 1.2) {
          hasMultiLine = true;
        }
      });

      // Nếu có bất kỳ tiêu đề nào dài hơn 1 dòng, set maxLines = 2, ngược lại set = 1
      setMaxLines(hasMultiLine ? 2 : 1);
    }, 150);

    return () => clearTimeout(timer);
  }, [posts]);

  return (
    <>
      {posts.map((post, index) => (
        <Link key={post.id || post.slug} href={`/posts/${post.slug}`}>
          <PostCard
            post={post}
            getThumbnailPath={getThumbnailPath}
            maxLines={maxLines}
            titleRef={(node) => {
              titleRefs.current[index] = node;
            }}
          />
        </Link>
      ))}
    </>
  );
}

