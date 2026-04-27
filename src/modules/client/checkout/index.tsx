"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "@/common/utils/toast";
import { getAuthHeaders } from "@/config/api";
import { API_URL_CLIENT } from "@/config/apiRoutes";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { OrderService } from "@/modules/client/orders/services/order.service";
import { PaymentService } from "@/modules/client/payments/services/payment.service";
import { CouponService, type ValidateCouponResult } from "@/modules/client/coupon/services/coupon.service";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  note: string;
  paymentMethod: "COD" | "VNPAY" | "VIETQR";
};

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuth();
  const { items, totalPrice, itemCount, clearCart, isLoading } = useCart();
  const profileMeFetchedRef = useRef(false);

  const [submitting, setSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<ValidateCouponResult | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    note: "",
    paymentMethod: "COD",
  });

  // Há» tÃªn + email tá»« JWT / context (khi user Ä‘Ã£ load)
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.fullName || "",
      email: prev.email || user.email || "",
    }));
  }, [isAuthenticated, user]);

  // Bá»• sung tá»« API (sá»‘ Ä‘iá»‡n thoáº¡i + dá»¯ liá»‡u Ä‘áº§y Ä‘á»§ tá»« DB)
  useEffect(() => {
    if (!isAuthenticated) {
      profileMeFetchedRef.current = false;
      return;
    }

    const authToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!authToken || profileMeFetchedRef.current) return;

    profileMeFetchedRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_URL_CLIENT}/api/usersapi/me`, {
          headers: getAuthHeaders(authToken),
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          fullName?: string;
          email?: string;
          phone?: string;
        };
        if (cancelled) return;
        setForm((prev) => ({
          ...prev,
          fullName: data.fullName ?? prev.fullName,
          email: data.email ?? prev.email,
          phone: data.phone ?? prev.phone ?? "",
        }));
      } catch {
        // Giá»¯ giÃ¡ trá»‹ Ä‘Ã£ Ä‘á»“ng bá»™ tá»« JWT
      }
    })();

    return () => {
      cancelled = true;
      profileMeFetchedRef.current = false;
    };
  }, [isAuthenticated, token]);

  const canSubmit = useMemo(() => {
    if (items.length === 0) return false;
    if (!form.fullName.trim()) return false;
    if (!form.phone.trim()) return false;
    return true;
  }, [items.length, form]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const onSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const createdOrder = await OrderService.create({
        customer: {
          fullName: form.fullName.trim(),
          email: form.email.trim() || undefined,
          phone: form.phone.trim(),
        },
        items: items.map((it) => ({
          productId: it.productId,
          productSlug: it.productSlug,
          productName: it.productName,
          productThumbnail: it.productThumbnail,
          size: it.size,
          price: it.price,
          quantity: it.quantity,
        })),
        paymentMethod: form.paymentMethod,
        note: form.note.trim() || undefined,
      });

      if (form.paymentMethod === "COD") {
        await clearCart();
        toast.success("Äáº·t hÃ ng thÃ nh cÃ´ng! Admin Ä‘Ã£ nháº­n Ä‘Æ°á»£c Ä‘Æ¡n.");
        return;
      }

      const provider = form.paymentMethod === "VNPAY" ? "vnpay" : "vietqr";
      const payment = await PaymentService.create({
        provider,
        targetType: "order",
        targetId: createdOrder._id,
        amount: createdOrder.totalPrice,
        description: `ORDER-${createdOrder._id}`,
        customerEmail: form.email.trim() || undefined,
      });

      if (provider === "vnpay" && payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
        return;
      }

      // VietQR: redirect sang trang hiá»ƒn thá»‹ mÃ£ QR cho khÃ¡ch quÃ©t
      const qrParams = new URLSearchParams({
        transactionId: payment.transactionId,
        qrCodeUrl: payment.qrCodeUrl || "",
        amount: String(createdOrder.totalPrice),
        expiresAt: payment.expiresAt || "",
        accountNo: payment.accountNo || "",
        accountName: payment.accountName || "",
        description: payment.description || "",
        orderId: String(createdOrder._id),
      });
      await clearCart();
      router.push(`/order/qr?${qrParams.toString()}`);
    } catch (e: any) {
      toast.error(e?.message || "Äáº·t hÃ ng tháº¥t báº¡i");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Thanh toÃ¡n
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isAuthenticated ? (
              <>Báº¡n Ä‘ang Ä‘Äƒng nháº­p.</>
            ) : (
              <>
                Báº¡n Ä‘Ã£ cÃ³ tÃ i khoáº£n?{" "}
                <Link href="/signin" className="text-slate-900 font-semibold underline">
                  ÄÄƒng nháº­p
                </Link>
              </>
            )}
          </p>
        </div>

        <Link
          href="/"
          className="text-sm font-semibold text-slate-900 hover:text-slate-700"
        >
          Tiáº¿p tá»¥c mua sáº¯m
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-gray-700 font-medium">Giá» hÃ ng cá»§a báº¡n Ä‘ang trá»‘ng.</p>
          <Link
            href="/"
            className="inline-flex mt-3 text-sm font-semibold text-slate-900 underline"
          >
            Quay láº¡i trang chá»§
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="Há» vÃ  tÃªn"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
              />
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
              <input
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="Äiá»‡n thoáº¡i"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
              <input
                className="w-full md:col-span-2 rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="Ghi chÃº (tuá»³ chá»n)"
                value={form.note}
                onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-base font-semibold text-gray-900">
                PhÆ°Æ¡ng thá»©c thanh toÃ¡n
              </h2>
              <div className="mt-3 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <input
                  type="radio"
                  checked={form.paymentMethod === "COD"}
                  onChange={() => setForm((p) => ({ ...p, paymentMethod: "COD" }))}
                  className="accent-slate-900"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Thanh toÃ¡n khi giao hÃ ng (COD)
                  </p>
                  <p className="text-xs text-gray-500">
                    NhÃ¢n viÃªn sáº½ liÃªn há»‡ xÃ¡c nháº­n trÆ°á»›c khi giao.
                  </p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <input
                  type="radio"
                  checked={form.paymentMethod === "VNPAY"}
                  onChange={() => setForm((p) => ({ ...p, paymentMethod: "VNPAY" }))}
                  className="accent-slate-900"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Thanh toÃ¡n VNPay</p>
                  <p className="text-xs text-gray-500">Chuyá»ƒn sang cá»•ng thanh toÃ¡n VNPay.</p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <input
                  type="radio"
                  checked={form.paymentMethod === "VIETQR"}
                  onChange={() => setForm((p) => ({ ...p, paymentMethod: "VIETQR" }))}
                  className="accent-slate-900"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Thanh toÃ¡n VietQR</p>
                  <p className="text-xs text-gray-500">Táº¡o mÃ£ QR Ä‘á»ƒ chuyá»ƒn khoáº£n nhanh.</p>
                </div>
              </div>
            </div>

            <button
              onClick={onSubmit}
              disabled={!canSubmit || submitting || isLoading}
              className="mt-6 w-full rounded-lg bg-[#2f86ad] text-white font-semibold py-3 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Äang xá»­ lÃ½..." : "Äáº·t hÃ ng"}
            </button>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6 h-fit">
            <h3 className="text-base font-semibold text-gray-900">TÃ³m táº¯t Ä‘Æ¡n</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sá»‘ lÆ°á»£ng</span>
                <span className="font-semibold text-gray-900">{itemCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Táº¡m tÃ­nh</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Tá»•ng</span>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Náº¿u chá»n VNPay/VietQR, há»‡ thá»‘ng sáº½ xÃ¡c nháº­n tá»± Ä‘á»™ng sau khi thanh toÃ¡n.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

