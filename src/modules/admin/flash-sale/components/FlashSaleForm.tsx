"use client";

import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  InputNumber, 
  DatePicker, 
  Switch, 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Checkbox,
  App,
  Divider,
  Tag
} from "antd";
import { 
  SaveOutlined, 
  ArrowLeftOutlined, 
  InfoCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { FlashSale } from "../models/flash-sale.model";
import { useFlashSale } from "../hooks/useFlashSale";
import { Product } from "@/modules/admin/products/models/product.model";

const { Text, Paragraph } = Typography;

interface FlashSaleFormProps {
  initialData?: FlashSale;
  mode: "create" | "edit";
  onSubmit: (flashSaleData: Partial<FlashSale>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FlashSaleForm: React.FC<FlashSaleFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const { products } = useFlashSale();
  const { message } = App.useApp();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        range: [
          initialData.startDate ? dayjs(initialData.startDate) : undefined,
          initialData.endDate ? dayjs(initialData.endDate) : undefined,
        ],
        discountPercentage: initialData.discountPercentage || 0,
        maxQuantity: initialData.maxQuantity || 0,
        isActive: initialData.isActive ?? true,
        products: initialData.products?.map((p: any) => typeof p === "string" ? p : p._id) || [],
      });
    } else {
      const now = dayjs();
      form.setFieldsValue({
        range: [now, now.add(1, "day").endOf("day")],
        isActive: true,
        discountPercentage: 0,
        maxQuantity: 0,
      });
    }
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    const { range, ...rest } = values;
    
    if (!range || range.length < 2) {
      message.error("Vui lòng chọn thời gian bắt đầu và kết thúc");
      return;
    }

    if (values.products.length === 0) {
      message.error("Vui lòng chọn ít nhất một sản phẩm tham gia");
      return;
    }

    const flashSaleData: Partial<FlashSale> = {
      ...rest,
      startDate: range[0].toISOString(),
      endDate: range[1].toISOString(),
      name: values.name.trim(),
    };

    await onSubmit(flashSaleData);
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
          <Col xs={24} lg={14}>
            <Card className="ah-admin-card" title="Thông tin cơ bản">
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    name="name"
                    label="Tên chương trình"
                    rules={[{ required: true, message: "Vui lòng nhập tên chương trình" }]}
                  >
                    <Input placeholder="Ví dụ: Flash Sale Cuối Tuần" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="description" label="Mô tả">
                    <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về chương trình (nếu có)..." />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card className="ah-admin-card mt-6" title="Sản phẩm tham gia">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center mb-2">
                  <Text type="secondary" className="text-xs">Chọn các sản phẩm áp dụng giảm giá</Text>
                  <Form.Item name="products" noStyle>
                    <Text strong className="text-blue-600">Đã chọn: {form.getFieldValue("products")?.length || 0}</Text>
                  </Form.Item>
                </div>
                
                <Form.Item 
                  name="products" 
                  rules={[{ required: true, message: "Chọn ít nhất 1 sản phẩm" }]}
                  className="!mb-0"
                >
                  <Checkbox.Group className="w-full">
                    <div className="max-h-[360px] overflow-y-auto border rounded-lg divide-y bg-gray-50/50">
                      {products.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">Không có sản phẩm nào</div>
                      ) : (
                        products.map((product: Product) => (
                          <div 
                            key={product._id} 
                            className="flex items-center gap-3 p-3 hover:bg-white transition-colors group"
                          >
                            <Checkbox value={product._id} className="!mr-0" />
                            <div className="w-12 h-12 rounded border overflow-hidden bg-white shrink-0">
                              <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Text strong className="block truncate text-sm">{product.name}</Text>
                              <Text type="secondary" className="text-xs">
                                {product.currentPrice?.toLocaleString("vi-VN")} VNĐ
                              </Text>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Tag color="blue">Chọn</Tag>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </Checkbox.Group>
                </Form.Item>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card className="ah-admin-card" title="Thời gian & Cài đặt">
              <Space direction="vertical" className="w-full" size={20}>
                <Form.Item
                  name="range"
                  label="Thời gian diễn ra"
                  rules={[{ required: true, message: "Vui lòng chọn thời gian" }]}
                >
                  <DatePicker.RangePicker 
                    className="w-full" 
                    showTime 
                    format="DD/MM/YYYY HH:mm"
                    placeholder={["Bắt đầu", "Kết thúc"]}
                  />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    name="discountPercentage"
                    label="Giảm giá (%)"
                    rules={[{ required: true, message: "Nhập % giảm" }]}
                  >
                    <InputNumber min={0} max={100} className="w-full" formatter={value => `${value}%`} parser={value => value!.replace('%', '')} />
                  </Form.Item>
                  <Form.Item
                    name="maxQuantity"
                    label="Giới hạn số lượng"
                  >
                    <InputNumber min={0} className="w-full" placeholder="0 = Không giới hạn" />
                  </Form.Item>
                </div>

                <Divider className="!m-0" />

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <InfoCircleOutlined className="text-blue-500" />
                    <Text strong>Kích hoạt ngay</Text>
                  </div>
                  <Form.Item name="isActive" valuePropName="checked" className="!mb-0">
                    <Switch />
                  </Form.Item>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-xs text-gray-500 flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <CheckCircleOutlined className="mt-0.5 text-green-500" />
                    <span>Hệ thống sẽ tự động hiển thị giá giảm trong thời gian đã định.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleOutlined className="mt-0.5 text-green-500" />
                    <span>Giá sau giảm = Giá gốc × (1 - % giảm).</span>
                  </div>
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
            {mode === "create" ? "Tạo chương trình" : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </Form>
  );
};
