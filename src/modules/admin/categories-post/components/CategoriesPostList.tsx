"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { App, Button, Card, Empty, Popconfirm, Space, Table, Tag, Tooltip, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AdminPageHeader,
} from "@/modules/admin/common/components/AdminUi";
import { useCategoryPosts } from "../hooks/useCategoriesPost";
import { CategoryPostTree } from "../models/categories-post.model";

const flattenCategories = (categories: CategoryPostTree[]): CategoryPostTree[] =>
  categories.reduce((accumulator: CategoryPostTree[], category) => {
    accumulator.push(category);
    if (category.children?.length) {
      accumulator.push(...flattenCategories(category.children));
    }
    return accumulator;
  }, []);

const CategoriesPostList = () => {
  const { message } = App.useApp();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { categories, total, isLoading, hardDeleteMutation } = useCategoryPosts(page, limit);
  const flatCategories = flattenCategories(categories);

  const handleDelete = useCallback(async (slug: string) => {
    if (!slug) {
      message.error("Không thể xóa vì thiếu slug.");
      return;
    }

    try {
      await hardDeleteMutation.mutateAsync(slug);
      message.success("Đã xóa danh mục thành công.");
    } catch (error) {
      console.error("Xóa thất bại:", error);
      message.error("Xóa thất bại.");
    }
  }, [hardDeleteMutation, message]);

  const columns: ColumnsType<CategoryPostTree> = useMemo(
    () => [
      {
        title: "STT",
        width: 80,
        align: "center",
        render: (_, __, index) => (page - 1) * limit + index + 1,
      },
      {
        title: "Tên danh mục",
        dataIndex: "name",
        key: "name",
        render: (value: string) => <Typography.Text strong>{value}</Typography.Text>,
      },
      {
        title: "Danh mục cha",
        key: "parent",
        render: (_, category) => {
          const parentCategory = flatCategories.find((item) => item._id === category.parent);
          return <Typography.Text type="secondary">{parentCategory ? parentCategory.name : "Không có"}</Typography.Text>;
        },
      },
      {
        title: "Slug",
        dataIndex: "slug",
        key: "slug",
        render: (value: string) => <Typography.Text type="secondary">{value}</Typography.Text>,
      },
      {
        title: "Hành động",
        key: "action",
        align: "center",
        width: 140,
        render: (_, category) => (
          <Space size={6}>
            <Tooltip title="Sửa">
              <Link href={`/admin/categories-posts/edit/${category.slug}`}>
                <Button type="text" shape="circle" icon={<EditOutlined />} aria-label="Sửa danh mục bài viết" />
              </Link>
            </Tooltip>
            <Popconfirm
              title="Xóa vĩnh viễn danh mục này?"
              description="Hành động này không thể hoàn tác."
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(category.slug)}
            >
              <Tooltip title="Xóa">
                <Button type="text" danger shape="circle" icon={<DeleteOutlined />} aria-label="Xóa danh mục bài viết" />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [flatCategories, handleDelete, page],
  );

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Nội dung hiển thị"
        title="Danh sách danh mục bài viết"
        description="Quản lý cấu trúc chuyên mục bài viết theo thứ bậc rõ ràng, để đội nội dung dễ theo dõi và tránh lệch bố cục khi tên danh mục dài."
        actions={
          <Link href="/admin/categories-posts/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm danh mục
            </Button>
          </Link>
        }
      />

      <Card className="ah-admin-card">
        {!isLoading && flatCategories.length === 0 ? (
          <Empty description="Chưa có danh mục bài viết" />
        ) : (
          <Table
            rowKey={(category) => category._id}
            columns={columns}
            dataSource={flatCategories}
            loading={isLoading}
            pagination={{
              current: page,
              pageSize: limit,
              total,
              showSizeChanger: false,
              onChange: setPage,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default CategoriesPostList;
