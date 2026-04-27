"use client";

import React, { useMemo, useState } from "react";
import { useTags } from "@/modules/admin/tags/hooks/useTags";
import { CreateTagDto } from "@/modules/admin/tags/models/tag.model";

const TagsAdminPage = () => {
  const { listQuery, createMutation, updateMutation, removeMutation } = useTags();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const items = useMemo(() => listQuery.data?.data || [], [listQuery.data]);

  const handleCreate = async () => {
    if (!name.trim()) return alert("Nhập tên thẻ");
    const dto: CreateTagDto = { name: name.trim(), slug: slug.trim() || undefined };
    await createMutation.mutateAsync(dto);
    setName("");
    setSlug("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý thẻ (Tags)</h1>

      <div className="bg-white p-4 rounded shadow mb-6 flex gap-2">
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Tên thẻ"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border px-3 py-2 rounded w-64"
          placeholder="Slug (tùy chọn)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Thêm thẻ
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Tên</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Sử dụng</th>
              <th className="p-3 w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.slug} className="border-b">
                <td className="p-3">
                  <input
                    defaultValue={t.name}
                    onBlur={(e) =>
                      e.target.value !== t.name &&
                      updateMutation.mutate({ slug: t.slug, dto: { name: e.target.value } })
                    }
                    className="border px-2 py-1 rounded w-full"
                  />
                </td>
                <td className="p-3">
                  <input
                    defaultValue={t.slug}
                    onBlur={(e) =>
                      e.target.value !== t.slug &&
                      updateMutation.mutate({ slug: t.slug, dto: { slug: e.target.value } })
                    }
                    className="border px-2 py-1 rounded w-full"
                  />
                </td>
                <td className="p-3">{t.usageCount ?? 0}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => removeMutation.mutate(t.slug)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={4}>
                  Chưa có thẻ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TagsAdminPage; 