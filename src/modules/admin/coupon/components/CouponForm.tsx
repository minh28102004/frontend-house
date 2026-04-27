"use client";

import React, { useEffect, useState } from "react";
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker, 
  Button, 
  Row, 
  Col, 
  App
} from "antd";
import { 
  SaveOutlined, 
  InfoCircleOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";
import { 
  couponService, 
  type Coupon, 
  type CreateCouponPayload,
  type CouponType
} from "../services/coupon.service";

interface Props {
  coupon: Coupon | null;
  onSuccess: () => void;
  onClose: () => void;
}

export default function CouponForm({ coupon, onSuccess, onClose }: Props) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<CouponType>("percent");

  useEffect(() => {
    if (coupon) {
      setType(coupon.type);
      form.setFieldsValue({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        maxDiscountAmount: coupon.maxDiscountAmount,
        minOrderAmount: coupon.minOrderAmount,
        usageLimit: coupon.usageLimit,
        applyTo: coupon.applyTo,
        range: [dayjs(coupon.startDate), dayjs(coupon.endDate)],
      });
    } else {
      form.setFieldsValue({
        type: "percent",
        applyTo: "all",
        usageLimit: 0,
        minOrderAmount: 0,
        range: [dayjs(), dayjs().add(7, "day")],
      });
    }
  }, [coupon, form]);

  const onFinish = async (values: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { range, ...rest } = values;
      const payload: CreateCouponPayload = {
        ...rest,
        startDate: (range as dayjs.Dayjs[])[0].toISOString(),
        endDate: (range as dayjs.Dayjs[])[1].toISOString(),
      } as CreateCouponPayload;

      if (coupon) {
        await couponService.update(coupon._id, payload);
        message.success("Cập nhật mã giảm giá thành công");
      } else {
        await couponService.create(payload);
        message.success("Tạo mã giảm giá mới thành công");
      }
      onSuccess();
    } catch (e: unknown) {
      message.error((e as Error)?.message || "Thao tác thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onValuesChange={(changed: Record<string, unknown>) => {
        if (changed.type) setType(changed.type as CouponType);
      }}
      className="ah-admin-form"
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="code"
            label="Mã giảm giá (Code)"
            rules={[
              { required: true, message: "Nhập mã giảm giá" },
              { pattern: /^[A-Z0-9_]+$/, message: "Chỉ cho phép chữ in hoa, số và dấu gạch dưới" }
            ]}
          >
            <Input 
              placeholder="VD: GIAMGIA10, WELLCOME_2024" 
              className="font-mono uppercase" 
              disabled={!!coupon}
            />
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Form.Item
            name="name"
            label="Tên chương trình"
            rules={[{ required: true, message: "Nhập tên chương trình" }]}
          >
            <Input placeholder="VD: Khuyến mãi chào hè" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="type" label="Loại giảm giá" rules={[{ required: true }]}>
            <Select options={[
              { label: "Phần trăm (%)", value: "percent" },
              { label: "Số tiền cố định (VND)", value: "fixed" },
            ]} />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="value"
            label={type === "percent" ? "Phần trăm giảm" : "Số tiền giảm"}
            rules={[{ required: true, message: "Nhập giá trị giảm" }]}
          >
            <InputNumber 
              className="w-full" 
              min={1} 
              max={type === "percent" ? 100 : undefined}
              formatter={type === "percent" ? value => `${value}%` : undefined}
            />
          </Form.Item>
        </Col>

        {type === "percent" && (
          <Col span={24}>
            <Form.Item name="maxDiscountAmount" label="Số tiền giảm tối đa (Tùy chọn)">
              <InputNumber 
                className="w-full" 
                min={0} 
                placeholder="VD: 50.000"
                formatter={(value: string | number | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: string | undefined) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        )}

        <Col span={24}>
          <Form.Item name="range" label="Thời gian hiệu lực" rules={[{ required: true }]}>
            <DatePicker.RangePicker className="w-full" showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="applyTo" label="Áp dụng cho" rules={[{ required: true }]}>
            <Select options={[
              { label: "Tất cả", value: "all" },
              { label: "Đặt phòng (Booking)", value: "booking" },
              { label: "Sản phẩm (Order)", value: "order" },
            ]} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="usageLimit" label="Lượt dùng tối đa">
            <InputNumber className="w-full" min={0} placeholder="0 = Không giới hạn" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="minOrderAmount" label="Đơn hàng tối thiểu để áp dụng">
            <InputNumber 
              className="w-full" 
              min={0}
              formatter={(value: string | number | undefined) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="description" label="Ghi chú thêm">
            <Input.TextArea rows={2} placeholder="Nội dung hiển thị cho khách hàng..." />
          </Form.Item>
        </Col>
      </Row>

      <div className="p-4 bg-blue-50 rounded-lg text-xs text-blue-700 flex gap-2 mb-6">
        <InfoCircleOutlined className="mt-0.5" />
        <div>
          Mã giảm giá sẽ có hiệu lực ngay khi đến thời gian bắt đầu. Khách hàng có thể nhập mã này tại trang thanh toán.
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          type="primary" 
          htmlType="submit" 
          icon={<SaveOutlined />} 
          loading={loading}
        >
          {coupon ? "Cập nhật mã" : "Tạo mã giảm giá"}
        </Button>
      </div>
    </Form>
  );
}
