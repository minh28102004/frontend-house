"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ColumnsType } from "antd/es/table";
import { App, Button, Card, Empty, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AdminModal,
  AdminPageHeader,
  AdminThumbnail,
  AdminFilterItem,
  AdminFilterBar,
} from "@/modules/admin/common/components/AdminUi";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../models/product.model";
import { ProductService } from "../services/product.service";
import { ProductForm } from "./ProductForm";

const visibilityOptions = [
  { value: "all", label: "Tất cả" },
  { value: "visible", label: "Đang hiển thị" },
  { value: "hidden", label: "Đang ẩn" },
];

const ListProducts = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    products,
    categories,
    isLoading,
    deleteProduct,
    createProduct,
    totalPages,
    fetchProducts,
  } = useProducts();

  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVisibility, setSelectedVisibility] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const pageFromUrl = useMemo(() => {
    const raw = searchParams.get("page");
    const parsed = raw ? Number.parseInt(raw, 10) : 1;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [searchParams]);

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "Tất cả" },
      ...(categories
        ?.filter((cat) => cat.level === 0)
        .map((cat) => ({
          value: cat.slug || cat._id || cat.name,
          label: cat.name,
        })) || []),
    ],
    [categories],
  );

  const setPageInUrl = (page: number) => {
    if (page === pageFromUrl) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setIsSearchMode(false);
      return;
    }

    setCurrentSearchTerm(searchTerm);
    setIsSearching(true);
    setIsSearchMode(true);

    try {
      const result = await ProductService.searchByName(searchTerm, 1);
      setSearchResults(result.data as Product[]);
      setSearchTotalPages(result.totalPages);
      setSearchCurrentPage(1);
    } catch {
      setSearchResults([]);
      message.error("Không thể tìm kiếm sản phẩm.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchPagination = async (searchTerm: string, page: number) => {
    setIsSearching(true);
    try {
      const result = await ProductService.searchByName(searchTerm, page);
      setSearchResults(result.data as Product[]);
      setSearchCurrentPage(page);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : err);
      message.error("Không thể tải kết quả tìm kiếm.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async (slug: string) => {
    await deleteProduct(slug);
    if (isSearchMode) {
      setSearchResults((prev) => prev.filter((product) => product.slug !== slug));
    }
    message.success("Đã xóa sản phẩm.");
  };

  const handleCreateProduct = async (productData: Partial<Product>) => {
    await createProduct(productData);
    setIsCreateOpen(false);
    setIsSearchMode(false);
    fetchProducts(1, selectedCategory, selectedVisibility);
    setPageInUrl(1);
  };

  const displayedProducts = isSearchMode ? searchResults : products;
  const displayedCurrentPage = isSearchMode ? searchCurrentPage : pageFromUrl;
  const displayedTotalPages = isSearchMode ? searchTotalPages : totalPages;

  const handleDisplayedPageChange = (targetPage: number) => {
    if (isSearchMode) {
      handleSearchPagination(currentSearchTerm, targetPage);
      return;
    }

    setPageInUrl(targetPage);
  };

  useEffect(() => {
    if (!isSearchMode) {
      fetchProducts(pageFromUrl, selectedCategory, selectedVisibility);
    }
  }, [pageFromUrl, selectedCategory, selectedVisibility, isSearchMode]); // eslint-disable-line react-hooks/exhaustive-deps

 const columns: ColumnsType<Product> = [
  {
    title: "STT",
    key: "index",
    width: 64,
    align: "center",
    render: (_, __, index) => (displayedCurrentPage - 1) * 10 + index + 1,
  },
  {
    title: "Ảnh",
    dataIndex: "thumbnail",
    key: "thumbnail",
    width: 92,
    align: "center",
    render: (_, product) => (
      <AdminThumbnail
        src={product.thumbnail}
        alt={product.name}
        aspect="square"
        className="mx-auto w-14"
        fallbackLabel={product.name}
      />
    ),
  },
{
  title: "Tên sản phẩm",
  dataIndex: "name",
  key: "name",
  width: 190,
  ellipsis: true,
  render: (_, product) => (
    <div className="min-w-0 max-w-[190px]">
      <Tooltip title={product.name}>
        <Typography.Text strong className="!block max-w-full truncate">
          {product.name}
        </Typography.Text>
      </Tooltip>

      <Tooltip title={`/san-pham/${product.slug}`}>
        <Typography.Text type="secondary" className="!block max-w-full truncate !text-xs">
          /san-pham/{product.slug}
        </Typography.Text>
      </Tooltip>
    </div>
  ),
},
  {
    title: "Danh mục",
    key: "category",
    width: 130,
    ellipsis: true,
    render: (_, product) => {
      const category = product.category?.main || "—";

      return (
        <Tooltip title={category}>
          <Tag className="max-w-[110px] truncate">
            {category}
          </Tag>
        </Tooltip>
      );
    },
  },
  {
    title: "Giá gốc",
    dataIndex: "currentPrice",
    key: "currentPrice",
    width: 120,
    align: "right",
    render: (value?: number) =>
      typeof value === "number" ? value.toLocaleString("vi-VN") : "—",
  },
  {
    title: "Giá KM",
    dataIndex: "discountPrice",
    key: "discountPrice",
    width: 120,
    align: "right",
    render: (value?: number) =>
      typeof value === "number" ? value.toLocaleString("vi-VN") : "—",
  },
  {
    title: "Hiển thị",
    dataIndex: "isVisible",
    key: "isVisible",
    width: 105,
    align: "center",
    render: (isVisible?: boolean) =>
      isVisible ? (
        <Tag color="success" className="!mr-0">
          Hiển thị
        </Tag>
      ) : (
        <Tag color="default" className="!mr-0">
          Ẩn
        </Tag>
      ),
  },
  {
    title: "Hành động",
    key: "actions",
    width: 118,
    align: "center",
    render: (_, product) => (
      <Space size={4} className="justify-center">
        <Tooltip title="Xem">
          <Link href={`/san-pham/${product.slug}`} target="_blank">
            <Button type="text"  shape="circle" size="small" icon={<EyeOutlined className="text-blue-500"/>} aria-label="Xem sản phẩm" />
          </Link>
        </Tooltip>

        <Tooltip title="Sửa">
          <Link href={`/admin/products/edit/${product.slug}`}>
            <Button type="text" shape="circle" size="small" icon={<EditOutlined />} aria-label="Sửa sản phẩm" />
          </Link>
        </Tooltip>

        <Popconfirm
          title="Xóa sản phẩm này?"
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
          onConfirm={() => handleDelete(product.slug)}
        >
          <Tooltip title="Xóa">
            <Button type="text" danger shape="circle" size="small" icon={<DeleteOutlined />} aria-label="Xóa sản phẩm" />
          </Tooltip>
        </Popconfirm>
      </Space>
    ),
  },
];
  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Dịch vụ & tiện ích"
        title="Danh sách sản phẩm"
        description="Quản lý danh mục dịch vụ theo cấu trúc hệ thống, tập trung vào dữ liệu, thao tác nhanh và dễ scan."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)}>
            Thêm sản phẩm
          </Button>
        }
      />

      <AdminFilterBar className="ah-admin-card-static">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(280px,1fr)_200px_180px] md:items-end">
            <AdminFilterItem label="Tìm kiếm">
              <Input.Search
                placeholder="Nhập tên sản phẩm cần tìm..."
                enterButton="Tìm kiếm"
                onSearch={handleSearch}
                loading={isSearching}
                allowClear
                className="w-full ah-admin-antd-search"
                onChange={(e) => {
                  if (!e.target.value) {
                    setIsSearchMode(false);
                    setCurrentSearchTerm("");
                  }
                }}
              />
            </AdminFilterItem>
            <AdminFilterItem label="Danh mục">
              <Select
                className="w-full ah-admin-antd-select"
                options={categoryOptions}
                value={selectedCategory || "all"}
                placeholder="Tất cả danh mục"
                onChange={(value) => {
                  setSelectedCategory(value);
                  setPageInUrl(1);
                }}
              />
            </AdminFilterItem>
            <AdminFilterItem label="Hiển thị">
              <Select
                className="w-full ah-admin-antd-select"
                options={visibilityOptions}
                value={selectedVisibility || "all"}
                placeholder="Tất cả trạng thái"
                onChange={(value) => {
                  setSelectedVisibility(value);
                  setPageInUrl(1);
                }}
              />
            </AdminFilterItem>
        </div>
</AdminFilterBar>
      <Card className="ah-admin-card">
        {isLoading && !isSearchMode ? (
          <div className="py-12 text-center text-sm text-[rgba(0,0,0,0.45)]">
            Đang tải danh sách sản phẩm...
          </div>
        ) : displayedProducts.length === 0 ? (
          <Empty description="Không có sản phẩm phù hợp" />
        ) : (
    <Table
  rowKey={(product) => product.slug || product._id || product.name}
  columns={columns}
  dataSource={displayedProducts}
  tableLayout="fixed"
  className="ah-admin-compact-table"
  pagination={{
    current: displayedCurrentPage,
    pageSize: 10,
    total: displayedTotalPages * 10,
    showSizeChanger: false,
    onChange: handleDisplayedPageChange,
  }}
/>
        )}
      </Card>

      <AdminModal
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={undefined}
        footer={null}
        width={1040}
        title="Thêm sản phẩm"
        destroyOnClose
      >
        <ProductForm
          mode="create"
          onSubmit={handleCreateProduct}
          onCancel={() => setIsCreateOpen(false)}
        />
      </AdminModal>
    </div>
  );
};

export default ListProducts;
