"use client";

import React, { useState, useEffect } from "react";
import { useMailSettings } from "../hooks/useMailSettings";
import { MailSettings, UpdateMailSettingsDto } from "../services/mail-settings.service";

type SettingsTab = "smtp" | "sender" | "notifications";

export const MailSettingsPage: React.FC = () => {
  const { useGetMailSettings, useUpdateMailSettings } = useMailSettings();
  const { data: settings, isLoading, error, refetch } = useGetMailSettings();
  const updateMutation = useUpdateMailSettings();

  const [tab, setTab] = useState<SettingsTab>("smtp");
  const [formData, setFormData] = useState<Partial<MailSettings>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (settings) {
      const rest = { ...settings };
      delete rest.smtpPassword;
      setFormData({
        ...rest,
        smtpPassword: '',
      });
    }
  }, [settings]);

  const handleChange = <K extends keyof MailSettings>(field: K, value: MailSettings[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const dataToSend: UpdateMailSettingsDto = { ...formData };
    if (!dataToSend.smtpPassword) {
      delete dataToSend.smtpPassword;
    }
    updateMutation.mutate(dataToSend);
  };

  const resetForm = () => {
    if (settings) {
      const rest = { ...settings };
      delete rest.smtpPassword;
      setFormData({
        ...rest,
        smtpPassword: '',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">Không thể tải cấu hình. Vui lòng thử lại.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tải lại
        </button>
      </div>
    );
  }

  const tabBtn = (id: SettingsTab, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
        tab === id
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cấu hình email</h1>
              <p className="text-gray-500 mt-1">
                SMTP, thông tin người gửi và cài đặt thông báo email
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {tabBtn("smtp", "Máy chủ SMTP")}
            {tabBtn("sender", "Người gửi")}
            {tabBtn("notifications", "Thông báo")}
          </div>
        </div>

        <div className="p-6">
          {tab === "smtp" && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Cấu hình SMTP</h2>
                    <p className="text-sm text-gray-500">Thông tin kết nối máy chủ email</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Host</label>
                    <input
                      type="text"
                      value={formData.smtpHost || ''}
                      onChange={(e) => handleChange('smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Port</label>
                      <input
                        type="number"
                        value={formData.smtpPort || 587}
                        onChange={(e) => handleChange('smtpPort', parseInt(e.target.value))}
                        placeholder="587"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-400 mt-1">587 (TLS) hoặc 465 (SSL)</p>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5 pt-7">
                        <input
                          type="checkbox"
                          checked={formData.smtpSecure || false}
                          onChange={(e) => handleChange('smtpSecure', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        Sử dụng SSL/TLS (Secure)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Username</label>
                    <input
                      type="text"
                      value={formData.smtpUser || ''}
                      onChange={(e) => handleChange('smtpUser', e.target.value)}
                      placeholder="your-email@gmail.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.smtpPassword || ''}
                        onChange={(e) => handleChange('smtpPassword', e.target.value)}
                        placeholder="App password (để trống nếu không đổi)"
                        className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? "Ẩn" : "Hiện"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Để trống nếu không muốn thay đổi mật khẩu</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Đặt lại
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Đang lưu..." : "Lưu SMTP"}
                </button>
              </div>
            </form>
          )}

          {tab === "sender" && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Thông tin người gửi</h2>
                    <p className="text-sm text-gray-500">Email và tên hiển thị khi gửi email</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email người gửi</label>
                    <input
                      type="email"
                      value={formData.senderEmail || ''}
                      onChange={(e) => handleChange('senderEmail', e.target.value)}
                      placeholder="no-reply@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email sẽ hiển thị trong phần &quot;From&quot; của email gửi đi</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên người gửi</label>
                    <input
                      type="text"
                      value={formData.senderName || ''}
                      onChange={(e) => handleChange('senderName', e.target.value)}
                      placeholder="Another House"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">Tên hiển thị thay cho email (VD: &quot;Another House&quot; thay vì &quot;no-reply@anotherhouse.vn&quot;)</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email nhận thông báo</label>
                    <input
                      type="email"
                      value={formData.notificationEmail || ''}
                      onChange={(e) => handleChange('notificationEmail', e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email nhận thông báo khi có đơn hàng mới, liên hệ, đặt phòng...</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Đặt lại
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Đang lưu..." : "Lưu thông tin người gửi"}
                </button>
              </div>
            </form>
          )}

          {tab === "notifications" && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Cài đặt thông báo</h2>
                    <p className="text-sm text-gray-500">Bật/tắt các loại thông báo qua email</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-purple-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-800">Thông báo email</label>
                      <p className="text-xs text-gray-500">Bật/tắt tất cả thông báo qua email</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="toggle"
                        checked={formData.emailNotificationsEnabled ?? true}
                        onChange={(e) => handleChange('emailNotificationsEnabled', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ease-in left-0.5 top-0.5"
                      />
                      <label
                        htmlFor="toggle-email"
                        className={`toggle-label block overflow-hidden h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                          formData.emailNotificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-purple-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-800">Thông báo đơn hàng</label>
                      <p className="text-xs text-gray-500">Gửi email khi có đơn hàng mới</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="toggle-order"
                        checked={formData.orderNotificationsEnabled ?? true}
                        onChange={(e) => handleChange('orderNotificationsEnabled', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ease-in left-0.5 top-0.5"
                      />
                      <label
                        htmlFor="toggle-order"
                        className={`toggle-label block overflow-hidden h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                          formData.orderNotificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-purple-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-800">Thông báo liên hệ</label>
                      <p className="text-xs text-gray-500">Gửi email khi có liên hệ mới</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="toggle-contact"
                        checked={formData.contactNotificationsEnabled ?? true}
                        onChange={(e) => handleChange('contactNotificationsEnabled', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ease-in left-0.5 top-0.5"
                      />
                      <label
                        htmlFor="toggle-contact"
                        className={`toggle-label block overflow-hidden h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                          formData.contactNotificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-purple-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-800">Thông báo đặt phòng</label>
                      <p className="text-xs text-gray-500">Gửi email khi có đặt phòng mới</p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        name="toggle-booking"
                        checked={formData.bookingNotificationsEnabled ?? true}
                        onChange={(e) => handleChange('bookingNotificationsEnabled', e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ease-in left-0.5 top-0.5"
                      />
                      <label
                        htmlFor="toggle-booking"
                        className={`toggle-label block overflow-hidden h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                          formData.bookingNotificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Đặt lại
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {updateMutation.isPending ? "Đang lưu..." : "Lưu thông báo"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Lưu ý</p>
            <ul className="list-disc list-inside flex flex-col gap-1 text-blue-600">
              <li>Sử dụng <strong className="font-medium">App Password</strong> cho Gmail thay vì mật khẩu thường.</li>
              <li>Tạo App Password tại: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline">Google App Passwords</a></li>
              <li>Với SMTP port 587 dùng TLS, port 465 dùng SSL.</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toggle-checkbox:checked {
          left: 1.75rem;
        }
        .toggle-checkbox {
          left: 0.125rem;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #10B981;
        }
        .toggle-checkbox:not(:checked) + .toggle-label {
          background-color: #D1D5DB;
        }
      `}</style>
    </div>
  );
};
