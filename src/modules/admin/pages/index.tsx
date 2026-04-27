"use client";

import React from "react";
import Link from "next/link";
import type { ColumnsType } from "antd/es/table";
import {
  AreaChartOutlined,
  BellOutlined,
  DashboardOutlined,
  FileTextOutlined,
  HomeOutlined,
  PictureOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Statistic, Table, Tag, Typography } from "antd";
import Chart from "react-apexcharts";
import { AdminActionLink, AdminPageHeader } from "@/modules/admin/common/components/AdminUi";

const summaryStats = [
  { title: "Tổng booking", value: 482, prefix: <HomeOutlined />, trend: "+12%" },
  { title: "Booking chờ xác nhận", value: 36, prefix: <BellOutlined />, trend: "-4%" },
  { title: "Phòng đang sử dụng", value: 28, prefix: <HomeOutlined />, trend: "+2%" },
  { title: "Doanh thu tháng", value: 328500000, prefix: "₫", trend: "+18%" },
  { title: "Bài viết", value: 94, prefix: <FileTextOutlined />, trend: "+3" },
  { title: "Banner đang hiển thị", value: 12, prefix: <PictureOutlined />, trend: "+1" },
  { title: "Người dùng", value: 267, prefix: <TeamOutlined />, trend: "+8" },
  { title: "Đối tác chủ nhà", value: 21, prefix: <UserSwitchOutlined />, trend: "+1" },
];

const quickActions = [
  {
    title: "Phòng & đặt lịch",
    description: "Tạo phòng, cập nhật trạng thái và điều phối lịch đặt phòng.",
    href: "/admin/rooms/bookings",
    icon: <HomeOutlined />,
    meta: "Vận hành",
  },
  {
    title: "Dịch vụ & tiện ích",
    description: "Quản lý dịch vụ, danh mục và đơn dịch vụ.",
    href: "/admin/products?page=1",
    icon: <AreaChartOutlined />,
    meta: "Vận hành",
  },
  {
    title: "Bài viết & SEO",
    description: "Biên tập nội dung hiển thị, trạng thái xuất bản và SEO.",
    href: "/admin/posts",
    icon: <FileTextOutlined />,
    meta: "Nội dung",
  },
  {
    title: "Thư viện hình ảnh",
    description: "Upload và quản lý tài nguyên ảnh dùng cho website.",
    href: "/admin/media",
    icon: <PictureOutlined />,
    meta: "Cấu hình",
  },
];

type RecentActivity = {
  id: string;
  type: string;
  title: string;
  owner: string;
  status: "Mới" | "Đang xử lý" | "Hoàn tất";
  time: string;
};

const recentActivities: RecentActivity[] = [
  {
    id: "BK-2026-001",
    type: "Booking",
    title: "Đặt phòng Romantic - 2 đêm",
    owner: "ngoc.anh@gmail.com",
    status: "Mới",
    time: "2 phút trước",
  },
  {
    id: "OD-2026-004",
    type: "Đơn dịch vụ",
    title: "Combo trang trí phòng",
    owner: "staff@anotherhouse.vn",
    status: "Đang xử lý",
    time: "18 phút trước",
  },
  {
    id: "PT-2026-002",
    type: "Bài viết",
    title: "Cập nhật bài viết trải nghiệm mùa hè",
    owner: "content@anotherhouse.vn",
    status: "Hoàn tất",
    time: "45 phút trước",
  },
  {
    id: "BN-2026-009",
    type: "Banner",
    title: "Banner ưu đãi tháng 4",
    owner: "marketing@anotherhouse.vn",
    status: "Đang xử lý",
    time: "1 giờ trước",
  },
];

const activityColumns: ColumnsType<RecentActivity> = [
  {
    title: "Mã",
    dataIndex: "id",
    width: 140,
  },
  {
    title: "Loại",
    dataIndex: "type",
    width: 130,
  },
  {
    title: "Nội dung",
    dataIndex: "title",
    ellipsis: true,
  },
  {
    title: "Người xử lý",
    dataIndex: "owner",
    width: 220,
    ellipsis: true,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    width: 130,
    align: "center",
    render: (value: RecentActivity["status"]) => {
      if (value === "Hoàn tất") return <Tag color="success">Hoàn tất</Tag>;
      if (value === "Đang xử lý") return <Tag color="processing">Đang xử lý</Tag>;
      return <Tag color="warning">Mới</Tag>;
    },
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    width: 140,
  },
];

const Index = () => {
  // Traffic chart data
  const trafficChartOptions = {
    chart: {
      type: "line" as const,
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#1677ff"],
    grid: { show: false },
    xaxis: {
      categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "rgba(0,0,0,0.45)", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: "rgba(0,0,0,0.45)", fontSize: "12px" } } },
    tooltip: { theme: "light" },
  };

  const trafficChartSeries = [
    {
      name: "Lượt truy cập",
      data: [420, 512, 481, 690, 628, 745, 820],
    },
  ];

  // Bookings chart data
  const bookingsChartOptions = {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
    },
    colors: ["#52c41a"],
    grid: { show: false },
    xaxis: {
      categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "rgba(0,0,0,0.45)", fontSize: "12px" } },
    },
    yaxis: { labels: { style: { colors: "rgba(0,0,0,0.45)", fontSize: "12px" } } },
    tooltip: { theme: "light" },
  };

  const bookingsChartSeries = [
    {
      name: "Booking",
      data: [12, 15, 18, 14, 16, 19, 22],
    },
  ];

  // Revenue chart data
  const revenueChartOptions = {
    chart: {
      type: "area" as const,
      toolbar: { show: false },
    },
    colors: ["#faad14"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
      },
    },
    stroke: { curve: "smooth", width: 2 },
    grid: { show: false },
    xaxis: {
      categories: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "rgba(0,0,0,0.45)", fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        style: { colors: "rgba(0,0,0,0.45)", fontSize: "12px" },
        formatter: (value: number) => `${(value / 1000).toFixed(0)}K`,
      },
    },
    tooltip: { theme: "light", y: { formatter: (value: number) => `${value.toLocaleString()} ₫` } },
  };

  const revenueChartSeries = [
    {
      name: "Doanh thu",
      data: [28000000, 32000000, 35000000, 31000000, 38000000, 42000000, 39000000, 45000000, 48000000, 51000000, 49000000, 55000000],
    },
  ];

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
              icon={<DashboardOutlined />}
        eyebrow="Tổng quan vận hành"
        title="Bảng điều khiển vận hành"
        description="Theo dõi nhanh tình trạng phòng, lịch đặt, nội dung hiển thị và hoạt động vận hành."
        actions={
          <Space wrap>
            <Link href="/admin/rooms/create">
              <Button type="primary">Tạo phòng</Button>
            </Link>
            <Link href="/admin/posts/create">
              <Button>Thêm bài viết</Button>
            </Link>
            <Link href="/admin/banners">
              <Button>Thêm banner</Button>
            </Link>
          </Space>
        }
      />

      <section>
        <Row gutter={[16, 16]}>
          {summaryStats.map((stat) => (
            <Col key={stat.title} xs={24} sm={12} lg={8} xl={6}>
              <Card className="ah-admin-card ah-admin-card-hoverable">
                <Statistic title={stat.title} value={stat.value} prefix={stat.prefix} groupSeparator="." />
                <Typography.Text className="!text-xs !text-[rgba(0,0,0,0.45)]">Biến động: {stat.trend}</Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card className="ah-admin-card" title="Lượt truy cập">
              <Chart options={trafficChartOptions} series={trafficChartSeries} type="line" height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className="ah-admin-card" title="Booking theo ngày">
              <Chart options={bookingsChartOptions} series={bookingsChartSeries} type="bar" height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card className="ah-admin-card" title="Doanh thu theo tháng">
              <Chart options={revenueChartOptions} series={revenueChartSeries} type="area" height={300} />
            </Card>
          </Col>
        </Row>
      </section>

      <section>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card className="ah-admin-card" title="Quick actions">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <AdminActionLink key={action.title} {...action} />
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </section>

      <section>
        <Card className="ah-admin-card" title="Hoạt động gần đây">
          <Table
            rowKey="id"
            columns={activityColumns}
            dataSource={recentActivities}
            pagination={false}
            size="middle"
          />
        </Card>
      </section>
    </div>
  );
};

export default Index;
