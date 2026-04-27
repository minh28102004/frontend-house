// app/account/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OrderService } from "@/modules/client/history-order/services/history-order.service";
import type { Order } from "@/modules/client/history-order/types/order";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy ID đơn hàng");
      setLoading(false);
      return;
    }

    OrderService.getDetailOrder(id)
      .then((data) => {
        setOrder(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi tải chi tiết đơn hàng");
        setOrder(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="text-center py-8">Đang tải...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="text-center py-8 text-red-500">
          {error || "Không tìm thấy đơn hàng"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6 mt-12 md:mt-20">
      <div className="flex justify-between items-center p-4 md:p-0">
        <h1 className="text-xl font-bold">Chi tiết đơn hàng</h1>
        {/* <span className="px-3 py-1 text-sm rounded-lg bg-orange-100 text-orange-600">
          {statusMap[order.status] || order.status}
        </span> */}
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Mã đơn hàng</h2>
        <p className="text-gray-600">#{order._id.slice(-8).toUpperCase()}</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Thông tin khách hàng</h2>
        <p>{order.customer.fullName}</p>
        {order.customer.email && <p>{order.customer.email}</p>}
        <p>{order.customer.phone}</p>
        <p>
          {order.customer.address}
          {order.customer.ward && `, ${order.customer.ward}`}
          {order.customer.district && `, ${order.customer.district}`}
          {order.customer.province && `, ${order.customer.province}`}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <h2 className="font-semibold mb-3">Sản phẩm</h2>
        {order.items.map((item, index) => (
          <div key={`${item.productId}-${index}`} className="flex gap-3">
            <img
              src={item.productThumbnail || "/images/default-thumbnail.png"}
              alt={item.productName}
              className="w-16 h-16 rounded object-cover border"
            />
            <div className="flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-500">Số lượng: x{item.quantity}</p>
            </div>
            <p className="font-semibold">
              {(item.price * item.quantity).toLocaleString()}₫
            </p>
          </div>
        ))}
      </div>

      {order.note && (
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Ghi chú</h2>
          <p className="text-gray-600">{order.note}</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Tổng cộng:</span>
          <span className="text-xl font-bold text-orange-600">
            {order.totalPrice.toLocaleString()}₫
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Phương thức thanh toán: {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : "Chuyển khoản"}
        </div>
      </div>
    </div>
  );
}
