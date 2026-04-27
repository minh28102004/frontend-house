"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./qr.module.css";

export default function BookingQrPage() {
  const searchParams = useSearchParams();

  const qrCodeUrl = searchParams.get("qrCodeUrl") || "";
  const amount = searchParams.get("amount") || "0";
  const accountNo = searchParams.get("accountNo") || "";
  const accountName = searchParams.get("accountName") || "";
  const description = searchParams.get("description") || "";
  const bookingId = searchParams.get("bookingId") || "";
  const roomName = searchParams.get("roomName") || "";
  const guestName = searchParams.get("guestName") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const formatPrice = (v: string | number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(v));

  const formatDate = (d: string) => {
    if (!d) return "";
    return new Date(d + "T12:00:00").toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  if (!qrCodeUrl) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.title}>Không có thông tin thanh toán</h2>
          <Link href="/" className={styles.btnPrimary}>Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Quét mã QR để thanh toán</h2>
        <p className={styles.subheading}>
          Mở app ngân hàng hoặc Ví điện tử, quét mã bên dưới và xác nhận.
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
              concept: roomName,
              roomName,
              guestName,
              checkIn,
              checkOut,
              total: amount,
              nights: "1",
            });
            window.location.href = `/booking/success?${params.toString()}`;
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Xác nhận đã chuyển khoản
        </button>

        <p className={styles.note}>
          Sau khi chuyển khoản, nhấn nút trên để xác nhận. Chúng tôi sẽ kiểm tra và gửi email xác nhận trong vài phút.
        </p>
      </div>

      {/* Booking info */}
      <div className={styles.bookingInfo}>
        <h4>Thông tin đặt phòng</h4>
        {bookingId && <p>Mã đặt phòng: <strong>{bookingId}</strong></p>}
        {roomName && <p>Phòng: <strong>{roomName}</strong></p>}
        {guestName && <p>Khách: <strong>{guestName}</strong></p>}
        {checkIn && checkOut && (
          <p>Ngày: <strong>{formatDate(checkIn)} → {formatDate(checkOut)}</strong></p>
        )}
      </div>
    </div>
  );
}
