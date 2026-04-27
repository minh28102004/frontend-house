import { API_URL_CLIENT, apiRoutes } from '@/config/apiRoutes';
import { getAuthHeaders } from '@/config/api';

export type RoomChatThreadDTO = {
  _id: string;
  bookingId: string;
  guestUserId: string;
  roomName: string;
  concept: string;
  guestName: string;
  lastMessageAt?: string;
  unreadForAdmin: number;
  unreadForGuest: number;
  createdAt?: string;
  updatedAt?: string;
};

export type RoomChatMessageDTO = {
  _id: string;
  senderRole: 'guest' | 'admin';
  senderUserId?: string;
  body: string;
  createdAt: string;
};

export const RoomChatAdminService = {
  async listThreads(token: string): Promise<RoomChatThreadDTO[]> {
    const res = await fetch(
      `${API_URL_CLIENT}${apiRoutes.ROOM_CHAT.ADMIN_THREADS}`,
      { headers: getAuthHeaders(token) },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Không tải được danh sách chat');
    }
    return res.json();
  },

  async getThreadMessages(
    token: string,
    threadId: string,
  ): Promise<{
    thread: RoomChatThreadDTO;
    messages: RoomChatMessageDTO[];
  }> {
    const res = await fetch(
      `${API_URL_CLIENT}${apiRoutes.ROOM_CHAT.ADMIN_MESSAGES(threadId)}`,
      { headers: getAuthHeaders(token) },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Không tải được tin nhắn');
    }
    return res.json();
  },

  async sendMessage(
    token: string,
    threadId: string,
    body: string,
  ): Promise<RoomChatMessageDTO> {
    const res = await fetch(
      `${API_URL_CLIENT}${apiRoutes.ROOM_CHAT.ADMIN_POST(threadId)}`,
      {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ body }),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Gửi tin nhắn thất bại');
    }
    return res.json();
  },

  async markRead(token: string, threadId: string): Promise<void> {
    await fetch(`${API_URL_CLIENT}${apiRoutes.ROOM_CHAT.ADMIN_READ(threadId)}`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
  },
};
