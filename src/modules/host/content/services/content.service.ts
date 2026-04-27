import type {
  HostContent,
  CreateContentData,
  UpdateContentData,
  ContentListResponse,
  ContentFilters,
} from '../types';
import { API_URL_CLIENT } from '@/config/apiRoutes';

const API_BASE = `${API_URL_CLIENT}/api/postsapi/host/me`;

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

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

function encodeSlug(slug: string) {
  return encodeURIComponent(slug);
}

export async function fetchHostContents(filters: ContentFilters = {}): Promise<ContentListResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));
  if (filters.status) params.append('status', filters.status);
  if (filters.search) params.append('search', filters.search);

  const queryString = params.toString();
  const endpoint = `${API_BASE}${queryString ? `?${queryString}` : ''}`;

  return request<ContentListResponse>(endpoint);
}

export async function fetchContentBySlug(slug: string): Promise<HostContent> {
  return request<HostContent>(`${API_BASE}/${encodeSlug(slug)}`);
}

export async function createContent(data: CreateContentData): Promise<HostContent> {
  return request<HostContent>(API_BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateContent(slug: string, data: UpdateContentData): Promise<HostContent> {
  return request<HostContent>(`${API_BASE}/${encodeSlug(slug)}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteContent(slug: string): Promise<void> {
  await request<{ success: boolean }>(`${API_BASE}/${encodeSlug(slug)}`, {
    method: 'DELETE',
  });
}

export async function publishContent(slug: string): Promise<HostContent> {
  return request<HostContent>(`${API_BASE}/${encodeSlug(slug)}/publish`, {
    method: 'POST',
  });
}

export async function unpublishContent(slug: string): Promise<HostContent> {
  return request<HostContent>(`${API_BASE}/${encodeSlug(slug)}/unpublish`, {
    method: 'POST',
  });
}

export const contentService = {
  fetchContents: fetchHostContents,
  getBySlug: fetchContentBySlug,
  create: createContent,
  update: updateContent,
  delete: deleteContent,
  publish: publishContent,
  unpublish: unpublishContent,
};

export default contentService;
