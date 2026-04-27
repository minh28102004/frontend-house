import api from '@/config/api';

export interface AdminUser {
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
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  admins: number;
  newThisMonth: number;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  role?: string;
  status?: string;
  fullName?: string;
  phone?: string;
}

export interface UpdateUserPayload {
  role?: string;
  status?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  gender?: string;
  avatar?: string;
}

const BASE = '/api/usersapi';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
});

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const response = await api.get<AdminUser[]>(BASE, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<AdminUser> => {
  const response = await api.get<AdminUser>(`${BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createUser = async (
  payload: CreateUserPayload,
): Promise<AdminUser> => {
  const response = await api.post<AdminUser>(BASE, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload,
): Promise<AdminUser> => {
  const response = await api.put<AdminUser>(`${BASE}/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`, {
    headers: getAuthHeaders(),
  });
};

export const getUserStats = async (): Promise<UserStats> => {
  const users = await getAllUsers();
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const total = users.length;
  const active = users.filter((u) => u.status === 'active').length;
  const inactive = users.filter((u) => u.status === 'inactive').length;
  const banned = users.filter((u) => u.status === 'banned').length;
  const admins = users.filter((u) => u.role === 'admin').length;
  const newThisMonth = users.filter((u) => {
    const created = new Date(u.createdAt);
    return created >= firstOfMonth;
  }).length;

  return { total, active, inactive, banned, admins, newThisMonth };
};

export const AdminUserService = {
  getAll: getAllUsers,
  getById: getUserById,
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  getStats: getUserStats,
};
