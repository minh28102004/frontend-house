import React from "react";
import ContactUs from "../ContactUs";

const AlterationPage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 lg:px-10 py-12 mt-20 space-y-12 font-medium">
      <div className="space-y-2 text-center">
        <p className="text-sm tracking-wide text-gray-500 uppercase">Dịch vụ</p>
        <div className="text-[20px] md:text-[25px] text-gray-900 font-bold">
          Dịch vụ Sửa Vest - Hoàn Thiện Từng Đường Nét Theo Yêu Cầu
        </div>
        <p className="text-gray-800 leading-relaxed text-justify">
          Dịch vụ sửa vest dành cho khách hàng muốn điều chỉnh trang phục để đạt sự vừa vặn và
          phong thái phù hợp. Mỗi thao tác chỉnh sửa được thực hiện bởi đội ngũ kỹ thuật có
          kinh nghiệm, bảo đảm sự tinh tế và giữ trọn vẻ sang trọng của bộ vest.
        </p>
      <ContactUs/>

      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Tiếp nhận yêu cầu và tư vấn hình thức chỉnh sửa
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Trao đổi trực tiếp để xác định nhu cầu sửa vest rõ ràng.</li>
            <li>Phân tích tình trạng hiện tại và gợi ý phương án phù hợp.</li>
            <li>Định hướng chi tiết cần chỉnh như vai, eo, tay áo, độ ôm hoặc chiều dài.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Kiểm tra cấu trúc trang phục và ghi nhận thông số
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Đánh giá tổng thể bộ vest, cấu trúc đường may và độ cân đối.</li>
            <li>Ghi nhận thông số quan trọng để đưa ra tỉ lệ điều chỉnh phù hợp.</li>
            <li>Xem xét dáng đứng và cách cử động để bảo đảm độ vừa vặn khi sử dụng.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Tiến hành chỉnh sửa theo yêu cầu
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Thu gọn hoặc mở rộng theo từng khu vực.</li>
            <li>Điều chỉnh vai, tay, eo hoặc chiều dài đúng phom mong muốn.</li>
            <li>Tái tạo đường may để giữ sự liền mạch và thẩm mỹ.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Thử trang phục và tinh chỉnh cuối
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Hẹn khách thử sau lần chỉnh đầu tiên, đánh giá khi đứng, ngồi, di chuyển.</li>
            <li>Ghi nhận điểm cần tinh chỉnh, hoàn thiện để đạt sự hài hòa.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Bàn giao sản phẩm sau kiểm tra chất lượng
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Kiểm tra lần cuối: đường may, phom dáng, sự chắc chắn.</li>
            <li>Bàn giao trong trạng thái hoàn thiện cao nhất.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="text-lg text-gray-900 font-bold">
            Chi phí dịch vụ sửa vest được xác định linh hoạt
          </div>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Mức độ phức tạp của yêu cầu chỉnh sửa.</li>
            <li>Tính chất của chất liệu cần xử lý.</li>
            <li>Thời gian hoàn thiện tiêu chuẩn hoặc gấp.</li>
            <li>Mức giá được thông báo rõ ràng trong buổi tư vấn.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlterationPage;

