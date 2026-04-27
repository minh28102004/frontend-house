// 📁 src/app/admin/posts/[slug]/edit/page.tsx

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePostBySlug, usePosts } from "@/modules/admin/posts/hooks/usePosts";
import PostForm from "@/modules/admin/posts/components/FormPost";
import {
  CreatePostDto,
  UpdatePostDto,
} from "@/modules/admin/posts/models/post.model";

const EditPostPage = () => {
  const { slug } = useParams(); // 🧩 Lấy slug từ URL
  const router = useRouter();
  const { updateMutation } = usePosts();
  const { data: post, isLoading } = usePostBySlug(slug as string);

  useEffect(() => {
    if (!slug) {
      router.push("/admin/posts");
    }
  }, [slug, router]);

  // 📤 Hàm xử lý cập nhật bài viết
  const handleUpdate = (data: CreatePostDto | UpdatePostDto, slug?: string) => {
    if (!slug) return;
    updateMutation.mutate(
      { slug, data },
      {
        onSuccess: () => {
          alert("Bài viết đã được cập nhật!");
          router.push("/admin/posts");
        },
        onError: (err) => {
          console.error("Lỗi cập nhật:", err);
          alert("Cập nhật thất bại.");
        },
      }
    );
  };

  if (isLoading) return <p className="p-4">Đang tải dữ liệu bài viết...</p>;

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">📝 Chỉnh sửa bài viết</h1>
      {post && (
        <PostForm initialData={post} onSubmit={handleUpdate} isEdit={true} />
      )}
    </div>
  );
};

export default EditPostPage;
