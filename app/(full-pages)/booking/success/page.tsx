"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./success.module.css";

function SuccessContent() {
  const searchParams = useSearchParams();

  const roomName = searchParams.get("roomName") || "";
  const guestName = searchParams.get("guestName") || "";
  const guestEmail = searchParams.get("guestEmail") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const total = searchParams.get("total") || "0";
  const nights = searchParams.get("nights") || "1";

  const formattedTotal = new Intl.NumberFormat("vi-VN").format(Number(total));
  const formattedCheckIn = checkIn
    ? new Date(checkIn + "T12:00:00").toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  const formattedCheckOut = checkOut
    ? new Date(checkOut + "T12:00:00").toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroIcon}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className={styles.heroTitle}>Đặt phòng thành công!</h1>
        <p className={styles.heroSubtitle}>
          Cảm ơn {guestName || "bạn"} đã đặt phòng tại Another House.
          <br />
          Chúng tôi đã gửi xác nhận đến email <strong>{guestEmail}</strong>.
        </p>
      </div>

      {/* Details */}
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Chi tiết đặt phòng</h2>
          </div>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Phòng</span>
                <span className={styles.detailValue}>{roomName}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Số đêm</span>
                <span className={styles.detailValue}>{nights} đêm</span>
              </div>
            </div>

            {formattedCheckIn && (
              <div className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ngày nhận phòng</span>
                  <span className={styles.detailValue}>{formattedCheckIn}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Ngày trả phòng</span>
                  <span className={styles.detailValue}>{formattedCheckOut}</span>
                </div>
              </div>
            )}

            <div className={styles.detailRow}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Khách</span>
                <span className={styles.detailValue}>{guestName}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{guestEmail}</span>
              </div>
            </div>
          </div>

          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>Tổng cộng</span>
            <span className={styles.totalAmount}>{formattedTotal}đ</span>
          </div>

          <div className={styles.paymentNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <span>Thanh toán sẽ được thực hiện khi nhận phòng.</span>
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
              Chúng tôi đã gửi thông tin chi tiết đến email của bạn. Vui lòng kiểm tra hộp thư.
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
              Nếu bạn cần thay đổi hoặc hủy đặt phòng, vui lòng liên hệ sớm nhất qua hotline.
            </p>
            <a href="tel:+84901234567" className={styles.infoPhone}>0901 234 567</a>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className={styles.infoTitle}>Địa chỉ</h3>
            <p className={styles.infoText}>
              Another House, Đà Nẵng. Xem{" "}
              <Link href="/maps" className={styles.infoLink}>
                bản đồ
              </Link>{" "}
              để biết thêm chi tiết.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/rooms" className={styles.btnSecondary}>
            Xem các phòng khác
          </Link>
          <Link href="/" className={styles.btnPrimary}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#1a1a1a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
