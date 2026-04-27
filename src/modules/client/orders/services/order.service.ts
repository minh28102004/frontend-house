import { API_URL_CLIENT, apiRoutes } from "@/config/apiRoutes";
import { getAuthHeaders } from "@/config/api";
import { OrderGuestStorage } from "@/utils/orderGuest.storage";

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
};

export type CreateOrderPayload = {
  customer: CustomerInfo;
  items: OrderItem[];
  paymentMethod?: "COD" | "VNPAY" | "VIETQR";
  note?: string;
};

export const OrderService = {
  create: async (payload: CreateOrderPayload) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers = token
      ? getAuthHeaders(token)
      : { "Content-Type": "application/json", Accept: "application/json" };

    const res = await fetch(`${API_URL_CLIENT}${apiRoutes.ORDERS.CREATE}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = "Lỗi khi tạo đơn hàng";
      try {
        const err = await res.json();
        msg = err?.message || msg;
      } catch { }
      throw new Error(msg);
    }

    const data = await res.json()
    console.log("Thông tin đơn hàng được tạo: ", data)
    localStorage.setItem("orderGuest", JSON.stringify(data))

    OrderGuestStorage.add(data._id);

    return data;
  },
};

