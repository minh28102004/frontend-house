"use client";

import React, { useState, useEffect } from 'react';
import { HostQrSettings } from '../types';

interface HostBusinessInfoFormProps {
  settings: HostQrSettings;
  onSave: (data: Partial<HostQrSettings>) => Promise<void>;
  saving?: boolean;
}

export const HostBusinessInfoForm: React.FC<HostBusinessInfoFormProps> = ({
  settings,
  onSave,
  saving = false,
}) => {
  const [formData, setFormData] = useState({
    businessName: settings.businessName || '',
    businessAddress: settings.businessAddress || '',
    businessPhone: settings.businessPhone || '',
    businessEmail: settings.businessEmail || '',
  });

  useEffect(() => {
    setFormData({
      businessName: settings.businessName || '',
      businessAddress: settings.businessAddress || '',
      businessPhone: settings.businessPhone || '',
      businessEmail: settings.businessEmail || '',
    });
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Business Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên doanh nghiệp
        </label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
          placeholder="Công Ty TNHH ABC"
        />
      </div>

      {/* Business Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ doanh nghiệp
        </label>
        <textarea
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors resize-none"
          placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
        />
      </div>

      {/* Business Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại
        </label>
        <input
          type="tel"
          name="businessPhone"
          value={formData.businessPhone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
          placeholder="0901234567"
        />
      </div>

      {/* Business Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="businessEmail"
          value={formData.businessEmail}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
          placeholder="contact@example.com"
        />
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
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
          {saving ? 'Đang lưu...' : 'Lưu thông tin doanh nghiệp'}
        </button>
      </div>
    </form>
  );
};
