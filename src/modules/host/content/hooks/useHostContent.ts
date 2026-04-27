'use client';

import { useState, useCallback } from 'react';
import {
  contentService,
  fetchHostContents,
  createContent,
  updateContent,
  deleteContent,
  publishContent,
  unpublishContent,
} from '../services/content.service';
import type {
  HostContent,
  CreateContentData,
  UpdateContentData,
  ContentListResponse,
  ContentFilters,
  ContentStatus,
} from '../types';

interface UseHostContentReturn {
  contents: HostContent[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchContents: (page?: number, status?: ContentStatus, search?: string) => Promise<void>;
  createContent: (data: CreateContentData) => Promise<HostContent>;
  updateContent: (slug: string, data: UpdateContentData) => Promise<HostContent>;
  deleteContent: (slug: string) => Promise<void>;
  publishContent: (slug: string) => Promise<HostContent>;
  unpublishContent: (slug: string) => Promise<HostContent>;
  clearError: () => void;
}

export function useHostContent(): UseHostContentReturn {
  const [contents, setContents] = useState<HostContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchContents = useCallback(
    async (page: number = 1, status?: ContentStatus, search?: string) => {
      setLoading(true);
      setError(null);
      try {
        const filters: ContentFilters = { page, limit: 10 };
        if (status) filters.status = status;
        if (search) filters.search = search;

        const response: ContentListResponse = await contentService.fetchContents(filters);
        setContents(response.data || []);
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch contents';
        setError(message);
        setContents([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createContentHandler = useCallback(async (data: CreateContentData): Promise<HostContent> => {
    setLoading(true);
    setError(null);
    try {
      const newContent = await contentService.create(data);
      setContents((prev) => [newContent, ...prev]);
      return newContent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create content';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContentHandler = useCallback(async (slug: string, data: UpdateContentData): Promise<HostContent> => {
    setLoading(true);
    setError(null);
    try {
      const updatedContent = await contentService.update(slug, data);
      setContents((prev) =>
        prev.map((content) => (content.slug === slug ? updatedContent : content))
      );
      return updatedContent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update content';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteContentHandler = useCallback(async (slug: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await contentService.delete(slug);
      setContents((prev) => prev.filter((content) => content.slug !== slug));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete content';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const publishContentHandler = useCallback(async (slug: string): Promise<HostContent> => {
    setLoading(true);
    setError(null);
    try {
      const publishedContent = await contentService.publish(slug);
      setContents((prev) =>
        prev.map((content) => (content.slug === slug ? publishedContent : content))
      );
      return publishedContent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to publish content';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unpublishContentHandler = useCallback(async (slug: string): Promise<HostContent> => {
    setLoading(true);
    setError(null);
    try {
      const unpublishedContent = await contentService.unpublish(slug);
      setContents((prev) =>
        prev.map((content) => (content.slug === slug ? unpublishedContent : content))
      );
      return unpublishedContent;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unpublish content';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    contents,
    loading,
    error,
    pagination,
    fetchContents,
    createContent: createContentHandler,
    updateContent: updateContentHandler,
    deleteContent: deleteContentHandler,
    publishContent: publishContentHandler,
    unpublishContent: unpublishContentHandler,
    clearError,
  };
}

export default useHostContent;
