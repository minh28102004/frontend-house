import { Metadata } from "next";
import React from "react";
import Index from "@/modules/admin/pages/index";

export const metadata: Metadata = {
  title: "Bảng điều khiển vận hành | Another House",
};
export default function page() {
  return (
    <div>
      <Index/>
    </div>
  );
}
