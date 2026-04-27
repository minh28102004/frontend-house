"use client";

import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  DatePicker, 
  Checkbox, 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Upload,
  Divider,
  App,
  Tag,
  Switch
} from "antd";
import { 
  SaveOutlined, 
  ArrowLeftOutlined, 
  UploadOutlined, 
  PictureOutlined,
  CalendarOutlined,
  GlobalOutlined,
  TagOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  CreatePostDto,
  UpdatePostDto,
  Category,
  CategoryInfo,
  PostStatus,
} from "../models/post.model";
import PostCategoryTree from "./CategoryPostTree";
import { usePosts } from "@/modules/admin/posts/hooks/usePosts";
import { useAuth } from "@/context/AuthContext";
import { useTags } from "@/modules/admin/tags/hooks/useTags";
import SunEditerUploadImage from "../../common/components/SunEditer";

const { Text, Title, Paragraph } = Typography;

/** Loại bỏ domain từ HTML, chỉ giữ phần relative */
const removeDomain = (html: string): string =>
  html.replace(new RegExp(`${process.env.NEXT_PUBLIC_API_URL}`, "g"), "");

type Props = {
  initialData?: CreatePostDto | UpdatePostDto;
  isEdit?: boolean;
  onSubmitSuccess: () => void;
  onCancel: () => void;
};

const PostForm: React.FC<Props> = ({ initialData, isEdit = false, onSubmitSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { user } = useAuth();
  const {
    categoriesQuery,
    uploadImageMutation,
    createMutation,
    updateMutation,
  } = usePosts();
  const { listQuery: tagListQuery } = useTags();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [postData, setPostData] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      const initThumbnail = initialData.thumbnail?.[0] || "";
      setThumbnailUrl(initThumbnail);
      
      setExcerpt(initialData.excerpt || "");
      setPostData(initialData.postData || "");
      setMetaDescription((initialData as any).metaDescription || "");
      
      const cats = initialData.category ? [...initialData.category.main, ...initialData.category.sub] : [];
      setSelectedCategoryNames(cats);
      
      setIsScheduled(!!initialData.scheduledAt);

      form.setFieldsValue({
        title: initialData.title,
        slug: initialData.slug,
        publishedAt: dayjs(initialData.publishedDate || Date.now()),
        scheduledAt: initialData.scheduledAt ? dayjs(initialData.scheduledAt) : undefined,
        tags: (initialData as any).tags || [],
      });
    } else {
      form.setFieldsValue({
        publishedAt: dayjs(),
        tags: [],
      });
    }
  }, [initialData, form]);

  const handleCategoryChange = (cat: Category, checked: boolean) => {
    setSelectedCategoryNames((prev) =>
      checked ? [...prev, cat.name] : prev.filter((n) => n !== cat.name)
    );
  };

  const handleUploadThumbnail = async (file: File) => {
    try {
      const { url } = await uploadImageMutation.mutateAsync(file);
      setThumbnailUrl(url);
      message.success("Tải ảnh đại diện thành công");
    } catch (error) {
      message.error("Tải ảnh thất bại");
    }
  };

  const onFinish = async (values: any) => {
    if (!values.title.trim()) {
      message.error("Tiêu đề không được để trống");
      return;
    }
    
    setIsSubmitting(true);
    
    // build categories
    const allCats = categoriesQuery.data?.data || [];
    const picked = allCats.filter((c) => selectedCategoryNames.includes(c.name));
    const categoryInfo: CategoryInfo = { 
      main: picked.filter((c) => c.level === 0).map((c) => c.name), 
      sub: picked.filter((c) => c.level > 0).map((c) => c.name) 
    };

    const common = {
      title: values.title.trim(),
      slug: values.slug?.trim() || undefined,
      excerpt: removeDomain(excerpt),
      postData: removeDomain(postData),
      metaDescription: removeDomain(metaDescription),
      author: user?.fullName || user?.email || "Admin",
      thumbnail: thumbnailUrl ? [thumbnailUrl] : [],
      publishedDate: values.publishedAt.toISOString(),
      category: categoryInfo,
      tags: values.tags,
      scheduledAt: isScheduled ? values.scheduledAt?.toISOString() : undefined,
      status: isScheduled ? PostStatus.Draft : undefined,
    };

    try {
      if (isEdit && initialData && "slug" in initialData) {
        await updateMutation.mutateAsync({
          slug: initialData.slug,
          data: { id: initialData.id, ...common } as UpdatePostDto,
        });
        message.success("Cập nhật bài viết thành công!");
      } else {
        await createMutation.mutateAsync({ id: "", ...common } as CreatePostDto);
        message.success("Tạo bài viết mới thành công!");
      }
      onSubmitSuccess();
    } catch (error) {
      message.error("Gửi biểu mẫu thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="ah-admin-form"
    >
      <div className="flex flex-col gap-5">
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card className="ah-admin-card" title="Nội dung bài viết">
              <Space direction="vertical" className="w-full" size={20}>
                <Form.Item
                  name="title"
                  label="Tiêu đề bài viết"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                  <Input.TextArea 
                    autoSize={{ minRows: 1, maxRows: 3 }} 
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..." 
                    className="text-lg font-bold"
                  />
                </Form.Item>

                <Form.Item
                  name="slug"
                  label={
                    <Space>
                      <span>Đường dẫn URL (Slug)</span>
                      <Text type="secondary" className="text-xs font-normal">(Để trống để tự động tạo)</Text>
                    </Space>
                  }
                >
                  <Input prefix={<GlobalOutlined className="text-gray-400" />} placeholder="ten-bai-viet-slug" />
                </Form.Item>

                <div>
                  <Text strong className="block mb-2">Tóm tắt (Excerpt)</Text>
                  <div className="border rounded-lg overflow-hidden">
                    <SunEditerUploadImage postData={excerpt} setPostData={setExcerpt} />
                  </div>
                </div>

                <div>
                  <Text strong className="block mb-2">Nội dung chính</Text>
                  <div className="border rounded-lg overflow-hidden">
                    <SunEditerUploadImage postData={postData} setPostData={setPostData} />
                  </div>
                </div>
              </Space>
            </Card>

            <Card className="ah-admin-card mt-6" title="Tối ưu tìm kiếm (SEO)">
              <Form.Item label="Meta Description">
                <div className="border rounded-lg overflow-hidden">
                  <SunEditerUploadImage postData={metaDescription} setPostData={setMetaDescription} />
                </div>
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="ah-admin-card" title="Ảnh đại diện">
              <div className="flex flex-col items-center gap-4">
                {thumbnailUrl ? (
                  <div className="relative w-full aspect-video rounded-lg border overflow-hidden bg-gray-50">
                    <img 
                      src={thumbnailUrl.startsWith('http') ? thumbnailUrl : `${process.env.NEXT_PUBLIC_API_URL}${thumbnailUrl}`} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                    <Button 
                      danger 
                      size="small"
                      type="primary" 
                      shape="circle" 
                      className="absolute top-2 right-2"
                      icon={<UploadOutlined />} 
                      onClick={() => setThumbnailUrl("")}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-lg border border-dashed flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                    <PictureOutlined className="text-4xl mb-2" />
                    <Text type="secondary">Chưa có ảnh đại diện</Text>
                  </div>
                )}
                <Upload 
                  showUploadList={false} 
                  customRequest={({ file }) => handleUploadThumbnail(file as File)}
                >
                  <Button icon={<UploadOutlined />} block>Tải ảnh lên</Button>
                </Upload>
              </div>
            </Card>

            <Card className="ah-admin-card mt-6" title="Phân loại & Thẻ">
              <Space direction="vertical" className="w-full" size={20}>
                <div>
                  <Text strong className="block mb-3"><TagOutlined className="mr-2" />Danh mục bài viết</Text>
                  <div className="max-h-[300px] overflow-y-auto border rounded-lg p-4 bg-gray-50/50">
                    {categoriesQuery.isLoading ? (
                      <Text type="secondary">Đang tải...</Text>
                    ) : (
                      <PostCategoryTree
                        categories={categoriesQuery.data?.data || []}
                        selectedCategoryNames={selectedCategoryNames}
                        handleCategoryChange={handleCategoryChange}
                      />
                    )}
                  </div>
                </div>

                <Form.Item name="tags" label={<Text strong><TagOutlined className="mr-2" />Thẻ (Tags)</Text>}>
                  <Checkbox.Group className="w-full">
                    <div className="flex flex-wrap gap-2">
                      {tagListQuery.isLoading ? (
                        <Text type="secondary">Đang tải...</Text>
                      ) : (
                        (tagListQuery.data?.data || []).map((t: any) => (
                          <Tag.CheckableTag 
                            key={t.slug} 
                            checked={form.getFieldValue("tags")?.includes(t.name)}
                            onChange={(checked) => {
                              const current = form.getFieldValue("tags") || [];
                              const next = checked ? [...current, t.name] : current.filter((n: string) => n !== t.name);
                              form.setFieldsValue({ tags: next });
                            }}
                            className="!m-0 border"
                          >
                            {t.name}
                          </Tag.CheckableTag>
                        ))
                      )}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </Space>
            </Card>

            <Card className="ah-admin-card mt-6" title="Lịch đăng bài">
              <Space direction="vertical" className="w-full" size={16}>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <Space>
                    <CalendarOutlined className="text-blue-500" />
                    <Text strong>Hẹn giờ lên bài</Text>
                  </Space>
                  <Switch checked={isScheduled} onChange={setIsScheduled} size="small" />
                </div>

                {isScheduled ? (
                  <Form.Item name="scheduledAt" label="Thời gian hẹn giờ" rules={[{ required: true }]}>
                    <DatePicker showTime format="DD/MM/YYYY HH:mm" className="w-full" />
                  </Form.Item>
                ) : (
                  <Form.Item name="publishedAt" label="Ngày đăng bài">
                    <DatePicker showTime format="DD/MM/YYYY HH:mm" className="w-full" />
                  </Form.Item>
                )}
                
                <Paragraph type="secondary" className="text-xs bg-gray-50 p-3 rounded border">
                  {isScheduled 
                    ? "Bài viết sẽ được lưu dưới dạng Nháp và tự động chuyển sang Công khai vào thời gian đã chọn." 
                    : "Bài viết sẽ được đăng ngay lập tức với ngày xuất bản đã chọn."}
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>

        <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-white z-10">
          <Button onClick={onCancel}>Hủy</Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SaveOutlined />} 
            loading={isSubmitting}
            size="large"
            className="min-w-[180px]"
          >
            {isEdit ? "Cập nhật bài viết" : "Tạo bài viết mới"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default PostForm;
