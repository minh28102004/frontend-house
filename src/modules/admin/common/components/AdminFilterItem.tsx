import React, { ReactNode } from "react";
import { Typography } from "antd";
import { twMerge } from "tailwind-merge";

type AdminFilterItemProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Component that wraps a label and a form control (Input, Select, DatePicker, etc.)
 * Used in admin filter bars. The label is placed above the control with a small,
 * medium‑weight, secondary colour typography as required by the design system.
 */
export const AdminFilterItem = ({ label, children, className }: AdminFilterItemProps) => (
  <div className={twMerge("flex flex-col gap-1", className)}>
    <Typography.Text className="!text-xs !font-medium !text-[rgba(0,0,0,0.65)]">
      {label}
    </Typography.Text>
    {children}
  </div>
);
