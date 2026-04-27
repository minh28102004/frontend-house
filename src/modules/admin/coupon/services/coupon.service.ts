const BASE = '/api/couponsapi';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export type CouponType = 'percent' | 'fixed_amount';
export type CouponApplyTo = 'booking' | 'order' | 'all';
export type CouponStatus = 'active' | 'inactive';

export interface Coupon {
  _id: string;
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  applyTo: CouponApplyTo;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponPayload {
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applyTo: CouponApplyTo;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  perUserLimit?: number;
  status?: CouponStatus;
}

export interface UpdateCouponPayload {
  name?: string;
  description?: string;
  type?: CouponType;
  value?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applyTo?: CouponApplyTo;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  perUserLimit?: number;
  status?: CouponStatus;
}

export interface CouponStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
}

export interface CouponListResponse {
  items: Coupon[];
  total: number;
}

export const couponService = {
  getAll: async (page = 1, limit = 20, filter?: { status?: string; applyTo?: string }): Promise<CouponListResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filter?.status) params.set('status', filter.status);
    if (filter?.applyTo) params.set('applyTo', filter.applyTo);
    const res = await fetch(`${BASE}?${params}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Không thể tải danh sách mã giảm giá');
    return res.json();
  },

  getById: async (id: string): Promise<Coupon> => {
    const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Không thể tải thông tin mã giảm giá');
    return res.json();
  },

  create: async (payload: CreateCouponPayload): Promise<Coupon> => {
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

  update: async (id: string, payload: UpdateCouponPayload): Promise<Coupon> => {
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
    if (!res.ok) throw new Error('Không thể xóa mã giảm giá');
  },

  toggleStatus: async (id: string): Promise<Coupon> => {
    const res = await fetch(`${BASE}/${id}/toggle`, {
      method: 'PATCH',
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Không thể thay đổi trạng thái');
    return res.json();
  },

  getStats: async (): Promise<CouponStats> => {
    const res = await fetch(`${BASE}/stats`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Không thể tải thống kê');
    return res.json();
  },
};
