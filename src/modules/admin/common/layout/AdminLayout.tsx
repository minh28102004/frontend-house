"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Layout } from "antd";
import AppHeader from "@/modules/admin/common/components/AppHeader";
import AppSidebar from "@/modules/admin/common/components/AppSidebar";
import Backdrop from "@/modules/admin/common/components/Backdrop";
import AdminGuard from "@/modules/admin/common/components/AdminGuard";
import { useSidebar } from "@/context/SidebarContext";
import { useNotificationInit } from "@/store/notifications";
import { useTrafficInit } from "@/store/traffic";

const { Content } = Layout;
const DESKTOP_SIDER_EXPANDED = 240;
const DESKTOP_SIDER_COLLAPSED = 72;
const LAYOUT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isExpanded, isMobile } = useSidebar();
  const prefersReducedMotion = useReducedMotion();

  useNotificationInit();
  useTrafficInit();

  const sidebarOffset = isMobile ? 0 : isExpanded ? DESKTOP_SIDER_EXPANDED : DESKTOP_SIDER_COLLAPSED;
  const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.34, ease: LAYOUT_EASE };

  return (
    <div data-admin-shell className="min-h-screen bg-[#f5f7fa]">
      <AdminGuard>
        <AppSidebar />
        <Backdrop />
        <motion.div initial={false} animate={{ paddingLeft: sidebarOffset }} transition={transition} className="min-h-screen">
          <Layout className="!min-h-screen !bg-transparent">
            <AppHeader />
            <Content>
              <main className="w-full px-4 py-5 sm:px-6 lg:px-8">{children}</main>
            </Content>
          </Layout>
        </motion.div>
      </AdminGuard>
    </div>
  );
};

export default AdminLayout;
