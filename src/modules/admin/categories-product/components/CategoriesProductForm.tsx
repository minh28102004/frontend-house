"use client";

import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Button, 
  Upload, 
  Space, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Modal,
  App
} from "antd";
import { 
  UploadOutlined, 
  DeleteOutlined, 
  PictureOutlined,
  SaveOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { getCategoriesProduct } from "../services/categories-product.service";
import { CategoriesProduct } from "../types/categories-product.types";
import { useImages } from "@/modules/admin/media/hooks/useImages";
import { ImageResponse } from "@/modules/admin/media/services/images.service";

const { Title, Text, Paragraph } = Typography;

export interface CategoryFormPayload {
  name: string;
  title?: string;
  description?: string;
  parentCategory?: string;
  image?: string;
  sortOrder?: number;
  bannerImage?: string;
  bannerMobileImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerCtaLabel?: string;
  bannerCtaLink?: string;
}

interface Props {
  category?: CategoriesProduct;
  onSuccess: (data: CategoryFormPayload) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const CategoriesProductForm: React.FC<Props> = ({
  category,
  onSuccess,
  onCancel,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [categories, setCategories] = useState<CategoriesProduct[]>([]);
  const { uploadImage, isUploading, images } = useImages();
  
  const [imageUrl, setImageUrl] = useState<string>(category?.image || "");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>(category?.bannerImage || "");
  const [bannerMobileImageUrl, setBannerMobileImageUrl] = useState<string>(category?.bannerMobileImage || "");
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState<"category" | "banner" | "bannerMobile" | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategoriesProduct();
      // Filter out current category to prevent self-parenting
      setCategories(data.filter(cat => cat._id !== category?._id));
    };
    fetchCategories();
  }, [category?._id]);

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        parentCategory: typeof category.parentCategory === "string" 
          ? category.parentCategory 
          : category.parentCategory?._id || undefined,
        sortOrder: category.sortOrder ?? 0,
        bannerTitle: category.bannerTitle || "",
        bannerSubtitle: category.bannerSubtitle || "",
        bannerCtaLabel: category.bannerCtaLabel || "",
        bannerCtaLink: category.bannerCtaLink || "",
      });
    }
  }, [category, form]);

  const handleUpload = async (file: File, target: "category" | "banner" | "bannerMobile") => {
    uploadImage(file, {
      onSuccess: (uploadedImage: ImageResponse) => {
        if (target === "banner") setBannerImageUrl(uploadedImage.imageUrl);
        else if (target === "bannerMobile") setBannerMobileImageUrl(uploadedImage.imageUrl);
        else setImageUrl(uploadedImage.imageUrl);
        message.success("Tải ảnh lên thành công");
      },
      onError: () => {
        message.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
      },
    });
  };

  const getUploadProps = (target: "category" | "banner" | "bannerMobile"): UploadProps => ({
    accept: "image/*",
    showUploadList: false,
    customRequest: ({ file }) => handleUpload(file as File, target),
  });

  const openMediaGallery = (target: "category" | "banner" | "bannerMobile") => {
    setGalleryTarget(target);
    setShowMediaGallery(true);
  };

  const handleSelectFromGallery = (image: ImageResponse) => {
    if (galleryTarget === "banner") setBannerImageUrl(image.imageUrl);
    else if (galleryTarget === "bannerMobile") setBannerMobileImageUrl(image.imageUrl);
    else setImageUrl(image.imageUrl);
    setShowMediaGallery(false);
  };

  const onFinish = async (values: any) => {
    const payload: CategoryFormPayload = {
      ...values,
      image: imageUrl,
      bannerImage: bannerImageUrl,
      bannerMobileImage: bannerMobileImageUrl,
    };
    await onSuccess(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ sortOrder: 0 }}
      className="ah-admin-form"
    >
      <div className="flex flex-col gap-5">
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card className="ah-admin-card" title="Thông tin cơ bản">
              <Row gutter={16}>
                <Col xs={24} md={16}>
                  <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
                  >
                    <Input placeholder="Ví dụ: Đồ lưu niệm, Weekend Gift Box" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="sortOrder" label="Thứ tự hiển thị">
                    <InputNumber min={0} className="w-full" placeholder="0" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="parentCategory" label="Danh mục cha">
                    <Select
                      placeholder="Chọn danh mục cha (nếu có)"
                      allowClear
                      options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card 
              className="ah-admin-card mt-6" 
              title={
                <div className="flex flex-col">
                  <span>Banner danh mục</span>
                  <Text type="secondary" className="text-xs font-normal">Hiển thị toàn chiều rộng trên trang danh mục</Text>
                </div>
              }
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="bannerTitle" label="Tiêu đề banner">
                    <Input placeholder="Ví dụ: Bộ sưu tập Thu Đông" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="bannerCtaLabel" label="Nhãn nút (CTA)">
                    <Input placeholder="Ví dụ: Khám phá ngay" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="bannerSubtitle" label="Mô tả ngắn banner">
                    <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về danh mục này trên banner..." />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="bannerCtaLink" label="Đường dẫn nút (URL)">
                    <Input placeholder="https://..." />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="ah-admin-card" title="Ảnh đại diện (Avatar)">
              <div className="flex flex-col items-center gap-4">
                {imageUrl ? (
                  <div className="relative w-full aspect-square rounded-lg border overflow-hidden bg-gray-50">
                    <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                    <Button 
                      danger 
                      type="primary" 
                      shape="circle" 
                      icon={<DeleteOutlined />} 
                      className="absolute top-2 right-2"
                      onClick={() => setImageUrl("")}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square rounded-lg border border-dashed flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                    <PictureOutlined className="text-4xl mb-2" />
                    <Text type="secondary">Chưa có ảnh</Text>
                  </div>
                )}
                
                <Space direction="vertical" className="w-full">
                  <Upload {...getUploadProps("category")}>
                    <Button icon={<UploadOutlined />} block loading={isUploading && galleryTarget === "category"}>
                      Tải ảnh lên
                    </Button>
                  </Upload>
                  <Button icon={<PictureOutlined />} block onClick={() => openMediaGallery("category")}>
                    Chọn từ thư viện
                  </Button>
                </Space>
              </div>
            </Card>

            <Card className="ah-admin-card mt-6" title="Ảnh Banner (Desktop/Mobile)">
              <Space direction="vertical" className="w-full" size={16}>
                <div>
                  <Text strong className="block mb-2 text-xs uppercase text-gray-500">Desktop (21:9)</Text>
                  {bannerImageUrl ? (
                    <div className="relative aspect-[21/9] rounded border overflow-hidden mb-2">
                      <img src={bannerImageUrl} alt="Banner Desktop" className="w-full h-full object-cover" />
                      <Button 
                        danger 
                        size="small"
                        type="primary" 
                        shape="circle" 
                        icon={<DeleteOutlined />} 
                        className="absolute top-1 right-1"
                        onClick={() => setBannerImageUrl("")}
                      />
                    </div>
                  ) : null}
                  <Space>
                    <Upload {...getUploadProps("banner")}>
                      <Button size="small" icon={<UploadOutlined />} loading={isUploading && galleryTarget === "banner"}>Tải lên</Button>
                    </Upload>
                    <Button size="small" icon={<PictureOutlined />} onClick={() => openMediaGallery("banner")}>Thư viện</Button>
                  </Space>
                </div>

                <div>
                  <Text strong className="block mb-2 text-xs uppercase text-gray-500">Mobile (16:9)</Text>
                  {bannerMobileImageUrl ? (
                    <div className="relative aspect-[16/9] rounded border overflow-hidden mb-2">
                      <img src={bannerMobileImageUrl} alt="Banner Mobile" className="w-full h-full object-cover" />
                      <Button 
                        danger 
                        size="small"
                        type="primary" 
                        shape="circle" 
                        icon={<DeleteOutlined />} 
                        className="absolute top-1 right-1"
                        onClick={() => setBannerMobileImageUrl("")}
                      />
                    </div>
                  ) : null}
                  <Space>
                    <Upload {...getUploadProps("bannerMobile")}>
                      <Button size="small" icon={<UploadOutlined />} loading={isUploading && galleryTarget === "bannerMobile"}>Tải lên</Button>
                    </Upload>
                    <Button size="small" icon={<PictureOutlined />} onClick={() => openMediaGallery("bannerMobile")}>Thư viện</Button>
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>Hủy</Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            loading={isLoading}
          >
            {category ? "Cập nhật danh mục" : "Tạo danh mục mới"}
          </Button>
        </div>
      </div>

      <Modal
        title="Chọn ảnh từ thư viện"
        open={showMediaGallery}
        onCancel={() => setShowMediaGallery(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-h-[60vh] overflow-y-auto p-2">
          {images.map((img) => (
            <div
              key={img._id}
              onClick={() => handleSelectFromGallery(img)}
              className="relative aspect-square cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg overflow-hidden transition-all group"
            >
              <img
                src={img.imageUrl}
                alt={img.alt || img.originalName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <Text className="text-white opacity-0 group-hover:opacity-100 font-bold">Chọn</Text>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </Form>
  );
};

export default CategoriesProductForm;
