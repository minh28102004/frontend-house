"use client";

import React, { useMemo, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { AdminModal } from "@/modules/admin/common/components/AdminUi";
import { AdminFilterItem, AdminFilterBar, AdminPageHeader, AdminStatusBadge } from "@/modules/admin/common/components/AdminUi";
import { useUsers } from "../hooks/useUsers";
import { AdminUser } from "../services/admin-user.service";

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  banned: "Bị khóa",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Quản trị",
  manager: "Quản lý",
  staff: "Nhân sự",
  host: "Chủ nhà",
  user: "Khách hàng",
  technician: "Kỹ thuật",
};

const roleOptions = [
  { value: "", label: "Tất cả vai trò" },
  { value: "admin", label: "Quản trị" },
  { value: "manager", label: "Quản lý" },
  { value: "staff", label: "Nhân sự" },
  { value: "host", label: "Chủ nhà" },
  { value: "user", label: "Khách hàng" },
];

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "banned", label: "Bị khóa" },
];

const createRoleOptions = roleOptions.filter((item) => item.value);
const createStatusOptions = statusOptions.filter((item) => item.value);

type CreateFormValues = {
  email: string;
  password: string;
  fullName?: string;
  role: string;
  status: string;
};

type EditFormValues = {
  fullName?: string;
  phone?: string;
  role: string;
  status: string;
};

const LIMIT = 15;

const roleTagColor = (role: string) => {
  if (role === "admin") return "processing";
  if (role === "manager") return "purple";
  if (role === "staff" || role === "host") return "green";
  return "default";
};

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("vi-VN");
};

const getInitial = (name?: string, email?: string) => (name || email || "A").charAt(0).toUpperCase();

export default function UsersPage() {
  const { message, modal } = App.useApp();
  const { users, loading, error, stats, statsLoading, createUser, updateUser, deleteUser } = useUsers();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [createForm] = Form.useForm<CreateFormValues>();
  const [editForm] = Form.useForm<EditFormValues>();

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();
      const matchSearch =
        !keyword ||
        user.fullName?.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone?.includes(search);
      const matchRole = !filterRole || user.role === filterRole;
      const matchStatus = !filterStatus || user.status === filterStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, filterRole, filterStatus]);

  const paginated = useMemo(() => {
    const start = (page - 1) * LIMIT;
    return filtered.slice(start, start + LIMIT);
  }, [filtered, page]);

  const handleExportCSV = () => {
    const headers = ["STT", "Họ tên", "Email", "Điện thoại", "Vai trò", "Trạng thái", "Ngày tạo"];
    const rows = filtered.map((user, index) => [
      index + 1,
      user.fullName || "",
      user.email,
      user.phone || "",
      ROLE_LABELS[user.role] || user.role,
      STATUS_LABELS[user.status] || user.status,
      formatDate(user.createdAt),
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterRole("");
    setFilterStatus("");
    setPage(1);
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      fullName: user.fullName || "",
      phone: user.phone || "",
      role: user.role || "user",
      status: user.status || "active",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (user: AdminUser) => {
    modal.confirm({
      title: "Xóa tài khoản",
      content: `Bạn có chắc muốn xóa tài khoản "${user.fullName || user.email}"?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: async () => {
        const success = await deleteUser(user.id);
        if (success) message.success("Đã xóa tài khoản.");
        else message.error("Không thể xóa tài khoản.");
      },
    });
  };

  const handleCreate = async (values: CreateFormValues) => {
    setCreating(true);
    const success = await createUser(values);
    setCreating(false);

    if (success) {
      message.success("Đã tạo tài khoản mới.");
      setShowCreateModal(false);
      createForm.resetFields();
      return;
    }

    message.error("Không thể tạo tài khoản.");
  };

  const handleEdit = async (values: EditFormValues) => {
    if (!selectedUser) return;
    setUpdating(true);
    const success = await updateUser(selectedUser.id, values);
    setUpdating(false);

    if (success) {
      message.success("Đã cập nhật tài khoản.");
      setShowEditModal(false);
      setSelectedUser(null);
      return;
    }

    message.error("Không thể cập nhật tài khoản.");
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: "Tài khoản",
      key: "account",
      render: (_, user) => (
        <Space size={10}>
          <Avatar src={user.avatar} icon={!user.avatar ? <UserOutlined /> : undefined}>
            {user.avatar ? null : getInitial(user.fullName, user.email)}
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-[14px] font-medium">{user.fullName || "Chưa cập nhật tên"}</div>
            <Typography.Text type="secondary" className="!text-xs">
              ID: {user.id.slice(-6)}
            </Typography.Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, user) => (
        <div>
          <div className="text-[14px]">{user.email}</div>
          <Typography.Text type="secondary" className="!text-xs">
            {user.phone || "Chưa cập nhật"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      width: 150,
      align: "center",
      render: (role: string) => <Tag color={roleTagColor(role)}>{ROLE_LABELS[role] || role}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 160,
      align: "center",
      render: (status: string) => <AdminStatusBadge status={status} label={STATUS_LABELS[status] || status} />,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 130,
      align: "center",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 110,
      fixed: "right",
      align: "center",
      render: (_, user) => (
        <Space size={6}>
          <Tooltip title="Sửa">
            <Button
              type="text"
              shape="circle"
              aria-label="Sửa tài khoản"
              icon={<EditOutlined />}
              onClick={() => openEditModal(user)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              shape="circle"
              danger
              aria-label="Xóa tài khoản"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(user)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="ah-admin-page flex flex-col gap-5">
      <AdminPageHeader
        eyebrow="Người dùng"
        title="Tài khoản nhân sự"
        description="Quản lý vai trò, trạng thái hoạt động và thông tin tài khoản trong hệ thống."
        actions={
          <Space wrap>
            <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
              Xuất CSV
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                createForm.setFieldsValue({ role: "user", status: "active" });
                setShowCreateModal(true);
              }}
            >
              Tạo tài khoản
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card className="ah-admin-card ah-admin-card-hoverable">
            <Statistic title="Tổng tài khoản" value={statsLoading ? "..." : stats.total} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="ah-admin-card ah-admin-card-hoverable">
            <Statistic title="Hoạt động" value={statsLoading ? "..." : stats.active} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="ah-admin-card ah-admin-card-hoverable">
            <Statistic title="Bị khóa" value={statsLoading ? "..." : stats.banned} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card className="ah-admin-card">
            <Statistic title="Mới trong tháng" value={statsLoading ? "..." : stats.newThisMonth} />
          </Card>
        </Col>
      </Row>

      <AdminFilterBar className="ah-admin-card-static">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(280px,1fr)_200px_200px_auto] md:items-end">
          <AdminFilterItem label="Tìm kiếm">
            <Input.Search
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              value={search}
              enterButton="Tìm kiếm"
              className="w-full ah-admin-antd-search"
              onSearch={(value) => {
                setSearch(value);
                setPage(1);
              }}
              onChange={(event) => {
                setSearch(event.target.value);
                if (!event.target.value) setPage(1);
              }}
              allowClear
            />
          </AdminFilterItem>
          <AdminFilterItem label="Vai trò">
            <Select
              className="w-full ah-admin-antd-select"
              value={filterRole || ""}
              options={roleOptions}
              placeholder="Tất cả vai trò"
              onChange={(value) => {
                setFilterRole(value);
                setPage(1);
              }}
            />
          </AdminFilterItem>
          <AdminFilterItem label="Trạng thái">
            <Select
              className="w-full ah-admin-antd-select"
              value={filterStatus || ""}
              options={statusOptions}
              placeholder="Tất cả trạng thái"
              onChange={(value) => {
                setFilterStatus(value);
                setPage(1);
              }}
            />
          </AdminFilterItem>
          <div className="flex items-end gap-2">
            <Button onClick={resetFilters} className="ah-admin-btn">
              Xóa lọc
            </Button>
          </div>
        </div>
        <div className="mt-3 text-sm text-[rgba(0,0,0,0.45)]">
          {loading ? "Đang tải..." : `Hiển thị ${paginated.length} / ${filtered.length} tài khoản`}
        </div>
        {error ? (
          <Typography.Text type="danger" className="mt-1 !block">
            {error}
          </Typography.Text>
        ) : null}
      </AdminFilterBar>

      <Card className="ah-admin-card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={paginated}
          loading={loading}
          locale={{ emptyText: "Không có dữ liệu người dùng" }}
          pagination={{
            current: page,
            pageSize: LIMIT,
            total: filtered.length,
            showSizeChanger: false,
            onChange: setPage,
          }}
          scroll={{ x: 980 }}
        />
      </Card>

      <AdminModal
        title="Tạo tài khoản nhân sự"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onOk={() => createForm.submit()}
        okText="Tạo mới"
        cancelText="Hủy"
        destroyOnClose
        loading={creating}
      >
        <Form<CreateFormValues> layout="vertical" form={createForm} onFinish={handleCreate} initialValues={{ role: "user", status: "active" }}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
            <Input placeholder="email@anotherhouse.vn" />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }, { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" }]}>
            <Input.Password placeholder="Tối thiểu 6 ký tự" />
          </Form.Item>
          <Form.Item label="Họ và tên" name="fullName">
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: "Chọn vai trò" }]}>
                <Select options={createRoleOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Chọn trạng thái" }]}>
                <Select options={createStatusOptions} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </AdminModal>

      <AdminModal
        title="Cập nhật tài khoản"
        open={showEditModal && !!selectedUser}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onOk={() => editForm.submit()}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        destroyOnClose
        loading={updating}
      >
        <Form<EditFormValues> layout="vertical" form={editForm} onFinish={handleEdit} initialValues={{ status: "active" }}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
            <Input placeholder="email@anotherhouse.vn" />
          </Form.Item>
          <Form.Item label="Họ và tên" name="fullName">
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: "Chọn vai trò" }]}>
                <Select options={createRoleOptions} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Chọn trạng thái" }]}>
                <Select options={createStatusOptions} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </AdminModal>
    </div>
  );
};
