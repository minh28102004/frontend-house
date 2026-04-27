"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { App, Button, Card, Checkbox, Descriptions, Drawer, Empty, Form, Input, Popconfirm, Segmented, Space, Spin, Table, Tooltip, Typography, Upload } from "antd";
import type { UploadProps, UploadFile } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CopyOutlined, DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { useImages } from "@/modules/admin/media/hooks/useImages";
import type { ImageResponse } from "@/modules/admin/media/services/images.service";
import { AdminPageHeader, AdminModal, AdminThumbnail } from "@/modules/admin/common/components/AdminUi";

type ViewMode = "grid" | "list";

export function MediaLibrary() {
  const { message } = App.useApp();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImageIds, setSelectedImageIds] = useState<React.Key[]>([]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageResponse | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageResponse | null>(null);
  const [editForm] = Form.useForm<{ alt: string; caption?: string; description?: string }>();

  const {
    images,
    isLoadingImages,
    isUploading,
    isDeleting,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    updateImage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    imagesError,
  } = useImages();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = { root: null, rootMargin: "0px", threshold: 0.1 };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, options);

    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filteredImages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return images;
    return images.filter((img) => {
      return (
        img.originalName?.toLowerCase().includes(q) ||
        img.alt?.toLowerCase().includes(q) ||
        img.caption?.toLowerCase().includes(q) ||
        img.slug?.toLowerCase().includes(q)
      );
    });
  }, [images, searchQuery]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không rõ";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openDetail = useCallback((img: ImageResponse) => {
    setSelectedImage(img);
    setDetailOpen(true);
  }, []);

  const openEdit = useCallback(
    (img: ImageResponse) => {
      setEditingImage(img);
      editForm.setFieldsValue({
        alt: img.alt || "",
        caption: img.caption || "",
        description: (img as any).description || "",
      });
      setEditOpen(true);
    },
    [editForm]
  );

  const handleCopyUrl = useCallback(
    async (img: ImageResponse) => {
      try {
        await navigator.clipboard.writeText(img.location || img.imageUrl);
        message.success("Đã copy URL.");
      } catch {
        message.error("Không thể copy URL.");
      }
    },
    [message]
  );

  const uploadOneProps: UploadProps = {
    multiple: false,
    accept: "image/*",
    showUploadList: false,
    customRequest: (options) => {
      try {
        uploadImage(options.file as File);
        options.onSuccess?.({});
      } catch (e) {
        options.onError?.(e as Error);
      }
    },
  };

  const uploadManyProps: UploadProps = {
    multiple: true,
    accept: "image/*",
    showUploadList: false,
    onChange: (info) => {
      const files = (info.fileList || [])
        .map((f: UploadFile) => f.originFileObj)
        .filter(Boolean) as File[];
      if (files.length) uploadMultipleImages(files);
    },
  };

  const deleteSelected = useCallback(() => {
    const slugs = selectedImageIds
      .map((id) => images.find((img) => img._id === id)?.slug)
      .filter(Boolean) as string[];

    slugs.forEach((slug) => deleteImage(slug));
    setSelectedImageIds([]);
  }, [selectedImageIds, images, deleteImage]);

  const columns: ColumnsType<ImageResponse> = [
    {
      title: "Ảnh",
      key: "thumb",
      width: 90,
      align: "center",
      render: (_, img) => (
        <AdminThumbnail src={img.imageUrl} alt={img.alt || img.originalName || "Image"} aspect="square" className="mx-auto w-14" />
      ),
    },
    {
      title: "Tên file",
      dataIndex: "originalName",
      key: "originalName",
      ellipsis: true,
      render: (value: string, img) => (
        <div className="min-w-0">
          <Typography.Text strong className="!block">
            {value || "Không rõ"}
          </Typography.Text>
          <Typography.Text type="secondary" className="!text-xs">
            {img.slug}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Alt",
      dataIndex: "alt",
      key: "alt",
      width: 240,
      ellipsis: true,
      render: (value: string) => <Typography.Text type="secondary">{value || "—"}</Typography.Text>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value?: string) => <Typography.Text type="secondary">{formatDate(value)}</Typography.Text>,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      fixed: "right",
      align: "center",
      render: (_, img) => (
        <Space size={6}>
          <Tooltip title="Xem">
            <Button type="text" shape="circle" icon={<EyeOutlined />} onClick={() => openDetail(img)} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" shape="circle" icon={<EditOutlined />} onClick={() => openEdit(img)} />
          </Tooltip>
          <Tooltip title="Copy URL">
            <Button type="text" shape="circle" icon={<CopyOutlined />} onClick={() => handleCopyUrl(img)} />
          </Tooltip>
          <Popconfirm title="Xóa ảnh này?" okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={() => deleteImage(img.slug)}>
            <Tooltip title="Xóa">
              <Button type="text" danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoadingImages) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin />
      </div>
    );
  }

  if (imagesError) {
    return (
      <Card>
        <Empty description="Có lỗi xảy ra khi tải ảnh." />
      </Card>
    );
  }

  return (
    <div className="p-6">
      <AdminPageHeader
        title="Thư viện hình ảnh"
        description={`Tổng cộng: ${images.length}${selectedImageIds.length ? ` | Đã chọn: ${selectedImageIds.length}` : ""}`}
        actions={
          <Space wrap>
            <Upload {...uploadOneProps} disabled={isUploading}>
              <Button icon={<UploadOutlined />} type="primary" loading={isUploading}>
                Tải ảnh
              </Button>
            </Upload>
            <Upload {...uploadManyProps} disabled={isUploading}>
              <Button icon={<UploadOutlined />}>Tải nhiều ảnh</Button>
            </Upload>
            <Popconfirm
              title={`Xóa ${selectedImageIds.length} ảnh đã chọn?`}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={deleteSelected}
              disabled={!selectedImageIds.length}
            >
              <Button danger icon={<DeleteOutlined />} disabled={!selectedImageIds.length} loading={isDeleting}>
                Xóa đã chọn
              </Button>
            </Popconfirm>
          </Space>
        }
      />

      <Card className="ah-admin-card">
        <Space direction="vertical" size={12} className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-12">
            <Input.Search
              allowClear
              placeholder="Tìm theo tên file, alt, caption, slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Segmented
              value={viewMode}
              onChange={(v) => setViewMode(v as ViewMode)}
              options={[
                { label: "Lưới", value: "grid" },
                { label: "Danh sách", value: "list" },
              ]}
            />
          </div>

          {filteredImages.length === 0 ? (
            <Empty description={searchQuery ? "Không tìm thấy hình ảnh nào" : "Chưa có hình ảnh nào trong thư viện"} />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-12">
              {filteredImages.map((img) => {
                const checked = selectedImageIds.includes(img._id);
                return (
                  <div key={img._id} className="relative group">
                    <div className="absolute left-8 top-8 z-10">
                      <Checkbox
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? Array.from(new Set([...selectedImageIds, img._id]))
                            : selectedImageIds.filter((id) => id !== img._id);
                          setSelectedImageIds(next);
                        }}
                      />
                    </div>
                    <button type="button" className="w-full text-left" onClick={() => openDetail(img)}>
                      <div className="relative aspect-square overflow-hidden rounded-md border bg-white">
                        <Image src={img.imageUrl} alt={img.alt || img.originalName || "Image"} fill className="object-cover" sizes="20vw" />
                      </div>
                      <div className="mt-6 min-w-0">
                        <Typography.Text ellipsis className="!block">
                          {img.originalName || "Không rõ"}
                        </Typography.Text>
                        <Typography.Text type="secondary" className="!block !text-xs" ellipsis>
                          {img.slug}
                        </Typography.Text>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <Table<ImageResponse>
              rowKey="_id"
              size="middle"
              columns={columns}
              dataSource={filteredImages}
              pagination={false}
              scroll={{ x: 900 }}
              rowSelection={{
                selectedRowKeys: selectedImageIds,
                onChange: (keys) => setSelectedImageIds(keys),
              }}
              onRow={(record) => ({ onClick: () => openDetail(record) })}
            />
          )}

          {(hasNextPage || isFetchingNextPage) && (
            <div ref={loadMoreRef} className="flex items-center justify-center py-12">
              {isFetchingNextPage ? <Spin /> : <div style={{ height: 24 }} />}
            </div>
          )}
        </Space>
      </Card>

      <Drawer
        title="Chi tiết hình ảnh"
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedImage(null);
        }}
        width={920}
        extra={
          selectedImage ? (
            <Space>
              <Button icon={<CopyOutlined />} onClick={() => handleCopyUrl(selectedImage)}>
                Copy URL
              </Button>
              <Button icon={<EditOutlined />} onClick={() => openEdit(selectedImage)}>
                Chỉnh sửa
              </Button>
              <Popconfirm
                title="Xóa ảnh này?"
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                onConfirm={() => {
                  deleteImage(selectedImage.slug);
                  setDetailOpen(false);
                  setSelectedImage(null);
                }}
              >
                <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          ) : null
        }
      >
        {selectedImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="relative aspect-square rounded-md border bg-gray-50 overflow-hidden">
              <Image src={selectedImage.imageUrl} alt={selectedImage.alt || selectedImage.originalName || "Image"} fill className="object-contain" />
            </div>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Tên file">{selectedImage.originalName || "Không rõ"}</Descriptions.Item>
              <Descriptions.Item label="Slug">
                <Typography.Text code>{selectedImage.slug}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="URL">
                <Typography.Text code copyable>
                  {selectedImage.location || selectedImage.imageUrl}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Alt">{selectedImage.alt || "—"}</Descriptions.Item>
              <Descriptions.Item label="Caption">{selectedImage.caption || "—"}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{formatDate(selectedImage.createdAt)}</Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <Empty />
        )}
      </Drawer>

      <AdminModal
        title="Chỉnh sửa hình ảnh"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingImage(null);
        }}
        onOk={async () => {
          const img = editingImage;
          if (!img) return;
          const values = await editForm.validateFields();
          updateImage({ slug: img.slug, data: values as any });
          setEditOpen(false);
          setEditingImage(null);
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        {editingImage ? (
          <Space direction="vertical" size={12} className="w-full">
            <div className="relative w-full h-48 rounded-md border bg-gray-50 overflow-hidden">
              <Image src={editingImage.imageUrl} alt={editingImage.alt || editingImage.originalName || "Image"} fill className="object-contain" />
            </div>
            <Form form={editForm} layout="vertical">
              <Form.Item name="alt" label="Alt text" rules={[{ required: true, message: "Vui lòng nhập alt text." }]}>
                <Input placeholder="Mô tả ngắn cho ảnh (giúp SEO)" />
              </Form.Item>
              <Form.Item name="caption" label="Caption">
                <Input placeholder="Chú thích ngắn cho ảnh" />
              </Form.Item>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={3} placeholder="Mô tả chi tiết hơn về ảnh" />
              </Form.Item>
            </Form>
          </Space>
        ) : (
          <Empty />
        )}
      </AdminModal>
    </div>
  );
}
