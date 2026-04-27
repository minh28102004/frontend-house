"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { BrowserData } from "../types/traffic.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BrowsersChartProps {
  browsers: BrowserData[];
}

const colorPalette = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function BrowsersChart({ browsers }: BrowsersChartProps) {
  const options = {
    chart: {
      type: "donut" as const,
      height: 280,
      fontFamily: "Inter, sans-serif",
    },
    labels: browsers.map((b) => b.browser),
    colors: colorPalette,
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { show: true, fontSize: "14px", fontWeight: 500 },
            value: {
              show: true,
              fontSize: "14px",
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: "Tổng",
              fontSize: "14px",
              formatter: () =>
                browsers
                  .reduce((sum, b) => sum + b.visitors, 0)
                  .toLocaleString("vi-VN"),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "bottom" as const,
      horizontalAlign: "center" as const,
      fontSize: "12px",
      fontWeight: 500,
      labels: { colors: "#6B7280" },
      markers: { size: 6, radius: 2 } as any,
    },
    stroke: { width: 0 },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number, { seriesIndex }: { seriesIndex: number }) =>
          `${browsers[seriesIndex]?.visitors.toLocaleString("vi-VN") || 0} người`,
      },
    },
  };

  const series = browsers.map((b) => b.percentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trình duyệt</h3>
      {browsers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>Chưa có dữ liệu</p>
        </div>
      ) : (
        <>
          <ReactApexChart options={options} series={series} type="donut" height={280} />
          <div className="mt-4 flex flex-col gap-2">
            {browsers.map((browser, index) => (
              <div key={browser.browser} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colorPalette[index] }}
                  />
                  <span className="text-gray-600 truncate">{browser.browser}</span>
                </div>
                <span className="text-gray-900 font-medium ml-2">
                  {browser.visitors.toLocaleString("vi-VN")} (
                  {browser.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
