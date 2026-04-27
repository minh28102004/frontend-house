import React from "react";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full border font-semibold";

  // Define size styles
  const sizeStyles = {
    sm: "text-theme-xs", // Smaller padding and font size
    md: "text-sm", // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "border-[rgba(196,148,74,0.24)] bg-[var(--ah-primary-soft)] text-[var(--ah-primary-hover)]",
      success:
        "border-[rgba(90,101,69,0.22)] bg-[var(--ah-success-soft)] text-[var(--ah-success)]",
      error:
        "border-[rgba(161,70,53,0.22)] bg-[var(--ah-danger-soft)] text-[var(--ah-danger)]",
      warning:
        "border-[rgba(196,148,74,0.28)] bg-[var(--ah-warning-soft)] text-[var(--ah-warning)]",
      info: "border-[rgba(196,148,74,0.24)] bg-[var(--ah-primary-soft)] text-[var(--ah-primary-hover)]",
      light: "border-[var(--ah-border)] bg-[var(--ah-surface-2)] text-[var(--ah-muted)]",
      dark: "border-[var(--ah-dark)] bg-[var(--ah-dark)] text-[var(--ah-surface)]",
    },
    solid: {
      primary: "border-[var(--ah-primary)] bg-[var(--ah-primary)] text-[var(--ah-surface)]",
      success: "border-[var(--ah-success)] bg-[var(--ah-success)] text-[var(--ah-surface)]",
      error: "border-[var(--ah-danger)] bg-[var(--ah-danger)] text-[var(--ah-surface)]",
      warning: "border-[var(--ah-warning)] bg-[var(--ah-warning)] text-[var(--ah-surface)]",
      info: "border-[var(--ah-primary)] bg-[var(--ah-primary)] text-[var(--ah-surface)]",
      light: "border-[var(--ah-border)] bg-[var(--ah-surface-2)] text-[var(--ah-text)]",
      dark: "border-[var(--ah-dark)] bg-[var(--ah-dark)] text-[var(--ah-surface)]",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
