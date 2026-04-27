"use client";

import React, { useEffect } from 'react';
import { useHostQrCode } from '../hooks/useHostQrCode';
import { HostVietQrForm } from '../components/HostVietQrForm';
import { HostBusinessInfoForm } from '../components/HostBusinessInfoForm';
import { QrPreview } from '../components/QrPreview';

export const HostQrCodePage: React.FC = () => {
  const { settings, loading, saving, fetchSettings, updateSettings } = useHostQrCode();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleVietQrSave = async (data: any) => {
    await updateSettings({ vietQr: data });
  };

  const handleBusinessInfoSave = async (data: any) => {
    await updateSettings(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-500">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Cấu hình VietQR</h1>
        <p className="mt-1 text-sm text-gray-500">
          Thiết lập thông tin thanh toán và VietQR cho tài khoản host của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* VietQR Configuration */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Cấu hình VietQR</h2>
                <p className="text-sm text-gray-500">Thông tin tài khoản ngân hàng để nhận thanh toán</p>
              </div>
            </div>
            <HostVietQrForm
              vietQr={settings.vietQr}
              onSave={handleVietQrSave}
              saving={saving}
            />
          </div>

          {/* Business Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Thông tin doanh nghiệp</h2>
                <p className="text-sm text-gray-500">Thông tin hiển thị trên QR Code</p>
              </div>
            </div>
            <HostBusinessInfoForm
              settings={settings}
              onSave={handleBusinessInfoSave}
              saving={saving}
            />
          </div>
        </div>

        {/* Right Column - QR Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <QrPreview vietQr={settings.vietQr} />

            {/* Status Badge */}
            <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trạng thái thanh toán</span>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    settings.vietQr.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {settings.vietQr.isActive ? 'Đang bật' : 'Đang tắt'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
