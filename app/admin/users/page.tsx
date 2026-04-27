import UsersPage from "@/modules/admin/users/pages/UsersPage";

export const metadata = {
  title: "Quản lý người dùng | Admin",
  description: "Quản lý danh sách người dùng",
};

export default function AdminUsersRoute() {
  return <UsersPage />;
}
