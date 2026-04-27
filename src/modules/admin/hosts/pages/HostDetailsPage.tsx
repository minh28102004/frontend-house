"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/common/utils/toast";
import { useHostDetails } from "../hooks/useHosts";
import styles from "./HostsPage.module.css";

const VERIFICATION_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const VERIFICATION_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const NOTE_TYPE_COLORS: Record<string, string> = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-yellow-100 text-yellow-700",
  important: "bg-red-100 text-red-700",
};

export default function HostDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hostId = params?.id as string;

  const {
    host,
    details,
    notes,
    loading,
    error,
    createNote,
    deleteNote,
  } = useHostDetails(hostId);

  const [activeTab, setActiveTab] = useState<"info" | "rooms" | "notes" | "history">("info");
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<"info" | "warning" | "important">("info");
  const [notePinned, setNotePinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateNote = async () => {
    if (!noteContent.trim()) {
      toast.error("Vui lòng nhập nội dung ghi chú");
      return;
    }
    setSubmitting(true);
    const ok = await createNote(noteContent, noteType, notePinned);
    setSubmitting(false);
    if (ok) {
      toast.success("Đã thêm ghi chú");
      setNoteContent("");
      setNoteType("info");
      setNotePinned(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Bạn có chắc muốn xóa ghi chú này?")) return;
    const ok = await deleteNote(noteId);
    if (ok) {
      toast.success("Đã xóa ghi chú");
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Đang tải thông tin chủ nhà...</p>
        </div>
      </div>
    );
  }

  if (error || !host) {
    return (
      <div className={styles.page}>
        <div className={styles.errorState}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
          <p>{error || "Không tìm thấy chủ nhà"}</p>
          <button onClick={() => router.back()} className={styles.btnCancel}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <div>
            <h1 className={styles.pageTitle}>{host.fullName || "Chủ nhà"}</h1>
            <p className={styles.pageSubtitle}>ID: {host.id}</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <span className={`${styles.badge} ${VERIFICATION_STATUS_COLORS[host.hostVerificationStatus || 'pending']}`}>
            {VERIFICATION_STATUS_LABELS[host.hostVerificationStatus || 'pending']}
          </span>
          <span className={`${styles.badge} ${styles[`status${host.status?.charAt(0).toUpperCase()}${host.status?.slice(1)}`] || "bg-gray-100 text-gray-600"}`}>
            {host.status === 'active' ? 'Hoạt động' : host.status === 'inactive' ? 'Không hoạt động' : 'Bị khóa'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("info")}
          className={`${styles.tab} ${activeTab === "info" ? styles.tabActive : ""}`}
        >
          Thông tin
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`${styles.tab} ${activeTab === "rooms" ? styles.tabActive : ""}`}
        >
          Phòng ({details?.roomCount || 0})
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`${styles.tab} ${activeTab === "notes" ? styles.tabActive : ""}`}
        >
          Ghi chú ({notes.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`${styles.tab} ${activeTab === "history" ? styles.tabActive : ""}`}
        >
          Lịch sử
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "info" && (
          <div className={styles.infoGrid}>
            {/* Profile Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Hồ sơ</h3>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  {host.avatar ? (
                    <Image src={host.avatar} alt={host.fullName || ""} fill className={styles.avatarImg} sizes="80px" />
                  ) : (
                    <span className={styles.avatarInitialsLarge}>
                      {(host.fullName || host.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className={styles.profileName}>{host.fullName || "—"}</p>
                  <p className={styles.profileEmail}>{host.email}</p>
                  {host.isFlagged && (
                    <span className={styles.flagBadge}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" y1="22" x2="4" y2="15" />
                      </svg>
                      Đã đánh dấu
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Liên hệ</h3>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{host.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Điện thoại</span>
                  <span className={styles.infoValue}>{host.phone || "—"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Địa chỉ</span>
                  <span className={styles.infoValue}>{host.address || "—"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ngày sinh</span>
                  <span className={styles.infoValue}>{host.birthday || "—"}</span>
                </div>
              </div>
            </div>

            {/* Verification Card */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Xác minh</h3>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Trạng thái xác minh</span>
                  <span className={`${styles.badge} ${VERIFICATION_STATUS_COLORS[host.hostVerificationStatus || 'pending']}`}>
                    {VERIFICATION_STATUS_LABELS[host.hostVerificationStatus || 'pending']}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Điều khoản chủ nhà</span>
                  <span className={styles.infoValue}>{host.hostTermsAccepted ? "Đã chấp nhận" : "Chưa chấp nhận"}</span>
                </div>
                {host.hostVerificationNote && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Ghi chú xác minh</span>
                    <span className={styles.infoValue}>{host.hostVerificationNote}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ban Info Card */}
            {host.isBanned && (
              <div className={`${styles.card} ${styles.banCard}`}>
                <h3 className={styles.cardTitle}>Thông tin khóa tài khoản</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Lý do</span>
                    <span className={styles.infoValue}>{host.banReason || "—"}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Ngày khóa</span>
                    <span className={styles.infoValue}>
                      {host.bannedAt ? new Date(host.bannedAt).toLocaleString("vi-VN") : "—"}
                    </span>
                  </div>
                  {host.flagReason && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Lý do đánh dấu</span>
                      <span className={styles.infoValue}>{host.flagReason}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "rooms" && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Danh sách phòng</h3>
            <p className={styles.roomSummary}>
              Tổng: <strong>{details?.roomCount ?? 0}</strong>
              {" · "}
              Đang hiển thị: <strong>{details?.activeRoomCount ?? 0}</strong>
            </p>
            {!details?.rooms?.length ? (
              <p className={styles.emptyText}>
                Chưa có phòng nào gắn với chủ nhà này (theo <code>ownerId</code>).
                <br />
                Nếu host đã tạo phòng nhưng vẫn 0, có thể phòng cũ chưa được gán chủ sở hữu — cần cập nhật <code>ownerId</code> trong DB.
              </p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Phòng</th>
                      <th className={styles.th}>Số / Concept</th>
                      <th className={styles.th}>Giá</th>
                      <th className={styles.th}>Hiển thị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.rooms.map((room) => {
                      const rid = room.id ?? (room as { _id?: string })._id ?? "";
                      return (
                        <tr key={rid || room.concept} className={styles.tableRow}>
                          <td className={styles.td}>
                            <div className={styles.roomNameCell}>
                              {room.thumbnail ? (
                                <div className={styles.roomThumb}>
                                  <Image
                                    src={room.thumbnail}
                                    alt={room.name}
                                    fill
                                    className={styles.avatarImg}
                                    sizes="48px"
                                  />
                                </div>
                              ) : (
                                <div className={styles.roomThumbPlaceholder}>
                                  {(room.name || "?").charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className={styles.cellPrimary}>{room.name}</p>
                                {room.features?.length ? (
                                  <p className={styles.cellSecondary}>
                                    {room.features.slice(0, 3).join(" · ")}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className={styles.td}>
                            <p className={styles.cellPrimary}>{room.num}</p>
                            <p className={styles.cellSecondary}>{room.concept}</p>
                          </td>
                          <td className={`${styles.td} ${styles.dateCell}`}>
                            {typeof room.price === "number"
                              ? `${room.price.toLocaleString("vi-VN")}đ`
                              : "—"}
                          </td>
                          <td className={styles.td}>
                            <span
                              className={`${styles.badge} ${
                                room.isVisible
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {room.isVisible ? "Hiển thị" : "Ẩn"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className={styles.notesTab}>
            {/* Add Note Form */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Thêm ghi chú mới</h3>
              <div className={styles.noteForm}>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Nhập nội dung ghi chú..."
                  className={styles.noteTextarea}
                  rows={3}
                />
                <div className={styles.noteFormRow}>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as "info" | "warning" | "important")}
                    className={styles.noteSelect}
                  >
                    <option value="info">Thông tin</option>
                    <option value="warning">Cảnh báo</option>
                    <option value="important">Quan trọng</option>
                  </select>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={notePinned}
                      onChange={(e) => setNotePinned(e.target.checked)}
                    />
                    Ghim lên đầu
                  </label>
                  <button
                    onClick={handleCreateNote}
                    disabled={submitting}
                    className={styles.btnSubmit}
                  >
                    {submitting ? "Đang lưu..." : "Thêm ghi chú"}
                  </button>
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className={styles.notesList}>
              {notes.length === 0 ? (
                <div className={styles.card}>
                  <p className={styles.emptyText}>Chưa có ghi chú nào</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className={`${styles.card} ${styles.noteCard}`}>
                    <div className={styles.noteHeader}>
                      <span className={`${styles.badge} ${NOTE_TYPE_COLORS[note.type]}`}>
                        {note.type === "info" ? "Thông tin" : note.type === "warning" ? "Cảnh báo" : "Quan trọng"}
                      </span>
                      {note.isPinned && (
                        <span className={styles.pinnedBadge}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" />
                          </svg>
                          Đã ghim
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className={styles.deleteNoteBtn}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                    <p className={styles.noteContent}>{note.content}</p>
                    <div className={styles.noteFooter}>
                      <span>{note.createdByName || "Admin"}</span>
                      <span>{new Date(note.createdAt).toLocaleString("vi-VN")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Lịch sử hoạt động</h3>
            {host.banHistory && host.banHistory.length > 0 ? (
              <div className={styles.historyList}>
                {host.banHistory.map((record, index) => (
                  <div key={index} className={styles.historyItem}>
                    <div className={styles.historyIcon}>
                      {record.unbannedAt ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.iconSuccess}>
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.iconDanger}>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M4.93 4.93l14.14 14.14" />
                        </svg>
                      )}
                    </div>
                    <div className={styles.historyContent}>
                      <p className={styles.historyTitle}>
                        {record.unbannedAt ? "Đã mở khóa" : "Đã khóa tài khoản"}
                      </p>
                      <p className={styles.historyText}>Lý do: {record.reason}</p>
                      <p className={styles.historyDate}>
                        {new Date(record.bannedAt).toLocaleString("vi-VN")}
                      </p>
                      {record.unbannedAt && (
                        <p className={styles.historyText}>
                          Mở khóa: {new Date(record.unbannedAt).toLocaleString("vi-VN")}
                          {record.unbannedReason && ` - ${record.unbannedReason}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>Không có lịch sử hoạt động</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
