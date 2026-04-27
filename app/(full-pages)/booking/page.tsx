"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BookingClientService,
  CreateBookingPayload,
  BookingRoomInfo,
  uploadClientService,
} from "@/modules/client/booking";
import { PaymentService } from "@/modules/client/payments/services/payment.service";
import { CouponService, type ValidateCouponResult } from "@/modules/client/coupon/services/coupon.service";
import { useAuth } from "@/context/AuthContext";

import styles from "./BookingPage.module.css";

function BookingContent() {
  const ALLOWED_CCCD_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
  const ALLOWED_CCCD_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

  const router = useRouter();
  const searchParams = useSearchParams();
  const concept = searchParams.get("concept") || "";
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";

  const [room, setRoom] = useState<BookingRoomInfo | null>(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [checkIn, setCheckIn] = useState(checkInParam);
  const [checkOut, setCheckOut] = useState(checkOutParam);

  // CCCD state
  const [cccdFront, setCccdFront] = useState("");
  const [cccdBack, setCccdBack] = useState("");
  const [cccdFrontFile, setCccdFrontFile] = useState<File | null>(null);
  const [cccdBackFile, setCccdBackFile] = useState<File | null>(null);
  const [uploadingCccd, setUploadingCccd] = useState(false);
  const [cccdError, setCccdError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY" | "VIETQR">("COD");
  const [availabilityStatus, setAvailabilityStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<ValidateCouponResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      setGuestEmail((prev) => (prev.trim() === "" ? user.email! : prev));
    }
  }, [user?.email]);

  useEffect(() => {
    if (!concept) {
      setRoomError("Không có thông tin phòng. Vui lòng chọn phòng trước.");
      setRoomLoading(false);
      return;
    }

    const fetchRoom = async () => {
      setRoomLoading(true);
      setRoomError(null);
      try {
        const res = await fetch(`/api/roomsapi/${encodeURIComponent(concept)}`);
        if (!res.ok) throw new Error("Không tìm thấy phòng");
        const data = await res.json();
        setRoom(data as BookingRoomInfo);
      } catch {
        setRoomError("Không thể tải thông tin phòng. Vui lòng thử lại.");
      } finally {
        setRoomLoading(false);
      }
    };

    fetchRoom();
  }, [concept]);

  useEffect(() => {
    if (!concept || !checkIn || !checkOut) {
      setAvailabilityStatus("idle");
      return;
    }

    const check = async () => {
      setAvailabilityStatus("checking");
      try {
        const result = await BookingClientService.checkAvailability(
          concept,
          checkIn,
          checkOut,
        );
        setAvailabilityStatus(result.available ? "available" : "unavailable");
      } catch {
        setAvailabilityStatus("idle");
      }
    };

    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [concept, checkIn, checkOut]);

  const priceCalc = useMemo(() => {
    if (!room || !checkIn || !checkOut) return null;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const nights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / 86400000));
    const subtotal = nights * room.price;
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + serviceFee;
    return { nights, subtotal, serviceFee, total };
  }, [room, checkIn, checkOut]);

  const formatPrice = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

  const today = new Date().toISOString().split("T")[0];

  // Coupon validation
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá");
      return;
    }
    if (!priceCalc?.total) {
      setCouponError("Vui lòng chọn ngày trước");
      return;
    }
    setCouponLoading(true);
    setCouponError(null);
    try {
      const result = await CouponService.validate(couponCode.trim(), priceCalc.total, "booking");
      setCouponResult(result);
      if (!result.valid) {
        setCouponError(result.message || "Mã giảm giá không hợp lệ");
      }
    } catch {
      setCouponError("Không thể kiểm tra mã giảm giá");
      setCouponResult(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
    setCouponError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!room) {
      setSubmitError("Không có thông tin phòng.");
      return;
    }

    if (availabilityStatus === "unavailable") {
      setSubmitError("Phòng không còn trống trong khoảng ngày bạn chọn.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload: CreateBookingPayload = {
      concept: room.concept,
      roomName: room.name,
      guestName,
      guestEmail,
      guestPhone,
      guestMessage,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice: couponResult?.finalAmount || priceCalc?.total || 0,
      specialRequests,
      numberOfGuests,
      cccdFront: cccdFront || undefined,
      cccdBack: cccdBack || undefined,
      paymentMethod,
    };

    try {
      const created = await BookingClientService.create(payload);

      if (paymentMethod !== "COD") {
        const provider = paymentMethod === "VNPAY" ? "vnpay" : "vietqr";
        const payment = await PaymentService.create({
          provider,
          targetType: "booking",
          targetId: created.booking._id,
          amount: couponResult?.finalAmount || priceCalc?.total || 0,
          description: `BOOKING-${created.booking._id}`,
          customerEmail: guestEmail,
        });

        if (provider === "vnpay" && payment.paymentUrl) {
          window.location.href = payment.paymentUrl;
          return;
        }

        // VietQR: redirect sang trang hiển thị mã QR cho khách quét
        const qrParams = new URLSearchParams({
          transactionId: payment.transactionId,
          qrCodeUrl: payment.qrCodeUrl || "",
          amount: String(priceCalc?.total || 0),
          expiresAt: payment.expiresAt || "",
          accountNo: payment.accountNo || "",
          accountName: payment.accountName || "",
          description: payment.description || "",
          bookingId: String(created.booking._id),
          roomName: room.name,
          guestName,
          checkIn,
          checkOut,
        });
        router.push(`/booking/qr?${qrParams.toString()}`);
        return;
      }

      const params = new URLSearchParams({
        concept: room.concept,
        roomName: room.name,
        guestName,
        guestEmail,
        checkIn,
        checkOut,
        total: String(priceCalc?.total || 0),
        nights: String(priceCalc?.nights || 1),
      });
      router.push(`/booking/success?${params.toString()}`);
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ||
        err?.message ||
        "Đã xảy ra lỗi khi đặt phòng. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectRoom = () => {
    router.push("/rooms");
  };

  const validateCccdImage = (file: File): string | null => {
    const fileName = file.name.toLowerCase();
    const hasAllowedExtension = ALLOWED_CCCD_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    const hasAllowedMimeType = file.type ? ALLOWED_CCCD_MIME_TYPES.has(file.type.toLowerCase()) : false;

    if (!hasAllowedMimeType && !hasAllowedExtension) {
      return "Chỉ hỗ trợ ảnh PNG, JPG, WEBP. Nếu ảnh là HEIC, vui lòng chuyển sang JPG/PNG.";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "Kích thước ảnh quá lớn (tối đa 10MB).";
    }

    return null;
  };

  // Upload CCCD mặt trước
  const handleCccdFrontChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateCccdImage(file);
    if (validationError) {
      setCccdError(validationError);
      return;
    }

    setCccdError(null);
    setCccdFrontFile(file);
    setUploadingCccd(true);

    try {
      const result = await uploadClientService.uploadImage(file);
      setCccdFront(result.imageUrl);
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      setCccdError(serverMessage || "Tải ảnh CCCD mặt trước thất bại. Vui lòng thử lại.");
    } finally {
      setUploadingCccd(false);
    }
  };

  // Upload CCCD mặt sau
  const handleCccdBackChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateCccdImage(file);
    if (validationError) {
      setCccdError(validationError);
      return;
    }

    setCccdError(null);
    setCccdBackFile(file);
    setUploadingCccd(true);

    try {
      const result = await uploadClientService.uploadImage(file);
      setCccdBack(result.imageUrl);
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      setCccdError(serverMessage || "Tải ảnh CCCD mặt sau thất bại. Vui lòng thử lại.");
    } finally {
      setUploadingCccd(false);
    }
  };

  // Xóa ảnh CCCD mặt trước
  const handleRemoveCccdFront = () => {
    setCccdFront("");
    setCccdFrontFile(null);
  };

  // Xóa ảnh CCCD mặt sau
  const handleRemoveCccdBack = () => {
    setCccdBack("");
    setCccdBackFile(null);
  };

  if (roomLoading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Đang tải thông tin phòng...</p>
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className={styles.errorWrap}>
        <div className={styles.errorIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <h2 className={styles.errorTitle}>
          {roomError || "Không tìm thấy phòng"}
        </h2>
        <p className={styles.errorDesc}>
          Vui lòng chọn phòng trước khi đặt.
        </p>
        <button onClick={handleSelectRoom} className={styles.errorBtn}>
          Chọn phòng ngay
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Trang chủ</Link>
            <span>/</span>
            <Link href="/rooms">Phòng</Link>
            <span>/</span>
            <span>{room.name}</span>
          </nav>
          <h1 className={styles.pageTitle}>Đặt phòng</h1>
          <p className={styles.pageSubtitle}>
            Another House — {room.name}
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left: Form */}
          <div className={styles.formCol}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Room Summary Card */}
              <div className={styles.roomCard}>
                <div className={styles.roomCardImg}>
                  <Image
                    src={room.thumbnail || room.gallery?.[0] || "/img/placeholder.jpg"}
                    alt={room.name}
                    fill
                    className={styles.roomCardImgEl}
                    sizes="120px"
                  />
                </div>
                <div className={styles.roomCardInfo}>
                  <p className={styles.roomCardName}>{room.name}</p>
                  <p className={styles.roomCardPrice}>
                    {formatPrice(room.price)}đ <span>/ đêm</span>
                  </p>
                  {priceCalc && (
                    <p className={styles.roomCardNights}>
                      {priceCalc.nights} đêm · {checkIn} → {checkOut}
                    </p>
                  )}
                </div>
              </div>

              {/* Date Selection */}
              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Ngày ở</h3>
                <div className={styles.dateGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Ngày check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={(e) => setCheckIn(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Ngày check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      onChange={(e) => setCheckOut(e.target.value)}
                      required
                      className={styles.input}
                    />
                  </div>
                </div>

                {availabilityStatus === "checking" && (
                  <p className={styles.availMsg}>Đang kiểm tra tình trạng phòng...</p>
                )}
                {availabilityStatus === "available" && (
                  <p className={`${styles.availMsg} ${styles.availOk}`}>
                    ✓ Phòng còn trống
                  </p>
                )}
                {availabilityStatus === "unavailable" && (
                  <p className={`${styles.availMsg} ${styles.availNo}`}>
                    ✗ Phòng đã được đặt trong khoảng ngày này
                  </p>
                )}
              </section>

              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Phương thức thanh toán</h3>
                <div className={styles.fieldGrid}>
                  <label className={styles.field} style={{ cursor: "pointer" }}>
                    <div className={styles.label}>Tùy chọn 1</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                      />
                      <span>Thanh toán khi nhận phòng</span>
                    </div>
                  </label>
                  <label className={styles.field} style={{ cursor: "pointer" }}>
                    <div className={styles.label}>Tùy chọn 2</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "VNPAY"}
                        onChange={() => setPaymentMethod("VNPAY")}
                      />
                      <span>Thanh toán qua VNPay</span>
                    </div>
                  </label>
                  <label className={styles.field} style={{ cursor: "pointer" }}>
                    <div className={styles.label}>Tùy chọn 3</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "VIETQR"}
                        onChange={() => setPaymentMethod("VIETQR")}
                      />
                      <span>Thanh toán bằng VietQR</span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Guest Info */}
              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Thông tin khách</h3>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Họ và tên <span className={styles.required}>*</span></label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email <span className={styles.required}>*</span></label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="VD: email@example.com"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Số điện thoại <span className={styles.required}>*</span></label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="VD: 0901234567"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Số khách</label>
                    <select
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                      className={styles.input}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n} khách</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* CCCD Upload */}
              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}>
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 8h10M7 12h6M7 16h4" />
                  </svg>
                  Căn cước công dân (bắt buộc)
                </h3>
                <p className={styles.cccdNote}>
                  Vui lòng chụp ảnh hoặc tải lên ảnh mặt trước và mặt sau CCCD/CMND để hoàn tất thủ tục đặt phòng.
                </p>

                {cccdError && (
                  <div className={styles.cccdError}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4m0 4h.01" />
                    </svg>
                    {cccdError}
                  </div>
                )}

                <div className={styles.cccdGrid}>
                  {/* Mặt trước */}
                  <div className={styles.cccdField}>
                    <label className={styles.cccdLabel}>
                      Mặt trước CCCD <span className={styles.required}>*</span>
                    </label>
                    {cccdFront ? (
                      <div className={styles.cccdPreview}>
                        <div className={styles.cccdImgWrap}>
                          <Image
                            src={cccdFront}
                            alt="CCCD mặt trước"
                            fill
                            className={styles.cccdImg}
                            sizes="200px"
                          />
                        </div>
                        <div className={styles.cccdImgActions}>
                          <button
                            type="button"
                            onClick={handleRemoveCccdFront}
                            className={styles.cccdRemoveBtn}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa
                          </button>
                        </div>
                        <div className={styles.cccdSuccessBadge}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          Đã tải lên
                        </div>
                      </div>
                    ) : (
                      <label className={styles.cccdUploadBox}>
                        {uploadingCccd ? (
                          <div className={styles.cccdUploading}>
                            <div className={styles.cccdSpinner} />
                            <span>Đang tải lên...</span>
                          </div>
                        ) : (
                          <>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.cccdUploadIcon}>
                              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className={styles.cccdUploadText}>Tải ảnh mặt trước</span>
                            <span className={styles.cccdUploadHint}>PNG, JPG, WEBP (tối đa 10MB)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCccdFrontChange}
                          className={styles.hiddenInput}
                          disabled={uploadingCccd}
                        />
                      </label>
                    )}
                  </div>

                  {/* Mặt sau */}
                  <div className={styles.cccdField}>
                    <label className={styles.cccdLabel}>
                      Mặt sau CCCD <span className={styles.required}>*</span>
                    </label>
                    {cccdBack ? (
                      <div className={styles.cccdPreview}>
                        <div className={styles.cccdImgWrap}>
                          <Image
                            src={cccdBack}
                            alt="CCCD mặt sau"
                            fill
                            className={styles.cccdImg}
                            sizes="200px"
                          />
                        </div>
                        <div className={styles.cccdImgActions}>
                          <button
                            type="button"
                            onClick={handleRemoveCccdBack}
                            className={styles.cccdRemoveBtn}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa
                          </button>
                        </div>
                        <div className={styles.cccdSuccessBadge}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          Đã tải lên
                        </div>
                      </div>
                    ) : (
                      <label className={styles.cccdUploadBox}>
                        {uploadingCccd ? (
                          <div className={styles.cccdUploading}>
                            <div className={styles.cccdSpinner} />
                            <span>Đang tải lên...</span>
                          </div>
                        ) : (
                          <>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.cccdUploadIcon}>
                              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className={styles.cccdUploadText}>Tải ảnh mặt sau</span>
                            <span className={styles.cccdUploadHint}>PNG, JPG, WEBP (tối đa 10MB)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCccdBackChange}
                          className={styles.hiddenInput}
                          disabled={uploadingCccd}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </section>

              {/* Messages */}
              <section className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Lời nhắn (tùy chọn)</h3>
                <div className={styles.fieldGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Lời chúc / Ghi chú</label>
                    <textarea
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      placeholder="VD: Kỷ niệm ngày cưới, muốn hoa tươi trong phòng..."
                      rows={3}
                      className={`${styles.input} ${styles.textarea}`}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Yêu cầu đặc biệt</label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="VD: Cần nôi em bé, chỗ để xe máy..."
                      rows={3}
                      className={`${styles.input} ${styles.textarea}`}
                    />
                  </div>
                </div>
              </section>

              {submitError && (
                <div className={styles.errorAlert}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" />
                  </svg>
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  availabilityStatus === "checking" ||
                  availabilityStatus === "unavailable" ||
                  !cccdFront ||
                  !cccdBack
                }
                className={styles.submitBtn}
              >
                {submitting
                  ? "Đang xử lý..."
                  : !cccdFront || !cccdBack
                    ? "Vui lòng tải ảnh CCCD"
                    : "Xác nhận đặt phòng"}
              </button>

              <p className={styles.disclaimer}>
                Bằng việc xác nhận đặt phòng, bạn đồng ý với{" "}
                <Link href="/rules">điều khoản sử dụng</Link> của Another House.
              </p>
            </form>
          </div>

          {/* Right: Price Summary */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Tóm tắt đơn</h3>

              {room && (
                <div className={styles.summaryRoom}>
                  <p className={styles.summaryRoomName}>{room.name}</p>
                  <p className={styles.summaryRoomConcept}>{room.concept}</p>
                </div>
              )}

              {checkIn && checkOut ? (
                <div className={styles.summaryDates}>
                  <div className={styles.summaryDateRow}>
                    <span>Check-in</span>
                    <span>{new Date(checkIn + "T12:00:00").toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "short" })}</span>
                  </div>
                  <div className={styles.summaryDateRow}>
                    <span>Check-out</span>
                    <span>{new Date(checkOut + "T12:00:00").toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "short" })}</span>
                  </div>
                </div>
              ) : (
                <div className={styles.summaryDates}>
                  <p className={styles.summaryNoDate}>Chưa chọn ngày</p>
                </div>
              )}

              {priceCalc ? (
                <div className={styles.summaryBreakdown}>
                  {/* Coupon Input */}
                  {couponResult?.valid ? (
                    <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{couponResult.code}</span>
                          <span style={{ fontSize: 12, color: "#16a34a", marginLeft: 6 }}>{couponResult.name}</span>
                          <div style={{ fontSize: 11, color: "#16a34a", marginTop: 2 }}>
                            -{formatPrice(couponResult.discountAmount)}đ
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                        >
                          ✕ Bỏ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(null); }}
                          placeholder="Nhập mã giảm giá"
                          style={{ flex: 1, fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 8px", outline: "none" }}
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          disabled={couponLoading}
                          style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: "#2f86ad", border: "none", borderRadius: 6, padding: "6px 10px", cursor: couponLoading ? "not-allowed" : "pointer", opacity: couponLoading ? 0.6 : 1 }}
                        >
                          {couponLoading ? "..." : "Áp dụng"}
                        </button>
                      </div>
                      {couponError && (
                        <p style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{couponError}</p>
                      )}
                    </div>
                  )}

                  <div className={styles.summaryLine}>
                    <span>{formatPrice(room.price)}đ × {priceCalc.nights} đêm</span>
                    <span>{formatPrice(priceCalc.subtotal)}đ</span>
                  </div>
                  <div className={styles.summaryLine}>
                    <span>Phí dịch vụ (5%)</span>
                    <span>{formatPrice(priceCalc.serviceFee)}đ</span>
                  </div>
                  {couponResult?.valid ? (
                    <>
                      <div className={styles.summaryLine} style={{ color: "#16a34a" }}>
                        <span>Mã: {couponResult.code} ({couponResult.name})</span>
                        <span>-{formatPrice(couponResult.discountAmount)}đ</span>
                      </div>
                      <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
                        <strong>Tổng cộng</strong>
                        <strong className={styles.totalAmt}>{formatPrice(couponResult.finalAmount)}đ</strong>
                      </div>
                    </>
                  ) : (
                    <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
                      <strong>Tổng cộng</strong>
                      <strong className={styles.totalAmt}>{formatPrice(priceCalc.total)}đ</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.summaryBreakdown}>
                  <p className={styles.summaryNoDate}>
                    Chọn ngày để xem giá
                  </p>
                </div>
              )}

              <div className={styles.summaryExtras}>
                <div className={styles.summaryExtra}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Miễn phí hủy trước 48h
                </div>
                <div className={styles.summaryExtra}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Xác nhận tức thì
                </div>
                <div className={styles.summaryExtra}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {paymentMethod === "COD"
                    ? "Thanh toán khi nhận phòng"
                    : paymentMethod === "VNPAY"
                      ? "Thanh toán online qua VNPay"
                      : "Thanh toán online qua VietQR"}
                </div>
              </div>
            </div>

            <div className={styles.helpCard}>
              <h4 className={styles.helpTitle}>Cần hỗ trợ?</h4>
              <p className={styles.helpText}>
                Liên hệ trực tiếp với chúng tôi nếu bạn cần tư vấn thêm.
              </p>
              <a href="tel:+84901234567" className={styles.helpPhone}>
                0901 234 567
              </a>
              <a href="https://zalo.me/0901234567" className={styles.helpZalo}>
                Nhắn Zalo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <p>Đang tải...</p>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
