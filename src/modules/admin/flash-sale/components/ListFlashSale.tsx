"use client";

import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import {
  App,
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  InputNumber,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { AdminModal, AdminPageHeader, AdminFilterItem } from "@/modules/admin/common/components/AdminUi";
import { useFlashSale } from "../hooks/useFlashSale";
import { FlashSale } from "../models/flash-sale.model";
import { FlashSaleForm } from "./FlashSaleForm";

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Tạm dừng" },
  { value: "expired", label: "Đã hết hạn" },
];

const { Paragraph } = Typography;

const formatDate = (date: string | Date) =>
  dayjs(date).format("DD/MM/YYYY HH:mm");

const ListFlashSale = () => {
  const { message } = App.useApp();
  const {
    flashSales,
    isLoading,
    deleteFlashSale,
    updateFlashSale,
    createFlashSale,
    totalPages,
    fetchFlashSales,
  } = useFlashSale();

  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedFlashSale, setSelectedFlashSale] = useState<FlashSale | null>(null);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const isActiveFilter =
      selectedStatus === "active" ? true : selectedStatus === "inactive" ? false : undefined;
    fetchFlashSales(page, isActiveFilter);
  }, [fetchFlashSales, page, selectedStatus]);

  const isFlashSaleActive = (flashSale: FlashSale) => {
    const now = new Date();
    const startDateValue = new Date(flashSale.startDate);
    const endDateValue = new Date(flashSale.endDate);
    return flashSale.isActive && startDateValue <= now && endDateValue >= now;
  };

  const isFlashSaleExpired = (flashSale: FlashSale) => {
    const now = new Date();
    return new Date(flashSale.endDate) < now;
  };

  const filteredFlashSales = useMemo(() => {
    if (selectedStatus === "expired") {
      return flashSales.filter(isFlashSaleExpired);
    }
    return flashSales;
  }, [flashSales, selectedStatus]);

  const handleDelete = async (slug: string) => {
    await deleteFlashSale(slug);
    message.success("Đã xóa flash sale.");
  };

  const handleStop = async (flashSale: FlashSale) => {
    try {
      await updateFlashSale(flashSale.slug, { isActive: false });
      message.success("Đã dừng flash sale.");
    } catch (error: any) {
      message.error(error.message || "Không thể dừng flash sale");
    }
  };

  const handleOpenEdit = (flashSale: FlashSale) => {
    setSelectedFlashSale(flashSale);
    setShowFormModal(true);
  };

  const handleOpenCreate = () => {
    setSelectedFlashSale(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (values: Partial<FlashSale>) => {
    setIsSubmitting(true);
    try {
      if (selectedFlashSale) {
        await updateFlashSale(selectedFlashSale.slug, values);
        message.success("Cập nhật flash sale thành công.");
      } else {
        await createFlashSale(values);
        message.success("Tạo flash sale mới thành công.");
      }
      setShowFormModal(false);
      const isActiveFilter =
        selectedStatus === "active" ? true : selectedStatus === "inactive" ? false : undefined;
      fetchFlashSales(page, isActiveFilter);
    } catch (error: any) {
      message.error(error.message || "Thao tác thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenActivateModal = (flashSale: FlashSale) => {
    setSelectedFlashSale(flashSale);
    form.setFieldsValue({
      range: [dayjs(), dayjs().add(1, "day")],
      discountPercentage: flashSale.discountPercentage || 0,
    });
    setShowActivateModal(true);
  };

  const handleActivateQuickly = async () => {
    if (!selectedFlashSale) return;
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      await updateFlashSale(selectedFlashSale.slug, {
        startDate: values.range[0].toISOString(),
        endDate: values.range[1].toISOString(),
        discountPercentage: values.discountPercentage,
        isActive: true,
      });
      message.success("Đã kích hoạt lại flash sale.");
      setShowActivateModal(false);
      const isActiveFilter =
        selectedStatus === "active" ? true : selectedStatus === "inactive" ? false : undefined;
      fetchFlashSales(page, isActiveFilter);
    } catch (error: any) {
      message.error(error.message || "Kích hoạt thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: ColumnsType<FlashSale> = [
    {
      title: "STT",
      key: "index",
      width: 70,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Tên chương trình",
      dataIndex: "name",
      key: "name",
      render: (name, flashSale) => (
        <div>
          <Typography.Text strong className="block">{name}</Typography.Text>
          <Typography.Text type="secondary" className="!text-xs">Slug: {flashSale.slug}</Typography.Text>
        </div>
      ),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 170,
      render: (value) => formatDate(value),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      width: 170,
      render: (value) => formatDate(value),
    },
    {
      title: "Giảm giá",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      width: 100,
      align: "center",
      render: (value: number) => <Tag color="blue" className="!mr-0">{value || 0}%</Tag>,
    },
    {
      title: "Sản phẩm",
      key: "products",
      width: 100,
      align: "center",
      render: (_, flashSale) => (Array.isArray(flashSale.products) ? flashSale.products.length : 0),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 140,
      align: "center",
      render: (_, flashSale) => {
        const isActive = isFlashSaleActive(flashSale);
        const isExpired = isFlashSaleExpired(flashSale);
        if (isActive) return <Tag color="success">Đang hoạt động</Tag>;
        if (isExpired) return <Tag color="default">Đã hết hạn</Tag>;
        return <Tag color="warning">Tạm dừng</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "actions",
      width: 160,
      fixed: "right",
      align: "center",
      render: (_, flashSale) => (
        <Space size={4}>
          {flashSale.isActive ? (
            <Popconfirm title="Dừng chương trình này?" onConfirm={() => handleStop(flashSale)}>
              <Tooltip title="Dừng">
                <Button type="text" shape="circle" icon={<PauseCircleOutlined />} />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Tooltip title="Kích hoạt nhanh">
              <Button type="text" shape="circle" icon={<PlayCircleOutlined />} onClick={() => handleOpenActivateModal(flashSale)} />
            </Tooltip>
          )}
          <Tooltip title="Chỉnh sửa">
            <Button type="text" shape="circle" icon={<EditOutlined />} onClick={() => handleOpenEdit(flashSale)} />
          </Tooltip>
          <Popconfirm title="Xóa vĩnh viễn?" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(flashSale.slug)}>
            <Tooltip title="Xóa">
              <Button type="text" danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Dịch vụ & tiện ích"
        title="Quản lý Flash Sale"
        description="Thiết lập chương trình giảm giá theo khung giờ, áp dụng cho nhiều sản phẩm cùng lúc để kích cầu mua sắm."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Thêm Flash Sale
          </Button>
        }
      />

      <Card className="ah-admin-card ah-admin-card-static" styles={{ body: { paddingBottom: 16 } }}>
        <div className="flex items-end gap-3">
          <AdminFilterItem label="Trạng thái">
            <Select
              value={selectedStatus}
              options={statusOptions}
              className="w-full ah-admin-antd-select"
              onChange={(value) => {
                setSelectedStatus(value);
                setPage(1);
              }}
            />
          </AdminFilterItem>
          <div className="flex items-end pb-1">
            <Typography.Text type="secondary" className="text-xs">
              {isLoading ? "Đang tải dữ liệu..." : `Tìm thấy ${filteredFlashSales.length} chương trình`}
            </Typography.Text>
          </div>
        </div>
      </Card>

      <Card className="ah-admin-card">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-gray-400">Đang tải danh sách...</div>
        ) : filteredFlashSales.length === 0 ? (
          <Empty description="Không tìm thấy chương trình nào" />
        ) : (
          <Table
            rowKey={(flashSale) => flashSale._id}
            columns={columns}
            dataSource={filteredFlashSales}
            pagination={{
              current: page,
              pageSize: 12,
              total: Math.max(totalPages, 1) * 12,
              showSizeChanger: false,
              onChange: setPage,
            }}
          />
        )}
      </Card>

      {/* Main Form Modal */}
      <AdminModal
        title={selectedFlashSale ? "Cập nhật Flash Sale" : "Tạo Flash Sale mới"}
        open={showFormModal}
        onCancel={() => setShowFormModal(false)}
        onOk={undefined}
        footer={null}
        width={1000}
        destroyOnClose={true}
        loading={isSubmitting}
      >
        <FlashSaleForm
          initialData={selectedFlashSale || undefined}
          mode={selectedFlashSale ? "edit" : "create"}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowFormModal(false)}
          isLoading={isSubmitting}
        />
      </AdminModal>

      {/* Quick Activate Modal */}
      <AdminModal
        title="Kích hoạt nhanh Flash Sale"
        open={showActivateModal}
        onCancel={() => setShowActivateModal(false)}
        onOk={handleActivateQuickly}
        okText="Kích hoạt"
        cancelText="Hủy"
        width={480}
        destroyOnClose={true}
        loading={isSubmitting}
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Paragraph type="secondary" className="text-sm mb-6">
            <InfoCircleOutlined className="mr-2" />
            Vui lòng cập nhật khung thời gian mới để kích hoạt chương trình này.
          </Paragraph>
          <Form.Item name="range" label="Thời gian diễn ra" rules={[{ required: true }]}>
            <DatePicker.RangePicker className="w-full" showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
          <Form.Item name="discountPercentage" label="Phần trăm giảm (%)" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} className="w-full" />
          </Form.Item>
        </Form>
      </AdminModal>
    </div>
  );
};

export default ListFlashSale;
