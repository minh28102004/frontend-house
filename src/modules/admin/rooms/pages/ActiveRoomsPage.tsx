"use client";

import { AdminPageHeader } from "@/modules/admin/common/components/AdminUi";
import ActiveRooms from "../components/ActiveRooms";

const ActiveRoomsPage = () => {
  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        title="Phòng đang hoạt động"
        description="Các phòng đang có khách ở hoặc booking đã xác nhận."
      />
      <ActiveRooms />
    </div>
  );
};

export default ActiveRoomsPage;
