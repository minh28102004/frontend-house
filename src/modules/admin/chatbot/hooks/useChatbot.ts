import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatbotService } from '../services/chatbot.service';
import {
  ChatbotItem,
  ChatbotRoom,
  ChatbotQuickReply,
  ChatbotSettings,
  ChatbotStats,
  PaginatedChatbotItems,
} from '../models/chatbot.model';

export const useChatbot = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 50;

  // ─── Items list ─────────────────────────────────────────────────────
  const itemsQuery = useQuery<PaginatedChatbotItems, Error>({
    queryKey: ['chatbot-items', page, limit, searchTerm],
    queryFn: async () => {
      if (searchTerm.trim()) {
        const result = await ChatbotService.searchItems(searchTerm.trim(), page, limit);
        return {
          data: result.data,
          total: result.data.length,
          page,
          limit,
          totalPages: 1,
        };
      }
      return ChatbotService.getItems(page, limit);
    },
    placeholderData: (prev) => prev,
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  // ─── Items mutations ─────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: Partial<ChatbotItem>) =>
      ChatbotService.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-items'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChatbotItem> }) =>
      ChatbotService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-items'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => ChatbotService.toggleItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-items'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ChatbotService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-items'] });
    },
  });

  // ─── Rooms ──────────────────────────────────────────────────────────
  const roomsQuery = useQuery<ChatbotRoom[], Error>({
    queryKey: ['chatbot-rooms'],
    queryFn: ChatbotService.getRooms,
    staleTime: 1000 * 60 * 10,
  });

  const upsertRoomsMutation = useMutation({
    mutationFn: (rooms: ChatbotRoom[]) => ChatbotService.upsertRooms(rooms),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-rooms'] });
    },
  });

  // ─── Quick Replies ──────────────────────────────────────────────────
  const quickRepliesQuery = useQuery<ChatbotQuickReply[], Error>({
    queryKey: ['chatbot-quick-replies'],
    queryFn: ChatbotService.getQuickReplies,
    staleTime: 1000 * 60 * 10,
  });

  const upsertQuickRepliesMutation = useMutation({
    mutationFn: (items: ChatbotQuickReply[]) =>
      ChatbotService.upsertQuickReplies(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-quick-replies'] });
    },
  });

  // ─── Settings ──────────────────────────────────────────────────────
  const settingsQuery = useQuery<ChatbotSettings, Error>({
    queryKey: ['chatbot-settings'],
    queryFn: ChatbotService.getSettings,
    staleTime: 1000 * 60 * 5,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<ChatbotSettings>) =>
      ChatbotService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-settings'] });
    },
  });

  // ─── Stats ──────────────────────────────────────────────────────────
  const statsQuery = useQuery<ChatbotStats, Error>({
    queryKey: ['chatbot-stats'],
    queryFn: ChatbotService.getStats,
    staleTime: 1000 * 30,
  });

  return {
    // Items
    itemsQuery,
    createMutation,
    updateMutation,
    toggleMutation,
    deleteMutation,
    handleSearch,
    // Rooms
    roomsQuery,
    upsertRoomsMutation,
    // Quick Replies
    quickRepliesQuery,
    upsertQuickRepliesMutation,
    // Settings
    settingsQuery,
    updateSettingsMutation,
    // Stats
    statsQuery,
    // Pagination
    page,
    setPage,
    searchTerm,
  };
};
