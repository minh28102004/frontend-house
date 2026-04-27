import React from 'react'
import Map from '@/modules/client/map/Map'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VỊ TRÍ CỬA HÀNG VINCENS",
  description: "Địa chỉ cửa hàng cùng hướng dẫn di chuyển rõ ràng. Không gian fitting riêng tư, có tư vấn chọn dáng và chỉnh vest tinh tế. Ghé trải nghiệm để chọn bộ phù hợp với bạn.",
  keywords: "địa chỉ cửa hàng vest, vị trí cửa hàng, fitting vest, tư vấn vest, chỉnh vest",
};

const MapsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 mt-20">
      <Map height="700px" />
    </div>
  )
}

export default MapsPage