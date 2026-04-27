import "antd/dist/reset.css";
import { SidebarProvider } from "@/context/SidebarContext";
import AnotherHouseAntdProvider from "@/common/providers/AnotherHouseAntdProvider";
import AdminLayout from "@/modules/admin/common/layout/AdminLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AnotherHouseAntdProvider>
        <AdminLayout>
          {children}
        </AdminLayout>
      </AnotherHouseAntdProvider>
    </SidebarProvider>
  );
}
