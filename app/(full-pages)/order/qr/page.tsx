"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./qr.module.css";

function OrderQrContent() {
  const searchParams = useSearchParams();

  const qrCodeUrl = searchParams.get("qrCodeUrl") || "";
  const amount = searchParams.get("amount") || "0";
  const accountNo = searchParams.get("accountNo") || "";
  const accountName = searchParams.get("accountName") || "";
  const description = searchParams.get("description") || "";
  const transactionId = searchParams.get("transactionId") || "";
  const orderId = searchParams.get("orderId") || "";

  const formatPrice = (v: string | number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(v));

  if (!qrCodeUrl) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.title}>Không có thông tin thanh toán</h2>
          <Link href="/" className={styles.btnPrimary}>
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconBadge}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM11 11h2v2h-2z" />
          </svg>
        </div>

        <h2 className={styles.heading}>Thanh toán đơn hàng</h2>
        <p className={styles.subheading}>
          Mở app ngân hàng hoặc Ví điện tử, quét mã bên dưới và xác nhận thanh toán.
        </p>

        {/* QR Code */}
        <div className={styles.qrWrap}>
          <Image
            src={qrCodeUrl}
            alt="Mã QR thanh toán VietQR"
            width={220}
            height={220}
            className={styles.qrImage}
            unoptimized
          />
        </div>

        {/* Amount */}
        <div className={styles.amountBox}>
          <span className={styles.amountLabel}>Số tiền cần chuyển</span>
          <span className={styles.amountValue}>{formatPrice(amount)}</span>
        </div>

        {/* Account */}
        <div className={styles.accountInfo}>
          <div className={styles.accountRow}>
            <span>Ngân hàng</span>
            <span>MB Bank</span>
          </div>
          <div className={styles.accountRow}>
            <span>Số tài khoản</span>
            <span className={styles.accountNo}>{accountNo}</span>
          </div>
          <div className={styles.accountRow}>
            <span>Tên tài khoản</span>
            <span>{accountName}</span>
          </div>
          {description && (
            <div className={styles.accountRow}>
              <span>Nội dung CK</span>
              <span className={styles.description}>{description}</span>
            </div>
          )}
        </div>

        {/* Confirm button */}
        <button
          className={styles.confirmBtn}
          onClick={() => {
            const params = new URLSearchParams({
              orderId,
              amount,
              transactionId,
            });
            window.location.href = `/order/success?${params.toString()}`;
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Xác nhận đã chuyển khoản
        </button>

        <p className={styles.note}>
          Sau khi chuyển khoản, nhấn nút trên để xác nhận. Chúng tôi sẽ kiểm tra và gửi email xác nhận trong vài phút.
        </p>
      </div>

      {/* Order info */}
      <div className={styles.orderInfo}>
        <h4>Thông tin đơn hàng</h4>
        {orderId && <p>Mã đơn hàng: <strong>#{orderId}</strong></p>}
      </div>

      {/* Back links */}
      <div className={styles.backLinks}>
        <Link href="/" className={styles.backLink}>Về trang chủ</Link>
        <span>·</span>
        <Link href="/cart" className={styles.backLink}>Xem giỏ hàng</Link>
      </div>
    </div>
  );
}

export default function OrderQrPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#1a1a1a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    }>
      <OrderQrContent />
    </Suspense>
  );
}
