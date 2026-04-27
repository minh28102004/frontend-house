"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "suneditor/dist/css/suneditor.min.css";
import dayjs, { Dayjs } from "dayjs";
import { Alert, App, Button, Card, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Space, Spin, Switch, TimePicker, Tooltip, Typography, Upload } from "antd";
import type { UploadProps } from "antd";
import { DeleteOutlined, LinkOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { Product } from "../models/product.model";
import { useProducts } from "../hooks/useProducts";
import CategoryTree, { Category } from "./CategoryTree";
import SunEditerUploadImage from "../../common/components/SunEditer";

interface SelectedCategory {
  id: string;
  name: string;
  slug: string;
  level?: number; // Thêm level để phân biệt main và sub
}

interface ProductFormProps {
  initialData?: Product;
  mode: "create" | "edit";
  onSubmit: (productData: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
}): React.ReactElement => {
  const { message } = App.useApp();
  const { categories, uploadImage } = useProducts();
  const [form] = Form.useForm();

  const [description, setDescription] = useState<string>(
    initialData?.description ||
      `<div>
<p><b>THÔNG SỐ SẢN PHẨM:</b></p>
<p><b>Chất liệu:</b></p>
<p><b>Màu sắc:</b></p>
<p><b>Size:</b></p>
<p><b>LƯU Ý:</b></p>
<p><b>TÊN VÀ ĐỊA CHỈ TỔ CHỨC CÁ NHÂN CHỊU TRÁCH NHIỆM HÀNG HÓA:</b></p>
</div>`
  );

  const [thumbnail, setThumbnail] = useState<string>(initialData?.thumbnail || "");
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [publishedAt, setPublishedAt] = useState<{ date: Dayjs; time: Dayjs } | null>(null);

  // State for categories
  const [selectedCategories, setSelectedCategories] = useState<
    SelectedCategory[]
  >([]);
  // Set default date and time on mount
  useEffect(() => {
    const now = new Date();
    const base = initialData?.updatedAt ? new Date(initialData.updatedAt) : now;
    const safe = isNaN(base.getTime()) ? now : base;
    const d = dayjs(safe);
    setPublishedAt({ date: d.startOf("day"), time: d });
  }, [initialData?.updatedAt]);

  // Ref để track xem đã sync từ initialData chưa
  const hasInitializedRef = useRef(false);
  const initialCategoryRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Chỉ sync khi có initialData và categories đã load, và chưa sync lần nào
    // Hoặc khi initialData.category thay đổi (khi switch sang product khác)
    const currentCategoryKey = initialData?.category
      ? `${initialData.category.main}-${(initialData.category.sub || []).join(',')}`
      : undefined;

    // Nếu category key không đổi và đã initialize rồi thì không làm gì
    if (hasInitializedRef.current && initialCategoryRef.current === currentCategoryKey) {
      return;
    }

    if (initialData?.category && categories.length > 0) {
      // Tìm main category theo slug hoặc name (vì backend lưu slug vào category.main)
      const mainCategory = categories.find(
        (c) => c.slug === initialData?.category?.main || c.name === initialData?.category?.main
      );

      // Tìm sub categories theo slug hoặc name
      const subCategories = (initialData?.category?.sub || [])
        .map((slugOrName: string) => {
          return categories.find((c) => c.slug === slugOrName || c.name === slugOrName);
        })
        .filter(Boolean);

      const updatedCategories: SelectedCategory[] = [];

      // Thêm main category
      if (mainCategory) {
        updatedCategories.push({
          id: mainCategory._id || "",
          name: mainCategory.name,
          slug: mainCategory.slug || "",
          level: mainCategory.level,
        });
      }

      // Thêm sub categories
      subCategories.forEach((cat) => {
        if (cat) {
          updatedCategories.push({
            id: cat._id || "",
            name: cat.name,
            slug: cat.slug || "",
            level: cat.level,
          });
        }
      });

      // Chỉ set nếu khác với giá trị hiện tại
      setSelectedCategories((prev) => {
        const prevIds = prev.map(c => c.id).sort().join(',');
        const newIds = updatedCategories.map(c => c.id).sort().join(',');
        if (prevIds !== newIds) {
          hasInitializedRef.current = true;
          initialCategoryRef.current = currentCategoryKey;
          return updatedCategories;
        }
        return prev;
      });
    } else if (!initialData?.category && hasInitializedRef.current === false) {
      // Chỉ reset khi chưa initialize và không có category
      setSelectedCategories([]);
      hasInitializedRef.current = true;
      initialCategoryRef.current = currentCategoryKey;
    }
  }, [initialData?.category, categories]);

  const [isVisible, setIsVisible] = useState(initialData?.isVisible || false);

  // UI State
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Fetch filter options khi đổi category (chỉ lấy theo category đầu tiên)
  useEffect(() => {
    const fetchCategoryFilters = async () => {
      if (selectedCategories.length === 0 || !selectedCategories[0].id) {
        return;
      }
    };
    fetchCategoryFilters();
  }, [selectedCategories]); // Remove filterOptionsCache from dependencies to avoid loop

  // Tự động tạo slug từ name
  useEffect(() => {
    if (mode === "create" && !initialData?.slug && name) {
      const generatedSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [name, mode, initialData?.slug]);

  // Handle category change
  // const handleCategoryChange = (category: Category, checked: boolean) => {
  //   setSelectedCategories((prev) => {
  //     if (checked) {
  //       // Khi chọn danh mục con, tự động chọn tất cả danh mục cha
  //       const getAllParentCategories = (
  //         childCategory: Category
  //       ): SelectedCategory[] => {
  //         if (!childCategory.parentCategory) {
  //           return [];
  //         }

  //         const parentCategory = categories.find(
  //           (cat) => cat._id === childCategory.parentCategory
  //         );
  //         if (!parentCategory) {
  //           return [];
  //         }

  //         const parentSelected: SelectedCategory = {
  //           id: parentCategory._id || "",
  //           name: parentCategory.name,
  //           slug: parentCategory.slug || "",
  //         };

  //         // Đệ quy để lấy tất cả danh mục cha của cha
  //         return [parentSelected, ...getAllParentCategories(parentCategory)];
  //       };

  //       const parentCategoriesToAdd = getAllParentCategories(category);
  //       const categoriesToAdd = [
  //         { id: category._id || "", name: category.name, slug: category.slug || "", level: category.level },
  //         ...parentCategoriesToAdd.map(cat => {
  //           const parentCat = categories.find(c => c._id === cat.id);
  //           return { ...cat, level: parentCat?.level ?? 0 };
  //         }),
  //       ];

  //       // Thêm tất cả danh mục mới (tránh trùng lặp)
  //       const newCategories = [...prev];
  //       categoriesToAdd.forEach((catToAdd) => {
  //         const exists = newCategories.some(
  //           (existing) =>
  //             existing.id === catToAdd.id || existing.name === catToAdd.name
  //         );
  //         if (!exists) {
  //           newCategories.push(catToAdd);
  //         }
  //       });

  //       return newCategories;
  //     }
  //     else {
  //       // Khi bỏ chọn danh mục cha, cũng bỏ chọn tất cả danh mục con
  //       const getAllChildCategories = (
  //         parentCategory: Category
  //       ): SelectedCategory[] => {
  //         const children = categories.filter(
  //           (cat) => cat.parentCategory === parentCategory._id
  //         );
  //         let allChildren: SelectedCategory[] = [];

  //         for (const child of children) {
  //           const childSelected: SelectedCategory = {
  //             id: child._id || "",
  //             name: child.name,
  //             slug: child.slug || "",
  //           };
  //           allChildren.push(childSelected);

  //           allChildren = [...allChildren, ...getAllChildCategories(child)];
  //         }

  //         return allChildren;
  //       };

  //       const childCategoriesToRemove = getAllChildCategories(category);
  //       const categoriesToRemove = [
  //         { id: category._id || "", name: category.name, slug: category.slug || "", level: category.level },
  //         ...childCategoriesToRemove.map(cat => {
  //           const childCat = categories.find(c => c._id === cat.id);
  //           return { ...cat, level: childCat?.level ?? 0 };
  //         }),
  //       ];

  //       const newCategories = prev.filter(
  //         (existing) =>
  //           !categoriesToRemove.some(
  //             (toRemove) =>
  //               existing.id === toRemove.id || existing.name === toRemove.name
  //           )
  //       );

  //       return newCategories;
  //     }
  //   });
  // };

  const checkedCategoryIds = useMemo(() => selectedCategories.map((c) => c.id), [selectedCategories]);
  const onCheckedCategoryIdsChange = (checkedIds: string[]) => {
    const next = checkedIds
      .map((id) => categories.find((c) => c._id === id))
      .filter(Boolean)
      .map((c) => ({
        id: c!._id || "",
        name: c!.name,
        slug: c!.slug || "",
        level: c!.level,
      }));
    setSelectedCategories(next);
  };


  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setIsUploadingImages(true);
      const imageUrl = await uploadImage(file);
      setIsUploadingImages(false);
      return imageUrl || "";
    } catch {
      setIsUploadingImages(false);
      setErrorMsg("Lỗi khi tải ảnh lên");
      return "";
    }
  };

  const thumbnailUploadProps: UploadProps = {
    accept: "image/*",
    showUploadList: false,
    customRequest: async (options) => {
      try {
        const url = await handleImageUpload(options.file as File);
        if (url) setThumbnail(url);
        options.onSuccess?.({});
      } catch (e) {
        options.onError?.(e as Error);
      }
    },
  };

  const galleryUploadProps: UploadProps = {
    accept: "image/*",
    multiple: true,
    showUploadList: false,
    customRequest: async (options) => {
      try {
        const url = await handleImageUpload(options.file as File);
        if (url) setGallery((prev) => [...prev, url]);
        options.onSuccess?.({});
      } catch (e) {
        options.onError?.(e as Error);
      }
    },
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const values = await form.validateFields();
      const name: string = values.name;
      const slug: string = values.slug;
      const sold: number = values.sold ?? 0;
      const currentPrice: number = values.currentPrice ?? 0;
      const discountPrice: number = values.discountPrice ?? 0;
      const isVisible: boolean = values.isVisible ?? false;

      // Prepare category data - phân biệt main (level 0) và sub (level > 0)
      // Tìm main category (level 0) - chỉ lấy 1 cái đầu tiên nếu có nhiều
      const mainCategory = selectedCategories.find(cat => {
        const category = categories.find(c => c._id === cat.id);
        return category?.level === 0;
      }) || selectedCategories[0]; // Fallback: lấy danh mục đầu tiên nếu không tìm thấy main

      // Đảm bảo main category có slug từ category object
      const mainCategoryFromDb = mainCategory ? categories.find(c => c._id === mainCategory.id) : null;
      const mainCategoryName = mainCategory?.name || mainCategoryFromDb?.name || "";
      const mainCategorySlug = mainCategory?.slug || mainCategoryFromDb?.slug || "";
      const mainCategoryId = mainCategory?.id || "";

      // Lấy tất cả sub categories (level > 0) hoặc các danh mục không phải main đã chọn
      const subCategories = selectedCategories
        .filter(cat => {
          if (cat.id === mainCategory?.id) return false; // Loại trừ main category
          const category = categories.find(c => c._id === cat.id);
          // Chỉ lấy sub categories (level > 0)
          return category?.level !== undefined && category.level > 0;
        })
        .map(cat => {
          // Đảm bảo có slug từ category object
          const category = categories.find(c => c._id === cat.id);
          return {
            ...cat,
            slug: cat.slug || category?.slug || "",
            name: cat.name || category?.name || "",
          };
        })
        .filter(cat => cat.slug && cat.slug.trim() !== ""); // Lọc bỏ những category không có slug

      const subCategorySlugs = subCategories.map((c) => c.slug);
      const subCategoryIds = subCategories.map((c) => c.id);

      const datePart: Dayjs | null = publishedAt?.date ?? null;
      const timePart: Dayjs | null = publishedAt?.time ?? null;
      const isoDate =
        datePart && timePart
          ? datePart
              .hour(timePart.hour())
              .minute(timePart.minute())
              .second(0)
              .millisecond(0)
              .toISOString()
          : new Date().toISOString();

      // Prepare product data
      const productData: Partial<Product> = {
        name,
        sold,
        slug,
        description,
        currentPrice,
        discountPrice,
        thumbnail,
        gallery,
        isVisible,
        updatedAt: isoDate,
        category: {
          main: mainCategorySlug, // Lưu slug vào main thay vì name
          sub: subCategorySlugs, // Lưu slug vào sub thay vì name
          subCategoryIds: subCategoryIds, // Vẫn giữ lại ID
          tags: [],
          mainCategoryId,
          id: mainCategoryId,
          name: mainCategoryName, // Giữ name để hiển thị
          slug: mainCategorySlug, // Giữ slug
        },
      };

      await onSubmit(productData);
      message.success(mode === "create" ? "Tạo sản phẩm thành công." : "Cập nhật sản phẩm thành công.");
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMsg(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        sold: initialData?.sold || 0,
        currentPrice: initialData?.currentPrice || 0,
        discountPrice: initialData?.discountPrice || 0,
        isVisible: initialData?.isVisible || false,
      }}
    >
      <Space direction="vertical" size={16} className="w-full">
        {errorMsg ? <Alert type="error" message={errorMsg} showIcon /> : null}

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card className="ah-admin-card" title="Thông tin cơ bản">
              <Row gutter={[16, 0]}>
                <Col xs={24}>
                  <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm." }]}>
                    <Input placeholder="Nhập tên sản phẩm" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="slug" label="Slug" rules={[{ required: true, message: "Vui lòng nhập slug." }]}>
                    <Input placeholder="vd: ten-san-pham" />
                  </Form.Item>
                  {mode === "edit" ? (
                    <Typography.Paragraph className="!mb-0">
                      <Typography.Text type="secondary">Link:</Typography.Text>{" "}
                      <Typography.Link
                        href={`${process.env.NEXT_PUBLIC_API_URL}/products/${form.getFieldValue("slug")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <LinkOutlined /> {process.env.NEXT_PUBLIC_API_URL}/products/{form.getFieldValue("slug")}
                      </Typography.Link>
                    </Typography.Paragraph>
                  ) : null}
                </Col>
              </Row>
            </Card>

            <Card className="ah-admin-card" title="Mô tả chi tiết">
              <SunEditerUploadImage postData={description} setPostData={setDescription} />
            </Card>

            <Card className="ah-admin-card" title="Hình ảnh">
              <Space direction="vertical" size={12} className="w-full">
                <div>
                  <Typography.Text strong>Ảnh đại diện</Typography.Text>
                  <div className="mt-8">
                    <Space wrap>
                      <Upload {...thumbnailUploadProps} disabled={isUploadingImages}>
                        <Button icon={<UploadOutlined />} loading={isUploadingImages}>
                          Tải ảnh
                        </Button>
                      </Upload>
                      {thumbnail ? (
                        <Button danger icon={<DeleteOutlined />} onClick={() => setThumbnail("")}>
                          Xóa
                        </Button>
                      ) : null}
                    </Space>
                    {thumbnail ? (
                      <div className="mt-12 w-48">
                        <img src={thumbnail} alt="Thumbnail" className="w-full rounded-md border object-cover" />
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Typography.Text strong>Gallery</Typography.Text>
                  <div className="mt-8">
                    <Space wrap>
                      <Upload {...galleryUploadProps} disabled={isUploadingImages}>
                        <Button icon={<UploadOutlined />} loading={isUploadingImages}>
                          Tải ảnh
                        </Button>
                      </Upload>
                      {gallery.length ? (
                        <Button danger icon={<DeleteOutlined />} onClick={() => setGallery([])}>
                          Xóa tất cả
                        </Button>
                      ) : null}
                    </Space>
                    {gallery.length ? (
                      <div className="mt-12 grid grid-cols-2 gap-12 sm:grid-cols-4">
                        {gallery.map((url, idx) => (
                          <div key={`${url}-${idx}`} className="relative">
                            <img src={url} alt={`Gallery ${idx + 1}`} className="w-full aspect-square rounded-md border object-cover" />
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
                    ) : null}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size={16} className="w-full">
              <Card className="ah-admin-card" title="Xuất bản">
                <Space direction="vertical" size={12} className="w-full">
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <Typography.Text type="secondary">Ngày</Typography.Text>
                      <DatePicker
                        className="w-full mt-6"
                        value={publishedAt?.date ?? undefined}
                        onChange={(d) => {
                          if (!d) return setPublishedAt(null);
                          setPublishedAt((prev) => ({ date: d, time: prev?.time ?? d }));
                        }}
                      />
                    </div>
                    <div>
                      <Typography.Text type="secondary">Giờ</Typography.Text>
                      <TimePicker
                        className="w-full mt-6"
                        value={publishedAt?.time ?? undefined}
                        format="HH:mm"
                        onChange={(t) => {
                          if (!t) return setPublishedAt(null);
                          setPublishedAt((prev) => ({ date: prev?.date ?? t.startOf("day"), time: t }));
                        }}
                      />
                    </div>
                  </div>

                  <Form.Item name="isVisible" valuePropName="checked" className="!mb-0">
                    <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                  </Form.Item>
                </Space>
              </Card>

              <Card className="ah-admin-card" title="Giá">
                <Form.Item name="currentPrice" label="Giá bán" rules={[{ required: true, message: "Vui lòng nhập giá bán." }]}>
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
                <Form.Item name="discountPrice" label="Giá khuyến mãi">
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
              </Card>

              <Card className="ah-admin-card" title="Số lượng bán">
                <Form.Item name="sold" label="Sold" rules={[{ required: true, message: "Vui lòng nhập số lượng bán." }]}>
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
              </Card>

              <Card className="ah-admin-card" title="Danh mục">
                <CategoryTree
                  categories={categories}
                  checkedCategoryIds={checkedCategoryIds}
                  onCheckedCategoryIdsChange={onCheckedCategoryIdsChange}
                />
              </Card>
            </Space>
          </Col>
        </Row>

        <Card className="ah-admin-card">
          <div className="flex justify-end gap-8">
            <Button onClick={onCancel} disabled={isSubmitting || isUploadingImages}>
              Hủy
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isUploadingImages}
            >
              {mode === "create" ? "Tạo sản phẩm" : "Cập nhật"}
            </Button>
          </div>
        </Card>
      </Space>
    </Form>
  );
};
