"use client";

import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Form, Input, InputNumber, Radio, Tabs, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useSettings } from "../hooks/useSettings";
import {
  PaymentSettings,
  VietQrAccountRow,
  createEmptyVietQrAccount,
} from "../services/settings.service";
import { AdminPageHeader } from "@/modules/admin/common/components/AdminUi";

type SettingsTab = "vnpay" | "vietqr" | "general";

const defaultForm = (): PaymentSettings => ({
  vnpay: {
    vnpUrl: "",
    tmnCode: "",
    hashSecret: "",
  },
  vietqr: {
    accounts: [],
    activeAccountId: "",
  },
  paymentExpiryMinutes: "15",
});

export const SettingsPage: React.FC = () => {
  const {
    useGetPaymentSettings,
    useSaveVnpaySettings,
    useSaveVietQrSettings,
    useSaveGeneralSettings,
    useInitializeSettings,
  } = useSettings();
  const { data: settings, isLoading, error, refetch } = useGetPaymentSettings();
  const saveVnpay = useSaveVnpaySettings();
  const saveVietQr = useSaveVietQrSettings();
  const saveGeneral = useSaveGeneralSettings();
  const initMutation = useInitializeSettings();

  const [tab, setTab] = useState<SettingsTab>("vietqr");
  const [formData, setFormData] = useState<PaymentSettings>(defaultForm);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const resetTab = () => {
    if (settings) {
      setFormData(settings);
    }
  };

  const updateVietQrAccount = (
    id: string,
    patch: Partial<Pick<VietQrAccountRow, "bankBin" | "accountNumber" | "accountName">>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      vietqr: {
        ...prev.vietqr,
        accounts: prev.vietqr.accounts.map((a) =>
          a.id === id ? { ...a, ...patch } : a,
        ),
      },
    }));
  };

  const addVietQrAccount = () => {
    const row = createEmptyVietQrAccount();
    setFormData((prev) => {
      const accounts = [...prev.vietqr.accounts, row];
      return {
        ...prev,
        vietqr: {
          accounts,
          activeAccountId: prev.vietqr.activeAccountId || row.id,
        },
      };
    });
  };

  const removeVietQrAccount = (id: string) => {
    setFormData((prev) => {
      const accounts = prev.vietqr.accounts.filter((a) => a.id !== id);
      let activeAccountId = prev.vietqr.activeAccountId;
      if (activeAccountId === id) {
        activeAccountId = accounts[0]?.id || "";
      }
      return { ...prev, vietqr: { accounts, activeAccountId } };
    });
  };

  const setActiveVietQr = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      vietqr: { ...prev.vietqr, activeAccountId: id },
    }));
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
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Hệ thống"
        title="Cấu hình thanh toán"
        description="VNPay, VietQR và cài đặt chung được lưu riêng từng phần"
        icon={<SettingOutlined />}
      />

      <Card className="ah-admin-card">
        <Tabs
          activeKey={tab}
          onChange={(key) => setTab(key as SettingsTab)}
          tabBarExtraContent={
            <Button
              onClick={() => initMutation.mutate()}
              loading={initMutation.isPending}
            >
              Khởi tạo mặc định
            </Button>
          }
          items={[
            {
              key: 'vnpay',
              label: 'VNPay',
              children: (
                <form
                  className="flex flex-col gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveVnpay.mutate(formData.vnpay);
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
                        <Typography.Title level={4} className="!mb-0">VNPay</Typography.Title>
                        <Typography.Text type="secondary">Cổng thanh toán VNPay (tách khỏi VietQR)</Typography.Text>
                      </div>
                    </div>

                    <Form layout="vertical">
                      <Form.Item label="URL thanh toán">
                        <Input
                          value={formData.vnpay.vnpUrl}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, vnpay: { ...p.vnpay, vnpUrl: e.target.value } }))
                          }
                          placeholder="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
                        />
                        <Typography.Text type="secondary" className="text-xs">Sandbox để test, production khi go-live</Typography.Text>
                      </Form.Item>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item label="Mã Terminal (TMN Code)">
                          <Input
                            value={formData.vnpay.tmnCode}
                            onChange={(e) =>
                              setFormData((p) => ({ ...p, vnpay: { ...p.vnpay, tmnCode: e.target.value } }))
                            }
                          />
                        </Form.Item>
                        <Form.Item label="Khóa bí mật (Hash Secret)">
                          <Input.Password
                            value={formData.vnpay.hashSecret}
                            onChange={(e) =>
                              setFormData((p) => ({ ...p, vnpay: { ...p.vnpay, hashSecret: e.target.value } }))
                            }
                          />
                        </Form.Item>
                      </div>
                    </Form>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button
                      type="default"
                      onClick={resetTab}
                    >
                      Đặt lại
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={saveVnpay.isPending}
                    >
                      Lưu VNPay
                    </Button>
                  </div>
                </form>
              ),
            },
            {
              key: 'vietqr',
              label: 'VietQR',
              children: (
                <form
                  className="flex flex-col gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveVietQr.mutate(formData.vietqr);
                  }}
                >
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div>
                          <Typography.Title level={4} className="!mb-0">VietQR</Typography.Title>
                          <Typography.Text type="secondary">
                            Nhiều tài khoản — chọn một tài khoản <strong>đang kích hoạt</strong> để nhận thanh toán
                          </Typography.Text>
                        </div>
                      </div>
                      <Button
                        type="primary"
                        onClick={addVietQrAccount}
                      >
                        + Thêm tài khoản
                      </Button>
                    </div>

                    {formData.vietqr.accounts.length === 0 ? (
                      <Typography.Text type="secondary">
                        Chưa có tài khoản. Nhấn &quot;Thêm tài khoản&quot; để thêm số tài khoản nhận tiền, sau đó nhấn <strong>Lưu VietQR</strong>.
                      </Typography.Text>
                    ) : (
                      <div className="flex flex-col gap-5">
                        {formData.vietqr.accounts.map((acc, index) => {
                          const isActive = formData.vietqr.activeAccountId === acc.id;
                          return (
                            <div
                              key={acc.id}
                              className={`rounded-xl border p-4 bg-white/80 ${
                                isActive ? "border-green-500 ring-1 ring-green-500/30" : "border-green-100"
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <Radio
                                  checked={isActive}
                                  onChange={() => setActiveVietQr(acc.id)}
                                >
                                  <span className="text-sm font-medium text-gray-800">
                                    Tài khoản {index + 1}
                                    {isActive && (
                                      <span className="ml-2 text-green-600 font-normal">(đang kích hoạt)</span>
                                    )}
                                  </span>
                                </Radio>
                                <Button
                                  type="link"
                                  danger
                                  onClick={() => removeVietQrAccount(acc.id)}
                                >
                                  Xóa
                                </Button>
                              </div>

                              <Form layout="vertical" className="flex flex-col gap-4">
                                <Form.Item label="Mã BIN ngân hàng">
                                  <Input
                                    value={acc.bankBin}
                                    onChange={(e) => updateVietQrAccount(acc.id, { bankBin: e.target.value })}
                                    placeholder="970422"
                                  />
                                  <Typography.Text type="secondary" className="text-xs">
                                    VD: 970422 (MB), 970415 (VPBank), 970432 (TPBank)
                                  </Typography.Text>
                                </Form.Item>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Form.Item label="Số tài khoản">
                                    <Input
                                      value={acc.accountNumber}
                                      onChange={(e) =>
                                        updateVietQrAccount(acc.id, { accountNumber: e.target.value })
                                      }
                                      placeholder="1234567890"
                                    />
                                  </Form.Item>
                                  <Form.Item label="Tên tài khoản">
                                    <Input
                                      value={acc.accountName}
                                      onChange={(e) =>
                                        updateVietQrAccount(acc.id, { accountName: e.target.value })
                                      }
                                      placeholder="Tên chủ TK"
                                    />
                                  </Form.Item>
                                </div>
                              </Form>

                              {acc.accountNumber.trim() ? (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                  <Typography.Text type="secondary" className="text-xs block mb-2">QR mẫu (0đ)</Typography.Text>
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
                    <Button
                      type="default"
                      onClick={resetTab}
                    >
                      Đặt lại
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={saveVietQr.isPending}
                    >
                      Lưu VietQR
                    </Button>
                  </div>
                </form>
              ),
            },
            {
              key: 'general',
              label: 'Cấu hình chung',
              children: (
                <form
                  className="flex flex-col gap-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveGeneral.mutate(formData.paymentExpiryMinutes);
                  }}
                >
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <Typography.Title level={4} className="!mb-0">Cấu hình chung</Typography.Title>
                        <Typography.Text type="secondary">Áp dụng cho thanh toán VietQR (hết hạn QR)</Typography.Text>
                      </div>
                    </div>
                    <div className="max-w-xs">
                      <Form.Item label="Thời gian hết hạn QR (phút)">
                        <InputNumber
                          min={1}
                          max={60}
                          className="w-full"
                          value={formData.paymentExpiryMinutes}
                          onChange={(value) =>
                            setFormData((p) => ({ ...p, paymentExpiryMinutes: String(value || 15) }))
                          }
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button
                      type="default"
                      onClick={resetTab}
                    >
                      Đặt lại
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={saveGeneral.isPending}
                    >
                      Lưu cấu hình chung
                    </Button>
                  </div>
                </form>
              ),
            },
          ]}
        />
      </Card>

      <Card className="ah-admin-card">
        <Alert
          message="Lưu ý"
          description={
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Mỗi tab có nút lưu riêng — nhớ bấm <strong>Lưu VietQR</strong> sau khi sửa số tài khoản.</li>
              <li>Thanh toán VietQR dùng đúng tài khoản bạn chọn là &quot;đang kích hoạt&quot;.</li>
              <li>Nếu trước đây không lưu được: hệ thống đã sửa để tạo bản ghi trong DB khi lưu (không bắt buộc chạy khởi tạo mặc định trước).</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </Card>
    </div>
  );
};
