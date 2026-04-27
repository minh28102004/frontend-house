import { API_URL_CLIENT, apiRoutes } from '@/config/apiRoutes';
import { getAuthHeaders } from '@/config/api';

export type RoomChatMessageDTO = {
  _id: string;
  threadId?: string;
  senderRole: 'guest' | 'admin';
  senderUserId?: string;
  body: string;
  createdAt: string;
};

export const RoomChatGuestService = {
  async fetchMessages(
    token: string,
    bookingId: string,
  ): Promise<{ threadId: string | null; messages: RoomChatMessageDTO[] }> {
    const res = await fetch(
      `${API_URL_CLIENT}${apiRoutes.ROOM_CHAT.GUEST_MESSAGES(bookingId)}`,
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
    bookingId: string,
    body: string,
  ): Promise<RoomChatMessageDTO> {
    const res = await fetch(`${API_URL_CLIENT}${apiRoutes.ROOM_CHAT.GUEST_POST}`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ bookingId, body }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || 'Gửi tin nhắn thất bại');
    }
    return res.json();
  },

  async markRead(token: string, bookingId: string): Promise<void> {
    await fetch(`${API_URL_CLIENT}${apiRoutes.ROOM_CHAT.GUEST_READ}`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ bookingId }),
    });
  },
};
