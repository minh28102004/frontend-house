import api from '@/config/api';
import { API_URL_CLIENT } from "@/config/apiRoutes";
import { config } from "@/config/config";

const VIDEO_UPLOAD_API = API_URL_CLIENT + config.ROUTES.VIDEOS.BASE;

export interface VideoResponse {
  _id: string;
  originalName: string;
  videoUrl: string;
  location: string;
  slug: string;
  alt: string;
  caption: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Cấu hình mặc định cho việc xử lý video
const videoConfig = {
  maxFileSize: 5 * 1024 * 1024 * 1024, // 5GB
  supportedFormats: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  chunkSize: 3, // Số lượng video upload cùng lúc
  timeout: 6000000, // 10 phút timeout cho video upload
};

const videoService = {
  /**
   * Kiểm tra file video hợp lệ
   */
  validateVideoFile: (file: File): { isValid: boolean; error?: string } => {
    // Kiểm tra kích thước file
    if (file.size > videoConfig.maxFileSize) {
      return {
        isValid: false,
        error: `Kích thước file quá lớn (tối đa ${(videoConfig.maxFileSize / 1024 / 1024 / 1024).toFixed(2)}GB)`
      };
    }

    // Kiểm tra định dạng file
    if (!videoConfig.supportedFormats.includes(file.type)) {
      return {
        isValid: false,
        error: `Định dạng file không được hỗ trợ. Hỗ trợ: ${videoConfig.supportedFormats.join(', ')}`
      };
    }

    return { isValid: true };
  },

  /**
   * Upload a single video file
   */
  uploadVideo: async (file: File, opts?: { uploadId?: string }): Promise<VideoResponse> => {
    const formData = new FormData();

    try {
      // Kiểm tra file trước khi upload
      const validation = videoService.validateVideoFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      formData.append('file', file);

      // Tạo URL với uploadId query parameter
      let uploadUrl = VIDEO_UPLOAD_API + '/upload';
      if (opts?.uploadId) {
        uploadUrl += `?uploadId=${encodeURIComponent(opts.uploadId)}`;
      }

      const response = await api.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        timeout: videoConfig.timeout,
      });

      return response.data;
    } catch (error: any) {
      console.error("Lỗi upload video:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Upload multiple video files (up to 10)
   */
  uploadMultipleVideos: async (files: File[]): Promise<VideoResponse[]> => {
    if (!files.length) {
      return [];
    }

    if (files.length > 10) {
      throw new Error('Chỉ có thể upload tối đa 10 video một lần');
    }

    try {
      // Kiểm tra từng file
      for (const file of files) {
        const validation = videoService.validateVideoFile(file);
        if (!validation.isValid) {
          throw new Error(`File ${file.name}: ${validation.error}`);
        }
      }

      // Chia thành các nhóm nhỏ nếu có nhiều video
      const uploadResults = [];
      const chunkSize = videoConfig.chunkSize;

      for (let i = 0; i < files.length; i += chunkSize) {
        const chunk = files.slice(i, i + chunkSize);

        const formData = new FormData();
        chunk.forEach(file => {
          formData.append('files', file);
        });

        const response = await api.post(VIDEO_UPLOAD_API + '/upload-multiple', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: videoConfig.timeout,
        });

        // Xử lý kết quả từ server
        let chunkResults;
        if (typeof response.data === 'string') {
          try {
            chunkResults = JSON.parse(response.data);
          } catch (e) {
            console.error("Failed to parse response string as JSON:", e);
            throw new Error("Invalid response format from server");
          }
        } else {
          chunkResults = response.data;
        }

        // Đảm bảo chúng ta có một mảng
        if (!Array.isArray(chunkResults)) {
          if (chunkResults && typeof chunkResults === 'object' && Array.isArray(chunkResults.data)) {
            chunkResults = chunkResults.data;
          } else {
            console.error("Invalid response format:", chunkResults);
            throw new Error("Expected array of videos but got: " + typeof chunkResults);
          }
        }

        // Xử lý từng kết quả
        const processedChunkResults = chunkResults.map((video: any, index: number) => {
          // Nếu video là chuỗi, giả định đó là URL
          if (typeof video === 'string') {
            const pathOnly = video.replace(/^https?:\/\/[^\/]+/i, '');
            return {
              _id: `generated_${index}`,
              originalName: `video_${index}.mp4`,
              videoUrl: pathOnly,
              location: pathOnly,
              slug: `video_${index}`,
              alt: `video_${index}`,
              caption: '',
              description: '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }

          // Nếu video là null hoặc không phải đối tượng, xử lý lỗi
          if (!video || typeof video !== 'object') {
            console.error(`Video response ${index} is invalid:`, video);
            throw new Error(`Invalid video response at index ${index}`);
          }

          // Trích xuất URL
          let url = null;
          if (video.videoUrl) url = video.videoUrl;
          else if (video.location) url = video.location;
          else if (video.url) url = video.url;
          else if (video.path) url = video.path;
          else if (video.src) url = video.src;
          else if (video.data && video.data.url) url = video.data.url;

          if (!url || url === 'undefined') {
            console.error(`No valid URL found in video response ${index}:`, video);
            throw new Error(`Missing URL in video response at index ${index}`);
          }

          // Đảm bảo URL là chuỗi và loại bỏ phần domain
          const urlString = String(url);
          const pathOnly = urlString.replace(/^https?:\/\/[^\/]+/i, '');

          // Trả về đối tượng chuẩn hóa
          return {
            ...video,
            videoUrl: pathOnly,
            location: pathOnly,
            _id: video._id || `generated_${index}`,
            originalName: video.originalName || `video_${index}.mp4`,
            slug: video.slug || `video_${index}`,
            alt: video.alt || `video_${index}`,
            caption: video.caption || '',
            description: video.description || '',
            createdAt: video.createdAt || new Date().toISOString(),
            updatedAt: video.updatedAt || new Date().toISOString()
          };
        });

        uploadResults.push(...processedChunkResults);
      }

      return uploadResults;
    } catch (error: any) {
      console.error('Lỗi upload video:', error);

      if (error.response) {
        console.error('Chi tiết lỗi:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }

      error.videoData = {
        message: "Lỗi khi xử lý upload video",
        error: error.message
      };

      throw error;
    }
  },

  /**
   * Upload a video for the SunEditor
   */
  uploadEditorVideo: async (file: File, opts?: { uploadId?: string }): Promise<VideoResponse> => {
    const formData = new FormData();

    try {
      // Kiểm tra file trước khi upload
      const validation = videoService.validateVideoFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      formData.append('file', file);

      // Tạo URL với uploadId query parameter
      let uploadUrl = VIDEO_UPLOAD_API + '/sunEditor';
      if (opts?.uploadId) {
        uploadUrl += `?uploadId=${encodeURIComponent(opts.uploadId)}`;
      }

      const response = await api.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        timeout: videoConfig.timeout,
      });

      return response.data;
    } catch (error: any) {
      console.error("Error uploading editor video:", error);
      throw error;
    }
  },

  /**
   * Get all videos with pagination
   */
  getAllVideos: async (page: number = 1, limit: number = 40): Promise<{
    videos: VideoResponse[];
    total: number;
    hasMore: boolean;
  }> => {
    try {
      const response = await api.get(`${VIDEO_UPLOAD_API}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  },

  /**
   * Delete a video by slug
   */
  deleteVideo: async (slug: string): Promise<any> => {
    try {
      const response = await api.delete(`${VIDEO_UPLOAD_API}/${slug}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },
};

export default videoService;