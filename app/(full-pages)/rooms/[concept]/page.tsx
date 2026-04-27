"use client";

import { useRoomDetail } from "@/modules/client/rooms/hooks/useRoomDetail";
import RoomDetailPage from "@/modules/client/rooms/RoomDetailPage";
import styles from "@/modules/client/rooms/RoomDetailPage.module.css";

export default function RoomDetailRoute() {
  const { room, loading, error } = useRoomDetail();

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Đang tải thông tin phòng...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className={styles.errorWrap}>
        <h2 className={styles.errorTitle}>Phòng không tồn tại</h2>
        <p className={styles.errorText}>
          {error || "Không tìm thấy phòng bạn yêu cầu."}
        </p>
        <a href="/rooms" className={styles.errorLink}>
          Quay lại danh sách phòng
        </a>
      </div>
    );
  }

  return <RoomDetailPage room={room} />;
}
