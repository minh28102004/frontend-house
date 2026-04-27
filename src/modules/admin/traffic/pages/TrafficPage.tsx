"use client";

import { useState } from "react";
import { Alert, Button, Card, Segmented, Spin, Typography } from "antd";
import { FiActivity } from "react-icons/fi";
import { AreaChartOutlined, PlusOutlined } from "@ant-design/icons";

import StatsOverview from "../components/StatsOverview";
import TrafficChart from "../components/TrafficChart";
import HourlyChart from "../components/HourlyChart";
import TopPages from "../components/TopPages";
import BrowsersChart from "../components/BrowsersChart";
import DevicesChart from "../components/DevicesChart";
import RecentActivity from "../components/RecentActivity";

import { useTrafficOverview } from "../hooks/useTraffic";
import { AdminPageHeader } from "../../common/components/AdminUi";

const { Title, Text } = Typography;

const dayOptions = [
  { label: "7 ngày", value: 7 },
  { label: "14 ngày", value: 14 },
  { label: "30 ngày", value: 30 },
];

export default function TrafficPage() {
  const [days, setDays] = useState<number>(7);

  const {
    stats,
    chart,
    hourly,
    topPages,
    browsers,
    devices,
    recentActivity,
    isLoading,
    error,
  } = useTrafficOverview(days);

  // Nếu chưa có chức năng create thì bỏ button này
  const handleOpenCreate = () => {
    console.log("Open create");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="ah-admin-card w-full max-w-[360px] text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <Spin size="large" />
            <Text type="secondary">Đang tải dữ liệu...</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="ah-admin-card w-full max-w-[460px]">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <FiActivity className="h-8 w-8 text-red-500" />
            </div>

            <Title level={4} className="!mb-2">
              Không thể tải dữ liệu
            </Title>

            <Text type="secondary" className="mb-5">
              Vui lòng kiểm tra kết nối API.
            </Text>

            <Alert
              type="error"
              showIcon
              className="mb-5 w-full text-left"
              message="Lỗi tải dữ liệu traffic"
              description={String(error)}
            />

            <Button type="primary" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      {/* Header */}
      <AdminPageHeader
           icon={<AreaChartOutlined/>}
        eyebrow="Tổng quan"
        title="Theo dõi lượt truy cập"
        description="Theo dõi lưu lượng truy cập website, thiết bị, trình duyệt và hoạt động gần đây."
        actions={
          <div className="flex items-center gap-3">
            <Segmented
              options={dayOptions}
              value={days}
              onChange={(value) => setDays(value as number)}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenCreate}
            >
              Thêm danh mục
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <section className="ah-admin-section">
        <StatsOverview stats={stats} />
      </section>

      {/* Main charts */}
      <section className="ah-admin-section grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrafficChart data={chart} days={days} />
        </div>

        <div>
          <HourlyChart data={hourly} />
        </div>
      </section>

      {/* Secondary charts */}
      <section className="ah-admin-section grid grid-cols-1 gap-5 lg:grid-cols-3">
        <BrowsersChart browsers={browsers} />
        <DevicesChart devices={devices} />
        <TopPages pages={topPages} />
      </section>

      {/* Recent activity */}
      <section className="ah-admin-section">
        <RecentActivity sessions={recentActivity} />
      </section>
    </div>
  );
}