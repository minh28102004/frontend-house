"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ColumnsType } from "antd/es/table";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Drawer,
  Empty,
  Input,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import {
  AdminPageHeader,
  AdminThumbnail,
  AdminFilterItem,
} from "@/modules/admin/common/components/AdminUi";
import { AdminOrder, AdminOrdersService } from "../services/orders.service";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
};

type OrderItem = AdminOrder["items"][number];

export default function OrdersList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [data, setData] = useState<{ items: AdminOrder[]; totalPages: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await AdminOrdersService.list(page, limit);
      setData({ items: res.items, totalPages: res.totalPages, total: res.total });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi khi tải đơn hàng";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredOrders = useMemo(() => {
    const source = data?.items || [];
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return source;
    return source.filter((order) => {
      const id = order._id.toLowerCase();
      const fullName = order.customer?.fullName?.toLowerCase() || "";
      const phone = order.customer?.phone?.toLowerCase() || "";
      const email = order.customer?.email?.toLowerCase() || "";
      return id.includes(keyword) || fullName.includes(keyword) || phone.includes(keyword) || email.includes(keyword);
    });
  }, [data?.items, searchKeyword]);

  const orderColumns: ColumnsType<AdminOrder> = useMemo(
    () => [
      {
        title: "Mã",
        dataIndex: "_id",
        key: "id",
        width: 104,
        align: "center",
        render: (id: string) => <Typography.Text code>{id.slice(-8)}</Typography.Text>,
      },
      {
        title: "Khách hàng",
        key: "customer",
        render: (_, order) => (
          <div className="min-w-0">
            <p className="ah-admin-table-main">{order.customer?.fullName || "Khách chưa cập nhật"}</p>
            <p className="ah-admin-table-sub max-w-[320px]">{order.customer?.address || "Chưa có địa chỉ"}</p>
          </div>
        ),
      },
      {
        title: "SĐT",
        key: "phone",
        dataIndex: ["customer", "phone"],
        width: 130,
        render: (phone: string) => phone || "—",
      },
      {
        title: "Số SP",
        key: "items",
        width: 90,
        align: "center",
        render: (_, order) => order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
      },
      {
        title: "Tổng",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 140,
        align: "right",
        render: (totalPrice: number) => <span className="font-semibold">{formatPrice(totalPrice)}</span>,
      },
      {
        title: "Thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        width: 130,
        render: (method: string) => <Tag>{method || "—"}</Tag>,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 190,
        render: (value: string) => formatDateTime(value),
      },
      {
        title: "Chi tiết",
        key: "actions",
        width: 120,
        align: "center",
        render: (_, order) => (
          <Space size={4}>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => setSelectedOrder(order)}
                aria-label="Xem chi tiết đơn hàng"
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [],
  );

  const orderItemColumns: ColumnsType<OrderItem> = useMemo(
    () => [
      {
        title: "#",
        key: "index",
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
      },
      {
        title: "Ảnh",
        key: "productThumbnail",
        width: 90,
        align: "center",
        render: (_, item) => (
          <AdminThumbnail
            src={item.productThumbnail}
            alt={item.productName}
            aspect="portrait"
            className="mx-auto w-14"
            fallbackLabel={item.productName}
          />
        ),
      },
      {
        title: "Tên sản phẩm",
        key: "productName",
        render: (_, item) => (
          <div className="min-w-0">
            <p className="ah-admin-table-main max-w-[240px]">{item.productName}</p>
            {item.productSlug ? (
              <Link
                href={`/san-pham/${item.productSlug}`}
                target="_blank"
                className="ah-admin-table-sub inline-flex items-center gap-1 hover:text-[var(--ah-primary-hover)]"
              >
                /san-pham/{item.productSlug}
              </Link>
            ) : null}
          </div>
        ),
      },
      {
        title: "Size",
        dataIndex: "size",
        key: "size",
        width: 90,
        align: "center",
        render: (size: string) => size || "—",
      },
      {
        title: "Đơn giá",
        dataIndex: "price",
        key: "price",
        width: 120,
        align: "right",
        render: (price: number) => formatPrice(price),
      },
      {
        title: "SL",
        dataIndex: "quantity",
        key: "quantity",
        width: 70,
        align: "center",
      },
      {
        title: "Thành tiền",
        key: "lineTotal",
        width: 140,
        align: "right",
        render: (_, item) => <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>,
      },
    ],
    [],
  );

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Điều phối vận hành"
        title="Đơn hàng"
        description="Danh sách đơn từ checkout, theo dõi nhanh người đặt, giá trị đơn và chi tiết sản phẩm để vận hành thuận tiện."
      />

      <Card className="ah-admin-card ah-admin-card-static" styles={{ body: { paddingBottom: 16 } }}>
        <AdminFilterItem label="Tìm kiếm">
          <Input.Search
            placeholder="Tìm theo mã đơn, tên khách, email hoặc số điện thoại..."
            value={searchKeyword}
            className="w-full ah-admin-antd-search"
            onChange={(event) => setSearchKeyword(event.target.value)}
            allowClear
          />
        </AdminFilterItem>
        <Typography.Text type="secondary" className="text-xs">
          {loading ? "Đang tải danh sách..." : `Hiển thị ${filteredOrders.length} / ${data?.total || 0} đơn`}
        </Typography.Text>
      </Card>

      <Card className="ah-admin-card">
        {error ? (
          <Alert type="error" showIcon message={error} />
        ) : !loading && filteredOrders.length === 0 ? (
          <Empty description="Chưa có đơn hàng phù hợp" />
        ) : (
          <Table
            rowKey={(order) => order._id}
            columns={orderColumns}
            dataSource={filteredOrders}
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total: data?.total || 0,
              showSizeChanger: false,
              onChange: setPage,
            }}
          />
        )}
      </Card>

      <Drawer
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title="Chi tiết đơn hàng"
        width={920}
        destroyOnClose
      >
        {selectedOrder ? (
          <Space direction="vertical" size={16} className="w-full">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã đơn" span={2}>
                {selectedOrder._id}
              </Descriptions.Item>
              <Descriptions.Item label="Khách hàng">{selectedOrder.customer?.fullName || "Khách chưa cập nhật"}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedOrder.customer?.phone || "—"}</Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{formatDateTime(selectedOrder.createdAt)}</Descriptions.Item>
              <Descriptions.Item label="Tổng tiền" span={2}>
                <strong>{formatPrice(selectedOrder.totalPrice)}</strong>
              </Descriptions.Item>
              {selectedOrder.note ? (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {selectedOrder.note}
                </Descriptions.Item>
              ) : null}
              <Descriptions.Item label="Địa chỉ giao nhận" span={2}>
                {[
                  selectedOrder.customer?.address,
                  selectedOrder.customer?.ward,
                  selectedOrder.customer?.district,
                  selectedOrder.customer?.province,
                ]
                  .filter(Boolean)
                  .join(", ") || "Chưa có địa chỉ"}
              </Descriptions.Item>
            </Descriptions>

            <Card className="ah-admin-card" title="Danh sách sản phẩm">
              <Table
                rowKey={(item, index) => `${selectedOrder._id}-${item.productId}-${index}`}
                columns={orderItemColumns}
                dataSource={selectedOrder.items || []}
                pagination={false}
              />
            </Card>

            <Space>
              <Button onClick={() => setSelectedOrder(null)}>Đóng</Button>
            </Space>
          </Space>
        ) : null}
      </Drawer>
    </div>
  );
}
