"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { HourlyData } from "../types/traffic.types";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface HourlyChartProps {
  data: HourlyData[];
}

export default function HourlyChart({ data }: HourlyChartProps) {
  const visitors = data.map((d) => d.visitors);
  const pageViews = data.map((d) => d.pageViews);

  const options = {
    chart: {
      type: "bar" as const,
      height: 250,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    colors: ["#3B82F6", "#10B981"],
    xaxis: {
      categories: data.map((d) => `${d.hour}:00`),
      labels: {
        style: { colors: "#6B7280", fontSize: "11px" },
        rotate: 0,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#6B7280", fontSize: "11px" },
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
      y: {
        formatter: (val: number) => `${val.toLocaleString("vi-VN")} người`,
      },
    },
    fill: { opacity: 1 },
  };

  const series = [
    { name: "Khách", data: visitors },
    { name: "Lượt xem", data: pageViews },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Lưu lượng theo giờ
      </h3>
      <p className="text-sm text-gray-500 mb-4">Hôm nay</p>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={250}
      />
    </motion.div>
  );
}
