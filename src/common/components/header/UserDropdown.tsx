"use client";

import Link from "next/link";
import React from "react";
import { Avatar, Button, Dropdown, Flex, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined, HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";

const getInitials = (name?: string, email?: string) => {
  const source = name?.trim() || email?.trim() || "AH";
  return source
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function UserDropdown() {
  const { user, logout } = useAuth();

  const menuItems: MenuProps["items"] = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link href="/">Về trang chủ</Link>,
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
    },
  ];

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") logout();
  };

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: onMenuClick }}
      trigger={["click"]}
      placement="bottomRight"
      classNames={{ root: "ah-admin-user-dropdown-overlay" }}
    >
      <Button type="text" className="ah-admin-user-trigger" aria-label="Mở menu tài khoản">
        <Space size={8} align="center">
          <Avatar
            size={36}
            src={user?.avatar?.trim() || undefined}
            icon={!user?.avatar?.trim() ? <UserOutlined /> : undefined}
          >
            {user?.avatar?.trim() ? null : getInitials(user?.fullName, user?.email)}
          </Avatar>
          <Flex vertical gap={0} className="hidden md:flex">
            <Typography.Text className="!m-0 !max-w-[150px] !truncate !text-left !text-sm !font-medium">
              {user?.fullName || "Another House Admin"}
            </Typography.Text>
            <Typography.Text className="!m-0 !max-w-[150px] !truncate !text-left !text-xs !text-[rgba(0,0,0,0.45)]">
              {user?.email || "admin@anotherhouse.vn"}
            </Typography.Text>
          </Flex>
          <DownOutlined className="hidden text-[10px] text-[rgba(0,0,0,0.45)] md:block" />
        </Space>
      </Button>
    </Dropdown>
  );
}
