import axios from 'axios';

import { config } from "@/config/config";
import { API_URL_CLIENT } from "@/config/apiRoutes";
import { HostMediaImageResponse, HostMediaPaginatedResponse, HostMediaUpdateDto } from "../types";

const API_URL = API_URL_CLIENT + config.ROUTES.IMAGES.BASE;

const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
  };
};

export const hostImagesService = {
  getAllImages: async (page: number = 1, limit: number = 60): Promise<HostMediaPaginatedResponse> => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          page,
          limit,
        },
        headers: {
          ...getAuthHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  uploadImage: async (file: File): Promise<HostMediaImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
    });
    return response.data;
  },

  uploadMultipleImages: async (files: File[]): Promise<HostMediaImageResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axios.post(`${API_URL}/upload-multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeaders(),
      },
    });
    return response.data;
  },

  deleteImage: async (slug: string): Promise<void> => {
    await axios.delete(`${API_URL}/${slug}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  },

  updateImage: async (slug: string, data: HostMediaUpdateDto): Promise<HostMediaImageResponse> => {
    const response = await axios.patch(`${API_URL}/${slug}`, data, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.data;
  },
};
