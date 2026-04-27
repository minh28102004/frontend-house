"use client";

import React, { useState, useEffect } from 'react';
import { HostVietQrConfig } from '../types';

interface HostVietQrFormProps {
  vietQr: HostVietQrConfig;
  onSave: (data: Partial<HostVietQrConfig>) => Promise<void>;
  saving?: boolean;
}

const VIETQR_BANKS = [
  { bin: '970405', name: 'Vietcombank' },
  { bin: '970418', name: 'VietinBank' },
  { bin: '970423', name: 'VPBank' },
  { bin: '970432', name: 'TPBank' },
  { bin: '970437', name: 'MBBank' },
  { bin: '970415', name: 'ACB' },
  { bin: '970438', name: 'SHB' },
  { bin: '970443', name: 'Sacombank' },
  { bin: '970422', name: 'BIDV' },
  { bin: '970448', name: 'OCB' },
];

export const HostVietQrForm: React.FC<HostVietQrFormProps> = ({
  vietQr,
  onSave,
  saving = false,
}) => {
  const [formData, setFormData] = useState<HostVietQrConfig>({
    bankBin: vietQr.bankBin || '',
    bankName: vietQr.bankName || '',
    accountNumber: vietQr.accountNumber || '',
    accountName: vietQr.accountName || '',
    template: vietQr.template || 'compact',
    isActive: vietQr.isActive ?? false,
  });

  useEffect(() => {
    setFormData({
      bankBin: vietQr.bankBin || '',
      bankName: vietQr.bankName || '',
      accountNumber: vietQr.accountNumber || '',
      accountName: vietQr.accountName || '',
      template: vietQr.template || 'compact',
      isActive: vietQr.isActive ?? false,
    });
  }, [vietQr]);

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = VIETQR_BANKS.find((bank) => bank.bin === e.target.value);
    setFormData((prev) => ({
      ...prev,
      bankBin: e.target.value,
      bankName: selectedBank?.name || '',
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const isFormValid = formData.bankBin && formData.accountNumber && formData.accountName;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bank Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngân hàng
          </label>
          <select
            name="bankBin"
            value={formData.bankBin}
            onChange={handleBankChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors bg-white"
          >
            <option value="">Chọn ngân hàng</option>
            {VIETQR_BANKS.map((bank) => (
              <option key={bank.bin} value={bank.bin}>
                {bank.name} ({bank.bin})
              </option>
            ))}
          </select>
        </div>

        {/* Bank BIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã BIN
          </label>
          <input
            type="text"
            name="bankBin"
            value={formData.bankBin}
            onChange={handleChange}
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
            placeholder="970405"
          />
        </div>
      </div>

      {/* Bank Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên ngân hàng
        </label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors bg-gray-50"
          placeholder="Tên ngân hàng (auto-filled)"
        />
      </div>

      {/* Account Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số tài khoản
        </label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
          placeholder="1234567890"
        />
      </div>

      {/* Account Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên tài khoản
        </label>
        <input
          type="text"
          name="accountName"
          value={formData.accountName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
          placeholder="NGUYEN VAN A"
        />
      </div>

      {/* Template */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giao diện QR
        </label>
        <select
          name="template"
          value={formData.template || 'compact'}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors bg-white"
        >
          <option value="compact">Compact</option>
          <option value="compact2">Compact 2</option>
          <option value="qr_only">QR Only</option>
        </select>
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                formData.isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          </div>
          <span className="ml-3 text-sm text-gray-700">Kích hoạt thanh toán QR</span>
        </label>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={saving || !isFormValid}
          className="w-full md:w-auto px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {saving ? 'Đang lưu...' : 'Lưu cấu hình VietQR'}
        </button>
      </div>
    </form>
  );
};
