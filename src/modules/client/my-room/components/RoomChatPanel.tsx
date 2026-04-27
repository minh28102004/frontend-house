'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  RoomChatGuestService,
  RoomChatMessageDTO,
} from '../services/room-chat.service';
import styles from './RoomChatPanel.module.css';

type Props = {
  bookingId: string | null | undefined;
  roomName?: string;
};

export default function RoomChatPanel({ bookingId, roomName }: Props) {
  const { token } = useAuth();
  const [messages, setMessages] = useState<RoomChatMessageDTO[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const load = useCallback(async () => {
    if (!token || !bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await RoomChatGuestService.fetchMessages(token, bookingId);
      setMessages(data.messages || []);
      await RoomChatGuestService.markRead(token, bookingId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi tải tin nhắn');
    } finally {
      setLoading(false);
    }
  }, [token, bookingId]);

  useEffect(() => {
    if (!bookingId || !token) return;
    load();
    const id = setInterval(load, 4000);
    return () => clearInterval(id);
  }, [bookingId, token, load]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !token || !bookingId || sending) return;
    setSending(true);
    setError(null);
    try {
      const msg = await RoomChatGuestService.sendMessage(token, bookingId, text);
      setInput('');
      setMessages((prev) => [...prev, msg]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Không gửi được');
    } finally {
      setSending(false);
    }
  };

  if (!bookingId) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Chat với lễ tân</p>
        <p className={styles.emptyText}>
          Chỉ khách đang lưu trú tại phòng (đặt phòng đã xác nhận) mới nhắn tin được.
          Khi bạn có phòng hiển thị ở trang này, mở lại Dịch vụ → Chat.
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>Vui lòng đăng nhập để chat với lễ tân.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {roomName && (
        <p className={styles.roomHint}>
          Phòng: <strong>{roomName}</strong>
        </p>
      )}
      <div className={styles.messages}>
        {loading && messages.length === 0 && (
          <p className={styles.hint}>Đang tải tin nhắn…</p>
        )}
        {messages.length === 0 && !loading && (
          <p className={styles.hint}>
            Chưa có tin nhắn. Hãy nhắn cho lễ tân — chúng tôi sẽ trả lời sớm nhất có thể.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m._id}
            className={
              m.senderRole === 'guest' ? styles.bubbleGuest : styles.bubbleAdmin
            }
          >
            <span className={styles.bubbleMeta}>
              {m.senderRole === 'guest' ? 'Bạn' : 'Lễ tân'}
            </span>
            <p className={styles.bubbleBody}>{m.body}</p>
            <span className={styles.time}>
              {new Date(m.createdAt).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'numeric',
              })}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {error && <p className={styles.err}>{error}</p>}
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          placeholder="Nhập tin nhắn…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          maxLength={4000}
          disabled={sending}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={() => void handleSend()}
          disabled={sending || !input.trim()}
        >
          {sending ? '…' : 'Gửi'}
        </button>
      </div>
    </div>
  );
}
