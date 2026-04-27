"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useHostRooms } from "@/modules/host/rooms/hooks";
import { Room } from "@/modules/host/rooms/types";

export default function HostRoomsPage() {
  const { rooms, loading, toggleVisibility } = useHostRooms();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleToggleVisibility = async (room: Room) => {
    if (window.confirm(`Bạn có chắc muốn ${room.isVisible ? "ẩn" : "hiển thị"} phòng "${room.name}"?`)) {
      await toggleVisibility(room.concept);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý phòng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý danh sách phòng của bạn
          </p>
        </div>
        <Link
          href="/host/rooms/create"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
        >
          <span className="text-lg">➕</span>
          <span>Đăng phòng mới</span>
        </Link>
      </div>

      {/* Room List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Ảnh
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Tên phòng
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Số phòng
                </th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Giá
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Trạng thái
                </th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
                      <span>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : !rooms || rooms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="text-5xl mb-3">🏠</div>
                    <p className="text-gray-500 mb-4">Bạn chưa có phòng nào</p>
                    <Link
                      href="/host/rooms/create"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <span>➕</span>
                      <span>Đăng phòng ngay</span>
                    </Link>
                  </td>
                </tr>
              ) : (
                rooms.map((room, index) => (
                  <tr key={room._id || room.concept} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 border-b border-gray-100">
                      {room.thumbnail ? (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={room.thumbnail}
                            alt={room.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          🏠
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100">
                      <div className="font-medium text-gray-800">{room.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{room.concept}</div>
                      {room.features && room.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {room.features.slice(0, 2).map((f, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                              {f}
                            </span>
                          ))}
                          {room.features.length > 2 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              +{room.features.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100">
                      <span className="font-mono font-semibold text-gray-700">{room.num}</span>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-right font-semibold text-green-600">
                      {formatPrice(room.price)}đ
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">
                      <button
                        onClick={() => handleToggleVisibility(room)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          room.isVisible
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {room.isVisible ? "✓ Hiển thị" : "Đã ẩn"}
                      </button>
                    </td>
                    <td className="py-3 px-4 border-b border-gray-100 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <button
                          onClick={() => setSelectedRoom(room)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-lg transition-colors"
                        >
                          Chi tiết
                        </button>
                        <Link
                          href={`/host/rooms/edit/${room.concept}`}
                          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                        >
                          Sửa
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Chi tiết phòng</h3>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {selectedRoom.thumbnail && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 mb-4">
                <Image
                  src={selectedRoom.thumbnail}
                  alt={selectedRoom.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 block">Tên phòng</label>
                  <p className="font-semibold text-gray-800">{selectedRoom.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block">Số phòng</label>
                  <p className="font-semibold text-gray-800">{selectedRoom.num}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block">Concept</label>
                  <p className="font-mono text-sm text-gray-600">{selectedRoom.concept}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block">Giá</label>
                  <p className="font-bold text-green-600 text-lg">
                    {formatPrice(selectedRoom.price)}đ
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block">Trạng thái</label>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    selectedRoom.isVisible
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {selectedRoom.isVisible ? "Đang hiển thị" : "Đã ẩn"}
                  </span>
                </div>
              </div>

              {selectedRoom.description && (
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Mô tả</label>
                  <p className="text-gray-700 text-sm">{selectedRoom.description}</p>
                </div>
              )}

              {selectedRoom.features && selectedRoom.features.length > 0 && (
                <div>
                  <label className="text-sm text-gray-500 block mb-2">Tiện ích</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedRoom.gallery && selectedRoom.gallery.length > 0 && (
                <div>
                  <label className="text-sm text-gray-500 block mb-2">Bộ sưu tập ảnh</label>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedRoom.gallery.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Link
                href={`/host/rooms/edit/${selectedRoom.concept}`}
                className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-lg transition-colors font-medium"
                onClick={() => setSelectedRoom(null)}
              >
                Sửa phòng
              </Link>
              <button
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}