"use client";

import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import type { TopPage } from "../types/traffic.types";

interface TopPagesProps {
  pages: TopPage[];
}

export default function TopPages({ pages }: TopPagesProps) {
  const maxViews = Math.max(...pages.map((p) => p.views), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Trang được xem nhiều nhất
      </h3>

      {pages.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Chưa có dữ liệu</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pages.map((page, index) => (
            <div key={page.url} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700 truncate" title={page.url}>
                    {page.url}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 ml-2 flex-shrink-0">
                  {page.views.toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="ml-9 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(page.views / maxViews) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
