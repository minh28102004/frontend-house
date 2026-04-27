import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
} from "antd";
import { AdminModal } from "@/modules/admin/common/components/AdminUi";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import { useVideos } from "@/common/hooks/useVideos";
import { useImages } from "@/common/hooks/useImages";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useAdminBanner } from "../hooks/useBanner";
import { Banner } from "../models/banner.model";
import { CreateBannerDto } from "../services/banner.service";

interface BannerFormData {
  title?: string;
  description?: string;
  imagePath: string;
  link?: string;
  type: "home" | "home-mobile" | "posts" | "products" | "contact";
  backgroundType?: "video" | "image";
  order: number;
  isActive: boolean;
}

interface BannerFormProps {
  banner?: Banner | null;
  open: boolean;
  onCancel: () => void;
}

const isValidUrl = (url: string) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const BannerForm: React.FC<BannerFormProps> = ({
  banner,
  open,
  onCancel,
}) => {
  const { message } = App.useApp();
  const { useCreateBanner, useUpdateBanner } = useAdminBanner();
  const { mutateAsync: createBanner, isPending: creating } = useCreateBanner();
  const { mutateAsync: updateBanner, isPending: updating } = useUpdateBanner();
  const { uploadImage, uploadEditorImage, loading: uploadingImage } = useImages();
  const { uploadVideo, loading: uploadingVideo } = useVideos();
  const [form] = Form.useForm<BannerFormData>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [descriptionHtml, setDescriptionHtml] = useState<string>("");
  const backgroundType = Form.useWatch("backgroundType", form) ?? "image";
  const submitting = creating || updating;

  const resolveUploadedUrl = (result: unknown) => {
    if (typeof result === "string") return result;
    if (!result || typeof result !== "object") return "";
    const source = result as Record<string, unknown>;
    const maybeUrl = source.videoUrl || source.imageUrl || source.location || source.url || source.path;
    return typeof maybeUrl === "string" ? maybeUrl : "";
  };

  useEffect(() => {
    if (banner) {
      form.setFieldsValue({
        title: banner.title || "",
        link: banner.link || "",
        imagePath: banner.imagePath,
        type: banner.type,
        backgroundType: banner.backgroundType || "image",
        order: banner.order ?? 0,
        isActive: banner.isActive,
      });
      setDescriptionHtml(banner.description || "");
      if (banner.backgroundType === "video") {
        setPreviewVideo(banner.imagePath);
        setPreviewImage(null);
      } else {
        setPreviewImage(banner.imagePath);
        setPreviewVideo(null);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({
        isActive: true,
        type: "home",
        backgroundType: "image",
        order: 0,
        imagePath: "",
        link: "",
      });
      setDescriptionHtml("");
      setPreviewImage(null);
      setPreviewVideo(null);
    }
  }, [banner, form]);

  const onManualUrlChange = (url: string) => {
    if (!url || !isValidUrl(url)) return;
    if (backgroundType === "video") {
      setPreviewVideo(url);
      setPreviewImage(null);
      return;
    }
    setPreviewImage(url);
    setPreviewVideo(null);
  };

  const uploadProps: UploadProps = {
    showUploadList: false,
    accept: backgroundType === "video" ? "video/*" : "image/*",
    customRequest: async (options) => {
      const file = options.file as RcFile;
      try {
        const result = backgroundType === "video" ? await uploadVideo(file) : await uploadImage(file);
        const assetUrl = resolveUploadedUrl(result);
        if (!assetUrl) throw new Error("Không lấy được đường dẫn tệp sau khi upload.");
        form.setFieldValue("imagePath", assetUrl);
        onManualUrlChange(assetUrl);
        message.success("Tải tệp thành công.");
        options.onSuccess?.(result as object);
      } catch (error) {
        message.error("Tải tệp thất bại.");
        options.onError?.(error as Error);
      }
    },
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.link && !isValidUrl(values.link)) {
        message.error("Link liên kết không hợp lệ.");
        return;
      }
      const payload: CreateBannerDto = {
        ...values,
        description: descriptionHtml,
      };
      if (banner?._id) {
        await updateBanner({ id: banner._id, data: payload });
      } else {
        await createBanner(payload);
      }
      onCancel();
    } catch {
      // Validation and mutation errors are already handled.
    }
  };

  return (
    <AdminModal
      title={banner ? "Chỉnh sửa banner" : "Thêm banner mới"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={banner ? "Lưu thay đổi" : "Tạo mới"}
      cancelText="Hủy"
      width={980}
      destroyOnClose
      loading={submitting}
    >
      <Form form={form} layout="vertical" className="pt-2">
        <Space direction="vertical" size={16} className="w-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item label="Tiêu đề" name="title">
              <Input placeholder="VD: Bộ sưu tập Xuân 2025" />
            </Form.Item>
            <Form.Item
              label="Link liên kết"
              name="link"
              rules={[
                {
                  validator: (_, value: string) => (!value || isValidUrl(value) ? Promise.resolve() : Promise.reject(new Error("URL không hợp lệ"))),
                },
              ]}
            >
              <Input placeholder="https://example.com" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Form.Item label="Loại banner" name="type" rules={[{ required: true, message: "Vui lòng chọn loại banner" }]}>
              <Select
                options={[
                  { value: "home", label: "Trang chủ" },
                  { value: "home-mobile", label: "Trang chủ Mobile" },
                  { value: "posts", label: "Bài viết" },
                  { value: "products", label: "Sản phẩm" },
                  { value: "contact", label: "Liên hệ" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Loại nền" name="backgroundType" rules={[{ required: true, message: "Chọn loại nền" }]}>
              <Radio.Group
                options={[
                  { value: "image", label: "Ảnh" },
                  { value: "video", label: "Video" },
                ]}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="Thứ tự" name="order">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </div>
          </div>

          <Form.Item label="Mô tả">
            <div className="overflow-hidden rounded-md border border-[#d9d9d9]">
              <SunEditor
                setContents={descriptionHtml}
                onChange={(content) => setDescriptionHtml(content)}
                height="220px"
                setOptions={{
                  buttonList: [["undo", "redo", "bold", "italic", "underline", "align", "list", "link", "image", "codeView"]],
                  minHeight: "180px",
                  maxHeight: "300px",
                  placeholder: "Nhập mô tả banner...",
                }}
                onImageUploadBefore={(files, _info, uploadHandler) => {
                  if (!files?.length) return false;
                  uploadEditorImage(files[0])
                    .then((response: unknown) => {
                      const imageUrl = resolveUploadedUrl(response);
                      if (!imageUrl) {
                        uploadHandler("Không thể tải ảnh lên");
                        return;
                      }
                      uploadHandler({
                        result: [{ url: imageUrl, name: files[0].name, size: files[0].size }],
                      });
                    })
                    .catch(() => uploadHandler("Lỗi khi tải ảnh lên"));
                  return false;
                }}
              />
            </div>
          </Form.Item>

          <Form.Item
            label="Ảnh/Video banner"
            name="imagePath"
            rules={[{ required: true, message: "Vui lòng upload hoặc nhập URL ảnh/video" }]}
          >
            <Input
              placeholder="Dán URL ảnh/video tại đây"
              onChange={(event) => onManualUrlChange(event.target.value)}
              addonAfter={
                <Upload {...uploadProps}>
                  <Button loading={uploadingImage || uploadingVideo} size="small">
                    Upload
                  </Button>
                </Upload>
              }
            />
          </Form.Item>

          <div>
            <Typography.Text type="secondary">Xem trước</Typography.Text>
            <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border border-[#f0f0f0] bg-[#fafafa]">
              {previewImage && backgroundType !== "video" ? (
                <Image src={previewImage} alt="Banner preview" fill className="object-contain" />
              ) : null}
              {previewVideo && backgroundType === "video" ? (
                <video className="h-full w-full object-cover" src={previewVideo} controls />
              ) : null}
              {!previewImage && !previewVideo ? (
                <div className="flex h-full items-center justify-center text-[rgba(0,0,0,0.45)]">Chưa có nội dung</div>
              ) : null}
            </div>
          </div>
        </Space>
      </Form>
    </AdminModal>
  );
};
