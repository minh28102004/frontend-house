"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HostProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Hồ sơ Chủ nhà</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Avatar & Name */}
        <div className="px-6 py-8 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName || ""} className="w-full h-full object-cover" />
              ) : (
                (user?.fullName || user?.email || "H").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {user?.fullName || "Chưa cập nhật"}
              </h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                🏠 Chủ nhà
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <p className="font-medium text-gray-800">{user?.email || "-"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">Họ và tên</label>
            <p className="font-medium text-gray-800">{user?.fullName || "Chưa cập nhật"}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">Vai trò</label>
            <p className="font-medium text-green-600">Chủ nhà (Host)</p>
            <p className="text-xs text-gray-500 mt-1">
              Bạn có quyền đăng và quản lý phòng của mình trên nền tảng.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <Link
            href="/profile"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Chỉnh sửa hồ sơ
          </Link>
          <Link
            href="/host/rooms"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            ← Quản lý phòng
          </Link>
        </div>
      </div>
    </div>
  );
}