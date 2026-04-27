import React from "react";

const ServicesPage = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 lg:px-10 py-12 mt-20 space-y-12 font-medium">
      <div className="space-y-2 text-center">
        <p className="text-sm tracking-wide text-gray-500 uppercase">
          Dịch vụ
        </p>
        <div className="text-2xl md:text-3xl text-gray-900 font-bold">
          Dịch vụ May đo - Nghệ thuật Kiến Tạo Phong Thái Cá Nhân
        </div>
        <p className="text-gray-800 leading-relaxed max-w-3xl mx-auto text-justify">
          Dịch vụ may đo được xây dựng dành cho những khách hàng mong muốn sở hữu một bộ
          trang phục phản ánh rõ cá tính và sự tinh tế của riêng mình. Mỗi thiết kế được
          chăm chút qua nhiều giai đoạn tỉ mỉ nhằm tạo nên một sản phẩm vừa vặn, thanh lịch
          và phù hợp cho nhiều dịp quan trọng. Quy trình may đo được hình thành từ kinh
          nghiệm thực tế cùng khả năng quan sát chi tiết của đội ngũ kỹ thuật, giúp mỗi
          khách hàng có được trải nghiệm trọn vẹn từ lúc tư vấn đến khi nhận sản phẩm hoàn
          chỉnh.
        </p>
      </div>

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
          </ul>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <div className="text-2xl md:text-3xl text-gray-900 font-bold">
            Dịch vụ Sửa Vest - Hoàn Thiện Từng Đường Nét Theo Yêu Cầu
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Dịch vụ sửa vest dành cho khách hàng muốn điều chỉnh trang phục để đạt sự vừa
            vặn và phong thái phù hợp. Mỗi thao tác chỉnh sửa được thực hiện bởi đội ngũ kỹ
            thuật có kinh nghiệm, bảo đảm sự tinh tế và giữ trọn vẻ sang trọng của bộ vest.
          </p>
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

      <div className="space-y-8">
        <div className="space-y-2">
          <div className="text-2xl md:text-3xl text-gray-900 font-bold">
            Bộ Quà Tặng - Món Quà Tinh Tế Dành Riêng Cho Người Bạn Trân Quý
          </div>
          <p className="text-gray-800 leading-relaxed text-justify">
            Bộ quà tặng của Vincens dành cho khách muốn gửi tặng người thân, bạn bè, đồng
            nghiệp hoặc giáo viên một món quà mang giá trị thực tế và sự trân trọng. Mỗi bộ
            trang phục được thiết kế theo nhu cầu riêng để mang dấu ấn cá nhân.
          </p>
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
              Giá trị bộ quà tặng được xác định dựa trên yêu cầu thiết kế, thời gian hoàn
              thiện và phạm vi hỗ trợ; mức giá được tư vấn rõ ràng để khách chủ động lựa
              chọn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;