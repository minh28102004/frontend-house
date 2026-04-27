"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { HostVietQrConfig } from '../types';

interface QrPreviewProps {
  vietQr: HostVietQrConfig;
}

export const QrPreview: React.FC<QrPreviewProps> = ({ vietQr }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const qrUrl = vietQr.bankBin && vietQr.accountNumber
    ? `https://img.vietqr.io/image/${vietQr.bankBin}-${vietQr.accountNumber}-${vietQr.template || 'compact'}.png?accountName=${encodeURIComponent(vietQr.accountName || '')}&refresh=${refreshKey}`
    : '';

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    setImageError(false);
  };

  const handleDownload = async () => {
    if (!qrUrl) return;

    setIsLoading(true);
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vietqr-${vietQr.accountNumber}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">QR Code Preview</h3>
        {vietQr.bankBin && vietQr.accountNumber && (
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Làm mới"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {vietQr.bankBin && vietQr.accountNumber ? (
        <>
          <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="animate-spin h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm text-gray-500">Đang tải...</span>
              </div>
            ) : imageError ? (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Không thể tải QR</span>
              </div>
            ) : (
              <Image
                key={refreshKey}
                src={qrUrl}
                alt="VietQR Preview"
                width={200}
                height={200}
                className="object-contain"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setImageError(true);
                }}
                unoptimized
              />
            )}
          </div>

          {/* QR URL */}
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1">URL QR Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={qrUrl}
                className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
              />
              <button
                onClick={() => copyToClipboard(qrUrl)}
                className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Sao chép"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isLoading || imageError}
            className="mt-3 w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Tải xuống QR Code
          </button>
        </>
      ) : (
        <div className="w-full aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400">
          <svg className="w-16 h-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <p className="text-sm text-center px-4">
            Điền thông tin tài khoản ngân hàng để xem trước QR Code
          </p>
        </div>
      )}
    </div>
  );
};
