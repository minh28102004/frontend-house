"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/common/components/ui/button/Button";
import { AdminBadge, AdminPageHeader } from "@/modules/admin/common/components/AdminUi";
import RoomForm, { RoomFormPayload } from "../components/RoomForm";
import { getRoomByConcept } from "../services/room.service";
import { Room } from "../types/room.types";

const EditRoomPage = () => {
  const router = useRouter();
  const params = useParams();
  const concept = params.concept as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!concept) return;

    getRoomByConcept(concept)
      .then(setRoom)
      .catch(() => {
        setError("Không tìm thấy phòng.");
      })
      .finally(() => setLoading(false));
  }, [concept]);

  const handleUpdate = async (data: RoomFormPayload) => {
    setError(null);
    try {
      const { updateRoom } = await import("../services/room.service");
      await updateRoom(concept, data);
      router.push("/admin/rooms");
    } catch (requestError: unknown) {
      const message =
        typeof requestError === "object" &&
        requestError !== null &&
        "response" in requestError &&
        typeof requestError.response === "object" &&
        requestError.response !== null &&
        "data" in requestError.response &&
        typeof requestError.response.data === "object" &&
        requestError.response.data !== null &&
        "message" in requestError.response.data &&
        typeof requestError.response.data.message === "string"
          ? requestError.response.data.message
          : "Không thể cập nhật phòng.";

      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="ah-admin-page">
        <AdminBadge tone="warning">Đang tải dữ liệu phòng...</AdminBadge>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="ah-admin-page flex flex-col gap-5">
        <AdminBadge tone="danger">{error}</AdminBadge>
        <Button variant="outline" onClick={() => router.push("/admin/rooms")}>
          Quay lại danh sách phòng
        </Button>
      </div>
    );
  }

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Chỉnh sửa"
        title={room ? `Phòng ${room.name}` : "Chỉnh sửa phòng"}
        description="Cập nhật thông tin hiển thị, hình ảnh và tiện ích của phòng trong cùng bộ giao diện vận hành."
      />

      {error && <AdminBadge tone="danger">{error}</AdminBadge>}

      {room && <RoomForm room={room} onSuccess={handleUpdate} />}
    </div>
  );
};

export default EditRoomPage;
