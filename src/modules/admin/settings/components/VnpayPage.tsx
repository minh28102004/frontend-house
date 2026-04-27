"use client";

import React, { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";
import { PaymentSettings } from "../services/settings.service";

const defaultVnpay = (): PaymentSettings["vnpay"] => ({
  vnpUrl: "",
  tmnCode: "",
  hashSecret: "",
});

export const VnpayPage: React.FC = () => {
  const { useGetPaymentSettings, useSaveVnpaySettings } = useSettings();
  const { data: settings, isLoading, error, refetch } = useGetPaymentSettings();
  const saveVnpay = useSaveVnpaySettings();

  const [formData, setFormData] = useState<PaymentSettings["vnpay"]>(defaultVnpay());
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings.vnpay);
    }
  }, [settings]);

  const resetForm = () => {
    if (settings) {
      setFormData(settings.vnpay);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">Không thể tải cấu hình. Vui lòng thử lại.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tải lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cấu hình VNPay</h1>
              <p className="text-gray-500 mt-1">
                Cổng thanh toán VNPay — sandbox để test, production khi go-live
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              saveVnpay.mutate(formData);
            }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">VNPay</h2>
                  <p className="text-sm text-gray-500">Cổng thanh toán VNPay (tách khỏi VietQR)</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">URL thanh toán</label>
                  <input
                    type="text"
                    value={formData.vnpUrl}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, vnpUrl: e.target.value }))
                    }
                    placeholder="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">Sandbox để test, production khi go-live</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã Terminal (TMN Code)</label>
                    <input
                      type="text"
                      value={formData.tmnCode}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, tmnCode: e.target.value }))
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Khóa bí mật (Hash Secret)</label>
                    <div className="relative">
                      <input
                        type={showSecret ? "text" : "password"}
                        value={formData.hashSecret}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, hashSecret: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecret ? "Ẩn" : "Hiện"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Đặt lại
              </button>
              <button
                type="submit"
                disabled={saveVnpay.isPending}
                className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {saveVnpay.isPending ? "Đang lưu..." : "Lưu VNPay"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Lưu ý</p>
            <ul className="list-disc list-inside flex flex-col gap-1 text-blue-600">
              <li>Sử dụng URL sandbox để test, đổi sang URL production khi go-live.</li>
              <li>TMN Code và Hash Secret được cung cấp bởi VNPay khi đăng ký tài khoản.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
