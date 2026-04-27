"use client";

import React from "react";
import { App as AntdApp, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { anotherHouseAdminTheme } from "@/theme/antd-theme";

const AnotherHouseAntdProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={anotherHouseAdminTheme}
      componentSize="middle"
    >
      <AntdApp
        message={{ maxCount: 4, duration: 3 }}
        notification={{ placement: "topRight", duration: 4, maxCount: 4 }}
      >
        {children}
      </AntdApp>
    </ConfigProvider>
  );
};

export default AnotherHouseAntdProvider;
