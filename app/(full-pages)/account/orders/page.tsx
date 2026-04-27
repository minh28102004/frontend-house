// app/account/orders/page.tsx
"use client";

import OrderCard from "@/modules/client/history-order/components/OrderCard";
import { useEffect, useState } from "react";
import { OrderService } from "@/modules/client/history-order/services/history-order.service";
import type { Order } from "@/modules/client/history-order/types/order";


export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await OrderService.getMyOrderHistory();
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Không thể tải đơn hàng");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-4 mt-12 md:mt-20">
      <h1 className="text-xl font-bold p-4 md:p-0">Lịch sử đơn hàng</h1>

      {loading && <div className="text-sm text-gray-500">Đang tải...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="text-sm text-gray-500">Chưa có đơn hàng nào.</div>
      )}

      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
