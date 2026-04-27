"use client";

import { useState } from 'react';
import toast from '@/common/utils/toast';
import { HostCoupon, CreateCouponData, UpdateCouponData, CouponType, CouponApplyTo } from '../types';

interface Props {
  coupon: HostCoupon | null;
  onSuccess: () => void;
  onClose: () => void;
  onSave: (data: CreateCouponData | UpdateCouponData, isEdit: boolean) => Promise<boolean>;
}

const today = new Date().toISOString().split('T')[0];
const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function HostCouponForm({ coupon, onSuccess, onClose, onSave }: Props) {
  const isEdit = !!coupon;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: coupon?.code || '',
    type: (coupon?.type || 'percent') as CouponType,
    value: coupon?.value || 10,
    minOrderAmount: coupon?.minOrderAmount || 0,
    maxDiscountAmount: coupon?.maxDiscountAmount || 0,
    applyTo: (coupon?.applyTo || 'booking') as CouponApplyTo,
    startDate: coupon?.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : today,
    endDate: coupon?.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : thirtyDaysLater,
    usageLimit: coupon?.usageLimit || 0,
    perUserLimit: coupon?.perUserLimit || 1,
    isActive: coupon?.status === 'active' ? true : false,
    description: coupon?.description || '',
  });

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code.trim()) return toast.error('Vui lÃ²ng nháº­p mÃ£ giáº£m giÃ¡');
    if (form.value <= 0) return toast.error('GiÃ¡ trá»‹ giáº£m pháº£i lá»›n hÆ¡n 0');
    if (form.type === 'percent' && form.value > 100) return toast.error('Pháº§n trÄƒm giáº£m tá»‘i Ä‘a lÃ  100%');
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      return toast.error('NgÃ y káº¿t thÃºc pháº£i sau ngÃ y báº¯t Ä‘áº§u');
    }

    setLoading(true);
    try {
      let payload: CreateCouponData | UpdateCouponData;

      if (isEdit) {
        payload = {
          type: form.type,
          value: form.value,
          minOrderAmount: form.minOrderAmount,
          maxDiscountAmount: form.maxDiscountAmount,
          applyTo: form.applyTo,
          startDate: form.startDate,
          endDate: form.endDate,
          usageLimit: form.usageLimit,
          perUserLimit: form.perUserLimit,
          status: form.isActive ? 'active' as const : 'inactive' as const,
          description: form.description || undefined,
        };
      } else {
        payload = {
          code: form.code,
          type: form.type,
          value: form.value,
          minOrderAmount: form.minOrderAmount,
          maxDiscountAmount: form.maxDiscountAmount,
          applyTo: form.applyTo,
          startDate: form.startDate,
          endDate: form.endDate,
          usageLimit: form.usageLimit,
          perUserLimit: form.perUserLimit,
          status: form.isActive ? 'active' as const : 'inactive' as const,
          description: form.description || undefined,
        };
      }

      const success = await onSave(payload, isEdit);
      if (success) {
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err?.message || 'ÄÃ£ xáº£y ra lá»—i');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = () => {
    const newCode = generateRandomCode();
    set('code', newCode);
  };

  const typeLabel = form.type === 'percent' ? '%' : 'VNÄ';

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-green-800">
          {isEdit ? 'Sá»­a MÃ£ Giáº£m GiÃ¡' : 'Táº¡o MÃ£ Giáº£m GiÃ¡ Má»›i'}
        </h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">âœ•</button>
      </div>

      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MÃ£ giáº£m giÃ¡ *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                disabled={isEdit}
                placeholder="VD: SUMMER2026"
                className="flex-1 border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 disabled:bg-green-50"
              />
              {!isEdit && (
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Táº¡o
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loáº¡i giáº£m</label>
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="percent">Pháº§n trÄƒm (%)</option>
              <option value="fixed_amount">Sá»‘ tiá»n cá»‘ Ä‘á»‹nh (VNÄ)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GiÃ¡ trá»‹ giáº£m</label>
            <div className="relative">
              <input
                type="number"
                value={form.value}
                onChange={(e) => set('value', Number(e.target.value))}
                min="0"
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{typeLabel}</span>
            </div>
          </div>
          {form.type === 'percent' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giáº£m tá»‘i Ä‘a (VNÄ)</label>
              <input
                type="number"
                value={form.maxDiscountAmount}
                onChange={(e) => set('maxDiscountAmount', Number(e.target.value))}
                min="0"
                placeholder="0 = khÃ´ng giá»›i háº¡n"
                className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ÄÆ¡n hÃ ng tá»‘i thiá»ƒu (VNÄ)</label>
            <input
              type="number"
              value={form.minOrderAmount}
              onChange={(e) => set('minOrderAmount', Number(e.target.value))}
              min="0"
              placeholder="0 = khÃ´ng giá»›i háº¡n"
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ãp dá»¥ng cho</label>
            <select
              value={form.applyTo}
              onChange={(e) => set('applyTo', e.target.value)}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="booking">Äáº·t phÃ²ng</option>
              <option value="room">PhÃ²ng</option>
              <option value="order">Mua sáº£n pháº©m</option>
              <option value="all">Táº¥t cáº£</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá»›i háº¡n sá»­ dá»¥ng</label>
            <input
              type="number"
              value={form.usageLimit}
              onChange={(e) => set('usageLimit', Number(e.target.value))}
              min="0"
              placeholder="0 = khÃ´ng giá»›i háº¡n"
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Má»—i ngÆ°á»i dÃ¹ng tá»‘i Ä‘a</label>
            <input
              type="number"
              value={form.perUserLimit}
              onChange={(e) => set('perUserLimit', Number(e.target.value))}
              min="1"
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NgÃ y báº¯t Ä‘áº§u</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NgÃ y káº¿t thÃºc</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
              className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MÃ´ táº£</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="MÃ´ táº£ ngáº¯n (tÃ¹y chá»n)"
            rows={2}
            className="w-full border border-green-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="w-4 h-4 accent-green-600 rounded"
            />
            <span className="font-medium text-gray-700">KÃ­ch hoáº¡t ngay</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-4 border-t border-green-100">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 text-sm font-semibold border border-green-200 rounded-lg hover:bg-green-50 text-green-700 transition-colors"
        >
          Há»§y
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Äang xá»­ lÃ½...' : isEdit ? 'LÆ°u thay Ä‘á»•i' : 'Táº¡o mÃ£ giáº£m giÃ¡'}
        </button>
      </div>
    </form>
  );
}

