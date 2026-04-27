"use client";

import React, { useMemo } from "react";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { twMerge } from "tailwind-merge";

export interface AdminSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AdminSelectProps {
  options: AdminSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  allowClear?: boolean;
}

const AdminSelect: React.FC<AdminSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn giá trị",
  disabled = false,
  className = "",
  name,
  allowClear = false,
}) => {
  const mappedOptions = useMemo(
    () => options.map((option) => ({ value: option.value, label: option.label, disabled: option.disabled })),
    [options],
  );

  return (
    <div className={twMerge("w-full", className)}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <Select
        value={value || undefined}
        options={mappedOptions}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear}
        suffixIcon={<DownOutlined className="text-[12px] text-[rgba(0,0,0,0.45)]" />}
        className="ah-admin-antd-select w-full"
        popupClassName="ah-admin-select-dropdown"
        getPopupContainer={(node) => node.parentElement ?? document.body}
      />
    </div>
  );
};

export default AdminSelect;
