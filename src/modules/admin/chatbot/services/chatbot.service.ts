'use client';
import axios from 'axios';
import {
  ChatbotItem,
  ChatbotRoom,
  ChatbotQuickReply,
  ChatbotSettings,
  ChatbotStats,
  ChatbotConfig,
  PaginatedChatbotItems,
} from '../models/chatbot.model';
import { API_URL_CLIENT } from '@/config/apiRoutes';
import { ClientProductListResponse } from '@/modules/client/product/models/product.model';

const API = API_URL_CLIENT + '/api';

export interface AvailableRoom {
  concept: string;
  name: string;
  price: number;
  available: boolean;
  thumbnail?: string;
}

export interface ProductSuggestion {
  name: string;
  slug: string;
  thumbnail?: string;
  currentPrice?: number;
  discountPrice?: number;
  category?: string;
}

export interface ChatbotSuggestionData {
  rooms: AvailableRoom[];
  products: ProductSuggestion[];
}

export const ChatbotService = {
  // ─── CLIENT: Lấy cấu hình đầy đủ cho chatbot ───────────────────────
  async getConfig(): Promise<ChatbotConfig> {
    const response = await axios.get<ChatbotConfig>(
      `${API}/chatbotapi/config`
    );
    return response.data;
  },

  // ─── CLIENT: Gửi message → nhận phản hồi (Q&A hoặc GPT) ──────────────
  async chat(message: string): Promise<{
    text: string;
    source: 'qa' | 'ai' | 'fallback';
    actions: any[];
    needsHuman?: boolean;
  }> {
    const response = await axios.post(`${API}/chatbotapi/chat`, { message });
    return response.data;
  },

  // ─── CLIENT: Lấy dữ liệu gợi ý phòng & sản phẩm ──────────────────────
  // Trả về danh sách phòng hiển thị cùng trạng thái availability giả định (true).
  // Trạng thái thực sẽ được kiểm tra khi khách vào trang booking.
  async getSuggestionData(): Promise<ChatbotSuggestionData> {
    const [roomsRes, productsRes] = await Promise.allSettled([
      // /roomsapi → findAllRooms() trả mảng BackendRoom
      axios.get<any[]>(`${API}/roomsapi`),
    // /productsapi/basic-info → trả { data: ClientProductBasic[], total, page, totalPages }
    axios.get<ClientProductListResponse>(`${API}/productsapi/basic-info?page=1&limit=20`),
    ]);

    // Map backend rooms → AvailableRoom
    const rooms: AvailableRoom[] = roomsRes.status === 'fulfilled'
      ? (roomsRes.value.data ?? []).map((r: any) => ({
          concept: r.concept ?? r._id ?? '',
          name: r.name ?? r.concept ?? '',
          price: Number(r.price) || 0,
          available: true,
          thumbnail: r.thumbnail ?? r.img ?? undefined,
        }))
      : [];

    const products: ProductSuggestion[] = productsRes.status === 'fulfilled'
      ? (productsRes.value.data?.data ?? []).slice(0, 10).map((p: any) => ({
          name: p.name ?? '',
          slug: p.slug ?? '',
          thumbnail: p.thumbnail ?? undefined,
          currentPrice: p.currentPrice,
          discountPrice: p.discountPrice,
          category: typeof p.category === 'object' ? p.category?.main : p.category,
        }))
      : [];

    return { rooms, products };
  },

  // ─── ADMIN: Items CRUD ────────────────────────────────────────────────
  async getItems(
    page = 1,
    limit = 50,
    includeDeleted = false
  ): Promise<PaginatedChatbotItems> {
    const response = await axios.get<PaginatedChatbotItems>(
      `${API}/chatbotapi/items`,
      {
        params: { page, limit, includeDeleted },
      }
    );
    return response.data;
  },

  async searchItems(
    q: string,
    page = 1,
    limit = 50
  ): Promise<{ data: ChatbotItem[] }> {
    const response = await axios.get(`${API}/chatbotapi/items/search`, {
      params: { q, page, limit },
    });
    return response.data;
  },

  async getItem(id: string): Promise<ChatbotItem> {
    const response = await axios.get<ChatbotItem>(
      `${API}/chatbotapi/items/${id}`
    );
    return response.data;
  },

  async createItem(data: Partial<ChatbotItem>): Promise<ChatbotItem> {
    const response = await axios.post<ChatbotItem>(
      `${API}/chatbotapi/items`,
      data
    );
    return response.data;
  },

  async updateItem(
    id: string,
    data: Partial<ChatbotItem>
  ): Promise<ChatbotItem> {
    const response = await axios.patch<ChatbotItem>(
      `${API}/chatbotapi/items/${id}`,
      data
    );
    return response.data;
  },

  async toggleItem(id: string): Promise<ChatbotItem> {
    const response = await axios.patch<ChatbotItem>(
      `${API}/chatbotapi/items/${id}/toggle`
    );
    return response.data;
  },

  async deleteItem(id: string): Promise<void> {
    await axios.delete(`${API}/chatbotapi/items/${id}`);
  },

  // ─── ADMIN: Rooms ─────────────────────────────────────────────────────
  async getRooms(): Promise<ChatbotRoom[]> {
    const response = await axios.get<ChatbotRoom[]>(`${API}/chatbotapi/rooms`);
    return response.data;
  },

  async upsertRooms(rooms: ChatbotRoom[]): Promise<ChatbotRoom[]> {
    const response = await axios.post<ChatbotRoom[]>(
      `${API}/chatbotapi/rooms`,
      { rooms }
    );
    return response.data;
  },

  // ─── ADMIN: Quick Replies ─────────────────────────────────────────────
  async getQuickReplies(): Promise<ChatbotQuickReply[]> {
    const response = await axios.get<ChatbotQuickReply[]>(
      `${API}/chatbotapi/quick-replies`
    );
    return response.data;
  },

  async upsertQuickReplies(
    items: ChatbotQuickReply[]
  ): Promise<ChatbotQuickReply[]> {
    const response = await axios.post<ChatbotQuickReply[]>(
      `${API}/chatbotapi/quick-replies`,
      { items }
    );
    return response.data;
  },

  // ─── ADMIN: Settings ─────────────────────────────────────────────────
  async getSettings(): Promise<ChatbotSettings> {
    const response = await axios.get<ChatbotSettings>(
      `${API}/chatbotapi/settings`
    );
    return response.data;
  },

  async updateSettings(data: Partial<ChatbotSettings>): Promise<ChatbotSettings> {
    const response = await axios.patch<ChatbotSettings>(
      `${API}/chatbotapi/settings`,
      data
    );
    return response.data;
  },

  // ─── ADMIN: Stats ─────────────────────────────────────────────────────
  async getStats(): Promise<ChatbotStats> {
    const response = await axios.get<ChatbotStats>(`${API}/chatbotapi/stats`);
    return response.data;
  },
};
