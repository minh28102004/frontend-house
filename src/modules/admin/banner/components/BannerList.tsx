"use client";

import React, { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  App,
  Button,
  Card,
  Empty,
  Image,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AdminPageHeader,
  AdminModal,
  AdminFilterItem,
} from "@/modules/admin/common/components/AdminUi";
import { useAdminBanner } from "../hooks/useBanner";
import { Banner } from "../models/banner.model";
import { BannerForm } from "./BannerForm";

const filterOptions = [
  { value: "all", label: "Tất cả" },
  { value: "home", label: "Trang chủ" },
  { value: "home-mobile", label: "Trang chủ Mobile" },
  { value: "posts", label: "Bài viết" },
  { value: "products", label: "Sản phẩm" },
  { value: "contact", label: "Liên hệ" },
] as const;

const typeLabelMap: Record<Banner["type"], string> = {
  home: "Trang chủ",
  "home-mobile": "Trang chủ Mobile",
  posts: "Bài viết",
  products: "Sản phẩm",
  contact: "Liên hệ",
};

export const BannerList: React.FC = () => {
  const { message } = App.useApp();
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const { useGetBanners, useToggleBannerActive, useDeleteBanner } = useAdminBanner();
  const { data: banners = [], isLoading } = useGetBanners();
  const { mutateAsync: toggleActive } = useToggleBannerActive();
  const { mutateAsync: deleteBanner } = useDeleteBanner();

  const openCreateModal = () => {
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const filteredBanners =
    filterType === "all" ? banners : banners.filter((banner) => banner.type === filterType);

  const columns: ColumnsType<Banner> = [
    {
      title: "Banner",
      dataIndex: "imagePath",
      key: "imagePath",
      width: 160,
      render: (_, banner) =>
        banner.backgroundType === "image" ? (
          <Image
            src={banner.imagePath}
            alt={banner.title || "Banner"}
            width={120}
            height={68}
            style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #f0f0f0" }}
            preview={false}
          />
        ) : (
          <Tag color="processing">Video</Tag>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (value: string | undefined) => value || "Banner chưa đặt tiêu đề",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 160,
      render: (type: Banner["type"]) => <Tag>{typeLabelMap[type] || type}</Tag>,
    },
    {
      title: "Nền",
      dataIndex: "backgroundType",
      key: "backgroundType",
      width: 110,
      align: "center",
      render: (type?: Banner["backgroundType"]) => <Tag>{type === "video" ? "Video" : "Ảnh"}</Tag>,
    },
    {
      title: "Thứ tự",
      dataIndex: "order",
      key: "order",
      width: 90,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 140,
      align: "center",
      render: (_, banner) => (
        <Switch
          checked={banner.isActive}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
          onChange={async () => {
            await toggleActive(banner._id);
            message.success("Đã cập nhật trạng thái banner.");
          }}
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 130,
      fixed: "right",
      align: "center",
      render: (_, banner) => (
        <Space size={6}>
          <Tooltip title="Xem nhanh">
            <Button
              type="text"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => setPreviewBanner(banner)}
              aria-label="Xem banner"
            />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(banner)}
              aria-label="Sửa banner"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa banner này?"
            description="Hành động này không thể hoàn tác."
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={async () => {
              await deleteBanner(banner._id);
              message.success("Đã xóa banner.");
            }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger shape="circle" icon={<DeleteOutlined />} aria-label="Xóa banner" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Nội dung hiển thị"
        title="Banner hiển thị"
        description="Quản lý banner desktop/mobile theo cấu trúc hệ thống, dễ lọc, dễ theo dõi và dễ vận hành."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Thêm banner
          </Button>
        }
      />

      <Card className="ah-admin-card ah-admin-card-static" styles={{ body: { paddingBottom: 16 } }}>
        <div className="flex items-end gap-3">
          <AdminFilterItem label="Loại hiển thị">
            <Select
              className="w-full ah-admin-antd-select"
              style={{ width: 220 }}
              value={filterType}
              options={filterOptions.map((item) => ({ value: item.value, label: item.label }))}
              onChange={setFilterType}
            />
          </AdminFilterItem>
          <div className="flex items-end pb-1">
            <Typography.Text type="secondary" className="text-xs">
              {isLoading ? "Đang tải..." : `Hiển thị ${filteredBanners.length} banner`}
            </Typography.Text>
          </div>
        </div>
      </Card>

      <Card className="ah-admin-card">
        <Table
          rowKey="_id"
          loading={isLoading}
          columns={columns}
          dataSource={filteredBanners}
          locale={{ emptyText: <Empty description="Chưa có banner nào" /> }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>

      {isModalOpen ? (
        <BannerForm
          banner={selectedBanner}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedBanner(null);
          }}
        />
      ) : null}

      <ModalPreview
        banner={previewBanner}
        onClose={() => setPreviewBanner(null)}
      />
    </div>
  );
};

const ModalPreview = ({ banner, onClose }: { banner: Banner | null; onClose: () => void }) => {
  return (
    <AdminModal
      open={!!banner}
      onCancel={onClose}
      footer={null}
      width={760}
      title={banner?.title || "Xem nhanh banner"}
      destroyOnClose
    >
      {banner ? (
        <Space direction="vertical" size={12} className="w-full">
          {banner.backgroundType === "image" ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-md border border-[#f0f0f0]">
              <Image src={banner.imagePath} alt={banner.title || "Banner preview"} preview={false} className="!h-full !w-full object-cover" />
            </div>
          ) : (
            <video src={banner.imagePath} controls className="w-full rounded-md border border-[#f0f0f0]" />
          )}
          <Space wrap>
            <Tag>{typeLabelMap[banner.type]}</Tag>
            <Tag>{banner.backgroundType === "video" ? "Video" : "Ảnh"}</Tag>
            <Tag color={banner.isActive ? "success" : "default"}>{banner.isActive ? "Đang hoạt động" : "Tạm ẩn"}</Tag>
          </Space>
          <Typography.Paragraph className="!mb-0">
            {banner.description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "Chưa có mô tả hiển thị."}
          </Typography.Paragraph>
        </Space>
      ) : null}
    </AdminModal>
  );
};
