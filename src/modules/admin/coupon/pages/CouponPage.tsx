"use client";

import { useEffect, useState } from "react";
import {
  App,
  Button,
  Card,
  Space,
  Table,
  Tag,
  Select,
  Input,
  Typography,
  Tooltip,
  Popconfirm,
} from "antd";
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TagOutlined, 
  CheckCircleOutlined, 
  StopOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  couponService,
  type Coupon,
  type CouponStatus,
  type CouponApplyTo,
  type CouponStats,
} from "../services/coupon.service";
import CouponForm from "../components/CouponForm";
import { AdminModal, AdminPageHeader, AdminFilterItem } from "@/modules/admin/common/components/AdminUi";
import dayjs from "dayjs";

const { Text, Title } = Typography;

type FilterStatus = "all" | CouponStatus;
type FilterApplyTo = "all" | CouponApplyTo;

export default function CouponPage() {
  const { message } = App.useApp();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterApplyTo, setFilterApplyTo] = useState<FilterApplyTo>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const LIMIT = 10;

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const filter: { status?: string; applyTo?: string } = {};
      if (filterStatus !== "all") filter.status = filterStatus;
      if (filterApplyTo !== "all") filter.applyTo = filterApplyTo;

      const [listRes, statsRes] = await Promise.all([
        couponService.getAll(page, LIMIT, filter),
        couponService.getStats(),
      ]);

      setCoupons(listRes.items);
      setTotal(listRes.total);
      setStats(statsRes);
    } catch (e: any) {
      message.error(e?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus, filterApplyTo]);

  const handleCreate = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCoupon(null);
    setPage(1);
    fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    try {
      await couponService.delete(id);
      message.success("Đã xóa mã giảm giá thành công");
      fetchCoupons();
    } catch (e: any) {
      message.error(e?.message || "Lỗi khi xóa");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await couponService.toggleStatus(id);
      message.success("Đã cập nhật trạng thái thành công");
      fetchCoupons();
    } catch (e: any) {
      message.error(e?.message || "Lỗi cập nhật trạng thái");
    }
  };

  const columns: ColumnsType<Coupon> = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (code, record) => (
        <Space direction="vertical" size={0}>
          <Text strong className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{code}</Text>
          <Text type="secondary" className="text-[10px] uppercase mt-1">{record.name}</Text>
        </Space>
      ),
    },
    {
      title: "Giá trị giảm",
      key: "value",
      width: 140,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong className="text-lg">
            {record.type === "percent" ? `${record.value}%` : `${record.value.toLocaleString()}₫`}
          </Text>
          {record.type === "percent" && record.maxDiscountAmount > 0 && (
            <Text type="secondary" className="text-[10px]">Tối đa {record.maxDiscountAmount.toLocaleString()}₫</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Thời gian",
      key: "range",
      width: 200,
      render: (_, record) => {
        const isExpired = dayjs(record.endDate).isBefore(dayjs());
        const isNotStarted = dayjs(record.startDate).isAfter(dayjs());
        return (
          <Space direction="vertical" size={2}>
            <div className="flex items-center gap-2 text-xs">
              <HistoryOutlined className="text-gray-400" />
              <span>{dayjs(record.startDate).format("DD/MM/YYYY")} - {dayjs(record.endDate).format("DD/MM/YYYY")}</span>
            </div>
            {isExpired && <Tag color="error" className="!m-0 text-[10px]">Đã hết hạn</Tag>}
            {isNotStarted && <Tag color="warning" className="!m-0 text-[10px]">Chưa bắt đầu</Tag>}
          </Space>
        );
      },
    },
    {
      title: "Sử dụng",
      key: "usage",
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text strong>{record.usageCount} <span className="text-gray-400 text-xs font-normal">/ {record.usageLimit || "∞"}</span></Text>
          <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${record.usageLimit ? Math.min(100, (record.usageCount / record.usageLimit) * 100) : 0}%` }}
            />
          </div>
        </Space>
      ),
    },
    {
      title: "Áp dụng",
      dataIndex: "applyTo",
      key: "applyTo",
      width: 120,
      render: (val: CouponApplyTo) => {
        const config = {
          all: { label: "Tất cả", color: "blue" },
          booking: { label: "Phòng", color: "purple" },
          order: { label: "Sản phẩm", color: "orange" },
        };
        return <Tag color={config[val].color} className="!mr-0">{config[val].label}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status, record) => {
        const isActive = status === "active" && dayjs().isBetween(dayjs(record.startDate), dayjs(record.endDate));
        return (
          <Tooltip title={status === "active" ? "Bấm để tạm dừng" : "Bấm để kích hoạt"}>
            <Button 
              type="text" 
              size="small" 
              onClick={() => handleToggle(record._id)}
              icon={isActive ? <CheckCircleOutlined className="text-green-500" /> : <StopOutlined className="text-red-400" />}
              className={isActive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}
            >
              {status === "active" ? "Hoạt động" : "Tạm dừng"}
            </Button>
          </Tooltip>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xóa mã giảm giá này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Chiến dịch Marketing"
        title="Quản lý Mã giảm giá"
        description="Tạo và quản lý các chương trình ưu đãi, mã giảm giá dành cho khách hàng đặt phòng hoặc mua sản phẩm."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo mã mới
          </Button>
        }
      />

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Tổng mã" value={stats.total} icon={<TagOutlined />} color="blue" />
          <StatCard title="Hoạt động" value={stats.active} icon={<CheckCircleOutlined />} color="green" />
          <StatCard title="Vô hiệu" value={stats.inactive} icon={<StopOutlined />} color="gray" />
          <StatCard title="Hết hạn" value={stats.expired} icon={<HistoryOutlined />} color="red" />
        </div>
      )}

      <Card className="ah-admin-card ah-admin-card-static" styles={{ body: { paddingBottom: 16 } }}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_180px_auto] md:items-end">
          <AdminFilterItem label="Trạng thái">
            <Select
              value={filterStatus}
              onChange={(val) => { setFilterStatus(val); setPage(1); }}
              className="w-full ah-admin-antd-select"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Hoạt động", value: "active" },
                { label: "Vô hiệu", value: "inactive" },
              ]}
            />
          </AdminFilterItem>
          <AdminFilterItem label="Áp dụng">
            <Select
              value={filterApplyTo}
              onChange={(val) => { setFilterApplyTo(val); setPage(1); }}
              className="w-full ah-admin-antd-select"
              options={[
                { label: "Tất cả loại", value: "all" },
                { label: "Đặt phòng", value: "booking" },
                { label: "Sản phẩm", value: "order" },
              ]}
            />
          </AdminFilterItem>
          <div className="flex items-end pb-1">
            <Text type="secondary" className="text-xs">
              {loading ? "Đang tải..." : `Hiển thị ${coupons.length} / ${total} mã`}
            </Text>
          </div>
        </div>
      </Card>

      <Card className="ah-admin-card">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={coupons}
          loading={loading}
          pagination={{
            current: page,
            pageSize: LIMIT,
            total,
            onChange: setPage,
            showSizeChanger: false,
          }}
        />
      </Card>

      <AdminModal
        title={editingCoupon ? "Cập nhật mã giảm giá" : "Tạo mã giảm giá mới"}
        open={showForm}
        onCancel={() => { setShowForm(false); setEditingCoupon(null); }}
        footer={null}
        width={560}
        destroyOnClose
      >
        <CouponForm
          coupon={editingCoupon}
          onSuccess={handleFormSuccess}
          onClose={() => { setShowForm(false); setEditingCoupon(null); }}
        />
      </AdminModal>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    gray: "bg-gray-50 text-gray-500 border-gray-200",
    red: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <div className={`p-4 rounded-xl border ${colorMap[color]} flex items-center justify-between`}>
      <div>
        <Text className="text-xs uppercase font-semibold opacity-70 block mb-1">{title}</Text>
        <Title level={3} className="!m-0 !leading-none">{value}</Title>
      </div>
      <div className="text-2xl opacity-40">{icon}</div>
    </div>
  );
}
