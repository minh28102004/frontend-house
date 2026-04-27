"use client";

import React from "react";
import { SiZalo } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";

export type WaveButtonVariant = "zalo" | "phone" | "olive";

export interface WaveContactButtonProps {
  href: string;
  variant?: WaveButtonVariant;
  label: string;
  /** Số vòng sóng (mặc định 3) */
  ringCount?: number;
  className?: string;
}

const variantStyles: Record<
  WaveButtonVariant,
  { ring: string; btn: string; icon: string }
> = {
  zalo: {
    ring: "border-[#0068FF]/45",
    btn: "bg-[#0068FF] text-white shadow-lg shadow-[#0068FF]/35 hover:bg-[#0056d6]",
    icon: "text-white",
  },
  phone: {
    ring: "border-[#1b64a7]/45",
    btn: "bg-[#1b64a7] text-white shadow-lg shadow-[#1b64a7]/35 hover:bg-[#15528c]",
    icon: "text-white",
  },
  olive: {
    ring: "border-olive/40",
    btn: "bg-olive text-cream shadow-lg shadow-ink10 ring-2 ring-white/30 hover:bg-[#4d563b]",
    icon: "text-cream",
  },
};

/** Một nút liên hệ: vòng sóng tỏa ra + icon lắc nhẹ */
export function WaveContactButton({
  href,
  variant = "zalo",
  label,
  ringCount = 3,
  className = "",
}: WaveContactButtonProps) {
  const v = variantStyles[variant];

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={`relative flex h-[52px] w-[52px] shrink-0 items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${className}`}
    >
      {/* Vòng sóng — scale + mờ dần, lệch delay */}
      {Array.from({ length: ringCount }).map((_, i) => (
        <span
          key={i}
          className={`animate-ah-contact-wave pointer-events-none absolute inset-0 rounded-full border-2 ${v.ring}`}
          style={{ animationDelay: `${i * 0.75}s` }}
          aria-hidden
        />
      ))}

      {/* Nút tròn */}
      <span
        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 ${v.btn}`}
      >
        <span className={`animate-ah-contact-wiggle inline-flex ${v.icon}`}>
          {variant === "zalo" && <SiZalo className="h-6 w-6" aria-hidden />}
          {(variant === "phone" || variant === "olive") && (
            <FaPhoneAlt className="h-[22px] w-[22px]" aria-hidden />
          )}
        </span>
      </span>
    </a>
  );
}

const DEFAULT_ZALO = "https://zalo.me/0901113179";
const DEFAULT_TEL = "tel:0901113179";

export interface ButtonWaveProps {
  zaloHref?: string;
  phoneHref?: string;
  /** "brand" = Zalo xanh + Phone xanh như mẫu; "olive" = palette Another House */
  theme?: "brand" | "olive";
  className?: string;
}

/**
 * Cụm nút liên hệ nổi (Zalo + Gọi điện): sóng tỏa + icon lắc.
 */
export default function ButtonWave({
  zaloHref = DEFAULT_ZALO,
  phoneHref = DEFAULT_TEL,
  theme = "brand",
  className = "",
}: ButtonWaveProps) {
  const zaloVariant: WaveButtonVariant = theme === "olive" ? "olive" : "zalo";
  const phoneVariant: WaveButtonVariant = theme === "olive" ? "olive" : "phone";

  return (
    <div
      className={`fixed right-4 z-[9998] flex flex-col items-center gap-5 md:right-6 ${className}`}
      style={{
        top: "50%",
        transform: "translateY(-50%)",
      }}
      role="group"
      aria-label="Liên hệ nhanh"
    >
      <WaveContactButton
        href={zaloHref}
        variant={zaloVariant}
        label="Mở Zalo chat"
      />
      <WaveContactButton
        href={phoneHref}
        variant={phoneVariant}
        label="Gọi điện thoại"
      />
    </div>
  );
}
