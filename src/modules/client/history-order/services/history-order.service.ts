import { API_URL_CLIENT, apiRoutes } from "@/config/apiRoutes";
import { getAuthHeaders } from "@/config/api";
import api from "@/config/api";
import { OrderGuestStorage } from "@/utils/orderGuest.storage";
import type { Order } from "../types/order";

export type OrderItem = {
  productId: string;
  productSlug?: string;
  productName: string;
  productThumbnail?: string;
  price: number;
  quantity: number;
};

export type CustomerInfo = {
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
};

export type CreateOrderPayload = {
  orderId: string[];
};

export const OrderService = {
  getInfoOrderGuest: async (): Promise<Order[]> => {
    if (typeof window === "undefined") return [];

    const ids = OrderGuestStorage.getIds();
    if (ids.length === 0) return [];

    const res = await fetch(`${API_URL_CLIENT}${apiRoutes.ORDERS.LOOKUP}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) {
      let msg = "Lỗi khi lấy đơn hàng (guest)";
      try {
        const err = await res.json();
        msg = err?.message || msg;
      } catch { }
      throw new Error(msg);
    }

    return res.json();
  },

  getInfoOrderUser: async (authToken?: string | null): Promise<Order[]> => {
    const token =
      authToken ??
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) return [];

    try {
      const res = await api.get<Order[]>(apiRoutes.ORDERS.MY, {
        headers: getAuthHeaders(token),
      });
      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Lỗi khi lấy đơn hàng (user)";
      throw new Error(msg);
    }
  },

  getMyOrderHistory: async (authToken?: string | null): Promise<Order[]> => {
    const token =
      authToken ??
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    return token
      ? OrderService.getInfoOrderUser(token)
      : OrderService.getInfoOrderGuest();
  },

  getDetailOrder: async (id: string): Promise<Order | null> => {
    if (typeof window === "undefined") return null;

    const res = await fetch(`${API_URL_CLIENT}${apiRoutes.ORDERS.GET_BY_ID(id)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });

    if (!res.ok) {
      let msg = "Lỗi khi lấy chi tiết đơn hàng.";
      try {
        const err = await res.json();
        msg = err?.message || msg;
      } catch { }
      throw new Error(msg);
    }

    const data = await res.json();

    // Map từ backend response sang Order type
    const order: Order = {
      _id: data._id,
      customer: {
        fullName: data.customer?.fullName || "",
        email: data.customer?.email || "",
        phone: data.customer?.phone || "",
        address: data.customer?.address || "",
        province: data.customer?.province || "",
        district: data.customer?.district || "",
        ward: data.customer?.ward || "",
      },
      items: (data.items || []).map((it: any) => ({
        productId: it.productId,
        productSlug: it.productSlug || "",
        productName: it.productName,
        productThumbnail: it.productThumbnail || "",
        price: it.price,
        quantity: it.quantity,
      })),
      totalPrice: data.totalPrice,
      paymentMethod: (data.paymentMethod || "COD") as "COD" | "BANKING",
      status: (data.status || "processing") as Order["status"],
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };

    return order;
  },
};

