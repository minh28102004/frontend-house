'use client'

import { useState } from 'react';
import videoService, { VideoResponse } from '../services/video.service';

/**
 * Custom hook for video management
 *
 * @example
 * ```tsx
 * const {
 *   loading,
 *   error,
 *   videos,
 *   pagination,
 *   uploadVideo,
 *   uploadMultipleVideos,
 *   fetchAllVideos,
 *   loadMoreVideos,
 *   deleteVideo,
 *   clearError,
 *   resetVideos
 * } = useVideos();
 *
 * // Upload single video
 * const handleUpload = async (file: File) => {
 *   const result = await uploadVideo(file);
 *   if (result) {
 *     console.log('Video uploaded:', result);
 *   }
 * };
 *
 * // Fetch videos with pagination
 * useEffect(() => {
 *   fetchAllVideos(1, 20);
 * }, []);
 *
 * // Load more videos
 * const handleLoadMore = () => {
 *   if (pagination.hasMore) {
 *     loadMoreVideos(20);
 *   }
 * };
 * ```
 */
export const useVideos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    hasMore: boolean;
    currentPage: number;
  }>({
    total: 0,
    hasMore: false,
    currentPage: 1,
  });

  /**
   * Upload a single video
   */
  const uploadVideo = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const result = await videoService.uploadVideo(file);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload video');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload multiple videos
   */
  const uploadMultipleVideos = async (files: File[]) => {
    setLoading(true);
    setError(null);

    try {
      const results = await videoService.uploadMultipleVideos(files);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload videos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Upload a video for the editor
   */
  const uploadEditorVideo = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const result = await videoService.uploadEditorVideo(file);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload editor video');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all videos with pagination
   */
  const fetchAllVideos = async (page: number = 1, limit: number = 40) => {
    setLoading(true);
    setError(null);

    try {
      const results = await videoService.getAllVideos(page, limit);
      setVideos(results.videos);
      setPagination({
        total: results.total,
        hasMore: results.hasMore,
        currentPage: page,
      });
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      return {
        videos: [],
        total: 0,
        hasMore: false,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load more videos (for pagination)
   */
  const loadMoreVideos = async (limit: number = 40) => {
    if (!pagination.hasMore || loading) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = pagination.currentPage + 1;
      const results = await videoService.getAllVideos(nextPage, limit);

      setVideos(prev => [...prev, ...results.videos]);
      setPagination({
        total: results.total,
        hasMore: results.hasMore,
        currentPage: nextPage,
      });

      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more videos');
      return {
        videos: [],
        total: 0,
        hasMore: false,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a video by slug
   */
  const deleteVideo = async (slug: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await videoService.deleteVideo(slug);
      // Update the videos list after deletion
      setVideos(videos.filter(video => video.slug !== slug));
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1,
      }));
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete video');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Reset videos state
   */
  const resetVideos = () => {
    setVideos([]);
    setPagination({
      total: 0,
      hasMore: false,
      currentPage: 1,
    });
    setError(null);
  };

  return {
    loading,
    error,
    videos,
    pagination,
    uploadVideo,
    uploadMultipleVideos,
    uploadEditorVideo,
    fetchAllVideos,
    loadMoreVideos,
    deleteVideo,
    clearError,
    resetVideos,
  };
};

/**
 * Example component showing how to use the useVideos hook
 *
 * @example
 * ```tsx
 * import { useVideos } from '@/common/hooks/useVideos';
 *
 * const VideoManager = () => {
 *   const {
 *     loading,
 *     error,
 *     videos,
 *     pagination,
 *     uploadVideo,
 *     uploadMultipleVideos,
 *     fetchAllVideos,
 *     loadMoreVideos,
 *     deleteVideo,
 *     clearError,
 *     resetVideos
 *   } = useVideos();
 *
 *   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
 *     const files = event.target.files;
 *     if (files && files.length > 0) {
 *       if (files.length === 1) {
 *         await uploadVideo(files[0]);
 *       } else {
 *         await uploadMultipleVideos(Array.from(files));
 *       }
 *     }
 *   };
 *
 *   const handleLoadMore = () => {
 *     if (pagination.hasMore) {
 *       loadMoreVideos(20);
 *     }
 *   };
 *
 *   const handleDelete = async (slug: string) => {
 *     await deleteVideo(slug);
 *   };
 *
 *   useEffect(() => {
 *     fetchAllVideos(1, 20);
 *   }, []);
 *
 *   return (
 *     <div>
 *       <input
 *         type="file"
 *         multiple
 *         accept="video/*"
 *         onChange={handleFileUpload}
 *         disabled={loading}
 *       />
 *
 *       {error && (
 *         <div className="error">
 *           {error}
 *           <button onClick={clearError}>Clear Error</button>
 *         </div>
 *       )}
 *
 *       {loading && <div>Loading...</div>}
 *
 *       <div className="videos-grid">
 *         {videos.map((video) => (
 *           <div key={video._id} className="video-item">
 *             <video src={video.videoUrl} controls />
 *             <p>{video.originalName}</p>
 *             <button onClick={() => handleDelete(video.slug)}>
 *               Delete
 *             </button>
 *           </div>
 *         ))}
 *       </div>
 *
 *       {pagination.hasMore && (
 *         <button onClick={handleLoadMore} disabled={loading}>
 *           Load More
 *         </button>
 *       )}
 *
 *       <div className="pagination-info">
 *         Total: {pagination.total} |
 *         Current Page: {pagination.currentPage} |
 *         Has More: {pagination.hasMore ? 'Yes' : 'No'}
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */