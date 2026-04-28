"use client";

import { ReactNode } from "react";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import CartModal from "@/modules/client/cart/components/CartModal";
import CartModalMobile from "@/modules/client/cart/components/CartModalMobile";
import BottomNavMobile from "../components/BottomNavMobile";
import { usePathname } from "next/navigation";
import ChatbotAi from "../components/ChatbotAi";
import BackToTop from "../components/BackToTop";
import ButtonWave from "../components/ButtonWave";

interface LayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isProductDetailPage = pathname?.startsWith("/san-pham/");
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Menu />

      {/* Noi dung chinh */}
      <main className={`${isHomePage ? "" : "container mx-auto"} pb-16 md:pb-0`}>
        {children}
      </main>

      {/* Footer */}
      <Footer />
      <ChatbotAi />
      <BackToTop />
      <ButtonWave />
      {/* Cart Modal - PC */}
      <div className="hidden md:block">
        <CartModal />
      </div>
      {/* Cart Modal - Mobile */}
      <div className="md:hidden">
        <CartModalMobile />
      </div>
      {/* Bottom Navigation - Mobile - an tren trang chi tiet san pham */}
      {!isProductDetailPage && <BottomNavMobile />}
    </div>
  );
};

export default ClientLayout;
