"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/common/utils/toast";
import { useHosts } from "../hooks/useHosts";
import { HostUser } from "../services/host.service";
import styles from "./HostsPage.module.css";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-600",
  banned: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  banned: "Bị khóa",
};

const VERIFIED_COLORS: Record<string, string> = {
  true: "bg-green-100 text-green-700",
  false: "bg-gray-100 text-gray-500",
};

const VERIFIED_LABELS: Record<string, string> = {
  true: "Đã xác nhận",
  false: "Chưa xác nhận",
};

export default function HostsPage() {
  const router = useRouter();
  const {
    hosts,
    loading,
    error,
    stats,
    statsLoading,
    updateHost,
    banHost,
    unbanHost,
    approveHost,
    rejectHost,
    bulkUpdateStatus,
    flagHost,
    unflagHost,
    sendNotification,
  } = useHosts();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterVerified, setFilterVerified] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHost, setSelectedHost] = useState<HostUser | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // Ban modal
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banning, setBanning] = useState(false);

  // Verification modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyAction, setVerifyAction] = useState<"approve" | "reject">("approve");
  const [verifyNote, setVerifyNote] = useState("");
  const [verifying, setVerifying] = useState(false);

  // Notify modal
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifySendEmail, setNotifySendEmail] = useState(false);
  const [notifying, setNotifying] = useState(false);

  // Flag modal
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flagging, setFlagging] = useState(false);

  // Bulk selection
  const [selectedHosts, setSelectedHosts] = useState<Set<string>>(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const filtered = useMemo(() => {
    return hosts.filter((h) => {
      const matchSearch =
        !search ||
        h.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        h.email.toLowerCase().includes(search.toLowerCase()) ||
        h.phone?.includes(search);
      const matchStatus = !filterStatus || h.status === filterStatus;
      const matchVerified =
        !filterVerified ||
        String(h.hostTermsAccepted) === filterVerified;
      return matchSearch && matchStatus && matchVerified;
    });
  }, [hosts, search, filterStatus, filterVerified]);

  const paginated = useMemo(() => {
    const start = (page - 1) * LIMIT;
    return filtered.slice(start, start + LIMIT);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / LIMIT);

  // Handlers
  const openEditModal = (host: HostUser) => {
    setSelectedHost(host);
    setEditFullName(host.fullName || "");
    setEditPhone(host.phone || "");
    setEditStatus(host.status || "active");
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!selectedHost) return;
    setUpdating(true);
    const ok = await updateHost(selectedHost.id, {
      fullName: editFullName,
      phone: editPhone,
      status: editStatus,
    });
    setUpdating(false);
    if (ok) {
      toast.success("Cập nhật thành công");
      setShowEditModal(false);
      setSelectedHost(null);
    } else {
      toast.error("Lỗi khi cập nhật");
    }
  };

  const handleToggleStatus = async (host: HostUser) => {
    const newStatus = host.status === "active" ? "inactive" : "active";
    const ok = await updateHost(host.id, { status: newStatus });
    if (ok) {
      toast.success(`Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} tài khoản`);
    }
  };

  const openBanModal = (host: HostUser) => {
    setSelectedHost(host);
    setBanReason("");
    setShowBanModal(true);
  };

  const handleBan = async () => {
    if (!selectedHost || !banReason.trim()) {
      toast.error("Vui lòng nhập lý do khóa");
      return;
    }
    setBanning(true);
    const ok = await banHost(selectedHost.id, banReason);
    setBanning(false);
    if (ok) {
      toast.success("Đã khóa tài khoản");
      setShowBanModal(false);
      setSelectedHost(null);
    }
  };

  const handleUnban = async (host: HostUser) => {
    if (!confirm(`Mở khóa tài khoản của ${host.fullName || host.email}?`)) return;
    const ok = await unbanHost(host.id);
    if (ok) {
      toast.success("Đã mở khóa tài khoản");
    }
  };

  const openVerifyModal = (host: HostUser, action: "approve" | "reject") => {
    setSelectedHost(host);
    setVerifyAction(action);
    setVerifyNote("");
    setShowVerifyModal(true);
  };

  const handleVerify = async () => {
    if (!selectedHost) return;
    if (verifyAction === "reject" && !verifyNote.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    setVerifying(true);
    let ok = false;
    if (verifyAction === "approve") {
      ok = await approveHost(selectedHost.id, verifyNote);
    } else {
      ok = await rejectHost(selectedHost.id, verifyNote);
    }
    setVerifying(false);
    if (ok) {
      toast.success(verifyAction === "approve" ? "Đã phê duyệt" : "Đã từ chối");
      setShowVerifyModal(false);
      setSelectedHost(null);
    }
  };

  const openNotifyModal = (host: HostUser) => {
    setSelectedHost(host);
    setNotifyTitle("");
    setNotifyMessage("");
    setNotifySendEmail(false);
    setShowNotifyModal(true);
  };

  const handleNotify = async () => {
    if (!selectedHost || !notifyTitle.trim() || !notifyMessage.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setNotifying(true);
    const ok = await sendNotification(selectedHost.id, notifyTitle, notifyMessage, notifySendEmail);
    setNotifying(false);
    if (ok) {
      toast.success("Đã gửi thông báo");
      setShowNotifyModal(false);
      setSelectedHost(null);
    }
  };

  const openFlagModal = (host: HostUser) => {
    setSelectedHost(host);
    setFlagReason("");
    setShowFlagModal(true);
  };

  const handleFlag = async () => {
    if (!selectedHost || !flagReason.trim()) {
      toast.error("Vui lòng nhập lý do đánh dấu");
      return;
    }
    setFlagging(true);
    const ok = await flagHost(selectedHost.id, flagReason);
    setFlagging(false);
    if (ok) {
      toast.success("Đã đánh dấu chủ nhà");
      setShowFlagModal(false);
      setSelectedHost(null);
    }
  };

  const handleUnflag = async (host: HostUser) => {
    const ok = await unflagHost(host.id);
    if (ok) {
      toast.success("Đã bỏ đánh dấu");
    }
  };

  const handleSelectHost = (hostId: string) => {
    const newSelected = new Set(selectedHosts);
    if (newSelected.has(hostId)) {
      newSelected.delete(hostId);
    } else {
      newSelected.add(hostId);
    }
    setSelectedHosts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedHosts.size === paginated.length) {
      setSelectedHosts(new Set());
    } else {
      setSelectedHosts(new Set(paginated.map((h) => h.id)));
    }
  };

  const openBulkModal = (action: string) => {
    setBulkAction(action);
    setShowBulkModal(true);
  };

  const handleBulkAction = async () => {
    if (selectedHosts.size === 0) {
      toast.error("Vui lòng chọn ít nhất một chủ nhà");
      return;
    }
    setBulkProcessing(true);
    let ok = false;
    if (bulkAction === "activate") {
      ok = await bulkUpdateStatus(Array.from(selectedHosts), "active");
    } else if (bulkAction === "deactivate") {
      ok = await bulkUpdateStatus(Array.from(selectedHosts), "inactive");
    }
    setBulkProcessing(false);
    if (ok) {
      toast.success(`Đã cập nhật ${selectedHosts.size} chủ nhà`);
      setShowBulkModal(false);
      setSelectedHosts(new Set());
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "STT", "Họ tên", "Email", "Điện thoại", "Địa chỉ",
      "Xác nhận chủ nhà", "Trạng thái", "Ngày đăng ký",
    ];
    const rows = filtered.map((h, i) => [
      i + 1,
      h.fullName || "",
      h.email,
      h.phone || "",
      h.address || "",
      h.hostTermsAccepted ? "Đã xác nhận" : "Chưa xác nhận",
      STATUS_LABELS[h.status] || h.status,
      h.createdAt ? new Date(h.createdAt).toLocaleDateString("vi-VN") : "",
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `hosts_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterVerified("");
    setPage(1);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản lý chủ nhà</h1>
          <p className={styles.pageSubtitle}>
            Danh sách và quản lý tài khoản chủ nhà
          </p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleExportCSV} className={styles.btnExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Xuất CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statTotal}`}>
          <div className={styles.statIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{statsLoading ? "..." : stats.total}</p>
            <p className={styles.statLabel}>Tổng chủ nhà</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statActive}`}>
          <div className={styles.statIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{statsLoading ? "..." : stats.active}</p>
            <p className={styles.statLabel}>Hoạt động</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statInactive}`}>
          <div className={styles.statIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{statsLoading ? "..." : stats.inactive}</p>
            <p className={styles.statLabel}>Không hoạt động</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statBanned}`}>
          <div className={styles.statIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M4.93 4.93l14.14 14.14" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{statsLoading ? "..." : stats.banned}</p>
            <p className={styles.statLabel}>Bị khóa</p>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statNew}`}>
          <div className={styles.statIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
          </div>
          <div className={styles.statContent}>
            <p className={styles.statValue}>{statsLoading ? "..." : stats.newThisMonth}</p>
            <p className={styles.statLabel}>Đăng ký tháng này</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersRow}>
          <div className={styles.searchWrap}>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={styles.searchIcon}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={styles.searchInput}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className={styles.filterSelect}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Bị khóa</option>
          </select>

          <select
            value={filterVerified}
            onChange={(e) => { setFilterVerified(e.target.value); setPage(1); }}
            className={styles.filterSelect}
          >
            <option value="">Tất cả xác nhận</option>
            <option value="true">Đã xác nhận</option>
            <option value="false">Chưa xác nhận</option>
          </select>

          {(search || filterStatus || filterVerified) && (
            <button onClick={resetFilters} className={styles.btnClear}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Xóa lọc
            </button>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedHosts.size > 0 && (
          <div className={styles.bulkActionsBar}>
            <span className={styles.bulkCount}>{selectedHosts.size} đã chọn</span>
            <button onClick={() => openBulkModal("activate")} className={styles.bulkBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Kích hoạt
            </button>
            <button onClick={() => openBulkModal("deactivate")} className={styles.bulkBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" />
              </svg>
              Vô hiệu hóa
            </button>
            <button onClick={() => setSelectedHosts(new Set())} className={styles.bulkBtnCancel}>
              Hủy chọn
            </button>
          </div>
        )}

        <p className={styles.resultCount}>
          {loading
            ? "Đang tải..."
            : `Hiển thị ${paginated.length} / ${filtered.length} chủ nhà`}
        </p>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Đang tải danh sách chủ nhà...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <p>Không tìm thấy chủ nhà nào</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>
                    <input
                      type="checkbox"
                      checked={selectedHosts.size === paginated.length && paginated.length > 0}
                      onChange={handleSelectAll}
                      className={styles.checkbox}
                    />
                  </th>
                  <th className={styles.th}>Chủ nhà</th>
                  <th className={styles.th}>Liên hệ</th>
                  <th className={styles.th}>Xác nhận</th>
                  <th className={styles.th}>Trạng thái</th>
                  <th className={styles.th}>Ngày đăng ký</th>
                  <th className={styles.th}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((host) => (
                  <tr key={host.id} className={styles.tableRow}>
                    <td className={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedHosts.has(host.id)}
                        onChange={() => handleSelectHost(host.id)}
                        className={styles.checkbox}
                      />
                    </td>
                    <td className={styles.td}>
                      <div
                        className={styles.userCell}
                        onClick={() => router.push(`/admin/hosts/${host.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className={styles.avatar}>
                          {host.avatar ? (
                            <Image src={host.avatar} alt={host.fullName || host.email} fill className={styles.avatarImg} sizes="40px" />
                          ) : (
                            <span className={styles.avatarInitials}>
                              {(host.fullName || host.email).charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className={styles.userInfo}>
                          <p className={styles.userName}>
                            {host.fullName || "—"}
                            {host.isFlagged && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className={styles.flagIcon}>
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                <line x1="4" y1="22" x2="4" y2="15" />
                              </svg>
                            )}
                          </p>
                          <p className={styles.userId}>ID: {host.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <p className={styles.cellPrimary}>{host.email}</p>
                      <p className={styles.cellSecondary}>{host.phone || "—"}</p>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${VERIFIED_COLORS[String(host.hostTermsAccepted)]}`}>
                        {VERIFIED_LABELS[String(host.hostTermsAccepted)]}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${STATUS_COLORS[host.status] || "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[host.status] || host.status}
                      </span>
                    </td>
                    <td className={`${styles.td} ${styles.dateCell}`}>
                      {host.createdAt ? new Date(host.createdAt).toLocaleDateString("vi-VN") : "—"}
                    </td>
                    <td className={styles.td}>
                      <div className={styles.actionBtns}>
                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(host)}
                          className={styles.btnAction}
                          title="Sửa"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(host)}
                          className={styles.btnAction}
                          title={host.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          {host.status === "active" ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>

                        {/* More actions dropdown */}
                        <div className={styles.dropdown}>
                          <button className={styles.btnAction} title="Khác">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </button>
                          <div className={styles.dropdownContent}>
                            {/* Verify actions */}
                            {host.hostVerificationStatus !== 'approved' && (
                              <button onClick={() => openVerifyModal(host, "approve")}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M9 12l2 2 4-4" />
                                  <circle cx="12" cy="12" r="10" />
                                </svg>
                                Phê duyệt
                              </button>
                            )}
                            {host.hostVerificationStatus === 'pending' && (
                              <button onClick={() => openVerifyModal(host, "reject")}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M15 9l-6 6M9 9l6 6" />
                                </svg>
                                Từ chối
                              </button>
                            )}
                            <div className={styles.dropdownDivider} />
                            {/* Ban/Unban */}
                            {host.status !== 'banned' ? (
                              <button onClick={() => openBanModal(host)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M4.93 4.93l14.14 14.14" />
                                </svg>
                                Khóa tài khoản
                              </button>
                            ) : (
                              <button onClick={() => handleUnban(host)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Mở khóa
                              </button>
                            )}
                            {/* Flag/Unflag */}
                            <div className={styles.dropdownDivider} />
                            {!host.isFlagged ? (
                              <button onClick={() => openFlagModal(host)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                  <line x1="4" y1="22" x2="4" y2="15" />
                                </svg>
                                Đánh dấu
                              </button>
                            ) : (
                              <button onClick={() => handleUnflag(host)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                  <line x1="4" y1="22" x2="4" y2="15" />
                                </svg>
                                Bỏ đánh dấu
                              </button>
                            )}
                            {/* Notify */}
                            <button onClick={() => openNotifyModal(host)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 01-3.46 0" />
                              </svg>
                              Gửi thông báo
                            </button>
                            {/* View Details */}
                            <button onClick={() => router.push(`/admin/hosts/${host.id}`)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className={styles.pagination}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={styles.pageBtn}>&lt;</button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 7) {
                if (page > 4) p = page - 3 + i;
                if (page > totalPages - 3) p = totalPages - 6 + i;
              }
              return (
                <button key={p} onClick={() => setPage(p)} className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ""}`}>{p}</button>
              );
            })}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={styles.pageBtn}>&gt;</button>
          </div>
        )}
      </div>

      {/* ====== EDIT MODAL ====== */}
      {showEditModal && selectedHost && (
        <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Chỉnh sửa chủ nhà</h3>
              <button onClick={() => setShowEditModal(false)} className={styles.modalClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.userProfileRow}>
                <div className={styles.profileAvatar}>
                  {selectedHost.avatar ? (
                    <Image src={selectedHost.avatar} alt={selectedHost.fullName || ""} fill className={styles.avatarImg} sizes="64px" />
                  ) : (
                    <span className={styles.avatarInitialsLarge}>
                      {(selectedHost.fullName || selectedHost.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className={styles.profileName}>{selectedHost.fullName || "—"}</p>
                  <p className={styles.profileEmail}>{selectedHost.email}</p>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Họ và tên</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className={styles.formInput}
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Số điện thoại</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className={styles.formInput}
                  placeholder="VD: 0901234567"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Trạng thái</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="banned">Bị khóa</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button onClick={() => setShowEditModal(false)} className={styles.btnCancel}>Hủy</button>
                <button onClick={handleEditSave} disabled={updating} className={styles.btnSubmit}>
                  {updating ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== BAN MODAL ====== */}
      {showBanModal && selectedHost && (
        <div className={styles.modalOverlay} onClick={() => setShowBanModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Khóa tài khoản</h3>
              <button onClick={() => setShowBanModal(false)} className={styles.modalClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.warningBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p>Khóa tài khoản của <strong>{selectedHost.fullName || selectedHost.email}</strong>?</p>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Lý do khóa <span className={styles.required}>*</span></label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className={styles.formTextarea}
                  placeholder="Nhập lý do khóa tài khoản..."
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button onClick={() => setShowBanModal(false)} className={styles.btnCancel}>Hủy</button>
                <button onClick={handleBan} disabled={banning} className={styles.btnDanger}>
                  {banning ? "Đang xử lý..." : "Khóa tài khoản"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== VERIFY MODAL ====== */}
      {showVerifyModal && selectedHost && (
        <div className={styles.modalOverlay} onClick={() => setShowVerifyModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {verifyAction === "approve" ? "Phê duyệt" : "Từ chối"} đơn đăng ký
              </h3>
              <button onClick={() => setShowVerifyModal(false)} className={styles.modalClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.userProfileRow}>
                <div className={styles.profileAvatar}>
                  {selectedHost.avatar ? (
                    <Image src={selectedHost.avatar} alt={selectedHost.fullName || ""} fill className={styles.avatarImg} sizes="64px" />
                  ) : (
                    <span className={styles.avatarInitialsLarge}>
                      {(selectedHost.fullName || selectedHost.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className={styles.profileName}>{selectedHost.fullName || "—"}</p>
                  <p className={styles.profileEmail}>{selectedHost.email}</p>
                </div>
              </div>

              {verifyAction === "approve" ? (
                <div className={styles.infoBox}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Phê duyệt đơn đăng ký chủ nhà của người dùng này?</p>
                </div>
              ) : (
                <div className={styles.warningBox}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" />
                  </svg>
                  <p>Từ chối đơn đăng ký chủ nhà?</p>
                </div>
              )}

              <div className={styles.formField}>
                <label className={styles.formLabel}>
                  Ghi chú {verifyAction === "reject" && <span className={styles.required}>*</span>}
                </label>
                <textarea
                  value={verifyNote}
                  onChange={(e) => setVerifyNote(e.target.value)}
                  className={styles.formTextarea}
                  placeholder={verifyAction === "approve" ? "Ghi chú (không bắt buộc)" : "Nhập lý do từ chối..."}
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button onClick={() => setShowVerifyModal(false)} className={styles.btnCancel}>Hủy</button>
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className={verifyAction === "approve" ? styles.btnSuccess : styles.btnDanger}
                >
                  {verifying ? "Đang xử lý..." : (verifyAction === "approve" ? "Phê duyệt" : "Từ chối")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== NOTIFY MODAL ====== */}
      {showNotifyModal && selectedHost && (
        <div className={styles.modalOverlay} onClick={() => setShowNotifyModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Gửi thông báo</h3>
              <button onClick={() => setShowNotifyModal(false)} className={styles.modalClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.userProfileRow}>
                <div className={styles.profileAvatar}>
                  {selectedHost.avatar ? (
                    <Image src={selectedHost.avatar} alt={selectedHost.fullName || ""} fill className={styles.avatarImg} sizes="64px" />
                  ) : (
                    <span className={styles.avatarInitialsLarge}>
                      {(selectedHost.fullName || selectedHost.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className={styles.profileName}>{selectedHost.fullName || "—"}</p>
                  <p className={styles.profileEmail}>{selectedHost.email}</p>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Tiêu đề <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={notifyTitle}
                  onChange={(e) => setNotifyTitle(e.target.value)}
                  className={styles.formInput}
                  placeholder="VD: Thông báo quan trọng"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Nội dung <span className={styles.required}>*</span></label>
                <textarea
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  className={styles.formTextarea}
                  placeholder="Nhập nội dung thông báo..."
                  rows={4}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={notifySendEmail}
                    onChange={(e) => setNotifySendEmail(e.target.checked)}
                  />
                  Gửi kèm email
                </label>
              </div>

              <div className={styles.modalActions}>
                <button onClick={() => setShowNotifyModal(false)} className={styles.btnCancel}>Hủy</button>
                <button onClick={handleNotify} disabled={notifying} className={styles.btnSubmit}>
                  {notifying ? "Đang gửi..." : "Gửi thông báo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== FLAG MODAL ====== */}
      {showFlagModal && selectedHost && (
        <div className={styles.modalOverlay} onClick={() => setShowFlagModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Đánh dấu chủ nhà</h3>
              <button onClick={() => setShowFlagModal(false)} className={styles.modalClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.userProfileRow}>
                <div className={styles.profileAvatar}>
                  {selectedHost.avatar ? (
                    <Image src={selectedHost.avatar} alt={selectedHost.fullName || ""} fill className={styles.avatarImg} sizes="64px" />
                  ) : (
                    <span className={styles.avatarInitialsLarge}>
                      {(selectedHost.fullName || selectedHost.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className={styles.profileName}>{selectedHost.fullName || "—"}</p>
                  <p className={styles.profileEmail}>{selectedHost.email}</p>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Lý do đánh dấu <span className={styles.required}>*</span></label>
                <textarea
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  className={styles.formTextarea}
                  placeholder="Nhập lý do đánh dấu chủ nhà này..."
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button onClick={() => setShowFlagModal(false)} className={styles.btnCancel}>Hủy</button>
                <button onClick={handleFlag} disabled={flagging} className={styles.btnWarning}>
                  {flagging ? "Đang xử lý..." : "Đánh dấu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== BULK MODAL ====== */}
      {showBulkModal && (
        <div className={styles.modalOverlay} onClick={() => setShowBulkModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {bulkAction === "activate" ? "Kích hoạt" : "Vô hiệu hóa"} {selectedHosts.size} chủ nhà
              </h3>
              <button onClick={() => setShowBulkModal(false)} className={styles.modalClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.confirmText}>
                Bạn có chắc muốn {bulkAction === "activate" ? "kích hoạt" : "vô hiệu hóa"} {selectedHosts.size} chủ nhà đã chọn?
              </p>

              <div className={styles.modalActions}>
                <button onClick={() => setShowBulkModal(false)} className={styles.btnCancel}>Hủy</button>
                <button onClick={handleBulkAction} disabled={bulkProcessing} className={styles.btnSubmit}>
                  {bulkProcessing ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
