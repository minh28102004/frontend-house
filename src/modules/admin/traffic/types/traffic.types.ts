export interface TrafficStats {
  totalVisitors: number;
  todayVisitors: number;
  yesterdayVisitors: number;
  activeNow: number;
  pageViews: number;
  todayPageViews: number;
}

export interface DailyData {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface HourlyData {
  hour: number;
  visitors: number;
  pageViews: number;
}

export interface TopPage {
  url: string;
  views: number;
}

export interface BrowserData {
  browser: string;
  visitors: number;
  percentage: number;
}

export interface DeviceData {
  device: string;
  visitors: number;
  percentage: number;
}

export interface GeoData {
  country: string;
  visitors: number;
  percentage: number;
}

export interface ActiveSession {
  sessionId: string;
  userId?: string;
  ip: string;
  browser: string;
  os: string;
  device: string;
  currentUrl: string;
  lastActivity: string;
  pageViews: number;
  createdAt: string;
}

export interface TrafficOverview {
  visitors: TrafficStats;
  chart: DailyData[];
  hourly: HourlyData[];
  topPages: TopPage[];
  browsers: BrowserData[];
  devices: DeviceData[];
  geo: GeoData[];
  recentActivity: ActiveSession[];
}

export interface ActiveNowResponse {
  activeNow: number;
}
