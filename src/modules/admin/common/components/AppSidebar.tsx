"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AppstoreOutlined,
  AreaChartOutlined,
  BellOutlined,
  CalendarOutlined,
  CameraOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
  NotificationOutlined,
  PictureOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Menu } from "antd";
import type { MenuProps } from "antd";
import { useSidebar } from "@/context/SidebarContext";

type SidebarSubItem = {
  key: string;
  label: string;
  href?: string;
};

type SidebarItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  children?: SidebarSubItem[];
};

type SidebarGroup = {
  key: string;
  label: string;
  items: SidebarItem[];
};

const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const SIDEBAR_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sidebarGroups: SidebarGroup[] = [
  {
    key: "overview",
    label: "Tổng quan",
    items: [
      { key: "/admin", href: "/admin", icon: <DashboardOutlined />, label: "Bảng điều khiển" },
      {
        key: "/admin/traffic",
        href: "/admin/traffic",
        icon: <AreaChartOutlined />,
        label: "Theo dõi lượt truy cập",
      },
      {
        key: "/admin/notifications",
        href: "/admin/notifications",
        icon: <BellOutlined />,
        label: "Thông báo vận hành",
      },
    ],
  },
  {
    key: "operations",
    label: "Vận hành",
    items: [
      {
        key: "services",
        icon: <AppstoreOutlined />,
        label: "Dịch vụ & tiện ích",
        children: [
          { key: "/admin/products", href: "/admin/products?page=1", label: "Danh sách dịch vụ" },
          { key: "/admin/categories-product", href: "/admin/categories-product", label: "Nhóm dịch vụ" },
          { key: "/admin/flash-sale", href: "/admin/flash-sale", label: "Ưu đãi nổi bật" },
          { key: "/admin/orders", href: "/admin/orders", label: "Đơn dịch vụ" },
        ],
      },
      {
        key: "rooms",
        icon: <HomeOutlined />,
        label: "Phòng & đặt lịch",
        children: [
          { key: "/admin/rooms", href: "/admin/rooms", label: "Danh sách phòng" },
          { key: "/admin/rooms/bookings", href: "/admin/rooms/bookings", label: "Lịch đặt phòng" },
          { key: "/admin/rooms/active", href: "/admin/rooms/active", label: "Phòng đang sử dụng" },
          { key: "/admin/rooms/chat", href: "/admin/rooms/chat", label: "Chat tại phòng" },
        ],
      },
      { key: "/admin/users", href: "/admin/users", icon: <TeamOutlined />, label: "Tài khoản nhân sự" },
      { key: "/admin/hosts", href: "/admin/hosts", icon: <UserSwitchOutlined />, label: "Đối tác chủ nhà" },
    ],
  },
  {
    key: "content",
    label: "Nội dung",
    items: [
      { key: "/admin/banners", href: "/admin/banners", icon: <PictureOutlined />, label: "Banner hiển thị" },
      { key: "/admin/chatbot", href: "/admin/chatbot", icon: <NotificationOutlined />, label: "Trợ lý hội thoại" },
      {
        key: "posts",
        icon: <ReadOutlined />,
        label: "Bài viết & SEO",
        children: [
          { key: "/admin/posts", href: "/admin/posts", label: "Bài viết" },
          { key: "/admin/categories-posts", href: "/admin/categories-posts", label: "Chuyên mục" },
          { key: "/admin/tags", href: "/admin/tags", label: "Thẻ nội dung" },
        ],
      },
      { key: "/admin/rules", href: "/admin/rules", icon: <FileTextOutlined />, label: "Nội quy & trang tĩnh" },
    ],
  },
  {
    key: "settings",
    label: "Cấu hình",
    items: [
      { key: "/admin/media", href: "/admin/media", icon: <CameraOutlined />, label: "Thư viện hình ảnh" },
      {
        key: "system-settings",
        icon: <SettingOutlined />,
        label: "Thiết lập hệ thống",
        children: [
          { key: "/admin/settings/vnpay", href: "/admin/settings/vnpay", label: "VNPay" },
          { key: "/admin/settings/vietqr", href: "/admin/settings/vietqr", label: "VietQR" },
          { key: "/admin/settings/email", href: "/admin/settings/email", label: "Cấu hình email" },
          { key: "/admin/settings/timebank", href: "/admin/settings/timebank", label: "TimeBank" },
          { key: "/admin/coupons", href: "/admin/coupons", label: "Mã ưu đãi" },
        ],
      },
    ],
  },
];

const flattenRoutes = () => {
  const routes: string[] = [];
  sidebarGroups.forEach((group) => {
    group.items.forEach((item) => {
      if (item.href && item.key.startsWith("/")) routes.push(item.key);
      item.children?.forEach((child) => {
        if (child.key.startsWith("/")) routes.push(child.key);
      });
    });
  });
  return routes;
};

const normalizePath = (path: string) => path.split("?")[0];

const resolveSelectedRoute = (pathname: string) => {
  const routeKeys = flattenRoutes();
  return routeKeys.find((route) => pathname === route || pathname.startsWith(`${route}/`)) ?? "/admin";
};

const resolveParentKey = (selectedRoute: string) => {
  for (const group of sidebarGroups) {
    for (const item of group.items) {
      if (!item.children) continue;
      const hasSelectedChild = item.children.some(
        (child) => selectedRoute === child.key || selectedRoute.startsWith(`${child.key}/`),
      );
      if (hasSelectedChild) return item.key;
    }
  }
  return null;
};

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobile,
    isMobileOpen,
    openSubmenu,
    setOpenSubmenu,
    setIsHovered,
    closeMobileSidebar,
  } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const selectedRoute = resolveSelectedRoute(normalizePath(pathname));
  const [localSelectedRoute, setLocalSelectedRoute] = React.useState<string>(selectedRoute);
  const showLabels = isMobile || isExpanded;
  const sidebarWidth = showLabels ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  useEffect(() => {
    setLocalSelectedRoute(selectedRoute);
    setIsHovered(false);
    const activeParent = resolveParentKey(selectedRoute);
    if (activeParent) setOpenSubmenu(activeParent);
  }, [selectedRoute, setOpenSubmenu, setIsHovered]);

  const hrefLookup = useMemo(() => {
    const map = new Map<string, string>();
    sidebarGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.href) map.set(item.key, item.href);
        item.children?.forEach((child) => {
          if (child.href) map.set(child.key, child.href);
        });
      });
    });
    return map;
  }, []);

  const menuItems = useMemo<MenuProps["items"]>(
    () =>
      sidebarGroups.map((group) => ({
        key: group.key,
        type: "group",
        label: showLabels ? group.label : "",
        children: group.items.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
    children: item.children?.map((child) => ({
  key: child.key,
  className: "ah-admin-sidebar-subitem",
  label: (
    <span className="ah-admin-sidebar-subitem-label">
      <span className="ah-admin-sidebar-subitem-dot" />
      <span className="ah-admin-sidebar-subitem-text">{child.label}</span>
    </span>
  ),
})),
        })),
      })),
    [showLabels],
  );

  const sidebarTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.34, ease: SIDEBAR_EASE };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    const target = hrefLookup.get(String(key));
    if (!target) return;
    setLocalSelectedRoute(String(key));
    router.push(target);
    if (isMobile) closeMobileSidebar();
  };

  const handleOpenChange: MenuProps["onOpenChange"] = (keys) => {
    const latest = keys.length ? String(keys[keys.length - 1]) : null;
    setOpenSubmenu(latest);
  };

  const sidebarBody = (
    <div className="ah-admin-sider h-full">
      <Link
        href="/admin"
        className={`ah-admin-sider-brand ${showLabels ? "justify-start px-4" : "justify-center px-0"}`}
        onClick={() => {
          if (isMobile) closeMobileSidebar();
        }}
      >
        <span className="ah-admin-sider-logo">
          <Image src="/img/logo2.png" alt="Another House" width={22} height={22} className="h-[22px] w-[22px]" />
        </span>
        <AnimatePresence initial={false}>
          {showLabels ? (
            <motion.span
              key="brand-text"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={sidebarTransition}
              className="min-w-0"
            >
              <span className="block truncate text-[15px] font-semibold leading-5 text-[#141414]">Another House</span>
              <span className="block truncate text-[12px] leading-4 text-[#8c8c8c]">Operations</span>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </Link>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        <Menu
          mode="inline"
          selectedKeys={[localSelectedRoute]}
          openKeys={showLabels && openSubmenu ? [openSubmenu] : []}
          onOpenChange={handleOpenChange}
          onClick={handleMenuClick}
          inlineCollapsed={!showLabels}
          items={menuItems}
          className="ah-admin-sidebar-menu"
        />
      </div>

      <AnimatePresence initial={false}>
        {showLabels ? (
          <motion.div
            key="ops-footer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={sidebarTransition}
            className="border-t border-[#f0f0f0] p-3"
          >
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#8c8c8c]">Trực vận hành</p>
            <Button
              type="link"
              className="!h-auto !px-0 !text-sm !font-medium"
              icon={<CalendarOutlined />}
              onClick={() => {
                router.push("/admin/rooms/bookings");
                if (isMobile) closeMobileSidebar();
              }}
            >
              Xem lịch đặt phòng
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {!isMobile ? (
        <motion.aside
          initial={false}
          animate={{ width: sidebarWidth }}
          transition={sidebarTransition}
          className="fixed left-0 top-0 z-50 hidden h-dvh bg-white lg:block"
          aria-label="Điều hướng quản trị"
        >
          {sidebarBody}
        </motion.aside>
      ) : (
        <Drawer
          open={isMobileOpen}
          placement="left"
          width={SIDEBAR_EXPANDED_WIDTH}
          mask={false}
          zIndex={60}
          closable={false}
          onClose={closeMobileSidebar}
          rootClassName="ah-admin-mobile-drawer"
          styles={{
            body: { padding: 0 },
            content: { background: "transparent", boxShadow: "none" },
          }}
        >
          <motion.div
            initial={{ x: -18, opacity: 0.98 }}
            animate={{ x: 0, opacity: 1 }}
            transition={sidebarTransition}
            className="h-full"
          >
            {sidebarBody}
          </motion.div>
        </Drawer>
      )}
    </>
  );
};

export default AppSidebar;
