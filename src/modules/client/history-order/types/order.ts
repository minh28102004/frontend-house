// types/order.ts
export interface OrderItem {
  productId: string;
  productSlug: string;
  productName: string;
  productThumbnail: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
}

export type OrderStatus = "processing" | "shipping" | "delivered" | "cancelled";

export interface Order {
  _id: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: "COD" | "BANKING";
  status: OrderStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
