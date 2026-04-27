import api from '@/config/api';

export interface HostUser {
  id: string;
  email: string;
  role: string;
  status: string;
  fullName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  gender?: string;
  isHost: boolean;
  hostTermsAccepted: boolean;
  hostTermsAcceptedAt?: string;
  createdAt?: string | Date;
  // Extended fields
  hostVerificationStatus?: string;
  hostVerifiedAt?: string;
  hostVerificationNote?: string;
  isBanned?: boolean;
  banReason?: string;
  bannedAt?: string;
  banHistory?: BanRecord[];
  isFlagged?: boolean;
  flagReason?: string;
  flaggedAt?: string;
}

export interface BanRecord {
  reason: string;
  bannedAt: string;
  unbannedAt?: string;
  unbannedReason?: string;
}

export interface AdminNote {
  id: string;
  targetUserId: string;
  createdBy: string;
  content: string;
  type: 'info' | 'warning' | 'important';
  isPinned: boolean;
  createdByName?: string;
  createdByAvatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HostStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  newThisMonth: number;
}

/** Phản hồi GET /usersapi/hosts/:id/details */
export interface HostAdminDetailResponse {
  host: HostUser;
  roomCount: number;
  activeRoomCount: number;
  banHistory?: BanRecord[];
  rooms: HostRoomSummary[];
}

export interface HostRoomSummary {
  id?: string;
  _id?: string;
  num: string;
  concept: string;
  name: string;
  description?: string;
  price: number;
  isVisible: boolean;
  thumbnail?: string;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const BASE = '/api/usersapi';
const HOSTS_BASE = `${BASE}/hosts`;

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
});

export const getAllHosts = async (): Promise<HostUser[]> => {
  const response = await api.get<HostUser[]>(`${HOSTS_BASE}`, { headers: getAuthHeaders() });
  return response.data;
};

export const getHostStats = async (): Promise<HostStats> => {
  const response = await api.get<HostStats>(`${HOSTS_BASE}/stats`, { headers: getAuthHeaders() });
  return response.data;
};

export const getHostById = async (id: string): Promise<HostUser> => {
  const response = await api.get<HostUser>(`${HOSTS_BASE}/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const getHostFullDetails = async (id: string): Promise<HostAdminDetailResponse> => {
  const response = await api.get<HostAdminDetailResponse>(`${HOSTS_BASE}/${id}/details`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateHostStatus = async (
  id: string,
  payload: { status?: string; fullName?: string; phone?: string; address?: string },
): Promise<HostUser> => {
  const response = await api.put<HostUser>(`${BASE}/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const banHost = async (id: string, reason: string): Promise<HostUser> => {
  const response = await api.post<HostUser>(`${HOSTS_BASE}/${id}/ban`, { reason }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const unbanHost = async (id: string, reason?: string): Promise<HostUser> => {
  const response = await api.post<HostUser>(`${HOSTS_BASE}/${id}/unban`, { reason }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const approveHost = async (id: string, note?: string): Promise<HostUser> => {
  const response = await api.post<HostUser>(`${HOSTS_BASE}/${id}/approve`, { note }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const rejectHost = async (id: string, reason: string): Promise<HostUser> => {
  const response = await api.post<HostUser>(`${HOSTS_BASE}/${id}/reject`, { reason }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const bulkUpdateHostStatus = async (
  hostIds: string[],
  status: string,
): Promise<{ success: number; failed: number }> => {
  const response = await api.post<{ success: number; failed: number }>(
    `${HOSTS_BASE}/bulk-update-status`,
    { hostIds, status },
    { headers: getAuthHeaders() },
  );
  return response.data;
};

export const flagHost = async (id: string, reason: string): Promise<HostUser> => {
  const response = await api.post<HostUser>(`${HOSTS_BASE}/${id}/flag`, { reason }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const unflagHost = async (id: string): Promise<HostUser> => {
  const response = await api.post<HostUser>(`${HOSTS_BASE}/${id}/unflag`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const sendNotificationToHost = async (
  id: string,
  title: string,
  message: string,
  sendEmail: boolean = false,
): Promise<void> => {
  await api.post(`${HOSTS_BASE}/${id}/notify`, { title, message, sendEmail }, {
    headers: getAuthHeaders(),
  });
};

// Admin Notes
export const getHostAdminNotes = async (hostId: string): Promise<AdminNote[]> => {
  const response = await api.get<AdminNote[]>(`${HOSTS_BASE}/${hostId}/notes`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createAdminNote = async (
  hostId: string,
  content: string,
  type: 'info' | 'warning' | 'important' = 'info',
  isPinned: boolean = false,
): Promise<AdminNote> => {
  const response = await api.post<AdminNote>(
    `${HOSTS_BASE}/${hostId}/notes`,
    { content, type, isPinned },
    { headers: getAuthHeaders() },
  );
  return response.data;
};

export const deleteAdminNote = async (noteId: string): Promise<void> => {
  await api.delete(`${BASE}/notes/${noteId}`, {
    headers: getAuthHeaders(),
  });
};

export const AdminHostService = {
  getAll: getAllHosts,
  getStats: getHostStats,
  getById: getHostById,
  getFullDetails: getHostFullDetails,
  updateStatus: updateHostStatus,
  ban: banHost,
  unban: unbanHost,
  approve: approveHost,
  reject: rejectHost,
  bulkUpdateStatus: bulkUpdateHostStatus,
  flag: flagHost,
  unflag: unflagHost,
  sendNotification: sendNotificationToHost,
  getNotes: getHostAdminNotes,
  createNote: createAdminNote,
  deleteNote: deleteAdminNote,
};
