"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumb, Button, Space, Typography } from "antd";
import { GlobalOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import UserDropdown from "@/common/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import NotificationBell from "@/modules/admin/notifications/components/NotificationBell";

type HeaderMeta = {
  match: string;
  title: string;
  section: string;
};

const pageMeta: HeaderMeta[] = [
  { match: "/admin/rooms/bookings", title: "Phòng & đặt lịch", section: "Vận hành" },
  { match: "/admin/rooms", title: "Danh sách phòng", section: "Vận hành" },
  { match: "/admin/products", title: "Dịch vụ & tiện ích", section: "Vận hành" },
  { match: "/admin/categories-product", title: "Nhóm dịch vụ", section: "Vận hành" },
  { match: "/admin/flash-sale", title: "Ưu đãi nổi bật", section: "Vận hành" },
  { match: "/admin/orders", title: "Đơn dịch vụ", section: "Vận hành" },
  { match: "/admin/posts", title: "Bài viết & SEO", section: "Nội dung" },
  { match: "/admin/categories-posts", title: "Chuyên mục bài viết", section: "Nội dung" },
  { match: "/admin/tags", title: "Thẻ nội dung", section: "Nội dung" },
  { match: "/admin/banners", title: "Banner hiển thị", section: "Nội dung" },
  { match: "/admin/users", title: "Tài khoản nhân sự", section: "Người dùng" },
  { match: "/admin/hosts", title: "Đối tác chủ nhà", section: "Người dùng" },
  { match: "/admin/media", title: "Thư viện hình ảnh", section: "Cấu hình" },
  { match: "/admin/settings", title: "Thiết lập hệ thống", section: "Cấu hình" },
  { match: "/admin/coupons", title: "Mã ưu đãi", section: "Cấu hình" },
  { match: "/admin/rules", title: "Nội quy & trang tĩnh", section: "Nội dung" },
  { match: "/admin/chatbot", title: "Trợ lý hội thoại", section: "Nội dung" },
  { match: "/admin/traffic", title: "Theo dõi lượt truy cập", section: "Tổng quan" },
  { match: "/admin/notifications", title: "Thông báo vận hành", section: "Tổng quan" },
  { match: "/admin", title: "Bảng điều khiển", section: "Tổng quan" },
];

const resolveMeta = (pathname: string) =>
  pageMeta.find((item) => pathname === item.match || pathname.startsWith(`${item.match}/`)) ??
  pageMeta[pageMeta.length - 1];

const AppHeader: React.FC = () => {
  const { isMobile, isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const current = resolveMeta(pathname);

  const handleToggle = () => {
    if (isMobile) {
      toggleMobileSidebar();
      return;
    }
    toggleSidebar();
  };

  const breadcrumbItems = useMemo(
    () => [
      { title: "Admin" },
      { title: current.section },
      { title: current.title },
    ],
    [current.section, current.title],
  );

  return (
    <header className="sticky top-0 z-30 border-b border-[#f0f0f0] bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex min-h-16 items-center justify-between gap-3">
        <Space size={12} className="min-w-0 items-center">
          <Button
            type="text"
            onClick={handleToggle}
            aria-label={isMobileOpen ? "Đóng menu điều hướng" : "Mở hoặc thu gọn sidebar"}
            icon={isMobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            className="!inline-flex !h-9 !w-9 !items-center !justify-center"
          />
          <div className="min-w-0">
            <Breadcrumb items={breadcrumbItems} className="mb-0.5 hidden sm:block" />
            <Typography.Title level={4} className="!m-0 !truncate !text-[18px] !font-semibold">
              {current.title}
            </Typography.Title>
          </div>
        </Space>

        <Space size={10} className="shrink-0 items-center">
          <Link href="/" className="hidden lg:block">
            <Button icon={<GlobalOutlined />}>Xem website</Button>
          </Link>
          <NotificationBell />
          <UserDropdown />
        </Space>
      </div>
    </header>
  );
};

export default AppHeader;
