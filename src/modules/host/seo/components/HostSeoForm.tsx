'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { HostSeoSettings } from '../types';
import { useHostSeo } from '../hooks/useHostSeo';
import { SeoPreview } from './SeoPreview';

type TabType = 'meta' | 'branding' | 'analytics' | 'advanced';

interface FormData {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  storeName: string;
  storeDescription: string;
  storeLogo: string;
  storeFavicon: string;
  googleAnalyticsId: string;
  facebookPixel: string;
  googleTagManager: string;
  robotsTxt: string;
  canonicalUrl: string;
}

const initialFormData: FormData = {
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  ogImage: '',
  storeName: '',
  storeDescription: '',
  storeLogo: '',
  storeFavicon: '',
  googleAnalyticsId: '',
  facebookPixel: '',
  googleTagManager: '',
  robotsTxt: '',
  canonicalUrl: '',
};

export const HostSeoForm: React.FC = () => {
  const { settings, loading, saving, fetchSettings, updateSettings } = useHostSeo();
  const [activeTab, setActiveTab] = useState<TabType>('meta');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        metaTitle: settings.metaTitle || '',
        metaDescription: settings.metaDescription || '',
        metaKeywords: settings.metaKeywords || '',
        ogImage: settings.ogImage || '',
        storeName: settings.storeName || '',
        storeDescription: settings.storeDescription || '',
        storeLogo: settings.storeLogo || '',
        storeFavicon: settings.storeFavicon || '',
        googleAnalyticsId: settings.googleAnalyticsId || '',
        facebookPixel: settings.facebookPixel || '',
        googleTagManager: settings.googleTagManager || '',
        robotsTxt: settings.robotsTxt || '',
        canonicalUrl: settings.canonicalUrl || '',
      });
      setIsDirty(false);
    }
  }, [settings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    setIsDirty(false);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'meta',
      label: 'Meta Tags',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      id: 'branding',
      label: 'Branding',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Meta Tags Tab */}
              {activeTab === 'meta' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Meta Tags</h3>
                    <p className="text-sm text-green-600">
                      Cấu hình thông tin meta tags giúp trang của bạn hiển thị tốt trên công cụ tìm kiếm và mạng xã hội.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      maxLength={60}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                      placeholder="Tiêu đề trang hiển thị trên Google (tối đa 60 ký tự)"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {formData.metaTitle.length}/60
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      maxLength={160}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Mô tả ngắn gọn về trang của bạn (tối đa 160 ký tự)"
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {formData.metaDescription.length}/160
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      name="metaKeywords"
                      value={formData.metaKeywords}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                      placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Các từ khóa phân cách bằng dấu phẩy
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      OG Image (Open Graph)
                    </label>
                    <input
                      type="url"
                      name="ogImage"
                      value={formData.ogImage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Hình ảnh hiển thị khi chia sẻ trên mạng xã hội (khuyến nghị: 1200x630px)
                    </p>
                    {formData.ogImage && (
                      <div className="mt-2 w-full max-w-xs aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={formData.ogImage}
                          alt="OG Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Branding Tab */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Branding</h3>
                    <p className="text-sm text-green-600">
                      Cấu hình thông tin thương hiệu và hình ảnh cửa hàng của bạn.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên cửa hàng
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                      placeholder="Tên cửa hàng của bạn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả cửa hàng
                    </label>
                    <textarea
                      name="storeDescription"
                      value={formData.storeDescription}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Mô tả ngắn về cửa hàng của bạn"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo cửa hàng
                    </label>
                    <input
                      type="url"
                      name="storeLogo"
                      value={formData.storeLogo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                      placeholder="https://example.com/logo.png"
                    />
                    {formData.storeLogo && (
                      <div className="mt-2 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={formData.storeLogo}
                          alt="Logo Preview"
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Favicon
                    </label>
                    <input
                      type="url"
                      name="storeFavicon"
                      value={formData.storeFavicon}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                      placeholder="https://example.com/favicon.ico"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Icon nhỏ hiển thị trên tab trình duyệt (khuyến nghị: 32x32px, định dạng .ico hoặc .png)
                    </p>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Analytics</h3>
                    <p className="text-sm text-green-600">
                      Cấu hình các công cụ theo dõi và phân tích lưu lượng truy cập.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      name="googleAnalyticsId"
                      value={formData.googleAnalyticsId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors font-mono"
                      placeholder="G-XXXXXXXXXX"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ví dụ: G-ABC123DEF456
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      name="facebookPixel"
                      value={formData.facebookPixel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors font-mono"
                      placeholder="1234567890123456"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      ID Pixel từ Facebook Business
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Tag Manager ID
                    </label>
                    <input
                      type="text"
                      name="googleTagManager"
                      value={formData.googleTagManager}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors font-mono"
                      placeholder="GTM-XXXXXXX"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ví dụ: GTM-ABC1234
                    </p>
                  </div>
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Advanced</h3>
                    <p className="text-sm text-green-600">
                      Cấu hình nâng cao cho SEO và quản lý robots.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      name="canonicalUrl"
                      value={formData.canonicalUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors"
                      placeholder="https://your-store.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL chính thức của trang để tránh trùng lặp nội dung
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Robots.txt
                    </label>
                    <textarea
                      name="robotsTxt"
                      value={formData.robotsTxt}
                      onChange={handleChange}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors resize-none font-mono text-sm"
                      placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/&#10;&#10;Sitemap: https://your-store.com/sitemap.xml"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cấu hình robots.txt để kiểm soát việc thu thập dữ liệu của công cụ tìm kiếm
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData(initialFormData);
                setIsDirty(true);
              }}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Đặt lại
            </button>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <SeoPreview settings={formData} />
          </div>
        </div>
      </div>
    </form>
  );
};
