"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  App,
  Button,
  Descriptions,
  Drawer,
  Empty,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";
import {
  AdminStatusBadge,
} from "@/modules/admin/common/components/AdminUi";
import { BookingStatus, RoomBooking } from "../types/booking.types";

interface Props {
  bookings: RoomBooking[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onCancelBooking: (id: string) => void;
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Chờ xác nhận",
  pending_payment: "Chờ thanh toán",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
  completed: "Hoàn thành",
};

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const ListBookings: React.FC<Props> = ({
  bookings,
  loading,
  pagination,
  onPageChange,
  onUpdateStatus,
  onCancelBooking,
}) => {
  const { message } = App.useApp();
  const [selectedBooking, setSelectedBooking] = useState<RoomBooking | null>(null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN").format(price);

  const handleStatusChange = useCallback(
    async (booking: RoomBooking, newStatus: BookingStatus) => {
      if (booking.status === newStatus) return;
      await onUpdateStatus(booking._id, newStatus);
      message.success(`Đã cập nhật trạng thái: ${STATUS_LABELS[newStatus]}.`);
    },
    [message, onUpdateStatus],
  );

  const handleCancelBooking = useCallback(
    async (booking: RoomBooking) => {
      await onCancelBooking(booking._id);
      message.success("Đã hủy booking.");
    },
    [message, onCancelBooking],
  );

  const columns: ColumnsType<RoomBooking> = useMemo(
    () => [
      {
        title: "STT",
        align: "center",
        width: 72,
        render: (_, __, index) => (
          <span className="font-semibold text-[var(--ah-muted)]">
            {(pagination.page - 1) * pagination.limit + index + 1}
          </span>
        ),
      },
      {
        title: "Khách lưu trú",
        dataIndex: "guestName",
        key: "guest",
        render: (_, booking) => (
          <div className="min-w-0 space-y-1">
            <p className="ah-admin-table-main max-w-[240px]">{booking.guestName}</p>
            <p className="ah-admin-table-sub max-w-[240px]">{booking.guestEmail}</p>
            <p className="ah-admin-table-sub">{booking.guestPhone}</p>
          </div>
        ),
      },
      {
        title: "Phòng",
        dataIndex: "roomName",
        key: "room",
        render: (_, booking) => (
          <div className="min-w-0 space-y-1">
            <p className="ah-admin-table-main max-w-[220px]">{booking.roomName}</p>
            <p className="ah-admin-table-sub max-w-[220px]">
              {booking.numberOfGuests} khách • {booking.concept}
            </p>
          </div>
        ),
      },
      {
        title: "Nhận phòng",
        dataIndex: "checkInDate",
        key: "checkInDate",
        width: 130,
        align: "center",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Trả phòng",
        dataIndex: "checkOutDate",
        key: "checkOutDate",
        width: 130,
        align: "center",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Tổng giá",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 130,
        align: "right",
        render: (value: number) => <span className="font-semibold">{formatPrice(value)}đ</span>,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 210,
        align: "center",
        render: (_, booking) => (
          <div className="mx-auto max-w-[190px]">
            <Select
              options={statusOptions}
              value={booking.status}
              onChange={(value) => handleStatusChange(booking, value as BookingStatus)}
              className="w-full"
            />
          </div>
        ),
      },
      {
        title: "Hành động",
        key: "actions",
        width: 130,
        align: "center",
        render: (_, booking) => (
          <Space size={6}>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => setSelectedBooking(booking)}
                aria-label="Xem chi tiết booking"
              />
            </Tooltip>
            {booking.status === "pending" ? (
              <Popconfirm
                title="Hủy booking này?"
                okText="Hủy booking"
                cancelText="Thoát"
                okButtonProps={{ danger: true }}
                onConfirm={() => handleCancelBooking(booking)}
              >
                <Tooltip title="Hủy booking">
                  <Button
                    type="text"
                    danger
                    shape="circle"
                    icon={<CloseCircleOutlined />}
                    aria-label="Hủy booking"
                  />
                </Tooltip>
              </Popconfirm>
            ) : null}
          </Space>
        ),
      },
    ],
    [handleCancelBooking, handleStatusChange, pagination.limit, pagination.page],
  );

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <div className="ah-admin-table-card p-2">
        {bookings.length === 0 && !loading ? (
          <div className="p-4">
            <Empty description="Chưa có lịch đặt phù hợp" />
          </div>
        ) : (
          <Table
            rowKey={(booking) => booking._id}
            columns={columns}
            dataSource={bookings}
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: false,
              onChange: onPageChange,
            }}
            className="ah-admin-antd-table"
          />
        )}
      </div>

      <Drawer
        title="Chi tiết booking"
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        width={640}
        destroyOnClose
      >
        {selectedBooking ? (
          <Space direction="vertical" size={16} className="w-full">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Khách lưu trú">{selectedBooking.guestName}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedBooking.guestEmail}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedBooking.guestPhone}</Descriptions.Item>
              <Descriptions.Item label="Phòng">{selectedBooking.roomName}</Descriptions.Item>
              <Descriptions.Item label="Concept">{selectedBooking.concept}</Descriptions.Item>
              <Descriptions.Item label="Nhận phòng">{formatDate(selectedBooking.checkInDate)}</Descriptions.Item>
              <Descriptions.Item label="Trả phòng">{formatDate(selectedBooking.checkOutDate)}</Descriptions.Item>
              <Descriptions.Item label="Số khách">{selectedBooking.numberOfGuests} khách</Descriptions.Item>
              <Descriptions.Item label="Tổng giá">{formatPrice(selectedBooking.totalPrice)}đ</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <AdminStatusBadge
                  status={selectedBooking.status}
                  label={STATUS_LABELS[selectedBooking.status]}
                />
              </Descriptions.Item>
            </Descriptions>

            <Space>
              {selectedBooking.status === "pending" ? (
                <Popconfirm
                  title="Hủy booking này?"
                  okText="Hủy booking"
                  cancelText="Thoát"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleCancelBooking(selectedBooking)}
                >
                  <Button danger icon={<CloseCircleOutlined />}>
                    Hủy booking
                  </Button>
                </Popconfirm>
              ) : null}
              <Button onClick={() => setSelectedBooking(null)}>Đóng</Button>
            </Space>
          </Space>
        ) : null}
      </Drawer>
    </div>
  );
};

export default ListBookings;
