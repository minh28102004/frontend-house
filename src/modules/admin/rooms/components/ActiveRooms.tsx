"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { App, Button, Card, Collapse, Empty, Popconfirm, Space, Statistic, Table, Tag, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined, ReloadOutlined, UserOutlined } from "@ant-design/icons";
import { BookingStatus, RoomBooking } from "../types/booking.types";
import { BookingService } from "../services/booking.service";

type ActiveRoom = {
  concept: string;
  roomName: string;
  bookings: RoomBooking[];
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Chờ xác nhận",
  pending_payment: "Chờ thanh toán",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
  completed: "Hoàn thành",
};

const ActiveRooms = () => {
  const { message } = App.useApp();
  const [rooms, setRooms] = useState<ActiveRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const fetchActiveRooms = async () => {
    setLoading(true);
    try {
      const data = await BookingService.getActiveRooms();
      setRooms(data);
    } catch {
      message.error("Không thể tải danh sách phòng đang sử dụng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveRooms();
  }, []);

  const handleComplete = async (bookingId: string) => {
    setCompletingId(bookingId);
    try {
      await BookingService.update(bookingId, { status: "completed" });
      await fetchActiveRooms();
      message.success("Đã đánh dấu booking hoàn thành.");
    } catch {
      message.error("Không thể cập nhật trạng thái booking.");
    } finally {
      setCompletingId(null);
    }
  };

  const isToday = (dateStr: string) => {
    const date = new Date(`${dateStr}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const isPast = (dateStr: string) => {
    const date = new Date(`${dateStr}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN").format(price);

  const statusTag = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return <Tag color="green">{STATUS_LABELS[status]}</Tag>;
      case "pending":
        return <Tag color="gold">{STATUS_LABELS[status]}</Tag>;
      case "pending_payment":
        return <Tag color="orange">{STATUS_LABELS[status]}</Tag>;
      case "completed":
        return <Tag color="blue">{STATUS_LABELS[status]}</Tag>;
      case "cancelled":
        return <Tag color="red">{STATUS_LABELS[status]}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const bookingColumns: ColumnsType<RoomBooking> = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value: BookingStatus) => statusTag(value),
    },
    {
      title: "Khách",
      key: "guest",
      width: 260,
      render: (_, b) => (
        <div className="min-w-0">
          <Typography.Text strong className="!block">
            {b.guestName}
          </Typography.Text>
          <Typography.Text type="secondary" className="!block !text-xs" ellipsis>
            {b.guestPhone} • {b.guestEmail}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Check-in",
      dataIndex: "checkInDate",
      key: "checkInDate",
      width: 120,
      render: (v: string) => <Typography.Text type="secondary">{formatDate(v)}</Typography.Text>,
    },
    {
      title: "Check-out",
      dataIndex: "checkOutDate",
      key: "checkOutDate",
      width: 120,
      render: (v: string) => <Typography.Text type="secondary">{formatDate(v)}</Typography.Text>,
    },
    {
      title: "Khách",
      dataIndex: "numberOfGuests",
      key: "numberOfGuests",
      width: 90,
      align: "right",
      render: (v: number) => <Typography.Text type="secondary">{v}</Typography.Text>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 130,
      align: "right",
      render: (v: number) => <Typography.Text>{formatPrice(v)}đ</Typography.Text>,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 120,
      render: (v?: string) => (v ? <Tag>{v}</Tag> : <Typography.Text type="secondary">—</Typography.Text>),
    },
    {
      title: "Tài khoản",
      key: "accountUser",
      width: 260,
      render: (_, b) =>
        b.accountUser ? (
          <div className="min-w-0">
            <Typography.Text className="!block" ellipsis>
              <UserOutlined /> {b.accountUser.fullName?.trim() || b.accountUser.email}
            </Typography.Text>
            <Typography.Text type="secondary" className="!block !text-xs" ellipsis>
              {b.accountUser.email}
              {b.accountUser.role ? ` · ${b.accountUser.role}` : ""}
            </Typography.Text>
            <Typography.Text type="secondary" className="!block !text-xs">
              User ID: {b.accountUser.id}
            </Typography.Text>
            <Link href="/admin/users">Mở quản lý người dùng</Link>
          </div>
        ) : (
          <Typography.Text type="secondary" className="!text-xs">
            Không có user trùng email khách ({b.guestEmail})
          </Typography.Text>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, b) => (
        <Popconfirm
          title="Đánh dấu booking hoàn thành?"
          description="Phòng sẽ rời khỏi danh sách đang sử dụng."
          okText="Hoàn thành"
          cancelText="Hủy"
          onConfirm={() => handleComplete(b._id)}
          okButtonProps={{ loading: completingId === b._id }}
          disabled={b.status === "completed" || b.status === "cancelled"}
        >
          <Tooltip title="Hoàn thành">
            <Button
              type="text"
              shape="circle"
              icon={<CheckCircleOutlined />}
              disabled={b.status === "completed" || b.status === "cancelled"}
              loading={completingId === b._id}
            />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} className="w-full">
      <Card
        className="ah-admin-card"
        title="Phòng đang sử dụng"
        extra={
          <Button icon={<ReloadOutlined />} onClick={fetchActiveRooms} loading={loading}>
            Làm mới
          </Button>
        }
      >
        <Space wrap size={16}>
          <Statistic title="Phòng active" value={rooms.length} />
          <Statistic title="Tổng booking" value={rooms.reduce((sum, r) => sum + r.bookings.length, 0)} />
          <Statistic
            title="Tổng doanh thu chờ"
            value={`${formatPrice(rooms.reduce((sum, r) => sum + r.bookings.reduce((s, b) => s + (b.totalPrice || 0), 0), 0))}đ`}
          />
        </Space>
      </Card>

      {loading ? (
        <Card className="ah-admin-card">
          <Typography.Text type="secondary">Đang tải phòng đang sử dụng...</Typography.Text>
        </Card>
      ) : rooms.length === 0 ? (
        <Card className="ah-admin-card">
          <Empty description="Không có phòng đang sử dụng" />
        </Card>
      ) : (
        <Collapse
          accordion
          items={rooms.map((r) => {
            const roomRevenue = r.bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const currentBookings = r.bookings.filter(
              (b) => b.status === "confirmed" && !isPast(b.checkInDate) && !isPast(b.checkOutDate),
            );

            return {
              key: r.concept,
              label: (
                <div className="flex flex-wrap items-center justify-between gap-12">
                  <div className="min-w-0">
                    <Typography.Text strong className="!block">
                      {r.roomName}
                    </Typography.Text>
                    <Typography.Text type="secondary" className="!text-xs">
                      {r.concept}
                    </Typography.Text>
                  </div>
                  <Space wrap size={8}>
                    <Tag>{r.bookings.length} booking</Tag>
                    {currentBookings.length > 0 && <Tag color="green">{currentBookings.length} đang ở</Tag>}
                    <Tag color="blue">{formatPrice(roomRevenue)}đ</Tag>
                  </Space>
                </div>
              ),
              children: (
                <Table<RoomBooking>
                  rowKey="_id"
                  size="small"
                  columns={bookingColumns}
                  dataSource={r.bookings}
                  pagination={false}
                  scroll={{ x: 1200 }}
                />
              ),
            };
          })}
        />
      )}
    </Space>
  );
};

export default ActiveRooms;
