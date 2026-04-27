"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import RoomForm from "@/modules/admin/rooms/components/RoomForm";
import { RoomFormPayload } from "@/modules/admin/rooms/components/RoomForm";
import { useHostRooms } from "@/modules/host/rooms/hooks";
import { HostRoomService } from "@/modules/host/rooms/services";
import { Room } from "@/modules/host/rooms/types";

export default function HostEditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const concept = params.concept as string;
  const { updateRoom, loading } = useHostRooms();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const data = await HostRoomService.getByConcept(concept);
        setRoom(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Không tìm thấy phòng");
      } finally {
        setRoomLoading(false);
      }
    };
    if (concept) {
      fetchRoom();
    }
  }, [concept]);

  const handleUpdate = async (data: RoomFormPayload) => {
    setError(null);
    const success = await updateRoom(concept, data);
    if (success) {
      alert("Cập nhật phòng thành công!");
      router.push("/host/rooms");
    } else {
      setError("Lỗi khi cập nhật phòng. Vui lòng thử lại.");
    }
  };

  if (roomLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <Link href="/host/rooms" className="text-blue-600 hover:underline">
            ← Quay lại danh sách phòng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/host" className="hover:text-gray-700">Trang chủ</Link>
        <span>/</span>
        <Link href="/host/rooms" className="hover:text-gray-700">Quản lý phòng</Link>
        <span>/</span>
        <span className="text-gray-800">Sửa phòng</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sửa phòng</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cập nhật thông tin phòng "{room?.name}"
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg">
          Đang xử lý...
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <RoomForm room={room || undefined} onSuccess={handleUpdate} />
      </div>
    </div>
  );
}