import { useState, useCallback } from 'react';
import {
  tagsService,
  HostTag,
  CreateHostTagDto,
  UpdateHostTagDto,
} from './tags.service';
export type { HostTag, CreateHostTagDto, UpdateHostTagDto };

interface UseTagsReturn {
  tags: HostTag[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  createTag: (dto: CreateHostTagDto) => Promise<HostTag>;
  updateTag: (slug: string, dto: UpdateHostTagDto) => Promise<HostTag>;
  deleteTag: (slug: string) => Promise<void>;
  clearError: () => void;
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<HostTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tagsService.getAll();
      setTags(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách tag');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = useCallback(async (dto: CreateHostTagDto): Promise<HostTag> => {
    setLoading(true);
    setError(null);
    try {
      const res = await tagsService.create(dto);
      setTags((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      return res.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Tạo tag thất bại';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTag = useCallback(async (slug: string, dto: UpdateHostTagDto): Promise<HostTag> => {
    setLoading(true);
    setError(null);
    try {
      const res = await tagsService.update(slug, dto);
      setTags((prev) =>
        prev
          .map((t) => (t.slug === slug ? res.data : t))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      return res.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Cập nhật tag thất bại';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTag = useCallback(async (slug: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await tagsService.remove(slug);
      setTags((prev) => prev.filter((t) => t.slug !== slug));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Xóa tag thất bại';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { tags, loading, error, fetchTags, createTag, updateTag, deleteTag, clearError };
}

export default useTags;
