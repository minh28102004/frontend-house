"use client";

import React, { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";
import {
  PaymentSettings,
  VietQrAccountRow,
  createEmptyVietQrAccount,
} from "../services/settings.service";

const defaultVietQr = (): PaymentSettings["vietqr"] => ({
  accounts: [],
  activeAccountId: "",
});

export const VietqrPage: React.FC = () => {
  const { useGetPaymentSettings, useSaveVietQrSettings } = useSettings();
  const { data: settings, isLoading, error, refetch } = useGetPaymentSettings();
  const saveVietQr = useSaveVietQrSettings();

  const [formData, setFormData] = useState<PaymentSettings["vietqr"]>(defaultVietQr());

  useEffect(() => {
    if (settings) {
      setFormData(settings.vietqr);
    }
  }, [settings]);

  const resetForm = () => {
    if (settings) {
      setFormData(settings.vietqr);
    }
  };

  const updateVietQrAccount = (
    id: string,
    patch: Partial<Pick<VietQrAccountRow, "bankBin" | "accountNumber" | "accountName">>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      accounts: prev.accounts.map((a) =>
        a.id === id ? { ...a, ...patch } : a,
      ),
    }));
  };

  const addVietQrAccount = () => {
    const row = createEmptyVietQrAccount();
    setFormData((prev) => {
      const accounts = [...prev.accounts, row];
      return {
        ...prev,
        activeAccountId: prev.activeAccountId || row.id,
      };
    });
  };

  const removeVietQrAccount = (id: string) => {
    setFormData((prev) => {
      const accounts = prev.accounts.filter((a) => a.id !== id);
      let activeAccountId = prev.activeAccountId;
      if (activeAccountId === id) {
        activeAccountId = accounts[0]?.id || "";
      }
      return { ...prev, accounts, activeAccountId };
    });
  };

  const setActiveVietQr = (id: string) => {
    setFormData((prev) => ({ ...prev, activeAccountId: id }));
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
              <h1 className="text-2xl font-bold text-gray-900">Cấu hình VietQR</h1>
              <p className="text-gray-500 mt-1">
                Nhiều tài khoản — chọn một tài khoản <strong className="font-medium text-gray-700">đang kích hoạt</strong> để nhận thanh toán
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              saveVietQr.mutate(formData);
            }}
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">VietQR</h2>
                    <p className="text-sm text-gray-500">
                      Nhiều tài khoản — chọn một tài khoản <strong className="font-medium text-gray-700">đang kích hoạt</strong> để nhận thanh toán
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addVietQrAccount}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 shrink-0"
                >
                  + Thêm tài khoản
                </button>
              </div>

              {formData.accounts.length === 0 ? (
                <p className="text-sm text-gray-600 py-4">
                  Chưa có tài khoản. Nhấn &quot;Thêm tài khoản&quot; để thêm số tài khoản nhận tiền, sau đó nhấn <strong className="font-medium">Lưu VietQR</strong>.
                </p>
              ) : (
                <div className="flex flex-col gap-5">
                  {formData.accounts.map((acc, index) => {
                    const isActive = formData.activeAccountId === acc.id;
                    return (
                      <div
                        key={acc.id}
                        className={`rounded-xl border p-4 bg-white/80 ${
                          isActive ? "border-green-500 ring-1 ring-green-500/30" : "border-green-100"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="vietqr-active"
                              checked={isActive}
                              onChange={() => setActiveVietQr(acc.id)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-800">
                              Tài khoản {index + 1}
                              {isActive && (
                                <span className="ml-2 text-green-600 font-normal">(đang kích hoạt)</span>
                              )}
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeVietQrAccount(acc.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Xóa
                          </button>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã BIN ngân hàng</label>
                            <input
                              type="text"
                              value={acc.bankBin}
                              onChange={(e) => updateVietQrAccount(acc.id, { bankBin: e.target.value })}
                              placeholder="970422"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              VD: 970422 (MB), 970415 (VPBank), 970432 (TPBank)
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số tài khoản</label>
                              <input
                                type="text"
                                value={acc.accountNumber}
                                onChange={(e) =>
                                  updateVietQrAccount(acc.id, { accountNumber: e.target.value })
                                }
                                placeholder="1234567890"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên tài khoản</label>
                              <input
                                type="text"
                                value={acc.accountName}
                                onChange={(e) =>
                                  updateVietQrAccount(acc.id, { accountName: e.target.value })
                                }
                                placeholder="Tên chủ TK"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {acc.accountNumber.trim() ? (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-600 mb-2">QR mẫu (0đ)</p>
                            <img
                              src={`https://img.vietqr.io/image/${(acc.bankBin || "970422").trim()}-${acc.accountNumber.trim()}-compact2.png?accountName=${encodeURIComponent(acc.accountName || "")}`}
                              alt="VietQR"
                              className="w-40 h-40 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
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
                disabled={saveVietQr.isPending}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saveVietQr.isPending ? "Đang lưu..." : "Lưu VietQR"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-green-700">
            <p className="font-medium mb-1">Lưu ý</p>
            <ul className="list-disc list-inside flex flex-col gap-1 text-green-600">
              <li>Thanh toán VietQR dùng đúng tài khoản bạn chọn là &quot;đang kích hoạt&quot;.</li>
              <li>Thêm nhiều tài khoản và chọn một tài khoản mặc định để nhận thanh toán.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
