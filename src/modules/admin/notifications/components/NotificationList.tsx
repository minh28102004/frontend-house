"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useNotifications,
  useNotificationStats,
} from "@/store/notifications";
import {
  NotificationCategory,
  Notification,
  categoryLabels,
  categoryColors,
  typeLabels,
} from "../services/notification.service";
import { formatDistanceToNow } from "@/common/utils/formatDate";
import {
  BellOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  UserOutlined,
  MailOutlined,
  CreditCardOutlined,
  SettingOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  List,
  Popconfirm,
  Row,
  Space,
  Statistic,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { AdminPageHeader } from "@/modules/admin/common/components/AdminUi";

const { Text, Title, Paragraph } = Typography;

const categoryIcons: Record<string, React.ReactNode> = {
  order: <ShoppingCartOutlined />,
  booking: <HomeOutlined />,
  user: <UserOutlined />,
  contact: <MailOutlined />,
  payment: <CreditCardOutlined />,
  system: <SettingOutlined />,
};

const categories = [
  { value: "", label: "Tất cả", icon: <BellOutlined /> },
  { value: NotificationCategory.ORDER, label: "Đơn hàng", icon: <ShoppingCartOutlined /> },
  { value: NotificationCategory.BOOKING, label: "Đặt phòng", icon: <HomeOutlined /> },
  { value: NotificationCategory.USER, label: "Người dùng", icon: <UserOutlined /> },
  { value: NotificationCategory.CONTACT, label: "Liên hệ", icon: <MailOutlined /> },
  { value: NotificationCategory.PAYMENT, label: "Thanh toán", icon: <CreditCardOutlined /> },
  { value: NotificationCategory.SYSTEM, label: "Hệ thống", icon: <SettingOutlined /> },
];

export default function NotificationList() {
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | "">("");

  const {
    notifications,
    total,
    page,
    setPage,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  } = useNotifications({
    category: selectedCategory || undefined,
    limit: 20,
    forAdmin: true,
  });

  const { stats } = useNotificationStats();

  const getRelatedLink = (notification: Notification): string | null => {
    if (!notification.relatedId || !notification.relatedModel) return null;

    switch (notification.relatedModel) {
      case "Order":
        return `/admin/orders?highlight=${notification.relatedId}`;
      case "RoomBooking":
        return `/admin/rooms/bookings?highlight=${notification.relatedId}`;
      case "User":
        return `/admin/users?highlight=${notification.relatedId}`;
      default:
        return null;
    }
  };

  const statCards = [
    {
      title: "Tổng thông báo",
      value: stats.total,
      icon: <BellOutlined />,
      color: "#1677ff",
    },
    {
      title: "Chưa đọc",
      value: stats.unread,
      icon: <InfoCircleOutlined />,
      color: "#ff4d4f",
    },
    {
      title: "Đơn hàng",
      value: stats.byCategory[NotificationCategory.ORDER]?.total || 0,
      icon: <ShoppingCartOutlined />,
      color: "#52c41a",
    },
    {
      title: "Đặt phòng",
      value: stats.byCategory[NotificationCategory.BOOKING]?.total || 0,
      icon: <HomeOutlined />,
      color: "#722ed1",
    },
  ];

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        icon={<BellOutlined />}
        eyebrow="Thông báo vận hành"
        title="Thông báo hệ thống"
        description="Quản lý các sự kiện, yêu cầu đặt phòng và đơn hàng mới nhất."
        actions={
          <Space wrap size={10}>
            {unreadCount > 0 ? (
              <Button icon={<CheckCircleOutlined />} onClick={() => markAllAsRead()}>
                Đánh dấu tất cả đã đọc
              </Button>
            ) : null}

            <Popconfirm
              title="Xóa thông báo đã đọc"
              description="Bạn có chắc chắn muốn xóa tất cả thông báo đã đọc?"
              onConfirm={() => deleteAllRead()}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa đã đọc
              </Button>
            </Popconfirm>
          </Space>
        }
      />

      <section className="ah-admin-section">
        <Row gutter={[16, 16]}>
          {statCards.map((stat) => (
            <Col key={stat.title} xs={24} sm={12} xl={6}>
              <Card className="ah-admin-card ah-admin-card-hoverable h-full">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={
                    <span style={{ color: stat.color, fontSize: 22 }}>
                      {stat.icon}
                    </span>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <Row gutter={[20, 20]} align="top">
        <Col xs={24} xl={6}>
          <Card
            title="Danh mục"
            className="ah-admin-card ah-admin-card-static ah-admin-notification-category-card"
            styles={{ body: { padding: 8 } }}
          >
            <List
              split={false}
              dataSource={categories}
              renderItem={(cat) => {
                const isActive = selectedCategory === cat.value;
                const catEnum = cat.value as NotificationCategory;
                const catStats = cat.value
                  ? stats.byCategory[catEnum]
                  : { total: stats.total, unread: stats.unread };

                return (
                  <List.Item className="!p-0">
                <Button
  type="text"
  block
  onClick={() => setSelectedCategory(cat.value as NotificationCategory | "")}
  className={`ah-admin-notification-category-btn ${
    isActive ? "ah-admin-notification-category-btn-active" : ""
  }`}
>
  <span className="flex w-full items-center gap-3">
    <span className="flex w-5 shrink-0 justify-center text-[16px]">
      {cat.icon}
    </span>

    <span className="min-w-0 flex-1 truncate text-left">
      {cat.label}
    </span>

    <span className="inline-flex w-[22px] shrink-0 justify-center">
      {catStats?.unread ? (
        <Badge count={catStats.unread} overflowCount={99} size="small" />
      ) : null}
    </span>
  </span>
</Button>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        <Col xs={24} xl={18}>
          <Card
            className="ah-admin-card ah-admin-card-static ah-admin-notification-list-card"
            title={
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">
                  {selectedCategory ? categoryLabels[selectedCategory] : "Tất cả thông báo"}
                </span>

                <Text type="secondary" className="shrink-0 !text-sm !font-normal">
                  {total} thông báo
                </Text>
              </div>
            }
          >
            <List
              loading={isLoading}
              dataSource={notifications}
              pagination={{
                current: page,
                pageSize: 20,
                total,
                onChange: (p) => setPage(p),
                align: "center",
                className: "pt-5",
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="Không có thông báo nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
              renderItem={(notification) => {
                const relatedLink = getRelatedLink(notification);
                const isUnread = !notification.isRead;
                const color = categoryColors[notification.category];

                return (
                  <List.Item
                    className={`ah-admin-notification-item ${
                      isUnread ? "ah-admin-notification-item-unread" : ""
                    }`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                    actions={[
                      <Popconfirm
                        key="delete"
                        title="Xóa thông báo"
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        onCancel={(e) => e?.stopPropagation()}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Tooltip title="Xóa">
                          <Button
                            type="text"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Tooltip>
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          className="ah-admin-notification-avatar"
                          style={{
                            backgroundColor: `${color}14`,
                            color,
                          }}
                        >
                          {categoryIcons[notification.category] || <BellOutlined />}
                        </div>
                      }
                      title={
                        <div className="flex flex-wrap items-center gap-2">
                          <Tag
                            bordered={false}
                            color={undefined}
                            className="!mr-0"
                            style={{
                              backgroundColor: `${color}14`,
                              color,
                            }}
                          >
                            {categoryLabels[notification.category]}
                          </Tag>

                          {isUnread ? <Badge status="processing" text="Mới" /> : null}

                          <Text type="secondary" className="!text-xs">
                            {formatDistanceToNow(new Date(notification.createdAt))}
                          </Text>
                        </div>
                      }
                      description={
                        <div className="min-w-0">
                          <Title level={5} className="!mb-1 !mt-0 !text-[15px] !leading-snug">
                            {notification.title}
                          </Title>

                          <Paragraph
                            className="!mb-2 !text-sm !text-[rgba(0,0,0,0.55)]"
                            ellipsis={{ rows: 2 }}
                          >
                            {notification.message}
                          </Paragraph>

                          <Space size={16} wrap>
                            {relatedLink ? (
                              <Link href={relatedLink} onClick={(e) => e.stopPropagation()}>
                                <Button type="link" size="small" className="!h-auto !p-0 !font-medium">
                                  Chi tiết <RightOutlined className="!text-[10px]" />
                                </Button>
                              </Link>
                            ) : null}

                            <Text type="secondary" className="!text-xs">
                              Nguồn: {typeLabels[notification.type]}
                            </Text>
                          </Space>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}