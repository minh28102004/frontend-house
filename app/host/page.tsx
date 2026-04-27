"use client";

import { useAuth } from "@/context/AuthContext";
import { useHostRooms } from "@/modules/host/rooms/hooks";

export default function HostDashboardPage() {
  const { user } = useAuth();
  const { rooms, loading } = useHostRooms();

  const visibleRooms = rooms.filter(r => r.isVisible);
  const hiddenRooms = rooms.filter(r => !r.isVisible);
  const totalRevenue = rooms.reduce((sum, room) => sum + room.price, 0);

  const stats = [
    {
      label: "Tổng phòng",
      value: rooms.length,
      icon: "🏠",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Phòng hiển thị",
      value: visibleRooms.length,
      icon: "✅",
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Phòng đã ẩn",
      value: hiddenRooms.length,
      icon: "🔒",
      color: "bg-gray-50 text-gray-600",
    },
    {
      label: "Giá thấp nhất",
      value: rooms.length > 0
        ? new Intl.NumberFormat("vi-VN").format(Math.min(...rooms.map(r => r.price))) + "đ"
        : "-",
      icon: "💰",
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Xin chào, {user?.fullName || user?.email}!
        </h1>
        <p className="text-gray-500">
          Chào mừng bạn đến với trang quản lý dành cho Chủ nhà.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? "..." : stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <a
          href="/host/rooms/create"
          className="group bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
              ➕
            </div>
            <div>
              <h3 className="text-lg font-semibold group-hover:underline">Đăng phòng mới</h3>
              <p className="text-green-100 text-sm mt-1">
                Tạo phòng mới để cho thuê
              </p>
            </div>
          </div>
        </a>

        <a
          href="/host/rooms"
          className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl">
              📋
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                Quản lý phòng
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Xem và chỉnh sửa danh sách phòng của bạn
              </p>
            </div>
          </div>
        </a>
      </div>

      {/* Recent Rooms */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Phòng gần đây</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Đang tải...
            </div>
          ) : rooms.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Bạn chưa có phòng nào</p>
              <a
                href="/host/rooms/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <span>➕</span>
                <span>Đăng phòng ngay</span>
              </a>
            </div>
          ) : (
            rooms.slice(0, 5).map((room) => (
              <a
                key={room._id || room.concept}
                href={`/host/rooms/edit/${room.concept}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {room.thumbnail ? (
                    <img
                      src={room.thumbnail}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🏠
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{room.name}</p>
                  <p className="text-sm text-gray-500">Phòng {room.num}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-green-600">
                    {new Intl.NumberFormat("vi-VN").format(room.price)}đ
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    room.isVisible
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {room.isVisible ? "Hiển thị" : "Đã ẩn"}
                  </span>
                </div>
              </a>
            ))
          )}
        </div>
        {rooms.length > 5 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <a
              href="/host/rooms"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả ({rooms.length} phòng) →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}