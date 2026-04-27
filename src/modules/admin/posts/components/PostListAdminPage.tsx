"use client";

import React, { useState, useMemo } from "react";
import {
  App,
  Button,
  Card,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { AdminPageHeader, AdminModal, AdminThumbnail, AdminFilterItem } from "@/modules/admin/common/components/AdminUi";
import { usePosts } from "../hooks/usePosts";
import { Post, PostStatus } from "../models/post.model";
import PostForm from "./FormPost";

const { Text } = Typography;

const PostListAdminPage: React.FC = () => {
  const { message } = App.useApp();
  const { 
    postsQuery, 
    deleteMutation, 
    categoriesQuery 
  } = usePosts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const posts = postsQuery.data?.data || [];
  const categories = categoriesQuery.data?.data || [];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = 
        selectedCategory === "all" || 
        post.category.main.includes(selectedCategory) || 
        post.category.sub.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchText, selectedCategory]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteMutation.mutateAsync(slug);
      message.success("Đã xóa bài viết thành công");
    } catch {
      message.error("Xóa bài viết thất bại");
    }
  };

  const columns: ColumnsType<Post> = [
    {
      title: "Bài viết",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <AdminThumbnail 
            src={record.thumbnail?.[0]} 
            alt={record.title} 
            aspect="video" 
            className="w-20 shrink-0"
          />
          <div className="min-w-0">
            <Text strong className="block truncate max-w-[300px]">{record.title}</Text>
            <Text type="secondary" className="text-[10px]">Slug: {record.slug}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      key: "categories",
      width: 180,
      render: (_, record) => (
        <Space size={2} wrap>
          {record.category.main.map((c) => (
            <Tag color="blue" key={c} className="!m-0 text-[10px]">{c}</Tag>
          ))}
          {record.category.sub.map((c) => (
            <Tag key={c} className="!m-0 text-[10px]">{c}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "publishedDate",
      key: "publishedDate",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: PostStatus, record) => {
        if (record.scheduledAt) return <Tag color="warning">Hẹn giờ</Tag>;
        return status === PostStatus.Published 
          ? <Tag color="success">Công khai</Tag> 
          : <Tag color="default">Nháp</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Xem trên website">
            <Button 
              type="text" 
              shape="circle" 
              icon={<EyeOutlined />} 
              onClick={() => window.open(`/blog/${record.slug}`, '_blank')}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" shape="circle" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xóa bài viết này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.slug)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Truyền thông & Blog"
        title="Danh sách bài viết"
        description="Quản lý nội dung tin tức, blog và các bài viết quảng bá trên hệ thống website."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm bài viết
          </Button>
        }
      />

      <Card className="ah-admin-card ah-admin-card-static" styles={{ body: { padding: 16 } }}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(280px,1fr)_200px_auto] md:items-end">
          <AdminFilterItem label="Tìm kiếm">
            <Input
              placeholder="Nhập tiêu đề bài viết..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full ah-admin-antd-select"
            />
          </AdminFilterItem>
          <AdminFilterItem label="Danh mục">
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="w-full ah-admin-antd-select"
              options={[
                { label: "Tất cả danh mục", value: "all" },
                ...categories.map((c) => ({ label: c.name, value: c.name })),
              ]}
            />
          </AdminFilterItem>
          <div className="flex items-end pb-1">
            <Text type="secondary" className="text-xs">
              {postsQuery.isLoading ? "Đang tải..." : `Tìm thấy ${filteredPosts.length} bài viết`}
            </Text>
          </div>
        </div>
      </Card>

      <Card className="ah-admin-card">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredPosts}
          loading={postsQuery.isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </Card>

      <AdminModal
        title={editingPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1200}
        destroyOnClose
      >
        <PostForm
          initialData={editingPost || undefined}
          isEdit={!!editingPost}
          onSubmitSuccess={() => {
            setIsModalOpen(false);
            postsQuery.refetch();
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </AdminModal>
    </div>
  );
};

export default PostListAdminPage;
