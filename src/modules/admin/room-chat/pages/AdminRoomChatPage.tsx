'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RoomChatAdminService,
  RoomChatMessageDTO,
  RoomChatThreadDTO,
} from '../services/room-chat-admin.service';

export default function AdminRoomChatPage() {
  const [threads, setThreads] = useState<RoomChatThreadDTO[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<RoomChatMessageDTO[]>([]);
  const [threadDetail, setThreadDetail] = useState<RoomChatThreadDTO | null>(null);
  const [input, setInput] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const loadThreads = useCallback(async () => {
    if (!token) return;
    try {
      const data = await RoomChatAdminService.listThreads(token);
      setThreads(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi tải danh sách');
    } finally {
      setLoadingList(false);
    }
  }, [token]);

  const loadMessages = useCallback(
    async (threadId: string) => {
      if (!token) return;
      setLoadingMsg(true);
      setError(null);
      try {
        const data = await RoomChatAdminService.getThreadMessages(token, threadId);
        setThreadDetail(data.thread);
        setMessages(data.messages);
        await RoomChatAdminService.markRead(token, threadId);
        await loadThreads();
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Lỗi tải tin nhắn');
      } finally {
        setLoadingMsg(false);
      }
    },
    [token, loadThreads],
  );

  useEffect(() => {
    void loadThreads();
    const id = setInterval(() => void loadThreads(), 8000);
    return () => clearInterval(id);
  }, [loadThreads]);

  useEffect(() => {
    if (!selectedId || !token) return;
    void loadMessages(selectedId);
    const id = setInterval(() => void loadMessages(selectedId), 4000);
    return () => clearInterval(id);
  }, [selectedId, token, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !token || !selectedId || sending) return;
    setSending(true);
    setError(null);
    try {
      const msg = await RoomChatAdminService.sendMessage(token, selectedId, text);
      setInput('');
      setMessages((prev) => [...prev, msg]);
      await loadThreads();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gửi thất bại');
    } finally {
      setSending(false);
    }
  };

  if (!token) {
    return (
      <div className="p-6 text-sm text-gray-500">Đang kiểm tra đăng nhập…</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-6xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Chat khách đang ở phòng</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tin nhắn từ khách trong Dịch vụ → Chat trên trang Phòng của bạn.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 text-sm px-4 py-2">{error}</div>
      )}

      <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white min-h-[480px]">
        {/* Thread list */}
        <div className="w-full max-w-xs border-r border-gray-200 flex flex-col bg-gray-50">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200">
            Cuộc trò chuyện
          </div>
          <div className="overflow-y-auto flex-1">
            {loadingList && (
              <p className="p-4 text-sm text-gray-400">Đang tải…</p>
            )}
            {!loadingList && threads.length === 0 && (
              <p className="p-4 text-sm text-gray-400">Chưa có tin nhắn nào.</p>
            )}
            {threads.map((t) => (
              <button
                key={t._id}
                type="button"
                onClick={() => setSelectedId(t._id)}
                className={`w-full text-left px-3 py-3 border-b border-gray-100 hover:bg-white transition-colors ${
                  selectedId === t._id ? 'bg-white border-l-4 border-l-green-600' : ''
                }`}
              >
                <div className="font-medium text-gray-900 text-sm truncate">
                  {t.roomName}
                </div>
                <div className="text-xs text-gray-500 truncate">{t.guestName}</div>
                {t.unreadForAdmin > 0 && (
                  <span className="inline-block mt-1 text-[10px] font-bold bg-green-600 text-white px-1.5 py-0.5 rounded-full">
                    {t.unreadForAdmin} mới
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selectedId && (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-8">
              Chọn một cuộc trò chuyện bên trái
            </div>
          )}
          {selectedId && (
            <>
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <p className="font-semibold text-gray-900">
                  {threadDetail?.roomName ?? '…'}
                </p>
                <p className="text-xs text-gray-500">
                  Khách: {threadDetail?.guestName ?? '—'}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
                {loadingMsg && messages.length === 0 && (
                  <p className="text-sm text-gray-400">Đang tải tin nhắn…</p>
                )}
                {messages.map((m) => (
                  <div
                    key={m._id}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      m.senderRole === 'admin'
                        ? 'ml-auto bg-green-600 text-white'
                        : 'mr-auto bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    <span className="text-[10px] opacity-80 block mb-0.5">
                      {m.senderRole === 'admin' ? 'Bạn (admin)' : 'Khách'}
                    </span>
                    <p className="whitespace-pre-wrap break-words m-0">{m.body}</p>
                    <span className="text-[10px] opacity-70 block mt-1">
                      {new Date(m.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-3 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                  placeholder="Nhập tin nhắn trả lời…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  disabled={sending}
                  maxLength={4000}
                />
                <button
                  type="button"
                  onClick={() => void handleSend()}
                  disabled={sending || !input.trim()}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Gửi
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
