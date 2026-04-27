"use client";

import React, { useState, useEffect } from "react";
import type { AdminMapItem } from "../services/maps.service";

interface MapFormProps {
  initial?: Partial<AdminMapItem> | null;
  onSubmit: (data: Partial<AdminMapItem>) => Promise<void> | void;
  onCancel?: () => void;
}

const empty: Partial<AdminMapItem> = {
  name: "",
  address: "",
  phone: "",
  email: "",
  latitude: undefined,
  longitude: undefined,
  hours: "8:00 - 22:00",
  embedUrl: "",
  isActive: true,
};

export default function MapForm({ initial, onSubmit, onCancel }: MapFormProps) {
  const [form, setForm] = useState<Partial<AdminMapItem>>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setForm({ ...empty, ...(initial || {}) });
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "latitude" || name === "longitude") ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tên cửa hàng</label>
          <input name="name" value={form.name || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" value={form.email || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input name="phone" value={form.phone || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Giờ mở cửa</label>
          <input name="hours" value={form.hours || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Google Maps Embed URL (tùy chọn)</label>
          <input name="embedUrl" value={form.embedUrl || ""} onChange={handleChange} placeholder="https://www.google.com/maps/embed?pb=..." className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Địa chỉ</label>
          <textarea name="address" value={form.address || ""} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} required />
        </div>
        {showAdvanced && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input name="latitude" type="number" step="any" value={form.latitude ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input name="longitude" type="number" step="any" value={form.longitude ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </>
        )}
        <div className="flex items-center gap-2">
          <input id="isActive" name="isActive" type="checkbox" checked={!!form.isActive} onChange={handleChange} className="h-4 w-4" />
          <label htmlFor="isActive" className="text-sm">Hoạt động</label>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-black text-white rounded">
          {submitting ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" onClick={() => setShowAdvanced(v => !v)} className="px-4 py-2 border rounded">
          {showAdvanced ? 'Ẩn tùy chọn nâng cao' : 'Tùy chọn nâng cao'}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Hủy</button>
        ) : null}
      </div>
    </form>
  );
}


