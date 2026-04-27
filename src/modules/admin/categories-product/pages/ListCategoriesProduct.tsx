"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  App,
  Button,
  Card,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { AdminModal } from "@/modules/admin/common/components/AdminUi";
import {
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  AdminPageHeader,
  AdminThumbnail,
} from "@/modules/admin/common/components/AdminUi";
import { useCategoriesProduct } from "../hooks/useCategoriesProduct";
import {
  deleteCategoriesProduct,
  createCategoriesProduct,
  updateCategoriesProduct,
} from "../services/categories-product.service";
import { CategoriesProduct } from "../types/categories-product.types";
import CategoriesProductForm, {
  CategoryFormPayload,
} from "../components/CategoriesProductForm";

const { Text } = Typography;

type CategoryRow = CategoriesProduct & {
  displayLevel: number;
};

const ListCategoriesProduct = () => {
  const { message } = App.useApp();
  const { categoriesProduct, loading, refetch } = useCategoriesProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoriesProduct | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedCategories = useMemo(() => {
    if (!categoriesProduct.length) return [];

    const getParentId = (category: CategoriesProduct): string | null => {
      if (!category.parentCategory) return null;
      if (typeof category.parentCategory === "string") return category.parentCategory;
      if (typeof category.parentCategory === "object" && category.parentCategory?._id) {
        return category.parentCategory._id;
      }
      return null;
    };

    const buildHierarchicalList = (
      parentId: string | null,
      currentLevel = 0,
      visited: Set<string> = new Set(),
    ): CategoryRow[] => {
      const result: CategoryRow[] = [];

      const children = categoriesProduct
        .filter((category) => getParentId(category) === parentId)
        .sort((first, second) => {
          const firstOrder = first.sortOrder ?? 0;
          const secondOrder = second.sortOrder ?? 0;

          if (firstOrder !== secondOrder) return firstOrder - secondOrder;
          return first.name.localeCompare(second.name);
        });

      children.forEach((child) => {
        if (visited.has(child._id)) return;

        visited.add(child._id);
        result.push({ ...child, displayLevel: currentLevel });
        result.push(...buildHierarchicalList(child._id, currentLevel + 1, visited));
      });

      return result;
    };

    return buildHierarchicalList(null);
  }, [categoriesProduct]);

  const handleDelete = useCallback(
    async (slug: string) => {
      if (!slug) {
        message.error("Không thể xóa vì thiếu slug.");
        return;
      }

      try {
        await deleteCategoriesProduct(slug);
        message.success("Danh mục đã được xóa.");
        refetch();
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        message.error("Xóa thất bại, vui lòng thử lại.");
      }
    },
    [message, refetch],
  );

  const handleOpenCreate = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: CategoriesProduct) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: CategoryFormPayload) => {
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await updateCategoriesProduct(editingCategory.slug, values);
        message.success("Cập nhật danh mục thành công.");
      } else {
        await createCategoriesProduct(values);
        message.success("Tạo danh mục mới thành công.");
      }

      setIsModalOpen(false);
      setEditingCategory(undefined);
      refetch();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      message.error("Thao tác thất bại. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: ColumnsType<CategoryRow> = useMemo(
    () => [
      {
        title: "STT",
        key: "index",
        width: 64,
        align: "center",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Avatar",
        dataIndex: "image",
        key: "image",
        width: 90,
        align: "center",
        render: (_, category) => (
          <AdminThumbnail
            src={category.image}
            alt={category.name}
            aspect="square"
            className="mx-auto w-14"
            fallbackLabel={category.name}
          />
        ),
      },
      {
        title: "Banner",
        dataIndex: "bannerImage",
        key: "bannerImage",
        width: 130,
        align: "center",
        render: (_, category) => (
          <AdminThumbnail
            src={category.bannerImage}
            alt={`${category.name} banner`}
            aspect="banner"
            className="mx-auto w-24"
            fallbackLabel={category.name}
          />
        ),
      },
      {
        title: "Tên danh mục",
        dataIndex: "name",
        key: "name",
        width: 260,
        ellipsis: true,
        render: (_, category) => {
          const level = category.displayLevel || category.level || 0;
          const isChild = level > 0;
          const indent = Math.min(level * 16, 48);

          return (
            <div className="min-w-0" style={{ paddingLeft: indent }}>
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#e6f4ff] text-[#1677ff]">
                  {isChild ? (
                    <span className="text-xs leading-none">└</span>
                  ) : (
                    <PictureOutlined className="text-[14px]" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <Tooltip title={category.name}>
                    <Text strong className="!block max-w-full truncate">
                      {category.name}
                    </Text>
                  </Tooltip>
                </div>

                {level > 0 ? (
                  <Tag className="!mr-0 shrink-0" color="default">
                    Cấp {level}
                  </Tag>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        title: "Slug",
        dataIndex: "slug",
        key: "slug",
        width: 190,
        ellipsis: true,
        render: (value: string) => (
          <Tooltip title={value}>
            <Text type="secondary" className="!block max-w-full truncate !text-xs">
              {value || "—"}
            </Text>
          </Tooltip>
        ),
      },
      {
        title: "Thứ tự",
        dataIndex: "sortOrder",
        key: "sortOrder",
        width: 92,
        align: "center",
        render: (value: number) => (
          <Tag color="blue" className="!mr-0">
            {value ?? 0}
          </Tag>
        ),
      },
      {
        title: "Hành động",
        key: "actions",
        width: 126,
        align: "center",
        render: (_, category) => (
          <Space size={4} className="justify-center">
            <Tooltip title="Sắp xếp sản phẩm">
              <Button
                type="text"
                shape="circle"
                size="small"
                icon={<ArrowUpOutlined />}
                aria-label="Sắp xếp sản phẩm"
                className="ah-admin-action-sort"
                onClick={() => message.info("Chức năng sắp xếp nâng cao sẽ sớm ra mắt")}
              />
            </Tooltip>

            <Tooltip title="Sửa danh mục">
              <Button
                type="text"
                shape="circle"
                size="small"
                icon={<EditOutlined />}
                aria-label="Sửa danh mục"
                onClick={() => handleOpenEdit(category)}
              />
            </Tooltip>

            <Popconfirm
              title="Xóa danh mục này?"
              description="Hành động này không thể hoàn tác và có thể ảnh hưởng đến sản phẩm liên quan."
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(category.slug)}
            >
              <Tooltip title="Xóa">
                <Button
                  type="text"
                  danger
                  shape="circle"
                  size="small"
                  icon={<DeleteOutlined />}
                  aria-label="Xóa danh mục"
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleDelete, handleOpenEdit, message],
  );

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        icon={<PictureOutlined />}
        eyebrow="Dịch vụ & tiện ích"
        title="Danh sách danh mục sản phẩm"
        description="Sắp xếp nhóm dịch vụ theo cấu trúc cha con, kiểm tra avatar và banner đi kèm để tối ưu hiển thị trên website."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm danh mục
          </Button>
        }
      />

      <Card className="ah-admin-card ah-admin-card-static">
        {!loading && sortedCategories.length === 0 ? (
          <Empty description="Chưa có danh mục nào" />
        ) : (
          <Table
            rowKey={(category) => category._id}
            columns={columns}
            dataSource={sortedCategories}
            loading={loading}
            pagination={false}
            tableLayout="fixed"
            className="ah-admin-compact-table"
          />
        )}
      </Card>

      <AdminModal
        title={editingCategory ? "Cập nhật danh mục" : "Tạo danh mục mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(undefined);
        }}
        onOk={undefined}
        footer={null}
        width={960}
        destroyOnClose
        loading={isSubmitting}
      >
        <CategoriesProductForm
          category={editingCategory}
          onSuccess={handleFormSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCategory(undefined);
          }}
          isLoading={isSubmitting}
        />
      </AdminModal>
    </div>
  );
};

export default ListCategoriesProduct;