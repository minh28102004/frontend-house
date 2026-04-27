"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { trafficApi } from "@/modules/admin/traffic/services/traffic.service";
import type {
  TrafficOverview,
  TrafficStats,
  DailyData,
  HourlyData,
  TopPage,
  BrowserData,
  DeviceData,
  GeoData,
} from "@/modules/admin/traffic/types/traffic.types";
import { useTrafficStore, selectStats, selectActiveNow, selectIsConnected } from "./trafficStore";

/**
 * Hook để initialize WebSocket connection (chỉ gọi 1 lần trong app)
 */
export const useTrafficInit = () => {
  const initialize = useTrafficStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);
};

/**
 * Hook để lấy số người đang online (real-time)
 */
export const useActiveNow = () => {
  const activeNow = useTrafficStore(selectActiveNow);
  const isConnected = useTrafficStore(selectIsConnected);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["traffic", "active-now"],
    queryFn: () => trafficApi.getActiveNow().then((res) => res.data),
    staleTime: Infinity, // Chỉ dùng để init, sau đó dùng store
  });

  // Init từ server nếu store chưa có
  useEffect(() => {
    if (data !== undefined && activeNow === 0) {
      useTrafficStore.getState().setActiveNow(data);
    }
  }, [data, activeNow]);

  return {
    activeNow,
    isConnected,
    isLoading,
    refetch,
  };
};

/**
 * Hook để lấy traffic overview
 */
export const useTrafficOverview = (days: number = 7) => {
  const storeStats = useTrafficStore(selectStats);
  const setStats = useTrafficStore((state) => state.setStats);
  const setRecentActivity = useTrafficStore((state) => state.setRecentActivity);

  const { data, isLoading, error, refetch } = useQuery<TrafficOverview>({
    queryKey: ["traffic", "overview", days],
    queryFn: () => trafficApi.getOverview(days).then((res) => res.data),
    staleTime: 30000,
  });

  // Sync từ API vào store khi có data
  useEffect(() => {
    if (data) {
      setStats(data.visitors);
      setRecentActivity(data.recentActivity);
    }
  }, [data, setStats, setRecentActivity]);

  return {
    // Stats từ store (reactive, real-time)
    stats: storeStats,
    chart: data?.chart || [],
    hourly: data?.hourly || [],
    topPages: data?.topPages || [],
    browsers: data?.browsers || [],
    devices: data?.devices || [],
    geo: data?.geo || [],
    recentActivity: data?.recentActivity || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook để lấy visitor stats
 */
export const useVisitorStats = () => {
  const stats = useTrafficStore(selectStats);

  const { data, isLoading, error, refetch } = useQuery<TrafficStats>({
    queryKey: ["traffic", "stats"],
    queryFn: () => trafficApi.getStats().then((res) => res.data),
    staleTime: 30000,
  });

  useEffect(() => {
    if (data) {
      useTrafficStore.getState().setStats(data);
    }
  }, [data]);

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook để lấy chart data
 */
export const useTrafficChartData = (days: number = 7) => {
  const { data, isLoading, error, refetch } = useQuery<DailyData[]>({
    queryKey: ["traffic", "chart", days],
    queryFn: () => trafficApi.getChart(days).then((res) => res.data),
    staleTime: 60000,
  });

  return {
    chart: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook để lấy hourly data
 */
export const useHourlyData = () => {
  const { data, isLoading, error, refetch } = useQuery<HourlyData[]>({
    queryKey: ["traffic", "hourly"],
    queryFn: () => trafficApi.getHourly().then((res) => res.data),
    staleTime: 60000,
  });

  return {
    hourly: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook để lấy top pages
 */
export const useTopPages = (limit: number = 10) => {
  const { data, isLoading, error, refetch } = useQuery<TopPage[]>({
    queryKey: ["traffic", "top-pages", limit],
    queryFn: () => trafficApi.getTopPages(limit).then((res) => res.data),
    staleTime: 60000,
  });

  return {
    topPages: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook để lấy browsers data
 */
export const useBrowsersData = () => {
  const { data, isLoading, error, refetch } = useQuery<BrowserData[]>({
    queryKey: ["traffic", "browsers"],
    queryFn: () => trafficApi.getBrowsers().then((res) => res.data),
    staleTime: 60000,
  });

  return {
    browsers: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook để lấy devices data
 */
export const useDevicesData = () => {
  const { data, isLoading, error, refetch } = useQuery<DeviceData[]>({
    queryKey: ["traffic", "devices"],
    queryFn: () => trafficApi.getDevices().then((res) => res.data),
    staleTime: 60000,
  });

  return {
    devices: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook để lấy geo data
 */
export const useGeoData = () => {
  const { data, isLoading, error, refetch } = useQuery<GeoData[]>({
    queryKey: ["traffic", "geo"],
    queryFn: () => trafficApi.getGeo().then((res) => res.data),
    staleTime: 60000,
  });

  return {
    geo: data || [],
    isLoading,
    error,
    refetch,
  };
};
