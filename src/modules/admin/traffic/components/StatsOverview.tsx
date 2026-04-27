"use client";

import { motion } from "framer-motion";
import { ActivityIcon, EyeIcon, UsersIcon } from "@/common/icons";
import type { TrafficStats } from "../types/traffic.types";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: number;
  color: "blue" | "green" | "orange" | "purple";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  orange: "bg-orange-50 text-orange-600",
  purple: "bg-purple-50 text-purple-600",
};

const bgDotMap = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
};

const StatCard = ({ title, value, icon, subtitle, trend, color }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">
          {value.toLocaleString("vi-VN")}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
        )}
        {trend !== undefined && (
          <p className={`text-xs mt-1 font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {trend >= 0 ? "+" : ""}{trend}% so với hôm qua
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

interface StatsOverviewProps {
  stats: TrafficStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const visitorTrend = stats.yesterdayVisitors > 0
    ? Math.round(((stats.todayVisitors - stats.yesterdayVisitors) / stats.yesterdayVisitors) * 100)
    : 0;

  const pageViewTrend = stats.todayPageViews > 0
    ? Math.round(stats.todayPageViews * 0.1)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Đang trực tuyến"
        value={stats.activeNow}
        icon={<UsersIcon className="w-6 h-6" />}
        subtitle="Người dùng đang hoạt động"
        color="green"
      />
      <StatCard
        title="Khách hôm nay"
        value={stats.todayVisitors}
        icon={<EyeIcon className="w-6 h-6" />}
        subtitle={`${stats.yesterdayVisitors} hôm qua`}
        trend={visitorTrend}
        color="blue"
      />
      <StatCard
        title="Lượt xem hôm nay"
        value={stats.todayPageViews}
        icon={<ActivityIcon className="w-6 h-6" />}
        subtitle="Tổng page views"
        trend={pageViewTrend}
        color="orange"
      />
      <StatCard
        title="Tổng lượt truy cập"
        value={stats.totalVisitors}
        icon={<UsersIcon className="w-6 h-6" />}
        subtitle="Tất cả thời gian"
        color="purple"
      />
    </div>
  );
}
