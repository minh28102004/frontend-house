import React from "react";
import ContactUs from "../ContactUs";

const GiftSetPage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 lg:px-10 py-12 mt-20 space-y-12 font-medium">
      <div className="space-y-2 text-center">
        <p className="text-sm tracking-wide text-gray-500 uppercase">Dịch vụ</p>
        <div className="text-[20px] md:text-[25px] text-gray-900 font-bold">
          Bộ Quà Tặng - Món Quà Tinh Tế Dành Riêng Cho Người Bạn Trân Quý
        </div>
        <p className="text-gray-800 leading-relaxed text-justify">
          Bộ quà tặng của Vincens dành cho khách muốn gửi tặng người thân, bạn bè, đồng nghiệp hoặc
          giáo viên một món quà mang giá trị thực tế và sự trân trọng. Mỗi bộ trang phục được thiết
          kế theo nhu cầu riêng để mang dấu ấn cá nhân.
        </p>
      <ContactUs/>

      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Lắng nghe mong muốn và mục đích tặng quà
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Xác định phong thái món quà muốn truyền tải.</li>
            <li>Tìm hiểu đối tượng nhận quà và phong cách cơ bản.</li>
            <li>Phân tích bối cảnh sử dụng: công việc, sự kiện, lễ tri ân, dịp đặc biệt.</li>
            <li>Gợi ý hướng thiết kế để món quà vừa hữu dụng vừa mang tính biểu trưng.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Thiết kế bộ vest theo yêu cầu của người tặng
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Định hình phom dáng phù hợp với đối tượng nhận.</li>
            <li>Chọn chi tiết thiết kế thanh lịch, dễ dùng trong nhiều hoàn cảnh.</li>
            <li>Tối ưu tỉ lệ và cấu trúc để diện mạo chỉnh chu, hài hòa.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Gói quà và trình bày sang trọng
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Chuẩn bị hộp quà trang nhã, thể hiện giá trị món quà.</li>
            <li>Trình bày hài hòa; kèm thiệp lời chúc nếu khách yêu cầu.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Hỗ trợ đổi size miễn phí cho người nhận
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Đổi size miễn phí nếu người nhận mặc chưa vừa.</li>
            <li>Kỹ thuật viên hỗ trợ điều chỉnh cần thiết, quy trình nhanh gọn.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Chi phí bộ quà tặng linh hoạt theo nhu cầu
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Giá trị bộ quà tặng được xác định dựa trên yêu cầu thiết kế, thời gian hoàn thiện và phạm
            vi hỗ trợ; mức giá được tư vấn rõ ràng để khách chủ động lựa chọn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiftSetPage;

