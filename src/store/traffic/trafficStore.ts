import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';
import { TrafficStats, ActiveSession } from '@/modules/admin/traffic/types/traffic.types';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface TrafficUpdate {
  type: 'pageview' | 'visitor' | 'active_session' | 'stats';
  data: {
    url?: string;
    sessionId?: string;
    pageViews?: number;
    visitors?: number;
    activeNow?: number;
    timestamp: string;
  };
}

export interface TrafficState {
  // Stats
  stats: TrafficStats;
  activeNow: number;
  recentActivity: ActiveSession[];
  
  // Real-time updates
  lastUpdate: TrafficUpdate | null;
  
  // Connection state
  isConnected: boolean;
  isInitialized: boolean;
  
  // Actions
  initialize: () => void;
  disconnect: () => void;
  setStats: (stats: TrafficStats) => void;
  setActiveNow: (count: number) => void;
  setRecentActivity: (sessions: ActiveSession[]) => void;
  handleTrafficUpdate: (update: TrafficUpdate) => void;
}

export const useTrafficStore = create<TrafficState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    stats: {
      totalVisitors: 0,
      todayVisitors: 0,
      yesterdayVisitors: 0,
      activeNow: 0,
      pageViews: 0,
      todayPageViews: 0,
    },
    activeNow: 0,
    recentActivity: [],
    lastUpdate: null,
    isConnected: false,
    isInitialized: false,

    // Initialize WebSocket connection
    initialize: () => {
      const state = get();
      if (state.isInitialized && state.isConnected) return;

      const socket: Socket = io(`${SOCKET_URL}/traffic`, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Connection events
      socket.on('connect', () => {
        console.log('[TrafficSocket] Connected:', socket.id);
        set({ isConnected: true });
        
        // Subscribe to traffic updates
        socket.emit('subscribe');
      });

      socket.on('disconnect', () => {
        console.log('[TrafficSocket] Disconnected');
        set({ isConnected: false });
      });

      socket.on('connect_error', (error) => {
        console.error('[TrafficSocket] Connection error:', error);
        set({ isConnected: false });
      });

      // Listen for traffic updates
      socket.on('traffic-update', (update: TrafficUpdate) => {
        console.log('[TrafficSocket] Traffic update:', update);
        get().handleTrafficUpdate(update);
      });

      socket.on('subscribed', () => {
        console.log('[TrafficSocket] Subscribed to traffic updates');
      });

      set({ isInitialized: true });

      // Store socket reference for cleanup
      return () => {
        socket.emit('unsubscribe');
        socket.disconnect();
      };
    },

    // Disconnect socket
    disconnect: () => {
      set({ isConnected: false });
    },

    // Set stats
    setStats: (stats: TrafficStats) => {
      set({ stats, activeNow: stats.activeNow });
    },

    // Set active now count
    setActiveNow: (count: number) => {
      set((state) => ({
        activeNow: count,
        stats: { ...state.stats, activeNow: count },
      }));
    },

    // Set recent activity
    setRecentActivity: (sessions: ActiveSession[]) => {
      set({ recentActivity: sessions });
    },

    // Handle traffic update from WebSocket
    handleTrafficUpdate: (update: TrafficUpdate) => {
      const state = get();

      switch (update.type) {
        case 'pageview':
          // Increment page views
          set({
            lastUpdate: update,
            stats: {
              ...state.stats,
              todayPageViews: (state.stats.todayPageViews || 0) + 1,
            },
          });
          break;

        case 'visitor':
          // New visitor
          set({
            lastUpdate: update,
            stats: {
              ...state.stats,
              todayVisitors: (state.stats.todayVisitors || 0) + 1,
            },
          });
          break;

        case 'active_session':
          // Active sessions changed
          if (update.data.activeNow !== undefined) {
            set({
              lastUpdate: update,
              activeNow: update.data.activeNow,
              stats: {
                ...state.stats,
                activeNow: update.data.activeNow,
              },
            });
          }
          break;

        case 'stats':
          // Full stats update
          if (update.data.visitors !== undefined && update.data.pageViews !== undefined) {
            set({
              lastUpdate: update,
              activeNow: update.data.activeNow || state.activeNow,
              stats: {
                ...state.stats,
                todayVisitors: update.data.visitors,
                todayPageViews: update.data.pageViews,
                activeNow: update.data.activeNow || state.stats.activeNow,
              },
            });
          }
          break;
      }
    },
  }))
);

// Selectors for performance
export const selectStats = (state: TrafficState) => state.stats;
export const selectActiveNow = (state: TrafficState) => state.activeNow;
export const selectIsConnected = (state: TrafficState) => state.isConnected;
export const selectIsInitialized = (state: TrafficState) => state.isInitialized;
export const selectLastUpdate = (state: TrafficState) => state.lastUpdate;
