import api from '@/config/api';
import { apiRoutes } from '@/config/apiRoutes';
import { getAuthHeaders } from '@/config/api';

export interface RankInfo {
  rank: string;
  rankName: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  icon: string;
  benefits: string[];
}

export interface PointsInfo {
  points: number;
  totalEarned: number;
  totalSpent: number;
  totalOrders: number;
  rank: RankInfo;
  nextRank: RankInfo | null;
  progress: number;
  pointsToNextRank: number | null;
}

export interface ExchangeCoupon {
  _id: string;
  code: string;
  name: string;
  type: string;
  value: number;
  pointsCost: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
  applyTo: string;
  endDate: string;
}

export interface UserCouponItem {
  _id: string;
  couponCode: string;
  couponName: string;
  couponType: string;
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  applyTo: string;
  endDate: string;
  isUsed: boolean;
  pointsSpent: number;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function defaultPointsInfo(): PointsInfo {
  return {
    points: 0,
    totalEarned: 0,
    totalSpent: 0,
    totalOrders: 0,
    rank: {
      rank: 'bronze',
      rankName: 'Đồng',
      minPoints: 0,
      maxPoints: 499,
      color: '#CD7F32',
      icon: '🥉',
      benefits: ['Tích điểm mua hàng', 'Đổi quà từ 100 điểm'],
    },
    nextRank: {
      rank: 'silver',
      rankName: 'Bạc',
      minPoints: 500,
      maxPoints: 1999,
      color: '#C0C0C0',
      icon: '🥈',
      benefits: ['Tích điểm mua hàng', 'Ưu tiên xử lý đơn', 'Giảm 2% cho đơn hàng'],
    },
    progress: 0,
    pointsToNextRank: 500,
  };
}

export const PointsService = {
  getMyPoints: async (): Promise<PointsInfo> => {
    const token = getToken();
    if (!token) {
      return defaultPointsInfo();
    }
    try {
      const response = await api.get(apiRoutes.POINTS.ME, {
        headers: getAuthHeaders(token),
      });
      return response.data;
    } catch {
      return defaultPointsInfo();
    }
  },

  getRanks: async (): Promise<RankInfo[]> => {
    const response = await api.get(apiRoutes.POINTS.RANKS);
    return response.data;
  },

  getExchangeCoupons: async (): Promise<ExchangeCoupon[]> => {
    const token = getToken();
    if (!token) return [];
    try {
      const response = await api.get(apiRoutes.POINTS.EXCHANGE_COUPONS, {
        headers: getAuthHeaders(token),
      });
      return response.data || [];
    } catch (err: any) {
      console.error('getExchangeCoupons error:', err?.response?.data || err);
      throw new Error(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Không thể tải danh sách mã đổi điểm'
      );
    }
  },

  exchangeCoupon: async (couponId: string): Promise<{
    message: string;
    coupon: UserCouponItem;
    remainingPoints: number;
  }> => {
    const token = getToken();
    if (!token) throw new Error('Vui lòng đăng nhập');
    const response = await api.post(
      apiRoutes.POINTS.EXCHANGE,
      { couponId },
      { headers: getAuthHeaders(token) },
    );
    return response.data;
  },

  getMyCoupons: async (): Promise<{
    available: UserCouponItem[];
    used: UserCouponItem[];
    expired: UserCouponItem[];
  }> => {
    const token = getToken();
    if (!token) return { available: [], used: [], expired: [] };
    try {
      const response = await api.get(apiRoutes.POINTS.MY_COUPONS, {
        headers: getAuthHeaders(token),
      });
      return response.data || { available: [], used: [], expired: [] };
    } catch (err: any) {
      console.error('getMyCoupons error:', err?.response?.data || err);
      return { available: [], used: [], expired: [] };
    }
  },
};
