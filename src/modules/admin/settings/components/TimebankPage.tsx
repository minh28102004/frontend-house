"use client";

import React, { useEffect } from "react";
import { useSettings } from "../hooks/useSettings";

export const TimebankPage: React.FC = () => {
  const { useGetPaymentSettings } = useSettings();
  const { data: settings, isLoading, error, refetch } = useGetPaymentSettings();

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
              <h1 className="text-2xl font-bold text-gray-900">Cấu hình TimeBank</h1>
              <p className="text-gray-500 mt-1">
                Cấu hình thanh toán qua TimeBank
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">TimeBank</h2>
                <p className="text-sm text-gray-500">Thanh toán qua TimeBank</p>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sắp ra mắt</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Tính năng cấu hình TimeBank đang được phát triển. Vui lòng quay lại sau.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-purple-50 border border-purple-100 rounded-xl p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-purple-700">
            <p className="font-medium mb-1">Lưu ý</p>
            <ul className="list-disc list-inside flex flex-col gap-1 text-purple-600">
              <li>Tính năng TimeBank đang trong quá trình phát triển.</li>
              <li>Liên hệ đội phát triển để biết thêm chi tiết.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
