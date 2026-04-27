'use client';

import React, { useState, useEffect } from 'react';
import { PointsService, type ExchangeCoupon, type UserCouponItem } from '../services/points.service';

interface Props {
  currentPoints: number;
  onExchangeSuccess: (newPoints: number) => void;
}

function formatDiscount(coupon: ExchangeCoupon) {
  if (coupon.type === 'percent') {
    return `Giảm ${coupon.value}%`;
  }
  return `Giảm ${coupon.value.toLocaleString('vi-VN')}đ`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function CouponExchangeSection({ currentPoints, onExchangeSuccess }: Props) {
  const [exchangeCoupons, setExchangeCoupons] = useState<ExchangeCoupon[]>([]);
  const [myCoupons, setMyCoupons] = useState<UserCouponItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'exchange' | 'wallet'>('exchange');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [coupons, wallet] = await Promise.all([
        PointsService.getExchangeCoupons(),
        PointsService.getMyCoupons(),
      ]);
      setExchangeCoupons(coupons);
      setMyCoupons(wallet.available);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExchange = async (coupon: ExchangeCoupon) => {
    if (currentPoints < coupon.pointsCost) {
      setMessage({ type: 'error', text: `Không đủ điểm. Bạn cần ${coupon.pointsCost} điểm.` });
      return;
    }

    setExchanging(coupon._id);
    setMessage(null);

    try {
      const result = await PointsService.exchangeCoupon(coupon._id);
      setMessage({ type: 'success', text: `Đổi thành công! Mã: ${result.coupon.couponCode}` });
      onExchangeSuccess(result.remainingPoints);
      await loadData();
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.response?.data?.message || e?.message || 'Đổi thất bại' });
    } finally {
      setExchanging(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-black">Đổi điểm lấy mã giảm giá</h2>
          <span className="text-sm text-blue-600 font-medium">
            {currentPoints.toLocaleString('vi-VN')} điểm
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('exchange')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'exchange'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Đổi mã giảm giá
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'wallet'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Ví mã ({myCoupons.length})
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mx-4 mt-3 px-3 py-2 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center text-sm text-gray-500 py-4">Đang tải...</div>
        ) : activeTab === 'exchange' ? (
          <div className="space-y-3">
            {exchangeCoupons.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">
                <p className="mb-1">Chưa có mã giảm giá nào để đổi.</p>
                <p className="text-xs">Admin sẽ thêm sớm!</p>
              </div>
            ) : (
              exchangeCoupons.map((coupon) => {
                const canAfford = currentPoints >= coupon.pointsCost;
                return (
                  <div
                    key={coupon._id}
                    className={`border rounded-xl p-3 flex items-center gap-3 ${
                      !canAfford ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">
                        {coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value / 1000}k`}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-black">{coupon.name}</p>
                      <p className="text-xs text-gray-500">{formatDiscount(coupon)}</p>
                      {coupon.minOrderAmount != null && coupon.minOrderAmount > 0 && (
                        <p className="text-xs text-gray-400">Đơn tối thiểu {coupon.minOrderAmount.toLocaleString('vi-VN')}đ</p>
                      )}
                      <p className="text-xs text-gray-400">HSD: {formatDate(coupon.endDate)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-sm font-bold mb-1 ${canAfford ? 'text-blue-600' : 'text-red-500'}`}>
                        {coupon.pointsCost.toLocaleString('vi-VN')} điểm
                      </div>
                      <button
                        onClick={() => handleExchange(coupon)}
                        disabled={!canAfford || exchanging === coupon._id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          canAfford
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {exchanging === coupon._id ? 'Đang đổi...' : 'Đổi ngay'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {myCoupons.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">
                <p>Ví mã giảm giá trống.</p>
                <p className="text-xs mt-1">Hãy đổi điểm để nhận mã!</p>
              </div>
            ) : (
              myCoupons.map((coupon) => (
                <div key={coupon._id} className="border border-green-200 bg-green-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg font-bold">
                      {coupon.couponType === 'percent' ? `${coupon.discountValue}%` : `${coupon.discountValue / 1000}k`}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-black">{coupon.couponName}</p>
                    <p className="text-xs font-mono font-bold text-blue-600">{coupon.couponCode}</p>
                    <p className="text-xs text-gray-500">
                      HSD: {formatDate(coupon.endDate)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded">
                      Đã đổi (-{coupon.pointsSpent}đ)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
