"use client";

import { motion } from "framer-motion";
import { FiMonitor, FiSmartphone, FiTablet, FiGlobe, FiClock } from "react-icons/fi";
import type { ActiveSession } from "../types/traffic.types";

interface RecentActivityProps {
  sessions: ActiveSession[];
}

function getDeviceIcon(device: string) {
  if (device === "Mobile") return <FiSmartphone className="w-4 h-4" />;
  if (device === "Tablet") return <FiTablet className="w-4 h-4" />;
  return <FiMonitor className="w-4 h-4" />;
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export default function RecentActivity({ sessions }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Hoạt động gần đây
      </h3>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                {getDeviceIcon(session.device)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {session.ip}
                  </span>
                  {session.userId && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-green-100 text-green-700">
                      Đã đăng nhập
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5" title={session.currentUrl}>
                  {session.currentUrl}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiGlobe className="w-3 h-3" />
                    {session.browser}
                  </span>
                  <span>{session.device}</span>
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {getTimeAgo(session.lastActivity)}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="text-xs font-medium text-gray-700">
                  {session.pageViews} trang
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
