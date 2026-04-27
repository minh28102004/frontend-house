"use client";

import React from "react";
import { Modal as AntdModal } from "antd";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

const resolveWidth = (className?: string) => {
  if (!className) return "min(94vw, 960px)";
  if (className.includes("max-w-lg")) return "min(94vw, 560px)";
  if (className.includes("max-w-xl")) return "min(94vw, 720px)";
  if (className.includes("max-w-2xl")) return "min(94vw, 860px)";
  if (className.includes("max-w-3xl")) return "min(94vw, 960px)";
  if (className.includes("max-w-4xl")) return "min(94vw, 1120px)";
  if (className.includes("max-w-5xl")) return "min(94vw, 1240px)";
  if (className.includes("max-w-6xl")) return "min(94vw, 1360px)";
  return "min(94vw, 960px)";
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
}) => {
  return (
    <AntdModal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      keyboard
      maskClosable
      closable={showCloseButton}
      centered={!isFullscreen}
      width={isFullscreen ? "100vw" : resolveWidth(className)}
      style={isFullscreen ? { top: 0, paddingBottom: 0 } : undefined}
      className={twMerge("ah-admin-antd-modal", isFullscreen && "ah-admin-antd-modal-fullscreen", className)}
      styles={{
        mask: {
          background: "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(2px)",
        },
        body: {
          padding: 0,
          maxHeight: isFullscreen ? "100vh" : "82vh",
          overflowY: "auto",
        },
      }}
    >
      {children}
    </AntdModal>
  );
};
