export enum ChatbotItemType {
  FAQ = 'faq',
  ROOM = 'room',
  RULE = 'rule',
  GREETING = 'greeting',
}

export enum ChatbotResponseMode {
  AUTO = 'auto',
  HUMAN = 'human',
  HYBRID = 'hybrid',
}

export interface ChatbotAction {
  label: string;
  url?: string | null;
  type?: string | null;
  roomId?: string | null;
}

export interface ChatbotItem {
  _id: string;
  type: ChatbotItemType;
  trigger: string;
  response: string;
  actions: ChatbotAction[];
  roomId?: string | null;
  priority: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotRoom {
  _id?: string;
  id: string;
  name: string;
  priceK: number;
  vibe: string;
  highlights: string[];
}

export interface ChatbotQuickReply {
  _id?: string;
  id: string;
  label: string;
  isActive: boolean;
  priority: number;
}

export interface ChatbotSettings {
  _id?: string;
  responseMode: ChatbotResponseMode;
  welcomeText: string;
  fallbackToHuman: boolean;
  adminNotifyId?: string | null;
  aiApiKey?: string | null;
  aiModel?: string | null;
  aiSystemPrompt?: string | null;
}

export interface ChatResponse {
  text: string;
  source: 'qa' | 'ai' | 'fallback';
  actions: ChatbotAction[];
  needsHuman?: boolean;
}

export interface ChatbotStats {
  _id?: string;
  totalMessages: number;
  qaReplied: number;
  aiReplied: number;
  humanHandled: number;
  fallbackCount: number;
}

export interface ChatbotConfig {
  items: ChatbotItem[];
  rooms: ChatbotRoom[];
  quickReplies: ChatbotQuickReply[];
  settings: ChatbotSettings;
  stats: ChatbotStats;
}

export interface PaginatedChatbotItems {
  data: ChatbotItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
