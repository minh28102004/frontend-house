"use client";

import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, ReactElement, ReactNode, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Input, Modal, Pagination, Tag, Tooltip, Typography } from "antd";
import { twMerge } from "tailwind-merge";



const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const AdminTooltip = ({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) => (
  <Tooltip title={label} placement="top" arrow={{ pointAtCenter: true }}>
    {children}
  </Tooltip>
);

type AdminIconActionButtonProps = {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: "neutral" | "primary" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
};

export const AdminIconActionButton = ({
  label,
  icon,
  href,
  onClick,
  tone = "neutral",
  className,
  disabled = false,
  type = "button",
}: AdminIconActionButtonProps) => {
  const buttonNode = (
    <Button
      aria-label={label}
      icon={icon}
      shape="circle"
      danger={tone === "danger"}
      type={tone === "primary" ? "primary" : "default"}
      disabled={disabled}
      htmlType={type}
      onClick={onClick}
      className={twMerge("!inline-flex !h-8 !w-8 !items-center !justify-center", className)}
    />
  );

  if (href) {
    return (
      <AdminTooltip label={label}>
        <Link href={href}>{buttonNode}</Link>
      </AdminTooltip>
    );
  }

  return <AdminTooltip label={label}>{buttonNode}</AdminTooltip>;
};

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  icon?: ReactNode;
};

export const AdminPageHeader = ({
  eyebrow,
  title,
  description,
  actions,
  className,
  icon,
}: AdminPageHeaderProps) => (
  <Card className={twMerge("ah-admin-card", className)}>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <div className="ah-admin-page-header-icon">
            {icon}
          </div>
        ) : null}

        <div className="min-w-0 max-w-4xl">
          {eyebrow ? (
            <Typography.Text className="!mb-1 !block !text-xs !font-medium !uppercase !tracking-[0.04em] !text-[rgba(0,0,0,0.45)]">
              {eyebrow}
            </Typography.Text>
          ) : null}

          <Typography.Title level={3} className="!mb-1 !mt-0 !text-[24px] !font-semibold">
            {title}
          </Typography.Title>

          {description ? (
            <Typography.Paragraph className="!mb-0 !text-sm !text-[rgba(0,0,0,0.45)]">
              {description}
            </Typography.Paragraph>
          ) : null}
        </div>
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  </Card>
);

type AdminCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
};

export const AdminCard = ({ children, className, delay = 0, hover = true }: AdminCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.24, delay, ease: EASE }}
    >
      <Card className={twMerge("ah-admin-card", hover && "ah-admin-card-hover", className)}>{children}</Card>
    </motion.div>
  );
};

type AdminActionLinkProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  meta?: string;
  className?: string;
};

export const AdminActionLink = ({ href, title, description, icon, meta, className }: AdminActionLinkProps) => (
  <Link href={href} className="block h-full">
    <Card className={twMerge("ah-admin-card ah-admin-card-hover h-full", className)} styles={{ body: { padding: 16 } }}>
      <div className="flex h-full flex-col justify-between gap-3">
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#f5f5f5] text-[18px]">
              {icon}
            </span>
            {meta ? (
              <Tag color="default" className="!m-0">
                {meta}
              </Tag>
            ) : null}
          </div>
          <Typography.Title level={5} className="!mb-1 !mt-0 !line-clamp-2 !text-[16px] !font-semibold">
            {title}
          </Typography.Title>
          <Typography.Paragraph className="!m-0 !line-clamp-3 !text-sm !text-[rgba(0,0,0,0.45)]">
            {description}
          </Typography.Paragraph>
        </div>
        <Typography.Text className="!text-sm !font-medium">Đi tới</Typography.Text>
      </div>
    </Card>
  </Link>
);

type AdminStatCardProps = {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
  delay?: number;
};

export const AdminStatCard = ({ label, value, description, icon, delay }: AdminStatCardProps) => (
  <AdminCard delay={delay}>
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <Typography.Text className="!block !text-xs !font-medium !uppercase !tracking-[0.04em] !text-[rgba(0,0,0,0.45)]">
          {label}
        </Typography.Text>
        <Typography.Title level={3} className="!my-1 !text-[28px] !font-semibold">
          {value}
        </Typography.Title>
        <Typography.Paragraph className="!m-0 !line-clamp-2 !text-sm !text-[rgba(0,0,0,0.45)]">
          {description}
        </Typography.Paragraph>
      </div>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f5f5f5] text-[18px]">
        {icon}
      </span>
    </div>
  </AdminCard>
);

type AdminBadgeTone = "neutral" | "success" | "warning" | "danger" | "primary";

const badgeColorMap: Record<AdminBadgeTone, string> = {
  neutral: "default",
  success: "success",
  warning: "warning",
  danger: "error",
  primary: "processing",
};

export const AdminBadge = ({
  tone = "neutral",
  children,
  className,
}: {
  tone?: AdminBadgeTone;
  children: ReactNode;
  className?: string;
}) => (
  <Tag color={badgeColorMap[tone]} className={twMerge("!m-0 !rounded-full !px-2 !py-0.5 !text-xs !font-medium", className)}>
    {children}
  </Tag>
);

const statusToneLookup: Record<string, AdminBadgeTone> = {
  available: "success",
  "còn trống": "success",
  booked: "primary",
  "đã đặt": "primary",
  maintenance: "warning",
  "đang bảo trì": "warning",
  processing: "warning",
  "đang xử lý": "warning",
  pending: "warning",
  "chờ xác nhận": "warning",
  pending_payment: "primary",
  "chờ thanh toán": "primary",
  confirmed: "success",
  "đã xác nhận": "success",
  completed: "success",
  "hoàn thành": "success",
  cancelled: "danger",
  "đã hủy": "danger",
  approved: "success",
  "đã duyệt": "success",
  draft: "neutral",
  nháp: "neutral",
  active: "success",
  inactive: "neutral",
  locked: "danger",
  banned: "danger",
};

export const AdminStatusBadge = ({
  status,
  label,
  className,
}: {
  status: string;
  label?: string;
  className?: string;
}) => {
  const normalized = status.trim().toLowerCase();
  return (
    <AdminBadge tone={statusToneLookup[normalized] ?? "neutral"} className={className}>
      {label ?? status}
    </AdminBadge>
  );
};

export const AdminThumbnail = ({
  src,
  alt,
  aspect = "square",
  className,
  imageClassName,
  fallbackLabel,
}: {
  src?: string | null;
  alt: string;
  aspect?: "square" | "portrait" | "banner";
  className?: string;
  imageClassName?: string;
  fallbackLabel?: string;
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const aspectClass =
    aspect === "portrait" ? "aspect-[3/4]" : aspect === "banner" ? "aspect-[16/9]" : "aspect-square";
  const label = fallbackLabel?.trim().charAt(0).toUpperCase() || alt.trim().charAt(0).toUpperCase();
  const showImage = Boolean(src) && !hasError;

  return (
    <div className={twMerge("ah-admin-thumb", aspectClass, className)}>
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes="120px"
          className={twMerge("object-cover", imageClassName)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="ah-admin-thumb-fallback" aria-hidden>
          {label || "?"}
        </div>
      )}
    </div>
  );
};

type AdminSearchGroupProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
};

export const AdminSearchGroup = ({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Tìm kiếm",
  buttonLabel = "Tìm kiếm",
  className,
  inputClassName,
  disabled = false,
}: AdminSearchGroupProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className={twMerge("w-full", className)}>
      <Input.Search
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onSearch={() => onSubmit?.()}
        placeholder={placeholder}
        enterButton={buttonLabel}
        allowClear
        disabled={disabled}
        className={twMerge("ah-admin-antd-search", inputClassName)}
        onClear={onClear}
      />
    </form>
  );
};

export const AdminPagination = ({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={twMerge("flex items-center justify-center", className)}>
      <Pagination
        current={page}
        total={totalPages * 10}
        pageSize={10}
        showSizeChanger={false}
        onChange={onPageChange}
        className="ah-admin-antd-pagination"
      />
    </div>
  );
};

export const AdminEmptyState = ({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <Card className="ah-admin-card">
    <div className="py-4 text-center">
      {icon ? <div className="mb-2 text-[24px] text-[rgba(0,0,0,0.45)]">{icon}</div> : null}
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <Typography.Title level={5} className="!mb-1 !mt-0">
              {title}
            </Typography.Title>
            {description ? <Typography.Text type="secondary">{description}</Typography.Text> : null}
          </div>
        }
      />
      {action ? <div>{action}</div> : null}
    </div>
  </Card>
);

export const AdminCheckRow = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={twMerge("flex gap-3 rounded-md border border-[#f0f0f0] bg-[#fafafa] p-3", className)}>
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1677ff] text-white">
      <CheckOutlined className="text-[12px]" />
    </span>
    <span className="text-sm text-[rgba(0,0,0,0.65)]">{children}</span>
  </div>
);

export const AdminActionIcons = {
  view: <EyeOutlined />,
  edit: <EditOutlined />,
  delete: <DeleteOutlined />,
};

type AdminFilterItemProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

export const AdminFilterItem = ({ label, children, className }: AdminFilterItemProps) => (
  <div className={twMerge("ah-admin-filter-item flex min-w-0 flex-col gap-1", className)}>
    <Typography.Text className="!text-xs !font-medium !text-[rgba(0,0,0,0.65)]">
      {label}
    </Typography.Text>
    {children}
  </div>
);

type AdminFilterBarProps = {
  children: ReactNode;
  className?: string;
};

export const AdminFilterBar = ({ children, className }: AdminFilterBarProps) => (
  <Card className={twMerge("ah-admin-card ah-admin-card-static", className)} styles={{ body: { padding: 16 } }}>
    <div className="ah-admin-filter-bar">
      {children}
    </div>
  </Card>
);

type AdminModalProps = {
  open: boolean;
  onCancel: () => void;
  onOk?: () => void;
  title: ReactNode;
  children: ReactNode;
  width?: number | string;
  okText?: string;
  cancelText?: string;
  footer?: ReactNode | null;
  destroyOnClose?: boolean;
  loading?: boolean;
  closable?: boolean;
};

export const AdminModal = ({
  open,
  onCancel,
  onOk,
  title,
  children,
  width = 800,
  okText = "OK",
  cancelText = "Hủy",
  footer,
  destroyOnClose = true,
  loading = false,
  closable = true,
}: AdminModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      title={null}
      width={width}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={loading}
      footer={footer}
      destroyOnClose={destroyOnClose}
      closable={false}
      className="ah-admin-antd-modal"
      styles={{
        content: {
          margin: '3px 0',
          maxHeight: 'calc(100vh - 6px)',
        },
        body: {
          padding: 0,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        },
        header: {
          display: 'none',
        },
        footer: {
          borderTop: '1px solid #f0f0f0',
          padding: '16px 24px',
          flexShrink: 0,
        },
      }}
      centered
    >
      <div className="ah-admin-modal-wrapper">
        <div className="ah-admin-modal-header">
          <div className="ah-admin-modal-title">{title}</div>
          {closable && (
            <button 
              className="ah-admin-modal-close" 
              onClick={onCancel}
              aria-label="Close"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
        <div className="ah-admin-modal-body">
          {children}
        </div>
      </div>
    </Modal>
  );
};
