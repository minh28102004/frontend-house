import api from '@/config/api';

export type CouponType = 'percent' | 'fixed_amount';
export type CouponApplyTo = 'booking' | 'order' | 'all';

export interface ValidateCouponResult {
  valid: boolean;
  code: string;
  name: string;
  type: CouponType;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  message?: string;
}

const BASE = '/api/couponsapi';

export const CouponService = {
  /**
   * Validate mã coupon (không tăng usageCount)
   * @param code Mã coupon
   * @param orderAmount Tổng tiền đơn hàng
   * @param targetType 'booking' | 'order'
   */
  validate: async (
    code: string,
    orderAmount: number,
    targetType: 'booking' | 'order' = 'order',
  ): Promise<ValidateCouponResult> => {
    const res = await api.post(`${BASE}/validate`, {
      code,
      orderAmount,
      targetType,
    });
    return res.data;
  },
};
