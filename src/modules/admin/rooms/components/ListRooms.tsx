"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { ColumnsType } from "antd/es/table";
import {
  App,
  Button,
  Descriptions,
  Drawer,
  Empty,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { AdminPageHeader } from "@/modules/admin/common/components/AdminUi";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  AdminStatusBadge,
  AdminThumbnail,
} from "@/modules/admin/common/components/AdminUi";
import { Room } from "../types/room.types";

interface Props {
  rooms: Room[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onToggleVisibility: (concept: string) => void;
  onDelete: (concept: string) => void;
  onEdit: (room: Room) => void;
}

const ListRooms: React.FC<Props> = ({
  rooms,
  loading,
  pagination,
  onPageChange,
  onToggleVisibility,
  onDelete,
  onEdit,
}) => {
  const { message } = App.useApp();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN").format(price);

  const columns: ColumnsType<Room> = useMemo(
    () => [
      {
        title: "STT",
        width: 76,
        align: "center",
        render: (_, __, index) => (
          <span className="font-semibold text-[var(--ah-muted)]">
            {(pagination.page - 1) * pagination.limit + index + 1}
          </span>
        ),
      },
      {
        title: "Phòng",
        dataIndex: "name",
        key: "room",
        render: (_, room) => (
          <div className="flex items-center gap-4">
            <AdminThumbnail
              src={room.thumbnail}
              alt={room.name}
              aspect="square"
              className="w-16 shrink-0"
              fallbackLabel={room.name}
            />
            <div className="min-w-0">
              <p className="ah-admin-table-main max-w-[260px]">{room.name}</p>
              <p className="ah-admin-table-sub mt-1">Phòng số {room.num}</p>
              {room.features?.length ? (
                <p className="ah-admin-table-sub mt-1 max-w-[360px] truncate">
                  {room.features.slice(0, 3).join(" • ")}
                </p>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        title: "Concept",
        dataIndex: "concept",
        key: "concept",
        width: 140,
        align: "center",
        render: (concept: string) => (
          <Tag className="!m-0">{concept}</Tag>
        ),
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        width: 140,
        align: "right",
        render: (price: number) => (
          <span className="font-semibold text-[var(--ah-text)]">{formatPrice(price)}đ</span>
        ),
      },
      {
        title: "Hiển thị",
        dataIndex: "isVisible",
        key: "isVisible",
        width: 160,
        align: "center",
        render: (_, room) => (
          <Popconfirm
            title={room.isVisible ? "Ẩn phòng khỏi website?" : "Hiển thị phòng trên website?"}
            okText={room.isVisible ? "Ẩn phòng" : "Hiển thị"}
            cancelText="Hủy"
            onConfirm={async () => {
              await onToggleVisibility(room.concept);
              message.success(room.isVisible ? "Đã ẩn phòng." : "Đã hiển thị phòng.");
            }}
          >
            <button type="button" className="inline-flex !min-h-0">
              <AdminStatusBadge
                status={room.isVisible ? "available" : "draft"}
                label={room.isVisible ? "Đang hiển thị" : "Đang ẩn"}
              />
            </button>
          </Popconfirm>
        ),
      },
      {
        title: "Hành động",
        key: "actions",
        width: 140,
        align: "center",
        fixed: "right",
        render: (_, room) => (
          <Space size={4}>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => setSelectedRoom(room)}
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button 
                type="text" 
                shape="circle" 
                icon={<EditOutlined />} 
                onClick={() => onEdit(room)} 
              />
            </Tooltip>
            <Popconfirm
              title={`Xóa phòng "${room.name}"?`}
              description="Hành động này không thể hoàn tác."
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              onConfirm={async () => {
                await onDelete(room.concept);
                message.success("Đã xóa phòng.");
              }}
            >
              <Tooltip title="Xóa">
                <Button type="text" danger shape="circle" icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [onEdit, message, onDelete, onToggleVisibility, pagination.limit, pagination.page],
  );

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <div className="ah-admin-table-card">
        {rooms.length === 0 && !loading ? (
          <div className="p-12">
            <Empty description="Chưa có phòng nào được tạo" />
          </div>
        ) : (
          <Table
            rowKey={(room) => room._id || room.concept}
            columns={columns}
            dataSource={rooms}
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: false,
              onChange: onPageChange,
            }}
            className="ah-admin-antd-table"
            scroll={{ x: 1080 }}
          />
        )}
      </div>

      <Drawer
        title="Chi tiết phòng"
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        width={640}
        destroyOnClose
        className="ah-admin-antd-drawer"
      >
        {selectedRoom ? (
          <Space direction="vertical" size={24} className="w-full">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-gray-50">
              {selectedRoom.thumbnail ? (
                <img src={selectedRoom.thumbnail} alt={selectedRoom.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">Chưa có ảnh đại diện</div>
              )}
            </div>

            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tên phòng"><Typography.Text strong>{selectedRoom.name}</Typography.Text></Descriptions.Item>
              <Descriptions.Item label="Số phòng">{selectedRoom.num}</Descriptions.Item>
              <Descriptions.Item label="Concept"><Tag>{selectedRoom.concept}</Tag></Descriptions.Item>
              <Descriptions.Item label="Giá hiển thị"><Typography.Text type="danger" strong>{formatPrice(selectedRoom.price)}đ</Typography.Text></Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <AdminStatusBadge
                  status={selectedRoom.isVisible ? "available" : "draft"}
                  label={selectedRoom.isVisible ? "Đang hiển thị" : "Đang ẩn"}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">{selectedRoom.description || "Chưa có mô tả"}</Descriptions.Item>
              <Descriptions.Item label="Tiện ích">
                {selectedRoom.features?.length ? (
                  <Space wrap size={[4, 4]}>
                    {selectedRoom.features.map((feature) => (
                      <Tag key={feature} className="!m-0">{feature}</Tag>
                    ))}
                  </Space>
                ) : (
                  "Chưa có tiện ích"
                )}
              </Descriptions.Item>
            </Descriptions>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button icon={<EditOutlined />} onClick={() => { onEdit(selectedRoom); setSelectedRoom(null); }}>
                Chỉnh sửa phòng
              </Button>
              <Button onClick={() => setSelectedRoom(null)}>Đóng</Button>
            </div>
          </Space>
        ) : null}
      </Drawer>
    </div>
  );
};

export default ListRooms;
