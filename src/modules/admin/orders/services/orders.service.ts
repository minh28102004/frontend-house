import { API_URL_CLIENT, apiRoutes } from "@/config/apiRoutes";
import { getAuthHeaders } from "@/config/api";

export type AdminOrder = {
  _id: string;
  userId?: string;
  customer: {
    fullName: string;
    email?: string;
    phone: string;
    address: string;
    province?: string;
    district?: string;
    ward?: string;
  };
  items: Array<{
    productId: string;
    productSlug?: string;
    productName: string;
    productThumbnail?: string;
    size: string;
    price: number;
    quantity: number;
  }>;
  totalPrice: number;
  paymentMethod: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type ListOrdersResponse = {
  items: AdminOrder[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const AdminOrdersService = {
  list: async (page = 1, limit = 20): Promise<ListOrdersResponse> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) throw new Error("Bạn chưa đăng nhập");

    const res = await fetch(
      `${API_URL_CLIENT}${apiRoutes.ORDERS.GET_ALL(page, limit)}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
      }
    );

    if (!res.ok) {
      let msg = "Lỗi khi tải danh sách đơn hàng";
      try {
        const err = await res.json();
        msg = err?.message || msg;
      } catch { }
      throw new Error(msg);
    }

    return res.json();
  },
};

