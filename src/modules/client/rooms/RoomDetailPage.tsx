"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoomDetail } from "./hooks/useRoomDetail";
import { RoomDetailBookingPanel } from "./components/RoomDetailBookingPanel";
import styles from "./RoomDetailPage.module.css";

interface Props {
  room: RoomDetail;
}

export default function RoomDetailPage({ room }: Props) {
  const [activeImg, setActiveImg] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const router = useRouter();

  const allImages = useMemo(
    () =>
      room.thumbnail
        ? [room.thumbnail, ...(room.gallery || [])]
        : room.gallery || [],
    [room.thumbnail, room.gallery],
  );

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert("Vui lòng chọn ngày check-in và check-out");
      return;
    }
    const params = new URLSearchParams({
      concept: room.concept,
      checkIn,
      checkOut,
    });
    router.push(`/booking?${params.toString()}`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  return (
    <div className={styles.page}>
      {/* Desktop Layout */}
      <div className={styles.desktopLayout}>
        {/* Left: Gallery + Info */}
        <div className={styles.leftCol}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <Image
                src={allImages[activeImg] || "/img/placeholder.jpg"}
                alt={room.name}
                fill
                className={styles.mainImg}
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>
            {allImages.length > 1 && (
              <div className={styles.thumbList}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbBtn} ${activeImg === i ? styles.thumbActive : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <Image
                      src={img}
                      alt={`${room.name} ${i + 1}`}
                      fill
                      className={styles.thumbImg}
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Room Info */}
          <div className={styles.infoSection}>
            <div className={styles.roomHeader}>
              <span className={styles.roomNum}>Room {room.num}</span>
              <h1 className={styles.roomName}>{room.name}</h1>
              <div className={styles.roomPrice}>
                <strong>{formatPrice(room.price)}đ</strong>
                <span> / đêm</span>
              </div>
            </div>

            {room.description && (
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Giới thiệu</h3>
                <p className={styles.infoText}>{room.description}</p>
              </div>
            )}

            {room.features && room.features.length > 0 && (
              <div className={styles.infoBlock}>
                <h3 className={styles.infoTitle}>Tiện ích</h3>
                <div className={styles.features}>
                  {room.features.map((f, i) => (
                    <span key={i} className={styles.featureTag}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.infoBlock}>
              <h3 className={styles.infoTitle}>Địa chỉ</h3>
              <p className={styles.infoText}>
                Another House, Đà Nẵng — Xem trên{" "}
                <Link href="/maps" className={styles.mapLink}>
                  bản đồ
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Booking Panel */}
        <div className={styles.rightCol}>
          <RoomDetailBookingPanel
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onBookNow={handleBookNow}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className={styles.mobileLayout}>
        {/* Gallery */}
        <div className={styles.mobileGallery}>
          <div className={styles.mobileMainImage}>
            <Image
              src={allImages[activeImg] || "/img/placeholder.jpg"}
              alt={room.name}
              fill
              className={styles.mainImg}
              sizes="100vw"
              priority
            />
          </div>
          {allImages.length > 1 && (
            <div className={styles.mobileThumbs}>
              {allImages.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.mobileThumb} ${activeImg === i ? styles.thumbActive : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <Image src={img} alt="" fill className={styles.thumbImg} sizes="60px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className={styles.mobileInfo}>
          <span className={styles.roomNum}>Room {room.num}</span>
          <h1 className={styles.roomName}>{room.name}</h1>
          <div className={styles.roomPrice}>
            <strong>{formatPrice(room.price)}đ</strong>
            <span> / đêm</span>
          </div>

          {room.description && (
            <p className={styles.mobileDesc}>{room.description}</p>
          )}

          {room.features && room.features.length > 0 && (
            <div className={styles.features}>
              {room.features.map((f, i) => (
                <span key={i} className={styles.featureTag}>
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Booking */}
        <div className={styles.mobileBooking}>
          <RoomDetailBookingPanel
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            onCheckInChange={setCheckIn}
            onCheckOutChange={setCheckOut}
            onBookNow={handleBookNow}
          />
        </div>
      </div>
    </div>
  );
}
