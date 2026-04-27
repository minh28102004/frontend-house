"use client";

import React from "react";
import { FiPhone, FiMail } from "react-icons/fi";

const ContactUs = () => {
  return (
    <div className="pt-0 pb-0">
      <div className="container mx-auto px-2 md:px-8 lg:px-14 py-0 pt-8">
        {/* Header */}
        <div className="text-left mb-2 mt-8">
          <h1 className="text-lg md:text-xl font-semibold text-black mb-1 tracking-tight uppercase" style={{ fontWeight: 500, letterSpacing: 0 }}>
            LIÊN HỆ VỚI CHÚNG TÔI
          </h1>
          <p className="text-xs md:text-base text-black max-w-3xl" style={{ marginBottom: 20, fontWeight: 400 }}>
            Quý khách có thể tìm hiểu thêm thông tin trong mục Câu hỏi thường gặp hoặc liên hệ với Trung tâm Tư vấn Khách hàng của chúng tôi qua các kênh dưới đây
          </p>
        </div>

        {/* Contact Methods - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-lg overflow-hidden bg-white" style={{ boxShadow: "0 1px 6px 0 #e7e7e7", marginBottom: "2.5rem" }}>
          {/* Column 1: LIÊN HỆ HOTLINE */}
          <div className="flex flex-col justify-between border-r border-gray-200 px-5 py-7 min-h-[220px]">
            <div>
              <div className="text-sm font-semibold text-black mb-[10px]" style={{ letterSpacing: 0 }}>LIÊN HỆ HOTLINE</div>
              <div className="text-xs text-gray-800 mb-2">Chúng tôi sẽ đóng cửa sớm vào các ngày lễ.</div>
              {/* <div className="text-xs text-gray-800 mb-2">Sắp đến ngày 12/12 sẽ đóng cửa sớm:</div>
              <div className="text-xs text-gray-800 mb-3">10 giờ sáng – 5 giờ tối</div> */}
            </div>
            <a
              href="tel:+84901113179"
              className="flex items-center justify-center gap-2 w-full h-[38px] px-4 border border-gray-400 rounded-full bg-white text-black text-base font-medium hover:bg-gray-100 transition-all"
              style={{
                fontSize: "15px",
                fontWeight: 500,
                marginTop: "auto",
              }}
            >
              <FiPhone className="text-lg" />
              +84 901 113 179
            </a>
          </div>

          {/* Column 2: GỬI EMAIL */}
          <div className="flex flex-col justify-between border-r border-gray-200 px-5 py-7 min-h-[220px]">
            <div>
              <div className="text-sm font-semibold text-black mb-[10px]" style={{ letterSpacing: 0 }}>GỬI EMAIL</div>
              <div className="text-xs text-gray-800 mb-3">
                Các chuyên viên tư vấn rất sẵn lòng giải đáp thắc mắc của quý khách.
              </div>
            </div>
            <a
              href="mailto:cskh.vincens@gmail.com"
              className="flex items-center justify-center gap-2 w-full h-[38px] px-4 border border-gray-400 rounded-full bg-white text-black text-base font-medium hover:bg-gray-100 transition-all"
              style={{
                fontSize: "15px",
                fontWeight: 500,
                marginTop: "auto",
              }}
            >
              <FiMail className="text-lg" />
              Gửi email
            </a>
          </div>

          {/* Column 3: GỬI TIN NHẮN */}
          <div className="flex flex-col justify-between px-5 py-7 min-h-[220px]">
            <div>
              <div className="text-sm font-semibold text-black mb-[10px]" style={{ letterSpacing: 0 }}>GỬI TIN NHẮN</div>
              <div className="text-xs text-gray-800 mb-3">
                Các chuyên viên tư vấn hân hạnh được hỗ trợ quý khách.
              </div>
            </div>
            <div className="flex flex-col w-full gap-2 mt-auto">
              {/* Zalo */}
              <a
                href="https://zalo.me/0901113179"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-[34px] border border-gray-400 rounded-full w-full text-black bg-white font-medium text-sm hover:bg-gray-100 transition-all"
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                <span>Zalo</span>
              </a>


              <a
                href="https://www.facebook.com/Vestcuoistore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-[34px] border border-gray-400 rounded-full w-full text-black bg-white font-medium text-sm hover:bg-gray-100 transition-all"
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
