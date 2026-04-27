"use client";

import { useState, useCallback } from "react";
import { hostImagesService } from "../services/images.service";
import { HostMediaImageResponse, HostMediaUpdateDto } from "../types";

export function useHostMedia() {
  const [images, setImages] = useState<HostMediaImageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const fetchImages = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await hostImagesService.getAllImages(pageNum, 60);
      
      if (pageNum === 1) {
        setImages(response.images);
      } else {
        setImages(prev => [...prev, ...response.images]);
      }
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const response = await hostImagesService.uploadImage(file);
      setImages(prev => [response, ...prev]);
      return response.imageUrl || response.location;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultipleImages = useCallback(async (files: File[]): Promise<string[]> => {
    try {
      setUploading(true);
      const responses = await hostImagesService.uploadMultipleImages(files);
      setImages(prev => [...responses, ...prev]);
      return responses.map(r => r.imageUrl || r.location);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
      return [];
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteImage = useCallback(async (slug: string): Promise<boolean> => {
    try {
      setDeleting(true);
      await hostImagesService.deleteImage(slug);
      setImages(prev => prev.filter(img => img.slug !== slug));
      setSelectedImages(prev => {
        const newSet = new Set(prev);
        return newSet;
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const updateImage = useCallback(async (
    slug: string,
    data: HostMediaUpdateDto
  ): Promise<boolean> => {
    try {
      setUpdating(true);
      const response = await hostImagesService.updateImage(slug, data);
      setImages(prev =>
        prev.map(img => (img.slug === slug ? response : img))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image");
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  const toggleSelect = useCallback((slug: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedImages(new Set());
  }, []);

  const selectAll = useCallback((slugs: string[]) => {
    setSelectedImages(new Set(slugs));
  }, []);

  return {
    images,
    loading,
    error,
    hasMore,
    page,
    uploading,
    deleting,
    updating,
    selectedImages,
    fetchImages,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    updateImage,
    toggleSelect,
    clearSelection,
    selectAll,
  };
}
