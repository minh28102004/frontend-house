import axios from 'axios';

import { config } from "@/config/config";
import { API_URL_CLIENT } from "@/config/apiRoutes";

const API_URL = API_URL_CLIENT + config.ROUTES.IMAGES.BASE;

export interface ImageResponse {
  _id: string;
  originalName: string;
  imageUrl: string;
  location: string;
  slug: string;
  alt: string;
  caption?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedImageResponse {
  images: ImageResponse[];
  total: number;
  hasMore: boolean;
}

export interface ImageUpdateDto {
  alt?: string;
  caption?: string;
  description?: string;
}

export const imagesService = {
  // Lấy ảnh theo trang
  getAllImages: async (page: number = 1, limit: number = 60): Promise<PaginatedImageResponse> => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          page,
          limit
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Upload một ảnh
  uploadImage: async (file: File): Promise<ImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Upload nhiều ảnh
  uploadMultipleImages: async (files: File[]): Promise<ImageResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axios.post(`${API_URL}/upload-multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Xóa ảnh theo slug
  deleteImage: async (slug: string): Promise<void> => {
    await axios.delete(`${API_URL}/${slug}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },

  // Cập nhật thông tin ảnh
  updateImage: async (slug: string, data: ImageUpdateDto): Promise<ImageResponse> => {
    const response = await axios.patch(`${API_URL}/${slug}`, data, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Upload ảnh cho SunEditor
  uploadEditorImage: async (file: File): Promise<ImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/sunEditor`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
};