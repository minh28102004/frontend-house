"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { App, Button, Card, Col, Empty, Form, Input, InputNumber, Modal, Row, Select, Space, Switch, Tooltip, Typography, Upload } from "antd";
import type { UploadProps } from "antd";
import { DeleteOutlined, PictureOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useImages } from "@/modules/admin/media/hooks/useImages";
import { ImageResponse } from "@/modules/admin/media/services/images.service";
import { Room } from "../types/room.types";
import { AdminThumbnail } from "@/modules/admin/common/components/AdminUi";

export interface RoomFormPayload {
  num: string;
  concept: string;
  name: string;
  description?: string;
  features?: string[];
  price: number;
  thumbnail?: string;
  gallery?: string[];
  isVisible?: boolean;
}

interface Props {
  room?: Room;
  onSuccess: (data: RoomFormPayload) => void;
}

const RoomForm: React.FC<Props> = ({ room, onSuccess }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm<RoomFormPayload>();

  const [thumbnail, setThumbnail] = useState<string>(room?.thumbnail || "");
  const [gallery, setGallery] = useState<string[]>(room?.gallery || []);

  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<"thumbnail" | "gallery">("thumbnail");
  const [mediaSearch, setMediaSearch] = useState("");

  const { uploadImage, isUploading, images, isLoadingImages, imagesError } = useImages();

  const openMediaGallery = (target: "thumbnail" | "gallery") => {
    setGalleryTarget(target);
    setMediaSearch("");
    setShowMediaGallery(true);
  };

  const closeMediaGallery = () => {
    setShowMediaGallery(false);
  };

  const handleSelectImage = (image: ImageResponse) => {
    if (galleryTarget === "thumbnail") {
      setThumbnail(image.imageUrl);
    } else if (galleryTarget === "gallery") {
      setGallery((prev) => [...prev, image.imageUrl]);
    }
    closeMediaGallery();
  };

  const filteredMedia = useMemo(() => {
    const q = mediaSearch.trim().toLowerCase();
    if (!q) return images;
    return images.filter((img) => {
      return (
        img.originalName?.toLowerCase().includes(q) ||
        img.alt?.toLowerCase().includes(q) ||
        img.slug?.toLowerCase().includes(q)
      );
    });
  }, [images, mediaSearch]);

  const uploadThumbProps: UploadProps = {
    multiple: false,
    accept: "image/*",
    showUploadList: false,
    beforeUpload: (file) => {
      uploadImage(file as File, {
        onSuccess: (uploaded: ImageResponse) => setThumbnail(uploaded.imageUrl),
        onError: () => message.error("Không thể tải ảnh lên. Vui lòng thử lại."),
      });
      return false;
    },
  };

  const uploadGalleryProps: UploadProps = {
    multiple: true,
    accept: "image/*",
    showUploadList: false,
    beforeUpload: (file) => {
      uploadImage(file as File, {
        onSuccess: (uploaded: ImageResponse) => setGallery((prev) => [...prev, uploaded.imageUrl]),
        onError: () => message.error("Không thể tải ảnh lên. Vui lòng thử lại."),
      });
      return false;
    },
  };

  return (
    <>
      <Form<RoomFormPayload>
        form={form}
        layout="vertical"
        initialValues={{
          num: room?.num || "",
          concept: room?.concept || "",
          name: room?.name || "",
          description: room?.description || "",
          features: room?.features || [],
          price: room?.price || 0,
          isVisible: room?.isVisible ?? true,
        }}
        onFinish={(values) => {
          onSuccess({
            ...values,
            concept: values.concept?.toLowerCase().replace(/\s+/g, "-"),
            thumbnail,
            gallery,
          });
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={14}>
            <Card className="ah-admin-card" title="Thông tin phòng">
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="num" label="Số phòng" rules={[{ required: true, message: "Vui lòng nhập số phòng." }]}>
                    <Input placeholder="VD: 203" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="price" label="Giá hiển thị" rules={[{ required: true, message: "Vui lòng nhập giá." }]}>
                    <InputNumber className="w-full" min={0} placeholder="VD: 1500000" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="name" label="Tên phòng" rules={[{ required: true, message: "Vui lòng nhập tên phòng." }]}>
                    <Input placeholder="VD: Olive Loft" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="concept"
                    label="Concept / định danh"
                    rules={[{ required: true, message: "Vui lòng nhập concept." }]}
                    extra="Dùng cho URL và vận hành nội bộ, nên ngắn gọn và không trùng lặp."
                  >
                    <Input placeholder="VD: olive-loft" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="description" label="Mô tả ngắn">
                    <Input.TextArea rows={5} placeholder="Mô tả ngắn điểm nổi bật, trải nghiệm phù hợp." />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="features" label="Tiện ích / điểm nổi bật">
                    <Select mode="tags" tokenSeparators={[","]} placeholder="Nhập tiện ích, nhấn Enter để thêm" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} xl={10}>
            <Space direction="vertical" size={16} className="w-full">
              <Card className="ah-admin-card" title="Ảnh đại diện">
                {thumbnail ? (
                  <Space direction="vertical" size={12} className="w-full">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md border bg-gray-50">
                      <Image src={thumbnail} alt="Ảnh đại diện phòng" fill className="object-cover" />
                    </div>
                    <Space wrap>
                      <Upload {...uploadThumbProps} disabled={isUploading}>
                        <Button icon={<UploadOutlined />} loading={isUploading}>
                          Tải ảnh mới
                        </Button>
                      </Upload>
                      <Button icon={<PictureOutlined />} onClick={() => openMediaGallery("thumbnail")}>
                        Chọn từ thư viện
                      </Button>
                      <Button danger icon={<DeleteOutlined />} onClick={() => setThumbnail("")}>
                        Xóa
                      </Button>
                    </Space>
                  </Space>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Chưa có ảnh đại diện"
                  >
                    <Space wrap>
                      <Upload {...uploadThumbProps} disabled={isUploading}>
                        <Button type="primary" icon={<UploadOutlined />} loading={isUploading}>
                          Tải ảnh lên
                        </Button>
                      </Upload>
                      <Button icon={<PictureOutlined />} onClick={() => openMediaGallery("thumbnail")}>
                        Chọn từ thư viện
                      </Button>
                    </Space>
                  </Empty>
                )}
              </Card>

              <Card className="ah-admin-card" title="Bộ sưu tập ảnh">
                {gallery.length ? (
                  <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
                    {gallery.map((url, idx) => (
                      <div key={`${url}-${idx}`} className="relative">
                        <div className="relative aspect-square overflow-hidden rounded-md border bg-gray-50">
                          <Image src={url} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                        </div>
                        <Tooltip title="Xóa ảnh">
                          <Button
                            danger
                            size="small"
                            shape="circle"
                            icon={<DeleteOutlined />}
                            className="!absolute right-8 top-8"
                            onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                          />
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có ảnh trong gallery" />
                )}

                <Space wrap className="mt-12">
                  <Upload {...uploadGalleryProps} disabled={isUploading}>
                    <Button icon={<UploadOutlined />} loading={isUploading}>
                      Tải ảnh
                    </Button>
                  </Upload>
                  <Button icon={<PictureOutlined />} onClick={() => openMediaGallery("gallery")}>
                    Chọn từ thư viện
                  </Button>
                  <Button danger icon={<DeleteOutlined />} disabled={!gallery.length} onClick={() => setGallery([])}>
                    Xóa tất cả
                  </Button>
                </Space>
              </Card>

              <Card className="ah-admin-card" title="Hiển thị">
                <Form.Item name="isVisible" valuePropName="checked" className="!mb-0">
                  <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                </Form.Item>
                <Typography.Text type="secondary" className="!block mt-8">
                  Khi tắt hiển thị, phòng vẫn được lưu trong hệ thống nhưng không xuất hiện ở giao diện khách.
                </Typography.Text>
              </Card>

              <Card className="ah-admin-card">
                <div className="flex items-center justify-between gap-12">
                  <div>
                    <Typography.Text type="secondary">Hoàn tất</Typography.Text>
                    <Typography.Title level={4} className="!mb-0 !mt-6">
                      {room ? "Cập nhật thông tin phòng" : "Tạo phòng mới"}
                    </Typography.Title>
                  </div>
                  <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                    {room ? "Lưu thay đổi" : "Tạo phòng"}
                  </Button>
                </div>
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>

      <Modal
        title={galleryTarget === "thumbnail" ? "Chọn ảnh đại diện" : "Chọn ảnh cho gallery"}
        open={showMediaGallery}
        onCancel={closeMediaGallery}
        footer={null}
        width={980}
      >
        <Space direction="vertical" size={12} className="w-full">
          <Input.Search
            allowClear
            placeholder="Tìm theo tên file, alt, slug..."
            value={mediaSearch}
            onChange={(e) => setMediaSearch(e.target.value)}
          />

          {isLoadingImages ? (
            <div className="py-24 text-center">
              <Typography.Text type="secondary">Đang tải thư viện ảnh...</Typography.Text>
            </div>
          ) : imagesError || filteredMedia.length === 0 ? (
            <Empty description="Chưa thể tải hoặc không có ảnh trong thư viện." />
          ) : (
            <div className="max-h-[65vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:grid-cols-4">
                {filteredMedia.map((img) => (
                  <button
                    key={img._id}
                    type="button"
                    onClick={() => handleSelectImage(img)}
                    className="text-left"
                  >
                    <Card hoverable size="small" styles={{ body: { padding: 8 } }}>
                      <AdminThumbnail src={img.imageUrl} alt={img.alt || img.originalName || "Image"} aspect="square" />
                      <Typography.Text ellipsis className="!block mt-8">
                        {img.alt || img.originalName || img.slug}
                      </Typography.Text>
                      <Typography.Text type="secondary" ellipsis className="!block !text-xs">
                        {img.slug}
                      </Typography.Text>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Space>
      </Modal>
    </>
  );
};

export default RoomForm;
