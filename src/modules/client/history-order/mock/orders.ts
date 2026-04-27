// mock/orders.ts
import { Order } from "../types/order";

export const mockOrders: Order[] = [
  {
    _id: "6972f4737e02d4e6f8a20964",
    customer: {
      fullName: "test",
      email: "vuminhduc.contact@gmail.com",
      phone: "0123456789",
      address: "28",
      province: "Thành phố Hồ Chí Minh",
      district: "Quận Tân Phú",
      ward: "Phường Hòa Thạnh",
    },
    items: [
      {
        productId: "696b7a4e257951ada8618298",
        productSlug: "phong-romantic",
        productName: "Phong Romantic - Concept",
        productThumbnail: "/demo-product.jpg",
        price: 2500000,
        quantity: 1,
      },
    ],
    totalPrice: 2500000,
    paymentMethod: "COD",
    status: "shipping",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
