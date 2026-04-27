import api from "@/config/api";
import { apiRoutes } from "@/config/apiRoutes";

export type PaymentProvider = "vnpay" | "vietqr";
export type PaymentTargetType = "booking" | "order";

export type CreatePaymentPayload = {
  provider: PaymentProvider;
  targetType: PaymentTargetType;
  targetId: string;
  amount: number;
  description?: string;
  customerEmail?: string;
};

export const PaymentService = {
  create: async (payload: CreatePaymentPayload) => {
    const response = await api.post(apiRoutes.PAYMENTS.CREATE, payload);
    return response.data;
  },

  getTransaction: async (transactionId: string) => {
    const response = await api.get(apiRoutes.PAYMENTS.TRANSACTION(transactionId));
    return response.data;
  },
};
