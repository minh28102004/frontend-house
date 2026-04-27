"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Empty, Space, Spin, Tree, Typography } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { DownOutlined } from "@ant-design/icons";

// Định nghĩa kiểu Category
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory: string | null;
  subCategories: string[];
  description: string;
  level: number; // Dùng level
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  productCount?: number; // Số lượng sản phẩm trong danh mục
  filterableAttributes?: Record<string, any>; // Thuộc tính có thể lọc
  children?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  __v?: number; // Version
}

interface CategoryTreeProps {
  categories: Category[];
  checkedCategoryIds: string[];
  onCheckedCategoryIdsChange: (checkedIds: string[]) => void;
  loading?: boolean;
  error?: string;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  checkedCategoryIds,
  onCheckedCategoryIdsChange,
  loading = false,
  error,
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const treeData = useMemo<DataNode[]>(() => {
    const byParent = new Map<string | null, Category[]>();
    categories.forEach((c) => {
      const key = c.parentCategory ?? null;
      const list = byParent.get(key) ?? [];
      list.push(c);
      byParent.set(key, list);
    });

    const build = (parentId: string | null): DataNode[] => {
      const items = (byParent.get(parentId) ?? []).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      return items.map((c) => ({
        key: c._id,
        title: (
          <Space size={6}>
            <Typography.Text delete={!c.isActive} type={c.isActive ? undefined : "secondary"}>
              {c.name}
            </Typography.Text>
            {!c.isActive && <TagLike>(Không hoạt động)</TagLike>}
          </Space>
        ),
        children: build(c._id),
      }));
    };

    return build(null);
  }, [categories]);

  // auto-expand parents of checked nodes
  useEffect(() => {
    const parentMap = new Map<string, string | null>();
    categories.forEach((c) => parentMap.set(c._id, c.parentCategory ?? null));

    const toExpand = new Set<string>();
    checkedCategoryIds.forEach((id) => {
      let p = parentMap.get(id) ?? null;
      while (p) {
        toExpand.add(p);
        p = parentMap.get(p) ?? null;
      }
    });
    setExpandedKeys(Array.from(toExpand));
  }, [checkedCategoryIds, categories]);

  const expandAll = () => setExpandedKeys(categories.map((c) => c._id));
  const collapseAll = () => setExpandedKeys([]);

  const handleCheck: TreeProps["onCheck"] = (checked) => {
    const keys = Array.isArray(checked) ? checked : checked.checked;
    onCheckedCategoryIdsChange(keys.map(String));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-8 mb-8">
        <Space size={8} wrap>
          <Typography.Text type="secondary">Đã chọn:</Typography.Text>
          <Typography.Text strong>{checkedCategoryIds.length}</Typography.Text>
        </Space>
        <Space>
          <Button size="small" onClick={expandAll}>
            Mở tất cả
          </Button>
          <Button size="small" onClick={collapseAll}>
            Đóng tất cả
          </Button>
        </Space>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <Spin />
        </div>
      ) : error ? (
        <Empty description={error} />
      ) : treeData.length === 0 ? (
        <Empty description="Không có danh mục nào" />
      ) : (
        <Tree
          checkable
          selectable={false}
          showLine
          switcherIcon={<DownOutlined />}
          checkedKeys={checkedCategoryIds}
          onCheck={handleCheck}
          expandedKeys={expandedKeys}
          onExpand={(keys) => setExpandedKeys(keys)}
          treeData={treeData}
        />
      )}
    </div>
  );
};

export default CategoryTree;

const TagLike = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontSize: 12, color: "#cf1322" }}>{children}</span>
);