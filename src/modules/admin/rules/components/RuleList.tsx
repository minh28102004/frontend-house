'use client';

import { useState } from 'react';
import type { Rule } from '../services/rule.service';

interface Props {
  rules: Rule[];
  loading: boolean;
  onEdit: (rule: Rule) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (fromIndex: number, toIndex: number) => void;
}

export default function RuleList({
  rules,
  loading,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border border-gray-100 bg-gray-50">
        <p className="text-gray-500">Chưa có trang nào.</p>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    onDragStart(e, index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    onDragOver(e, index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      onDrop(draggedIndex, toIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {rules.map((rule, index) => (
        <div
          key={rule._id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={() => setDraggedIndex(null)}
          className={`bg-white rounded-xl border-2 transition-all cursor-move ${
            draggedIndex === index
              ? 'border-slate-400 opacity-50 scale-[0.98]'
              : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
          }`}
        >
          <div className="p-4 flex items-center gap-4">
            {/* Drag Handle */}
            <div className="text-gray-300 hover:text-gray-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
              </svg>
            </div>

            {/* Order Number */}
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
              {index + 1}
            </div>

            {/* Rule Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">{rule.title}</h3>
                <a
                  href={`/rules/${rule.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 font-mono"
                >
                  /{rule.slug}
                </a>
                {!rule.isPublished && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                    Ẩn
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span>Thứ tự: {rule.sortOrder}</span>
                <span>Ngôn ngữ: {rule.language}</span>
                <span>
                  Cập nhật: {new Date(rule.updatedAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a
                href={`/rules/${rule.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50"
              >
                Xem
              </a>
              <button
                onClick={() => onEdit(rule)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Sửa
              </button>
              <button
                onClick={() => onDelete(rule._id)}
                className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
