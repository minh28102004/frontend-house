"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserService } from "@/modules/auth/users/services/user.service";
import { useRouter } from "next/navigation";

interface UserProfile {
  _id?: string;
  id?: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: string;
}

const EditProfilePage = () => {
  const { user, token, verifyToken } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data: UserProfile = await UserService.getCurrentUser();
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: data.address || "",
        });
        setAvatar(data.avatar || "");
        setAvatarPreview(data.avatar || null);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: "error", text: "Không thể tải thông tin profile" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Vui lòng chọn file ảnh" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ảnh không được lớn hơn 5MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploadingAvatar(true);
    try {
      const result = await UserService.uploadAvatar(file);
      setAvatar(result.url);
      setMessage({ type: "success", text: "Upload ảnh đại diện thành công!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.message || "Upload ảnh thất bại",
      });
      setAvatarPreview(avatar || null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSaving(true);
    setMessage(null);

    try {
      await UserService.updateUserInfo({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        avatar: avatar,
      });

      await verifyToken(token);

      setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      setTimeout(() => router.push("/profile"), 1500);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error?.message || "Cập nhật thất bại. Vui lòng thử lại.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto py-6 px-4 mt-12 md:mt-20">
        <div className="text-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-lg mx-auto py-6 px-4 mt-12 md:mt-20">
        <div className="text-center text-gray-500">Vui lòng đăng nhập để chỉnh sửa profile.</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-6 px-4 mt-12 md:mt-20">
      <h1 className="text-2xl font-bold mb-6 text-black uppercase">Chỉnh sửa Profile</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="relative cursor-pointer group"
            onClick={handleAvatarClick}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
              {uploadingAvatar ? (
                <div className="flex items-center justify-center w-full h-full">
                  <svg
                    className="animate-spin h-6 w-6 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              ) : avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-gray-400">
                  {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-2">Nhấn để thay đổi ảnh đại diện</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            placeholder="Nhập họ và tên"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
