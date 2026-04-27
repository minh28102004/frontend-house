"use client";

import React, { ReactNode } from "react";
import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import { twMerge } from "tailwind-merge";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

interface ButtonProps extends Omit<AntButtonProps, "size" | "type" | "icon" | "variant"> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const sizeMap: Record<ButtonSize, AntButtonProps["size"]> = {
  sm: "small",
  md: "middle",
  lg: "large",
};

const variantTypeMap: Record<ButtonVariant, AntButtonProps["type"]> = {
  primary: "primary",
  secondary: "default",
  outline: "default",
  ghost: "text",
  destructive: "default",
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "",
  secondary: "",
  outline: "",
  ghost: "",
  destructive: "!border-[#ffccc7] !text-[#cf1322] hover:!border-[#ff7875] hover:!text-[#cf1322]",
};

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  type = "button",
  className,
  disabled = false,
  ...props
}) => {
  return (
    <AntButton
      size={sizeMap[size]}
      type={variantTypeMap[variant]}
      danger={variant === "destructive"}
      icon={startIcon}
      disabled={disabled}
      htmlType={type}
      className={twMerge("!inline-flex !items-center !justify-center !gap-2 !rounded-md !font-medium", variantClassMap[variant], className)}
      {...props}
    >
      <span className="inline-flex items-center gap-2">
        {children}
        {endIcon ? <span className="inline-flex shrink-0 items-center justify-center">{endIcon}</span> : null}
      </span>
    </AntButton>
  );
};

export default Button;
