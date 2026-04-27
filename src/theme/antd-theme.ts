import type { ThemeConfig } from "antd";

export const anotherHouseAdminTheme: ThemeConfig = {
  cssVar: {
    key: "another-house-admin",
  },
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    colorText: "rgba(0, 0, 0, 0.88)",
    colorTextSecondary: "rgba(0, 0, 0, 0.65)",
    colorBgBase: "#f5f7fa",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBorder: "#d9d9d9",
    colorBorderSecondary: "#f0f0f0",
    borderRadius: 8,
    borderRadiusLG: 8,
    borderRadiusSM: 6,
    fontFamily:
      "\"Inter\", \"Segoe UI\", \"Roboto\", \"Helvetica Neue\", Arial, sans-serif",
    fontSize: 14,
    boxShadow:
      "0 1px 2px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)",
    boxShadowSecondary:
      "0 3px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
  },
  components: {
    Layout: {
      bodyBg: "#f5f7fa",
      headerBg: "#ffffff",
      siderBg: "#001529",
      triggerBg: "#001529",
      triggerColor: "#ffffff",
    },
    Menu: {
      itemHeight: 40,
      itemMarginInline: 8,
      itemMarginBlock: 4,
      itemBorderRadius: 6,
      iconSize: 16,
    },
    Card: {
      borderRadiusLG: 8,
      headerBg: "#ffffff",
      bodyPadding: 16,
      boxShadowTertiary: "none",
    },
    Button: {
      borderRadius: 8,
      controlHeight: 36,
      controlHeightLG: 40,
      fontWeight: 500,
      boxShadow: "none",
      primaryShadow: "none",
    },
    Input: {
      controlHeight: 36,
      borderRadius: 8,
      activeBorderColor: "#1677ff",
      hoverBorderColor: "#4096ff",
      activeShadow: "0 0 0 2px rgba(22, 119, 255, 0.2)",
    },
    Select: {
      controlHeight: 36,
      borderRadius: 8,
      optionSelectedBg: "#e6f4ff",
      optionActiveBg: "#f5f5f5",
    },
    DatePicker: {
      controlHeight: 36,
      borderRadius: 8,
      activeBorderColor: "#1677ff",
      activeShadow: "0 0 0 2px rgba(22, 119, 255, 0.2)",
    },
    Table: {
      headerBg: "#fafafa",
      headerColor: "rgba(0,0,0,0.88)",
      headerBorderRadius: 0,
      rowHoverBg: "#f5faff",
      borderColor: "#f0f0f0",
      headerSplitColor: "#f0f0f0",
      cellPaddingBlock: 12,
      cellPaddingInline: 12,
      colorBgContainer: "#ffffff",
    },
    Modal: {
      borderRadiusLG: 8,
      contentBg: "#ffffff",
      headerBg: "#ffffff",
      titleColor: "rgba(0, 0, 0, 0.88)",
      boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
    },
    Drawer: {
      colorBgElevated: "#ffffff",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.16)",
    },
    Tabs: {
      titleFontSize: 14,
      horizontalItemPadding: "10px 8px",
      itemColor: "rgba(0,0,0,0.65)",
      itemHoverColor: "#1677ff",
      itemSelectedColor: "#1677ff",
      inkBarColor: "#1677ff",
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Tooltip: {
      borderRadius: 6,
    },
    Pagination: {
      borderRadius: 6,
      colorPrimary: "#1677ff",
      colorPrimaryHover: "#4096ff",
    },
    Upload: {
      colorBorder: "#d9d9d9",
      colorFillAlter: "#fafafa",
    },
    Notification: {
      borderRadiusLG: 8,
    },
  },
};
