/**
 * Shared chatbot defaults — single source of truth for both client & server.
 * These are used when the backend has no data yet (seeding) and as fallback on the client.
 */

import { ChatbotRoom, ChatbotQuickReply } from '@/modules/admin/chatbot/models/chatbot.model';

export const DEFAULT_ROOMS: ChatbotRoom[] = [
  { id: 'romantic', name: 'Romantic', priceK: 990, vibe: 'Warm amber light, intimate evenings, slow mornings.', highlights: ['King size bed', 'Deep soaking tub', 'Private balcony'] },
  { id: 'sky', name: 'Sky', priceK: 890, vibe: 'Airy, cloud-like space with skylight and soft natural light.', highlights: ['Queen size bed', 'Skylight window', 'City view'] },
  { id: 'cinema', name: 'Cinema', priceK: 1090, vibe: 'Velvet cocoon for film nights and immersive audio.', highlights: ['4K Projector', 'Surround sound', 'Curated film library'] },
  { id: 'nature', name: 'Nature', priceK: 940, vibe: 'Living moss, botanical elements, grounding calm.', highlights: ['Living moss wall', 'Soaking tub', 'Garden view'] },
  { id: 'minimal', name: 'Minimal', priceK: 850, vibe: 'Concrete + oak + linen. Quiet, clear, and exactly what you need.', highlights: ['Queen size bed', 'Rain shower', 'Writing desk'] },
];

export const DEFAULT_QUICK_REPLIES: ChatbotQuickReply[] = [
  { id: 'q_book', label: 'Đặt phòng ngay', isActive: true, priority: 1 },
  { id: 'q_room', label: 'Gợi ý phòng theo mood', isActive: true, priority: 2 },
  { id: 'q_hours', label: 'Giờ nhận/trả', isActive: true, priority: 3 },
  { id: 'q_pets', label: 'Có cho thú cưng không?', isActive: true, priority: 4 },
  { id: 'q_wifi', label: 'WiFi có sẵn không?', isActive: true, priority: 5 },
  { id: 'q_price', label: 'Giá phòng bao nhiêu?', isActive: true, priority: 6 },
];

export const DEFAULT_WELCOME =
  'Xin chào! Bạn cần mình giúp đặt phòng hay trả lời câu hỏi thường gặp?\n' +
  'Bạn có thể nói: "đặt phòng", "giờ nhận/trả", "pets welcome", "WiFi", "giá phòng"…';
