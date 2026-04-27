"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminBadge, AdminPageHeader } from "@/modules/admin/common/components/AdminUi";
import RoomForm, { RoomFormPayload } from "../components/RoomForm";
import { useRooms } from "../hooks/useRooms";

const CreateRoomPage = () => {
  const router = useRouter();
  const { createRoom, loading } = useRooms();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: RoomFormPayload) => {
    setError(null);
    const success = await createRoom(data);
    if (success) {
      router.push("/admin/rooms");
    } else {
      setError("Không thể tạo phòng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Tạo mới"
        title="Thêm phòng vào hệ thống"
        description="Dùng route riêng khi cần thao tác sâu hoặc chia sẻ trực tiếp cho đội vận hành."
      />

      {error && <AdminBadge tone="danger">{error}</AdminBadge>}
      {loading && <AdminBadge tone="warning">Đang xử lý dữ liệu phòng...</AdminBadge>}

      <RoomForm onSuccess={handleCreate} />
    </div>
  );
};

export default CreateRoomPage;
