"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  BellOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  MailOutlined,
  SettingOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Dropdown, Empty, Spin, Tag, Typography } from "antd";
import { useUnreadCount, useNotifications } from "@/store/notifications";
import { Notification, NotificationCategory } from "../services/notification.service";
import { formatDistanceToNow } from "@/common/utils/formatDate";

const categoryMeta: Record<NotificationCategory, { label: string; icon: React.ReactNode; color: string }> = {
  [NotificationCategory.ORDER]: {
    label: "Đơn dịch vụ",
    icon: <ShoppingOutlined />,
    color: "blue",
  },
  [NotificationCategory.BOOKING]: {
    label: "Đặt phòng",
    icon: <CalendarOutlined />,
    color: "gold",
  },
  [NotificationCategory.USER]: {
    label: "Tài khoản",
    icon: <UserOutlined />,
    color: "geekblue",
  },
  [NotificationCategory.CONTACT]: {
    label: "Liên hệ",
    icon: <MailOutlined />,
    color: "purple",
  },
  [NotificationCategory.PAYMENT]: {
    label: "Thanh toán",
    icon: <CreditCardOutlined />,
    color: "green",
  },
  [NotificationCategory.SYSTEM]: {
    label: "Hệ thống",
    icon: <SettingOutlined />,
    color: "default",
  },
};

interface NotificationBellProps {
  className?: string;
}

const NotificationItem = ({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: (notification: Notification) => Promise<void>;
}) => {
  const meta = categoryMeta[notification.category] ?? categoryMeta[NotificationCategory.SYSTEM];

  return (
    <button type="button" onClick={() => onClick(notification)} className="ah-admin-notification-item">
      <div className="flex items-start gap-3">
        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#f5f5f5] text-[14px]">
          {meta.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <Tag color={meta.color} className="!m-0 !text-[10px] !leading-5">
              {meta.label}
            </Tag>
            {!notification.isRead ? <Badge status="processing" /> : null}
          </span>
          <span className="mt-1 block line-clamp-1 text-left text-sm font-medium text-[#141414]">
            {notification.title}
          </span>
          {notification.message ? (
            <span className="mt-0.5 block line-clamp-2 text-left text-xs text-[rgba(0,0,0,0.45)]">
              {notification.message}
            </span>
          ) : null}
          <span className="mt-1.5 block text-left text-xs text-[rgba(0,0,0,0.45)]">
            {formatDistanceToNow(new Date(notification.createdAt))}
          </span>
        </span>
      </div>
    </button>
  );
};

export const NotificationBell: React.FC<NotificationBellProps> = ({ className = "" }) => {
  const [open, setOpen] = useState(false);
  const { unreadCount, refetch: refetchUnreadCount } = useUnreadCount();
  const { notifications, markAsRead, markAllAsRead, isLoading, refetch: refetchNotifications } = useNotifications({
    limit: 8,
    forAdmin: true,
  });

  const hasItems = notifications.length > 0;

  const overlayNode = useMemo(
    () => (
      <section className="ah-admin-notification-panel">
        <header className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-3">
          <Typography.Title level={5} className="!m-0 !text-[16px]">
            Thông báo
          </Typography.Title>
          {unreadCount > 0 ? (
            <Button size="small" type="link" onClick={() => markAllAsRead()} className="!px-0">
              Đánh dấu đã đọc
            </Button>
          ) : null}
        </header>

        <div className="custom-scrollbar max-h-[380px] overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <Spin />
            </div>
          ) : !hasItems ? (
            <div className="px-3 py-8">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có thông báo mới" />
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={async (item) => {
                  if (!item.isRead) await markAsRead(item.id);
                }}
              />
            ))
          )}
        </div>

        {hasItems ? (
          <footer className="border-t border-[#f0f0f0] px-4 py-3">
            <Link href="/admin/notifications" onClick={() => setOpen(false)} className="text-sm font-medium">
              Xem tất cả thông báo
            </Link>
          </footer>
        ) : null}
      </section>
    ),
    [hasItems, isLoading, markAllAsRead, markAsRead, notifications, unreadCount],
  );

  const handleOpenChange = async (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      await Promise.all([refetchNotifications(), refetchUnreadCount()]);
    }
  };

  return (
    <div className={className}>
      <Dropdown
        open={open}
        onOpenChange={handleOpenChange}
        trigger={["click"]}
        popupRender={() => overlayNode}
        placement="bottomRight"
      >
        <Button
          shape="circle"
          type="text"
          aria-label="Thông báo vận hành"
          icon={
            <Badge count={unreadCount > 99 ? "99+" : unreadCount} size="small" offset={[2, -1]}>
              <BellOutlined className="text-[18px]" />
            </Badge>
          }
          className="!inline-flex !h-9 !w-9 !items-center !justify-center"
        />
      </Dropdown>
    </div>
  );
};

export default NotificationBell;
