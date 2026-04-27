// components/order/OrderCard.tsx
import Link from "next/link";
import { Order } from "../types/order";

interface Props {
  order: Order;
}

const statusMap = {
  processing: "Chờ xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export default function OrderCard({ order }: Props) {
  const item = order.items[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
      {/* Header */}
      <div className="flex justify-between text-sm">
        <span className="font-semibold">Đơn #{order._id.slice(-6)}</span>
        {/* <span className="text-orange-500 font-medium">
          {statusMap[order.status]}
        </span> */}
      </div>

      {/* Product */}
      <div className="flex gap-3">
        <img
          src={item.productThumbnail}
          className="w-16 h-16 rounded object-cover border"
        />
        <div className="flex-1">
          <p className="font-medium line-clamp-1">{item.productName}</p>
          <p className="text-sm text-gray-500">x{item.quantity}</p>
        </div>
        <p className="font-semibold text-sm">
          {(item.price * item.quantity).toLocaleString()}₫
        </p>
      </div>

      {/* Total */}
      <div className="text-right text-sm">
        Tổng tiền:{" "}
        <span className="font-semibold text-black">
          {order.totalPrice.toLocaleString()}₫
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Link href={`/account/orders/${order._id}`} className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100">
          Chi tiết
        </Link>
        {/* <button className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
          Theo dõi đơn
        </button> */}
      </div>
    </div>
  );
}
