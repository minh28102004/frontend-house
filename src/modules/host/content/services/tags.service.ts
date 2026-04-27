import { API_URL_CLIENT } from '@/config/apiRoutes';

const API_BASE = `${API_URL_CLIENT}/api/host-tags`;

interface RequestOptions {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method: options.method || 'GET',
    headers,
    body: options.body,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface HostTag {
  _id?: string;
  name: string;
  slug: string;
  usageCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateHostTagDto {
  name: string;
  slug?: string;
}

export interface UpdateHostTagDto {
  name?: string;
  slug?: string;
}

export const tagsService = {
  getAll: async (): Promise<{ message: string; data: HostTag[]; total: number }> => {
    return request<{ message: string; data: HostTag[]; total: number }>(API_BASE);
  },

  create: async (dto: CreateHostTagDto): Promise<{ message: string; data: HostTag }> => {
    return request<{ message: string; data: HostTag }>(API_BASE, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  update: async (slug: string, dto: UpdateHostTagDto): Promise<{ message: string; data: HostTag }> => {
    return request<{ message: string; data: HostTag }>(`${API_BASE}/${encodeURIComponent(slug)}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  remove: async (slug: string): Promise<{ message: string }> => {
    return request<{ message: string }>(`${API_BASE}/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
    });
  },
};

export default tagsService;
