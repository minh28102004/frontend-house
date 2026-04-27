"use client";

import { HostCoupon } from '../types';

interface Props {
  coupons: HostCoupon[];
  loading: boolean;
  onEdit: (coupon: HostCoupon) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(price);

const formatDate = (date: string | Date | undefined) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const isExpired = (coupon: HostCoupon) => {
  if (!coupon.endDate) return false;
  return new Date(coupon.endDate) < new Date();
};

const isNotStarted = (coupon: HostCoupon) => {
  if (!coupon.startDate) return false;
  return new Date(coupon.startDate) > new Date();
};

const handleCopyCode = (code: string) => {
  navigator.clipboard.writeText(code);
};

export default function HostCouponList({
  coupons,
  loading,
  onEdit,
  onDelete,
  onToggle,
  onPageChange,
  currentPage,
  totalPages,
}: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border border-green-100 bg-green-50">
        <svg className="w-12 h-12 mx-auto text-green-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <p className="text-green-600 font-medium">Chưa có mã giảm giá nào</p>
        <p className="text-green-500 text-sm mt-1">Tạo mã giảm giá đầu tiên của bạn</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-green-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-50 border-b border-green-100">
              <th className="text-left px-4 py-3 font-semibold text-green-800 whitespace-nowrap">Mã</th>
              <th className="text-left px-4 py-3 font-semibold text-green-800 whitespace-nowrap">Loại</th>
              <th className="text-left px-4 py-3 font-semibold text-green-800 whitespace-nowrap">Giá trị</th>
              <th className="text-left px-4 py-3 font-semibold text-green-800 whitespace-nowrap">Áp dụng cho</th>
              <th className="text-left px-4 py-3 font-semibold text-green-800 whitespace-nowrap">Đã dùng</th>
              <th className="text-left px-4 py-3 font-semibold text-green-800 whitespace-nowrap">Thời hạn</th>
              <th className="text-left px-4 py-3 font-semibold text-green-800 whitespace-nowrap">Trạng thái</th>
              <th className="text-right px-4 py-3 font-semibold text-green-800">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => {
              const expired = isExpired(coupon);
              const notStarted = isNotStarted(coupon);
              const outOfUses = coupon.usageLimit && coupon.usageLimit > 0 && coupon.usageCount && coupon.usageCount >= coupon.usageLimit;
              const disabled = expired || notStarted || outOfUses || coupon.status !== 'active';

              return (
                <tr key={coupon._id} className="border-b border-green-50 hover:bg-green-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="p-1 hover:bg-green-100 rounded transition-colors"
                        title="Sao chép mã"
                      >
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      coupon.type === 'percent' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {coupon.type === 'percent' ? 'Phần trăm' : 'Số tiền'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-green-800">
                      {coupon.type === 'percent' ? `${coupon.value}%` : formatPrice(coupon.value)}
                    </span>
                    {coupon.type === 'percent' && coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0 && (
                      <div className="text-xs text-green-500">Max {formatPrice(coupon.maxDiscountAmount)}</div>
                    )}
                    {coupon.minOrderAmount && coupon.minOrderAmount > 0 && (
                      <div className="text-xs text-gray-400">Tối thiểu {formatPrice(coupon.minOrderAmount)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      coupon.applyTo === 'booking'
                        ? 'bg-blue-50 text-blue-700'
                        : coupon.applyTo === 'order'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-green-50 text-green-700'
                    }`}>
                      {coupon.applyTo === 'booking' ? 'Phòng' : coupon.applyTo === 'order' ? 'Sản phẩm' : 'Tất cả'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="font-semibold text-gray-900">
                      {coupon.usageCount || 0}
                      {coupon.usageLimit && coupon.usageLimit > 0 && (
                        <span className="text-gray-400"> / {coupon.usageLimit}</span>
                      )}
                    </div>
                    {coupon.usageLimit && coupon.usageLimit > 0 && (
                      <div className="w-full bg-green-100 rounded-full h-1 mt-1">
                        <div
                          className={`h-1 rounded-full ${outOfUses ? 'bg-red-400' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, ((coupon.usageCount || 0) / coupon.usageLimit) * 100)}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                    <div>{formatDate(coupon.startDate)}</div>
                    <div className="text-gray-400">→ {formatDate(coupon.endDate)}</div>
                    {expired && <span className="text-red-500 font-medium">Đã hết hạn</span>}
                    {notStarted && <span className="text-yellow-600 font-medium">Chưa bắt đầu</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onToggle(coupon._id!)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        disabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : coupon.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      disabled={disabled}
                      title={disabled ? 'Không thể thay đổi trạng thái khi hết hạn/hết lượt' : ''}
                    >
                      {disabled ? 'Dừng' : coupon.status === 'active' ? 'Hoạt động' : 'Tắt'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(coupon)}
                        className="px-3 py-1.5 text-xs font-medium border border-green-200 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => onDelete(coupon._id!)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm border border-green-200 rounded-lg disabled:opacity-40 hover:bg-green-50 transition-colors text-green-700"
          >
            ← Trước
          </button>
          <span className="text-sm text-gray-600 px-2">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm border border-green-200 rounded-lg disabled:opacity-40 hover:bg-green-50 transition-colors text-green-700"
          >
            Sau →
          </button>
        </div>
      )}
    </>
  );
}
