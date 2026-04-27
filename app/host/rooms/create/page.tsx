"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RoomForm from "@/modules/admin/rooms/components/RoomForm";
import { RoomFormPayload } from "@/modules/admin/rooms/components/RoomForm";
import { useHostRooms } from "@/modules/host/rooms/hooks";

export default function HostCreateRoomPage() {
  const router = useRouter();
  const { createRoom, loading } = useHostRooms();
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (data: RoomFormPayload) => {
    setError(null);
    const success = await createRoom(data);
    if (success) {
      alert("Tạo phòng thành công!");
      router.push("/host/rooms");
    } else {
      setError("Lỗi khi tạo phòng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/host" className="hover:text-gray-700">Trang chủ</Link>
        <span>/</span>
        <Link href="/host/rooms" className="hover:text-gray-700">Quản lý phòng</Link>
        <span>/</span>
        <span className="text-gray-800">Đăng phòng mới</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Đăng phòng mới</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tạo phòng mới để bắt đầu cho thuê
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
        <RoomForm onSuccess={handleCreate} />
      </div>
    </div>
  );
}