import api from '@/config/api';
import { API_URL_CLIENT } from '@/config/apiRoutes';
import { config } from '@/config/config';
import { CreateTagDto, Tag, UpdateTagDto } from '../models/tag.model';

const API_URL = API_URL_CLIENT + config.ROUTES.TAGS.BASE;

export const TagService = {
  getAll: async (): Promise<{ message: string; data: Tag[]; total: number }> => {
    const res = await api.get(API_URL);
    return res.data;
  },
  create: async (dto: CreateTagDto): Promise<{ message: string; data: Tag }> => {
    const res = await api.post(API_URL, dto, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  },
  update: async (slug: string, dto: UpdateTagDto): Promise<{ message: string; data: Tag }> => {
    const res = await api.patch(`${API_URL}/${slug}`, dto, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  },
  remove: async (slug: string): Promise<{ message: string }> => {
    const res = await api.delete(`${API_URL}/${slug}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  },
}; 