"use client";

import React from "react";
import { usePopups } from "@/context/PopupsContext";

const Popups = () => {
  const { isOpen, openPopup, closePopup } = usePopups();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  return (
    <>
      {/* Popup */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[rgba(60,60,60,0.15)] z-[1200] flex justify-center items-end md:items-center bottom-16 md:bottom-0"
          onClick={handleOverlayClick}
        >
          <div
            className={`
              bg-white rounded-t-[18px] md:rounded-[16px]
              w-full max-w-[500px] mx-2
              shadow-[0_8px_32px_0_rgba(33,40,80,0.19)]
              pt-6 md:pt-8
              px-3 sm:px-6 pb-4 md:pb-6
              mb-2 md:mb-0
              animate-[popupShow_0.18s_ease]
              relative
            `}
            style={
              // Slide up for mobile (bottom sheet style)
              { bottom: "0" }
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center border-b border-[#eee] pb-3 md:pb-4 pt-3 md:pt-6 px-1 md:px-6 mb-3 md:mb-4 justify-between">
              <div className="flex items-center gap-[10px]">
                <img
                  src="/img/logo.png"
                  alt="Another House"
                  className="w-8 h-8 object-contain"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                  <text x="1" y="15" fontSize="17" fontWeight="bold" fontStyle="italic" fontFamily="serif">Z</text>
                </svg>
                <span className="font-medium text-[#111] text-[15px]">
                  Liên hệ với Chuyên Viên Tư Vấn
                </span>
              </div>
              <button
                onClick={closePopup}
                className="bg-transparent border-0 p-0 cursor-pointer"
                aria-label="Đóng"
                type="button"
              >
                <svg width="24" height="24" stroke="#333" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-1 md:px-6 pb-2 md:pb-6">
              <div className="text-[15px] text-[#222] leading-[1.7] mb-3 md:mb-[14px]">
                Thông tin của bạn sẽ được tiếp nhận để hỗ trợ chọn phòng phù hợp và đồng hành trong suốt quá trình. Mọi dữ liệu đều được bảo mật và xử lý theo quy chuẩn riêng của Another House, đảm bảo an tâm khi trao đổi.
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                <a
                  href="https://zalo.me/0901113179"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#2f89ff] text-white border-0 rounded-[24px] font-medium text-[17px] py-[13px] flex items-center justify-center hover:bg-[#1e7ae6] transition-colors"
                >
                  Zalo
                </a>
                <a
                  href="tel:0901113179"
                  className="w-full bg-[#0caa13] text-white border-0 rounded-[24px] font-medium text-[17px] py-[13px] flex items-center justify-center hover:bg-[#0a8a10] transition-colors"
                >
                  Điện thoại
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button để mở popup */}
      {!isOpen && (
        <button
          type="button"
          onClick={openPopup}
          className="hidden md:flex fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-white text-[#111] shadow-[0_2px_8px_0_rgba(33,40,80,0.13)] border-[1.5px] border-[#222] rounded-full md:rounded-[32px_16px_0px_32px] py-2 px-2 md:pr-[15px] md:pl-2 items-center text-[14px] font-light cursor-pointer z-[1000] gap-1 md:gap-3"
        >
          <img
            src="/img/logo.png"
            alt="Another House"
            className="w-10 h-10 object-contain"
          />
          <span className="hidden md:inline">Liên hệ với chúng tôi</span>
        </button>
      )}

      {/* mobile-only: add basic popup animation */}
      <style jsx global>{`
        @media (max-width: 767px) {
          @keyframes popupShow {
            from {
              transform: translateY(60px);
              opacity: 0.9;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        }
      `}</style>
    </>
  );
};

export default Popups;