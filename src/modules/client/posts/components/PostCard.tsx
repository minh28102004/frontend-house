import React, { FC } from "react";
import { Post } from "../models/post.model";

interface PostCardProps {
  post: Post;
  getThumbnailPath: (thumbnail: any) => string;
  maxLines?: number; // Số dòng tối đa cho tiêu đề (1 hoặc 2)
  titleRef?: (node: HTMLDivElement | null) => void; // Ref callback để đo chiều cao
}

const PostCard: FC<PostCardProps> = ({ post, getThumbnailPath, maxLines = 2, titleRef }) => {
  const imageUrl = getThumbnailPath(post.thumbnail);
  const description = post.metaDescription?.trim();
  const lineClampClass = maxLines === 1 ? "line-clamp-1" : "line-clamp-2";
  const heightClass = maxLines === 1 ? "h-7" : "h-14";

  return (
    <div className="group">
      {/* Hình ảnh hiển thị với kích thước 800x600 */}
      <div className="relative overflow-hidden w-full" style={{ aspectRatio: '4/3', maxWidth: "800px", maxHeight: "600px" }}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={post.title}
          width={800}
          height={600}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          style={{ width: "100%", height: "100%", maxWidth: "800px", maxHeight: "600px" }}
        />
      </div>
      <div
        ref={titleRef}
        className={`font-medium text-lg mt-2 ${lineClampClass} group-hover:text-[#021737] transition-colors ${heightClass}`}
      >
        {post.title}
      </div>
      <div className="flex items-center text-xs text-gray-500 mb-1 mt-1">
        <span>{new Date(post.publishedDate).toLocaleDateString("vi-VN")}</span>
      </div>
      {description ? (
        <div
          className="text-gray-600 line-clamp-3 text-sm sun-editor-content"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <div
          className="text-gray-600 line-clamp-3 text-sm"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
      )}
    </div>
  );
};

export default PostCard;
