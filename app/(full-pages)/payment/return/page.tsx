"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentService } from "@/modules/client/payments/services/payment.service";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusParam = searchParams.get("status") || "";
  const transactionId = searchParams.get("transactionId") || "";
  const orderId = searchParams.get("orderId") || "";
  const bookingId = searchParams.get("bookingId") || "";
  const [status, setStatus] = useState(statusParam || "pending");
  const [message, setMessage] = useState("Đang kiểm tra trạng thái thanh toán...");

  useEffect(() => {
    if (!transactionId) {
      setStatus("failed");
      setMessage("Thiếu mã giao dịch.");
      return;
    }

    let timer: ReturnType<typeof setInterval> | null = null;
    const check = async () => {
      try {
        const tx = await PaymentService.getTransaction(transactionId);
        if (tx.status === "success") {
          setStatus("success");
          setMessage("Thanh toán thành công.");
          if (timer) clearInterval(timer);
          // Chuyển hướng sang trang thành công phù hợp
          if (bookingId) {
            const params = new URLSearchParams({
              roomName: searchParams.get("roomName") || "",
              guestName: searchParams.get("guestName") || "",
              guestEmail: searchParams.get("guestEmail") || "",
              checkIn: searchParams.get("checkIn") || "",
              checkOut: searchParams.get("checkOut") || "",
              total: searchParams.get("total") || "",
              nights: searchParams.get("nights") || "1",
            });
            router.replace(`/booking/success?${params.toString()}`);
          } else {
            const params = new URLSearchParams({
              orderId: orderId || "",
              amount: searchParams.get("amount") || "",
              transactionId,
            });
            router.replace(`/order/success?${params.toString()}`);
          }
          return;
        }
        if (tx.status === "failed" || tx.status === "cancelled" || tx.status === "expired") {
          setStatus("failed");
          setMessage("Thanh toán chưa thành công hoặc đã hết hạn.");
          if (timer) clearInterval(timer);
          return;
        }
        setStatus("pending");
        setMessage("Đang chờ xác nhận thanh toán...");
      } catch {
        setStatus("pending");
      }
    };

    check();
    timer = setInterval(check, 3000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [transactionId, orderId, bookingId, router, searchParams]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Kết quả thanh toán</h1>
        <p className="mt-3 text-sm text-gray-600">{message}</p>
        {transactionId && (
          <p className="mt-2 text-xs text-gray-500">Mã giao dịch: {transactionId}</p>
        )}

        {status === "pending" && (
          <div className="mt-6">
            <p className="text-sm text-gray-500">Hệ thống sẽ tự động cập nhật khi thanh toán thành công.</p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/" className="rounded-lg bg-[#2f86ad] px-4 py-2 text-white">
            Về trang chủ
          </Link>
          <Link href="/cart" className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700">
            Xem giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
