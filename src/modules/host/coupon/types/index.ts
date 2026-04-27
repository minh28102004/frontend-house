export type CouponType = 'percent' | 'fixed_amount';
export type CouponApplyTo = 'booking' | 'order' | 'all';
export type CouponStatus = 'active' | 'inactive';

export interface HostCoupon {
  _id?: string;
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applyTo: CouponApplyTo;
  usageLimit?: number;
  usageCount?: number;
  perUserLimit?: number;
  startDate?: Date;
  endDate?: Date;
  status?: CouponStatus;
  pointsCost?: number;
  requiresPointsExchange?: boolean;
  hostId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCouponData {
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
  pointsCost?: number;
  requiresPointsExchange?: boolean;
}

export interface UpdateCouponData {
  code?: string;
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
  pointsCost?: number;
  requiresPointsExchange?: boolean;
}

export interface CouponListResponse {
  items: HostCoupon[];
  total: number;
  page: number;
  limit: number;
}

export interface HostCouponStats {
  total: number;
  active: number;
  inactive: number;
  expired: number;
}
