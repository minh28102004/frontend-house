"use client";

import { type Coupon } from "../services/coupon.service";
import type { ColumnsType } from "antd/es/table";
import { Button, Card, Empty, Space, Switch, Table, Tag, Tooltip, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface Props {
  coupons: Coupon[];
  loading: boolean;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const isExpired = (coupon: Coupon) => new Date(coupon.endDate) < new Date();
const isNotStarted = (coupon: Coupon) => new Date(coupon.startDate) > new Date();

export default function CouponList({ coupons, loading, onEdit, onDelete, onToggle }: Props) {
  const columns: ColumnsType<Coupon> = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (code: string) => (
        <Tag className="font-mono font-bold">{code}</Tag>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 180,
      ellipsis: true,
      render: (name: string, record: Coupon) => (
        <div>
          <Typography.Text strong className="block">{name}</Typography.Text>
          {record.description && (
            <Typography.Text type="secondary" className="text-xs truncate block">
              {record.description}
            </Typography.Text>
          )}
        </div>
      ),
    },
    {
      title: "Giá trị",
      key: "value",
      width: 120,
      render: (_, record: Coupon) => (
        <div>
          <Typography.Text strong>
            {record.type === "percent" ? `${record.value}%` : formatPrice(record.value)}
          </Typography.Text>
          {record.type === "percent" && record.maxDiscountAmount > 0 && (
            <Typography.Text type="secondary" className="text-xs block">
              Max {formatPrice(record.maxDiscountAmount)}
            </Typography.Text>
          )}
        </div>
      ),
    },
    {
      title: "Áp dụng cho",
      dataIndex: "applyTo",
      key: "applyTo",
      width: 120,
      align: "center",
      render: (applyTo: string) => {
        const color = applyTo === "booking" ? "blue" : applyTo === "order" ? "purple" : "green";
        const label = applyTo === "booking" ? "Phòng" : applyTo === "order" ? "Sản phẩm" : "Tất cả";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Thời hạn",
      key: "dateRange",
      width: 160,
      render: (_, record: Coupon) => {
        const expired = isExpired(record);
        const notStarted = isNotStarted(record);
        return (
          <div className="text-xs">
            <div>{formatDate(record.startDate)}</div>
            <div className="text-gray-400">→ {formatDate(record.endDate)}</div>
            {expired && <Tag color="default" className="mt-1">Đã hết hạn</Tag>}
            {notStarted && <Tag color="warning" className="mt-1">Chưa bắt đầu</Tag>}
          </div>
        );
      },
    },
    {
      title: "Đã dùng",
      key: "usage",
      width: 120,
      align: "center",
      render: (_, record: Coupon) => {
        const outOfUses = record.usageLimit > 0 && record.usageCount >= record.usageLimit;
        return (
          <div>
            <Typography.Text strong>
              {record.usageCount}
              {record.usageLimit > 0 && <span className="text-gray-400"> / {record.usageLimit}</span>}
            </Typography.Text>
            {record.usageLimit > 0 && (
              <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                <div
                  className={`h-1 rounded-full ${outOfUses ? "bg-red-400" : "bg-slate-900"}`}
                  style={{ width: `${Math.min(100, (record.usageCount / record.usageLimit) * 100)}%` }}
                />
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      align: "center",
      render: (_, record: Coupon) => {
        const expired = isExpired(record);
        const notStarted = isNotStarted(record);
        const outOfUses = record.usageLimit > 0 && record.usageCount >= record.usageLimit;
        const disabled = expired || notStarted || outOfUses || record.status === "inactive";
        
        return (
          <Switch
            checked={record.status === "active"}
            checkedChildren="Hoạt động"
            unCheckedChildren="Tắt"
            onChange={() => onToggle(record._id)}
            disabled={disabled}
          />
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, record: Coupon) => (
        <Space size={4}>
          <Tooltip title="Sửa">
            <Button
              type="text"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card className="ah-admin-card">
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={coupons}
        loading={loading}
        locale={{ emptyText: <Empty description="Chưa có mã giảm giá nào" /> }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 1100 }}
      />
    </Card>
  );
}
