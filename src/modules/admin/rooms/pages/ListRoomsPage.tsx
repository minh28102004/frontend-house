"use client";

import { useState } from "react";
import { App, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  AdminPageHeader,
  AdminModal,
} from "@/modules/admin/common/components/AdminUi";
import ListRooms from "../components/ListRooms";
import RoomForm, { RoomFormPayload } from "../components/RoomForm";
import { useRooms } from "../hooks/useRooms";
import { Room } from "../types/room.types";

const ListRoomsPage = () => {
  const {
    rooms,
    loading,
    error,
    pagination,
    fetchRooms,
    createRoom,
    updateRoom,
    toggleVisibility,
    deleteRoom,
  } = useRooms();
  const { message } = App.useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);

  const handlePageChange = (page: number) => {
    fetchRooms(page, pagination.limit);
  };

  const handleToggleVisibility = async (concept: string) => {
    await toggleVisibility(concept);
  };

  const handleDelete = async (concept: string) => {
    await deleteRoom(concept);
  };

  const handleOpenCreate = () => {
    setEditingRoom(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: RoomFormPayload) => {
    try {
      let success = false;
      if (editingRoom) {
        success = await updateRoom(editingRoom.concept, data);
        if (success) message.success("Đã cập nhật thông tin phòng thành công.");
      } else {
        success = await createRoom(data);
        if (success) message.success("Đã tạo phòng mới thành công.");
      }
      
      if (success) {
        setIsModalOpen(false);
        fetchRooms(pagination.page, pagination.limit);
      } else {
        message.error("Thao tác thất bại. Vui lòng kiểm tra lại dữ liệu.");
      }
    } catch {
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Không gian lưu trú"
        title="Phòng & concept"
        description="Quản lý danh sách phòng, hình ảnh, giá hiển thị và trạng thái xuất hiện trên website vận hành Another House."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate}>
            Tạo phòng mới
          </Button>
        }
      />

      {error ? <div className="text-sm text-[#ff4d4f]">{error}</div> : null}

      <ListRooms
        rooms={rooms}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onToggleVisibility={handleToggleVisibility}
        onDelete={handleDelete}
        onEdit={handleOpenEdit}
      />

      <AdminModal
        title={editingRoom ? "Chỉnh sửa phòng" : "Thêm phòng vào hệ thống"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <RoomForm 
          room={editingRoom} 
          onSuccess={handleFormSubmit} 
        />
      </AdminModal>
    </div>
  );
};

export default ListRoomsPage;
