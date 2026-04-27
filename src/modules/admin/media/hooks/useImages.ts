import { useMutation, useInfiniteQuery, useQueryClient, UseMutationResult, InfiniteData } from '@tanstack/react-query';
import { imagesService, ImageResponse, PaginatedImageResponse, ImageUpdateDto } from '@/modules/admin/media/services/images.service';
import { toast } from '@/common/utils/toast';
import { useImages as useCommonImages } from '@/common/hooks/useImages';
import { ImageResponse as CommonImageResponse } from '@/common/services/imageService';

// Hàm chuyển đổi từ CommonImageResponse sang ImageResponse
const convertToAdminImageResponse = (commonResponse: CommonImageResponse): ImageResponse => {
  return {
    _id: commonResponse._id,
    originalName: commonResponse.originalName || commonResponse.filename,
    imageUrl: commonResponse.imageUrl,
    location: commonResponse.path,
    slug: commonResponse.slug,
    alt: commonResponse.alt || '',
    caption: commonResponse.caption,
    createdAt: commonResponse.createdAt,
    updatedAt: commonResponse.updatedAt
  };
};

export const useImages = () => {
  const queryClient = useQueryClient();
  const commonImageHook = useCommonImages();

  // Query để lấy ảnh với infinite scroll
  const {
    data,
    isLoading: isLoadingImages,
    error: imagesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedImageResponse, Error, InfiniteData<PaginatedImageResponse>, string[], number>({
    queryKey: ['images'],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await imagesService.getAllImages(pageParam, 60);
        return result;
      } catch (error: any) {
        console.error('Error fetching images:', error);
        if (error?.response?.status === 500) {
          return { images: [], total: 0, hasMore: false };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage: PaginatedImageResponse, allPages: PaginatedImageResponse[]): number | undefined => {
      if (!lastPage?.hasMore) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  // Tổng hợp tất cả ảnh từ các trang
  const images = data?.pages.flatMap(page => page.images) ?? [];

  // Mutation để upload một ảnh
  const {
    mutate: uploadImage,
    isPending: isUploading,
  } = useMutation<ImageResponse, Error, File>({
    mutationFn: async (file: File) => {
      const result = await commonImageHook.uploadImage(file);
      if (!result) throw new Error('Failed to upload image');
      return convertToAdminImageResponse(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Tải ảnh lên thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tải ảnh lên');
    },
  });

  // Mutation để upload nhiều ảnh
  const {
    mutate: uploadMultipleImages,
    isPending: isUploadingMultiple,
  } = useMutation<ImageResponse[], Error, File[]>({
    mutationFn: async (files: File[]) => {
      const results = await commonImageHook.uploadMultipleImages(files);
      if (!results.length) throw new Error('Failed to upload images');
      return results.map(convertToAdminImageResponse);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Tải các ảnh lên thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tải các ảnh lên');
    },
  });

  // Mutation để xóa ảnh
  const {
    mutate: deleteImage,
    isPending: isDeleting,
  }: UseMutationResult<void, Error, string> = useMutation({
    mutationFn: imagesService.deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Xóa ảnh thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi xóa ảnh');
    },
  });

  // Mutation để cập nhật thông tin ảnh
  const {
    mutate: updateImage,
    isPending: isUpdating,
  }: UseMutationResult<ImageResponse, Error, { slug: string; data: ImageUpdateDto }> = useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: ImageUpdateDto }) => {
      return imagesService.updateImage(slug, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Cập nhật ảnh thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi cập nhật ảnh');
    },
  });

  // Mutation để upload ảnh cho SunEditor
  const {
    mutate: uploadEditorImage,
    isPending: isUploadingEditor,
  } = useMutation<ImageResponse, Error, File>({
    mutationFn: async (file: File) => {
      const result = await commonImageHook.uploadEditorImage(file);
      if (!result) throw new Error('Failed to upload editor image');
      return convertToAdminImageResponse(result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Tải ảnh lên thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tải ảnh lên');
    },
  });

  return {
    // Data
    images,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,

    // Loading states
    isLoadingImages,
    isUploading,
    isUploadingMultiple,
    isDeleting,
    isUpdating,
    isUploadingEditor,

    // Error
    imagesError,

    // Methods
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    updateImage,
    uploadEditorImage,
  };
};
