import "antd/dist/reset.css";
import HostLayout from "@/modules/host/common/layout/HostLayout";
import { SidebarProvider } from "@/context/SidebarContext";
import AnotherHouseAntdProvider from "@/common/providers/AnotherHouseAntdProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AnotherHouseAntdProvider>
        <HostLayout>{children}</HostLayout>
      </AnotherHouseAntdProvider>
    </SidebarProvider>
  );
}
