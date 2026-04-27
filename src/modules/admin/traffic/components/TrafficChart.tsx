"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { DailyData } from "../types/traffic.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TrafficChartProps {
  data: DailyData[];
  days?: number;
}

export default function TrafficChart({ data, days = 7 }: TrafficChartProps) {
  const visitors = data.map((d) => ({
    x: new Date(d.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
    }),
    y: d.visitors,
  }));

  const pageViews = data.map((d) => ({
    x: new Date(d.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
    }),
    y: d.pageViews,
  }));

  const options = {
    chart: {
      type: "area" as const,
      height: 350,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" as const, width: 2 },
    colors: ["#3B82F6", "#10B981"],
    fill: {
      type: "gradient" as const,
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "category" as const,
      labels: { style: { colors: "#6B7280", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" },
        formatter: (val: number) => val.toLocaleString("vi-VN"),
      },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
    },
    legend: {
      show: true,
      position: "top" as const,
      horizontalAlign: "right" as const,
      labels: { colors: "#6B7280" },
      markers: { size: 6, radius: 4 } as any,
    },
    tooltip: {
      theme: "light",
      x: { show: true },
      y: {
        formatter: (val: number) => `${val.toLocaleString("vi-VN")} người`,
      },
    },
  };

  const series = [
    { name: "Khách truy cập", data: visitors },
    { name: "Lượt xem trang", data: pageViews },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lưu lượng truy cập
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Thống kê {days} ngày gần đây
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">Khách</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Lượt xem</span>
          </div>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={300}
      />
    </motion.div>
  );
}
