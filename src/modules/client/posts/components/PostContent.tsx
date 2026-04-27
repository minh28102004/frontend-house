"use client";
import type { FC } from "react";

interface PostContentProps {
  html: string;
}

const PostContent: FC<PostContentProps> = ({ html }) => (
  <div
    className="prose max-w-none sun-editor-content"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

export default PostContent;