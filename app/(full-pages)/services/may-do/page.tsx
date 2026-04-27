import React from "react";
import ContactUs from "../ContactUs";

const TailorMadePage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 lg:px-10 py-12 mt-20 space-y-12 font-medium">
      <div className="space-y-3">
        <p className="text-sm tracking-wide text-gray-500 uppercase text-center">Dịch vụ</p>
        <div className="text-2xl md:text-3xl text-gray-900 font-bold text-center">
          Dịch vụ May đo - Nghệ thuật Kiến Tạo Phong Thái Cá Nhân
        </div>
        <p className="text-gray-800 leading-relaxed text-justify">
          Dịch vụ may đo được xây dựng dành cho những khách hàng mong muốn sở hữu một bộ
          trang phục phản ánh rõ cá tính và sự tinh tế của riêng mình. Mỗi thiết kế được
          chăm chút qua nhiều giai đoạn tỉ mỉ nhằm tạo nên một sản phẩm vừa vặn, thanh lịch
          và phù hợp cho nhiều dịp quan trọng. Quy trình may đo được hình thành từ kinh
          nghiệm thực tế cùng khả năng quan sát chi tiết của đội ngũ kỹ thuật, giúp mỗi
          khách hàng có được trải nghiệm trọn vẹn từ lúc tư vấn đến khi nhận sản phẩm hoàn
          chỉnh.
        </p>
      </div>
      <ContactUs/>
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="text-xl md:text-2xl text-gray-900 font-bold">
            Tư vấn định hình phong thái và mục đích sử dụng
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Buổi tư vấn là bước khởi đầu quan trọng trong quá trình may đo. Tại đây, khách
            và đội ngũ tư vấn cùng trao đổi để xác định hướng thiết kế phù hợp nhất với nhu
            cầu thực tế.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Phân tích bối cảnh và mục đích sử dụng để chọn phong thái phù hợp.</li>
            <li>Gợi ý các chi tiết phù hợp với vóc dáng và sở thích cá nhân.</li>
            <li>
              Định hình tổng thể bộ trang phục sao cho cân đối với hình thể và thói quen di
              chuyển.
            </li>
            <li>Bước này giúp khách hình dung rõ ràng về bộ trang phục sẽ được tạo dựng.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-xl md:text-2xl text-gray-900 font-bold">
            Đo thông số chuẩn và xây dựng cấu trúc phom dáng
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Quy trình đo được thực hiện cẩn thận theo tiêu chuẩn của nhà may nhằm đảm bảo
            tính chuẩn xác.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Ghi nhận các thông số quan trọng như vai, ngực, eo, tay và chiều dài.</li>
            <li>Quan sát tư thế đứng và tỉ lệ cơ thể để tạo nền tảng phom dáng phù hợp.</li>
            <li>Lưu trữ toàn bộ dữ liệu phục vụ giai đoạn thiết kế và may thử.</li>
            <li>Sự chính xác ở bước này quyết định phần lớn độ vừa vặn của trang phục.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-xl md:text-2xl text-gray-900 font-bold">
            Thiết kế phom dáng theo yêu cầu cá nhân
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Dựa trên số đo và phong thái đã thống nhất, kỹ thuật viên tiến hành xây dựng
            phom dáng phù hợp với từng khách.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Điều chỉnh tỉ lệ vai, ngực, eo và chiều dài sao cho hài hòa.</li>
            <li>Tư vấn các chi tiết như độ mở cổ, vị trí khuy và độ ôm của thân áo.</li>
            <li>Phối hợp các yếu tố để trang phục vừa thoải mái, vừa sang trọng.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-xl md:text-2xl text-gray-900 font-bold">
            May thử và đánh giá độ tương thích
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Sau khi hoàn thiện bản may đầu tiên, khách được hẹn thử để đánh giá độ phù hợp.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Quan sát sự vận động của trang phục khi đứng, ngồi và di chuyển.</li>
            <li>Xác định những vị trí cần chỉnh như vai, tay áo, eo và lưng.</li>
            <li>Ghi nhận phản hồi của khách để tinh chỉnh phom dáng tốt hơn.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-xl md:text-2xl text-gray-900 font-bold">
            Tinh chỉnh thủ công và hoàn thiện sản phẩm
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Dựa trên kết quả may thử, kỹ thuật viên thực hiện các điều chỉnh cần thiết để
            tối ưu phom dáng và sự thoải mái.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Tối ưu lại tỉ lệ và đường nét để đạt độ chỉn chu.</li>
            <li>Hoàn thiện chi tiết nhằm tạo sự thoải mái cho người mặc.</li>
            <li>Kiểm tra tổng thể trước khi bàn giao sản phẩm.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-xl md:text-2xl text-gray-900 font-bold">
            Chi phí may đo được xác định linh hoạt
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Giá dịch vụ may đo không cố định mà phụ thuộc vào từng nhu cầu cụ thể và được
            trao đổi rõ ràng trong buổi tư vấn.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800 leading-relaxed text-justify">
            <li>Độ phức tạp của phom dáng mong muốn.</li>
            <li>Số lượng chi tiết cần chỉnh sửa hoặc phát triển riêng.</li>
            <li>Thời gian hoàn thiện (tiêu chuẩn hoặc rút gọn).</li>
            <li>Giá may đo từ 2.800.000 VNĐ.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TailorMadePage;

