"use client";

import { useState } from "react";
import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Tabs,
} from "antd";
import { DownloadOutlined, TeamOutlined, WalletOutlined } from "@ant-design/icons";
import {
  AdminPageHeader,
  AdminFilterItem,
  AdminFilterBar,
} from "@/modules/admin/common/components/AdminUi";
import { useBookingsWithFilters, useBookingExport, useBookingStats } from "../hooks/useBookingManagement";
import { BookingListResponse, BookingQueryDto, BookingStatus, RoomBooking } from "../types/booking.types";
import { BookingService } from "../services/booking.service";
import ListBookings from "../components/ListBookings";
import ActiveRooms from "../components/ActiveRooms";

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "pending_payment", label: "Chờ thanh toán" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const ListBookingsPage = () => {
  const { message } = App.useApp();
  const {
    bookings,
    loading,
    pagination,
    goToPage,
    updateBookingStatus,
    cancelBooking,
    fetchBookings,
  } = useBookingsWithFilters();
  const { stats, loading: statsLoading } = useBookingStats();
  const { exportCSV } = useBookingExport();

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterConcept, setFilterConcept] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "active">("bookings");

  const handleSearch = () => {
    const newFilters: BookingQueryDto = {
      page: 1,
      concept: filterConcept || undefined,
      status: (filterStatus || undefined) as BookingStatus | undefined,
      guestEmail: searchEmail || undefined,
      checkInDate: filterDateFrom || undefined,
      checkOutDate: filterDateTo || undefined,
    };
    goToPage(1);
    fetchBookings(newFilters);
  };

  const handleClearFilters = () => {
    setFilterStatus("");
    setFilterConcept("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setSearchEmail("");
    goToPage(1);
    fetchBookings({ page: 1 });
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status);
  };

  const handleCancelBooking = async (id: string) => {
    await cancelBooking(id);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      let allBookings: RoomBooking[] = [];
      const firstPage: BookingListResponse = await BookingService.getAllAdmin({ limit: 100, page: 1 });
      const totalPages = Math.ceil(firstPage.total / 100);

      for (let page = 1; page <= totalPages; page += 1) {
        const response: BookingListResponse = await BookingService.getAllAdmin({ limit: 100, page });
        allBookings = allBookings.concat(response.data);
      }

      exportCSV(allBookings, `tat-ca-dat-phong_${new Date().toISOString().split("T")[0]}`);
    } catch (error) {
      console.error("Export failed:", error);
      message.error("Không thể xuất toàn bộ dữ liệu booking.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportFiltered = () => {
    exportCSV(bookings, `dat-phong_loc_${new Date().toISOString().split("T")[0]}`);
  };

  const formatPrice = (value: number) => new Intl.NumberFormat("vi-VN").format(value);

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Lịch lưu trú"
        title="Phòng & đặt lịch"
        description="Theo dõi nhanh booking mới, lịch nhận phòng, trạng thái xác nhận và nhịp vận hành lưu trú trong ngày."
        actions={
          <Space wrap>
            <Button icon={<DownloadOutlined />} onClick={handleExportFiltered} disabled={bookings.length === 0}>
              Xuất danh sách
            </Button>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportAll} loading={isExporting}>
              {isExporting ? "Đang xuất..." : "Xuất tất cả CSV"}
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card className="ah-admin-card">
            <Statistic title="Tổng đơn" value={statsLoading ? "..." : stats.total} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="ah-admin-card">
            <Statistic title="Chờ xác nhận" value={statsLoading ? "..." : stats.pending} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="ah-admin-card">
            <Statistic title="Đã xác nhận" value={statsLoading ? "..." : stats.confirmed} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="ah-admin-card">
            <Statistic
              title="Doanh thu"
              value={statsLoading ? "..." : formatPrice(stats.totalRevenue)}
              suffix="đ"
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="ah-admin-card">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "bookings" | "active")}
          items={[
            { key: "bookings", label: "Tất cả lịch đặt" },
            { key: "active", label: "Phòng đang sử dụng" },
          ]}
        />
      </Card>

      {activeTab === "bookings" ? (
        <>
          <AdminFilterBar className="ah-admin-card-static">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(260px,1fr)_200px_180px_150px_150px_auto] md:items-end">
              <AdminFilterItem label="Tìm kiếm">
                <Input.Search
                  placeholder="Tìm theo email khách..."
                  value={searchEmail}
                  enterButton="Tìm kiếm"
                  className="w-full ah-admin-antd-search"
                  onChange={(e) => setSearchEmail(e.target.value)}
                  onSearch={handleSearch}
                  allowClear
                />
              </AdminFilterItem>
              <AdminFilterItem label="Trạng thái">
                <Select
                  className="w-full ah-admin-antd-select"
                  options={statusOptions}
                  value={filterStatus || ""}
                  placeholder="Tất cả trạng thái"
                  onChange={setFilterStatus}
                />
              </AdminFilterItem>
              <AdminFilterItem label="Concept phòng">
                <Input 
                  placeholder="Concept phòng" 
                  value={filterConcept} 
                  className="w-full ah-admin-input"
                  onChange={(e) => setFilterConcept(e.target.value)} 
                />
              </AdminFilterItem>
              <AdminFilterItem label="Từ ngày">
                <DatePicker 
                  className="w-full ah-admin-input" 
                  placeholder="Từ ngày"
                  format="DD/MM/YYYY" 
                  onChange={(_, dateStr) => setFilterDateFrom(String(dateStr || ""))} 
                />
              </AdminFilterItem>
              <AdminFilterItem label="Đến ngày">
                <DatePicker 
                  className="w-full ah-admin-input" 
                  placeholder="Đến ngày"
                  format="DD/MM/YYYY" 
                  onChange={(_, dateStr) => setFilterDateTo(String(dateStr || ""))} 
                />
              </AdminFilterItem>
              <div className="flex items-end gap-2">
                <Button type="primary" onClick={handleSearch} className="ah-admin-btn">
                  Lọc
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[rgba(0,0,0,0.45)]">
                {loading ? "Đang tải..." : `Hiển thị ${bookings.length} / ${pagination.total} booking`}
              </p>
              <Space>
                <Button onClick={handleClearFilters}>
                  Xóa lọc
                </Button>
              </Space>
            </div>
          </AdminFilterBar>

          <ListBookings
            bookings={bookings}
            loading={loading}
            pagination={{
              page: pagination.page,
              limit: pagination.limit,
              total: pagination.total,
              totalPages: pagination.totalPages,
            }}
            onPageChange={handlePageChange}
            onUpdateStatus={handleUpdateStatus}
            onCancelBooking={handleCancelBooking}
          />
        </>
      ) : (
        <ActiveRooms />
      )}
    </div>
  );
};

export default ListBookingsPage;
