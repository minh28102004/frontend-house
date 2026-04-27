import api from '@/config/api';

const IMAGE_UPLOAD_API = '/api/imagesapi';

export interface UploadResponse {
  _id: string;
  imageUrl: string;
  originalName: string;
  slug: string;
}

export const uploadClientService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`${IMAGE_UPLOAD_API}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    return response.data;
  },
};
