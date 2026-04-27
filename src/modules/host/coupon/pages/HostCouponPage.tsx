"use client";

import { useEffect, useState } from 'react';
import { HostCouponList, HostCouponForm } from '../components';
import { useHostCoupons } from '../hooks';
import { CreateCouponData, HostCoupon, UpdateCouponData } from '../types';

type FilterStatus = 'all' | 'active' | 'inactive';

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

export default function HostCouponPage() {
  const {
    coupons,
    loading,
    pagination,
    stats,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCoupon,
  } = useHostCoupons();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<HostCoupon | null>(null);

  useEffect(() => {
    const filter = filterStatus !== 'all' ? { status: filterStatus } : undefined;
    fetchCoupons(1, filter);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const handlePageChange = (page: number) => {
    const filter = filterStatus !== 'all' ? { status: filterStatus } : undefined;
    fetchCoupons(page, filter);
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setShowForm(true);
  };

  const handleEdit = (coupon: HostCoupon) => {
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCoupon(null);
    const filter = filterStatus !== 'all' ? { status: filterStatus } : undefined;
    fetchCoupons(1, filter);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa mã giảm giá này?')) return;
    const success = await deleteCoupon(id);
    if (success) {
      const filter = filterStatus !== 'all' ? { status: filterStatus } : undefined;
      fetchCoupons(pagination.page, filter);
    }
  };

  const handleToggle = async (id: string) => {
    const updated = await toggleCoupon(id);
    if (updated) {
      const filter = filterStatus !== 'all' ? { status: filterStatus } : undefined;
      fetchCoupons(pagination.page, filter);
    }
  };

  const handleSave = async (data: CreateCouponData | UpdateCouponData, isEdit: boolean): Promise<boolean> => {
    if (isEdit && editingCoupon?._id) {
      const result = await updateCoupon(editingCoupon._id, data as UpdateCouponData);
      return !!result;
    } else {
      const result = await createCoupon(data as CreateCouponData);
      return !!result;
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-green-800">Mã Giảm Giá</h1>
          <p className="text-sm text-gray-500 mt-1">
            Chỉ mã do bạn tạo (backend lọc theo tài khoản host — không phải kho mã admin).
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo mã mới
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Tổng mã" value={stats.total} color="bg-blue-50 text-blue-700" />
          <StatCard label="Đang hoạt động" value={stats.active} color="bg-green-50 text-green-700" />
          <StatCard label="Hết hạn" value={stats.expired} color="bg-red-50 text-red-600" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-green-50 p-1 rounded-lg">
          {(['all', 'active', 'inactive'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filterStatus === status
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-green-600 hover:text-green-800'
              }`}
            >
              {status === 'all' ? 'Tất cả' : status === 'active' ? 'Hoạt động' : 'Dừng'}
            </button>
          ))}
        </div>
        <div className="ml-auto text-sm text-gray-500">
          Hiển thị {coupons.length} / {pagination.total} mã
        </div>
      </div>

      <HostCouponList
        coupons={coupons}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
        onPageChange={handlePageChange}
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <HostCouponForm
              coupon={editingCoupon}
              onSuccess={handleFormSuccess}
              onClose={() => { setShowForm(false); setEditingCoupon(null); }}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
