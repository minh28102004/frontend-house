"use client";

import React, { useEffect, useState } from "react";
import { MapsAdminService, type AdminMapItem } from "../services/maps.service";
import MapForm from "./MapForm";

export default function ListMaps() {
  const [items, setItems] = useState<AdminMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState<AdminMapItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await MapsAdminService.getAll(page, 10);
      setItems(res.data);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      setError(e.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCreate = async (data: Partial<AdminMapItem>) => {
    await MapsAdminService.create(data);
    setShowForm(false);
    await fetchData();
  };

  const handleUpdate = async (data: Partial<AdminMapItem>) => {
    if (!editing?._id) return;
    await MapsAdminService.update(editing._id, data);
    setEditing(null);
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa cửa hàng này?")) return;
    await MapsAdminService.remove(id);
    await fetchData();
  };

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="ah-admin-page flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý cửa hàng (Maps)</h1>
        <button className="px-4 py-2 bg-black text-white rounded" onClick={() => { setShowForm(true); setEditing(null); }}>Thêm cửa hàng</button>
      </div>

      {showForm && (
        <div className="border rounded p-4 bg-white">
          <h2 className="font-semibold mb-3">Thêm cửa hàng</h2>
          <MapForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {editing && (
        <div className="border rounded p-4 bg-white">
          <h2 className="font-semibold mb-3">Cập nhật cửa hàng</h2>
          <MapForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </div>
      )}

      <div className="overflow-x-auto border rounded bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Tên</th>
              <th className="p-3">Địa chỉ</th>
              <th className="p-3">Liên hệ</th>
              <th className="p-3">Tọa độ</th>
              <th className="p-3">Embed URL</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id} className="border-t">
                <td className="p-3 font-medium">{it.name}</td>
                <td className="p-3 max-w-[360px] truncate" title={it.address}>{it.address}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-0.5">
                    <div>{it.phone}</div>
                    <div className="text-gray-500">{it.email}</div>
                  </div>
                </td>
                <td className="p-3">{it.latitude}, {it.longitude}</td>
                <td className="p-3 max-w-[240px] truncate" title={it.embedUrl || ''}>{it.embedUrl ? 'Có' : '—'}</td>
                <td className="p-3">{it.isActive ? <span className="text-green-600">Active</span> : <span className="text-gray-500">Inactive</span>}</td>
                <td className="p-3 text-right space-x-2">
                  <button className="px-3 py-1 border rounded" onClick={() => setEditing(it)}>Sửa</button>
                  <button className="px-3 py-1 border rounded text-red-600" onClick={() => it._id && handleDelete(it._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button disabled={page <= 1} className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))}>Trước</button>
        <span className="text-sm">Trang {page}/{totalPages}</span>
        <button disabled={page >= totalPages} className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Sau</button>
      </div>
    </div>
  );
}


