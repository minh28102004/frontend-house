// src/app/admin/posts/create/page.tsx
"use client";

import React from "react";
import PostForm from "@/modules/admin/posts/components/FormPost";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/modules/admin/common/components/AdminUi";
import { Card } from "antd";

const CreatePostPage = () => {
  const router = useRouter();

  const handleSubmitSuccess = () => {
    alert("Tạo bài viết thành công!");
    router.push("/admin/posts");
  };

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Nội dung"
        title="Tạo bài viết mới"
        description="Tạo và xuất bản bài viết mới cho trang web"
      />
      <Card className="ah-admin-card">
        <PostForm 
          isEdit={false}
          onSubmitSuccess={handleSubmitSuccess} 
          onCancel={() => router.push('/admin/posts')} 
        />
      </Card>
    </div>
  );
};

export default CreatePostPage;
