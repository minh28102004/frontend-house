import { CreateCouponData, CouponListResponse, HostCoupon, HostCouponStats, UpdateCouponData } from '../types';

/** Backend tự lọc theo JWT: role host chỉ thấy/sửa mã của chính họ (không dùng chung kho admin). */
const BASE = '/api/couponsapi';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const hostCouponService = {
  getAll: async (page = 1, limit = 10, filter?: { status?: string }): Promise<CouponListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filter?.status) params.set('status', filter.status);
    const res = await fetch(`${BASE}?${params}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Không thể tải danh sách mã giảm giá');
    return res.json();
  },

  getById: async (id: string): Promise<HostCoupon> => {
    const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Không thể tải thông tin mã giảm giá');
    return res.json();
  },

  create: async (payload: CreateCouponData): Promise<HostCoupon> => {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Lỗi tạo mã giảm giá' }));
      throw new Error(err.message || 'Lỗi tạo mã giảm giá');
    }
    return res.json();
  },

  update: async (id: string, payload: UpdateCouponData): Promise<HostCoupon> => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Lỗi cập nhật mã giảm giá' }));
      throw new Error(err.message || 'Lỗi cập nhật mã giảm giá');
    }
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Lỗi xóa mã giảm giá' }));
      throw new Error(err.message || 'Lỗi xóa mã giảm giá');
    }
  },

  toggleStatus: async (id: string): Promise<HostCoupon> => {
    const res = await fetch(`${BASE}/${id}/toggle`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Không thể thay đổi trạng thái');
    return res.json();
  },

  getStats: async (): Promise<HostCouponStats> => {
    const res = await fetch(`${BASE}/stats`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Không thể tải thống kê');
    return res.json();
  },
};
