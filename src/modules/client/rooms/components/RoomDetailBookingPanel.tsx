"use client";

import { useMemo } from "react";
import styles from "./RoomDetailBookingPanel.module.css";

interface RoomDetail {
  _id: string;
  concept: string;
  name: string;
  price: number;
}

interface Props {
  room: RoomDetail;
  checkIn: string;
  checkOut: string;
  onCheckInChange: (v: string) => void;
  onCheckOutChange: (v: string) => void;
  onBookNow: () => void;
}

export function RoomDetailBookingPanel({
  room,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  onBookNow,
}: Props) {
  const calc = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const nights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
    const subtotal = nights * room.price;
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + serviceFee;
    return { nights, subtotal, serviceFee, total };
  }, [checkIn, checkOut, room.price]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={styles.panel}>
      <div className={styles.priceHeader}>
        <span className={styles.priceValue}>{formatPrice(room.price)}đ</span>
        <span className={styles.priceUnit}>/ đêm</span>
      </div>

      <div className={styles.dateRow}>
        <div className={styles.dateField}>
          <label className={styles.dateLabel}>Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => onCheckInChange(e.target.value)}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.dateDivider} />
        <div className={styles.dateField}>
          <label className={styles.dateLabel}>Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={(e) => onCheckOutChange(e.target.value)}
            className={styles.dateInput}
          />
        </div>
      </div>

      {calc && (
        <div className={styles.calcSection}>
          <div className={styles.calcRow}>
            <span>
              {formatPrice(room.price)}đ × {calc.nights} đêm
            </span>
            <span>{formatPrice(calc.subtotal)}đ</span>
          </div>
          <div className={styles.calcRow}>
            <span>Phí dịch vụ</span>
            <span>{formatPrice(calc.serviceFee)}đ</span>
          </div>
          <div className={`${styles.calcRow} ${styles.calcTotal}`}>
            <strong>Tổng cộng</strong>
            <strong className={styles.totalValue}>{formatPrice(calc.total)}đ</strong>
          </div>
        </div>
      )}

      <button onClick={onBookNow} className={styles.bookBtn}>
        Đặt phòng ngay
      </button>

      <div className={styles.extras}>
        <div className={styles.extraItem}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Không tính phí hủy
        </div>
        <div className={styles.extraItem}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Xác nhận tức thì
        </div>
      </div>
    </div>
  );
}
