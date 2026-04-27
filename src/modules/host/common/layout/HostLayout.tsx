"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AppstoreOutlined,
  BarcodeOutlined,
  BellOutlined,
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PictureOutlined,
  QrcodeOutlined,
  SearchOutlined,
  ShopOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Drawer, Dropdown, Layout, Menu, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import HostGuard from "@/modules/host/common/components/HostGuard";
import Backdrop from "@/modules/admin/common/components/Backdrop";
import { useTrafficInit } from "@/store/traffic";

const { Content } = Layout;
const DESKTOP_SIDER_EXPANDED = 240;
const DESKTOP_SIDER_COLLAPSED = 72;
const SIDEBAR_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type HostMenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: HostMenuItem[];
};

const hostMenuGroups: HostMenuItem[] = [
  {
    key: "overview",
    label: "Tổng quan",
    children: [{ key: "/host", href: "/host", label: "Dashboard", icon: <HomeOutlined /> }],
  },
  {
    key: "rooms",
    label: "Quản lý phòng",
    children: [
      { key: "/host/rooms", href: "/host/rooms", label: "Danh sách phòng", icon: <AppstoreOutlined /> },
      { key: "/host/rooms/create", href: "/host/rooms/create", label: "Thêm phòng mới", icon: <HomeOutlined /> },
    ],
  },
  {
    key: "store",
    label: "Cửa hàng",
    children: [
      { key: "/host/store", href: "/host/store", label: "Sản phẩm", icon: <ShopOutlined /> },
      { key: "/host/store/categories", href: "/host/store/categories", label: "Danh mục", icon: <TagsOutlined /> },
      { key: "/host/coupons", href: "/host/coupons", label: "Mã giảm giá", icon: <BarcodeOutlined /> },
    ],
  },
  {
    key: "content",
    label: "Nội dung",
    children: [
      { key: "/host/content", href: "/host/content", label: "Bài viết", icon: <FileTextOutlined /> },
      { key: "/host/content/categories", href: "/host/content/categories", label: "Danh mục bài viết", icon: <TagsOutlined /> },
      { key: "/host/content/tags", href: "/host/content/tags", label: "Thẻ nội dung", icon: <TagsOutlined /> },
      { key: "/host/banners", href: "/host/banners", label: "Banner", icon: <PictureOutlined /> },
      { key: "/host/media", href: "/host/media", label: "Thư viện ảnh", icon: <PictureOutlined /> },
    ],
  },
  {
    key: "settings",
    label: "Cấu hình",
    children: [
      { key: "/host/traffic", href: "/host/traffic", label: "Theo dõi truy cập", icon: <SearchOutlined /> },
      { key: "/host/seo", href: "/host/seo", label: "SEO", icon: <BellOutlined /> },
      { key: "/host/qrcode", href: "/host/qrcode", label: "VietQR", icon: <QrcodeOutlined /> },
      { key: "/host/profile", href: "/host/profile", label: "Hồ sơ", icon: <UserOutlined /> },
    ],
  },
];

const flattenRoutes = () => {
  const keys: string[] = [];
  hostMenuGroups.forEach((group) => {
    group.children?.forEach((item) => {
      if (item.key.startsWith("/")) keys.push(item.key);
    });
  });
  return keys;
};

const resolveSelectedRoute = (pathname: string) =>
  flattenRoutes().find((route) => pathname === route || pathname.startsWith(`${route}/`)) ?? "/host";

const resolvePageTitle = (pathname: string) => {
  for (const group of hostMenuGroups) {
    for (const item of group.children ?? []) {
      if (pathname === item.key || pathname.startsWith(`${item.key}/`)) {
        return { section: group.label, title: item.label };
      }
    }
  }
  return { section: "Tổng quan", title: "Dashboard" };
};

const HostLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { isExpanded, isMobile, isMobileOpen, setIsHovered, toggleSidebar, toggleMobileSidebar, closeMobileSidebar } =
    useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  useTrafficInit();

  const selectedRoute = resolveSelectedRoute(pathname);
  const pageMeta = resolvePageTitle(pathname);
  const sidebarOffset = isMobile ? 0 : isExpanded ? DESKTOP_SIDER_EXPANDED : DESKTOP_SIDER_COLLAPSED;
  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.34, ease: SIDEBAR_EASE };
  const showLabels = isMobile || isExpanded;
  const sidebarWidth = showLabels ? DESKTOP_SIDER_EXPANDED : DESKTOP_SIDER_COLLAPSED;

  const hostMenuItems = useMemo<MenuProps["items"]>(
    () =>
      hostMenuGroups.map((group) => ({
        key: group.key,
        type: "group",
        label: showLabels ? group.label : "",
        children: (group.children ?? []).map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        })),
      })),
    [showLabels],
  );

  const accountItems: MenuProps["items"] = [
    {
      key: "home",
      label: <Link href="/">Về website</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: "Đăng xuất",
    },
  ];

  const sidebarBody = (
    <div className="ah-admin-sider h-full">
      <Link href="/host" className={`ah-admin-sider-brand ${showLabels ? "justify-start px-4" : "justify-center px-0"}`}>
        <span className="ah-admin-sider-logo">
          <Image src="/img/logo2.png" alt="Another House" width={22} height={22} className="h-[22px] w-[22px]" />
        </span>
        <AnimatePresence initial={false}>
          {showLabels ? (
            <motion.span
              key="host-brand"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={transition}
              className="min-w-0"
            >
              <span className="block truncate text-[15px] font-semibold leading-5 text-[#141414]">Host Dashboard</span>
              <span className="block truncate text-[12px] leading-4 text-[#8c8c8c]">Another House</span>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </Link>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
        <Menu
          mode="inline"
          items={hostMenuItems}
          selectedKeys={[selectedRoute]}
          onClick={({ key }) => {
            router.push(String(key));
            if (isMobile) closeMobileSidebar();
          }}
          inlineCollapsed={!showLabels}
          className="ah-admin-sidebar-menu"
        />
      </div>
    </div>
  );

  return (
    <div data-admin-shell className="min-h-screen bg-[#f5f7fa]">
      <HostGuard>
        {!isMobile ? (
          <motion.aside
            initial={false}
            animate={{ width: sidebarWidth }}
            transition={transition}
            className="fixed left-0 top-0 z-50 hidden h-dvh bg-white lg:block"
            onMouseEnter={() => setIsHovered(false)}
          >
            {sidebarBody}
          </motion.aside>
        ) : (
          <Drawer
            open={isMobileOpen}
            placement="left"
            width={DESKTOP_SIDER_EXPANDED}
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
              transition={transition}
              className="h-full"
            >
              {sidebarBody}
            </motion.div>
          </Drawer>
        )}

        <Backdrop />

        <motion.div initial={false} animate={{ paddingLeft: sidebarOffset }} transition={transition} className="min-h-screen">
          <Layout className="!min-h-screen !bg-transparent">
            <header className="sticky top-0 z-30 border-b border-[#f0f0f0] bg-white px-4 sm:px-6 lg:px-8">
              <div className="flex min-h-16 items-center justify-between gap-3">
                <Space size={12} className="min-w-0 items-center">
                  <Button
                    type="text"
                    onClick={() => {
                      if (isMobile) toggleMobileSidebar();
                      else toggleSidebar();
                    }}
                    icon={isMobileOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    className="!inline-flex !h-9 !w-9 !items-center !justify-center"
                  />
                  <div className="min-w-0">
                    <Breadcrumb items={[{ title: "Host" }, { title: pageMeta.section }, { title: pageMeta.title }]} className="mb-0.5 hidden sm:block" />
                    <Typography.Title level={4} className="!m-0 !truncate !text-[18px] !font-semibold">
                      {pageMeta.title}
                    </Typography.Title>
                  </div>
                </Space>

                <Dropdown
                  menu={{
                    items: accountItems,
                    onClick: ({ key }) => {
                      if (key === "logout") logout();
                    },
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Button type="text" className="ah-admin-user-trigger" aria-label="Mở menu tài khoản host">
                    <Space size={8} align="center">
                      <Avatar src={user?.avatar?.trim() || undefined} icon={!user?.avatar?.trim() ? <UserOutlined /> : undefined} />
                      <Space direction="vertical" size={0} className="hidden md:flex">
                        <Typography.Text className="!m-0 !max-w-[140px] !truncate !text-left !text-sm !font-medium">
                          {user?.fullName || "Host Account"}
                        </Typography.Text>
                        <Typography.Text className="!m-0 !max-w-[140px] !truncate !text-left !text-xs !text-[rgba(0,0,0,0.45)]">
                          {user?.email || "host@anotherhouse.vn"}
                        </Typography.Text>
                      </Space>
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </header>

            <Content>
              <main className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8">{children}</main>
            </Content>
          </Layout>
        </motion.div>
      </HostGuard>
    </div>
  );
};

export default HostLayout;
