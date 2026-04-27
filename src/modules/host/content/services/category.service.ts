import { HostContentCategory, CreateCategoryData, UpdateCategoryData } from '../types';
import { API_URL_CLIENT } from '@/config/apiRoutes';

const CATEGORY_API = `${API_URL_CLIENT}/api/categories-posts/host`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
});

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Lỗi máy chủ' }));
    throw new Error(error.message || 'Lỗi máy chủ');
  }
  return response.json();
};

export const HostCategoryService = {
  getAll: async (): Promise<{ data: HostContentCategory[] }> => {
    const response = await fetch(CATEGORY_API, { headers: getHeaders() });
    return handleResponse(response);
  },

  getById: async (id: string): Promise<HostContentCategory> => {
    const response = await fetch(`${CATEGORY_API}/${id}`, { headers: getHeaders() });
    return handleResponse(response);
  },

  create: async (data: CreateCategoryData): Promise<HostContentCategory> => {
    const response = await fetch(CATEGORY_API, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: UpdateCategoryData): Promise<HostContentCategory> => {
    const response = await fetch(`${CATEGORY_API}/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${CATEGORY_API}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  toggleActive: async (id: string): Promise<HostContentCategory> => {
    const response = await fetch(`${CATEGORY_API}/${id}/toggle`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  reorder: async (orderedIds: string[]): Promise<void> => {
    const response = await fetch(`${CATEGORY_API}/reorder`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ orderedIds }),
    });
    return handleResponse(response);
  },
};
