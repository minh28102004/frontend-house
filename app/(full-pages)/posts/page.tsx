
import PostClientPage from "@/modules/client/pages/Posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VINCENS – NƠI CHIA SẺ MẸO HAY VÀ KINH NGHIỆM CHĂM SÓC GIA ĐÌNH HIỆU QUẢ",
  description: "Vincens",
  keywords: "vest, vest nam, vest nữ, vest phụ kiện, vest phụ kiện giá rẻ, vest phụ kiện nữ, vest phụ kiện nam, vest phụ kiện",
};

export default function PostList() {
  return (
    <PostClientPage />
  );
}
