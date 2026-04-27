"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./success.module.css";

function OrderSuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId") || "";
  const amount = searchParams.get("amount") || "0";
  const transactionId = searchParams.get("transactionId") || "";

  const formatPrice = (v: string | number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(v));

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroIcon}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className={styles.heroTitle}>Đặt hàng thành công!</h1>
        <p className={styles.heroSubtitle}>
          Cảm ơn bạn đã đặt hàng tại Another House.
          <br />
          Chúng tôi sẽ kiểm tra thanh toán và gửi xác nhận trong giây lát.
        </p>
      </div>

      {/* Details */}
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Chi tiết đơn hàng</h2>
          </div>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mã đơn hàng</span>
                <span className={styles.detailValue}>#{orderId}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Mã giao dịch</span>
                <span className={styles.detailValue}>{transactionId || "—"}</span>
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Ngày đặt</span>
                <span className={styles.detailValue}>
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>Tổng thanh toán</span>
            <span className={styles.totalAmount}>{formatPrice(amount)}</span>
          </div>

          <div className={styles.paymentNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <span>
              Thanh toán đang được xác minh. Bạn sẽ nhận email xác nhận khi hoàn tất.
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className={styles.infoTitle}>Xác nhận qua email</h3>
            <p className={styles.infoText}>
              Chúng tôi sẽ gửi thông tin chi tiết đơn hàng đến email của bạn sau khi thanh toán được xác minh.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className={styles.infoTitle}>Liên hệ hỗ trợ</h3>
            <p className={styles.infoText}>
              Nếu bạn cần thay đổi hoặc hủy đơn hàng, vui lòng liên hệ sớm nhất qua hotline.
            </p>
            <a href="tel:+84901234567" className={styles.infoPhone}>0901 234 567</a>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className={styles.infoTitle}>Theo dõi đơn hàng</h3>
            <p className={styles.infoText}>
              Xem trạng thái đơn hàng của bạn bất kỳ lúc nào trong mục Tài khoản.
            </p>
            <Link href="/account/orders" className={styles.infoLink}>
              Xem đơn hàng của tôi
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/san-pham" className={styles.btnSecondary}>
            Tiếp tục mua sắm
          </Link>
          <Link href="/" className={styles.btnPrimary}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#1a1a1a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
