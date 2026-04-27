'use client';

import { useEffect, useState } from 'react';
import { ruleService, type Rule } from '@/modules/admin/rules/services/rule.service';
import Link from 'next/link';

interface Props {
  slug?: string;
}

export default function RulesPage({ slug }: Props) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await ruleService.getAllPublished();
        setRules(data);

        if (slug) {
          const rule = data.find(r => r.slug === slug);
          if (rule) {
            setCurrentRule(rule);
          } else {
            setError('Trang không tồn tại');
          }
        } else if (data.length > 0) {
          setCurrentRule(data[0]);
        }
      } catch (e: any) {
        setError('Không thể tải nội dung');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-gray-500">{error}</p>
          <Link href="/rules" className="text-blue-500 hover:underline mt-4 inline-block">
            Quay về trang chính
          </Link>
        </div>
      </div>
    );
  }

  if (!currentRule && rules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Chưa có nội dung nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {currentRule?.title || 'Trang'}
          </h1>
          {rules.length > 1 && !slug && (
            <p className="text-gray-500 text-sm">Chọn một trang để xem</p>
          )}
        </div>

        {/* Sidebar - Table of Contents */}
        {rules.length > 1 && !slug && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <h2 className="font-semibold text-gray-700 mb-3">Mục lục</h2>
            <ul className="space-y-2">
              {rules.map((rule) => (
                <li key={rule._id}>
                  <Link
                    href={`/rules/${rule.slug}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="hover:underline">{rule.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content */}
        {currentRule && (
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: currentRule.content || '<p>Nội dung đang được cập nhật...</p>' }}
            />
          </div>
        )}

        {/* Back to all rules */}
        {slug && rules.length > 1 && (
          <div className="mt-6">
            <Link
              href="/rules"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Xem tất cả các trang
            </Link>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Cập nhật lần cuối: {currentRule ? new Date(currentRule.updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</p>
        </div>
      </div>
    </div>
  );
}
