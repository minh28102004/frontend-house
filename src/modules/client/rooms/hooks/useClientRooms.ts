'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Room } from '../models/rooms.model';
import { getAllRooms } from '../services/rooms.service';

interface FilterOption {
  id: string;
  label: string;
}

export function useClientRooms() {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rooms = await getAllRooms();
      setAllRooms(rooms);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách phòng';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const filters = useMemo<FilterOption[]>(() => {
    const concepts = Array.from(new Set(allRooms.map((r) => r.concept)));
    const items: FilterOption[] = [
      { id: 'all', label: 'Tất cả' },
      ...concepts.map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
    ];
    return items;
  }, [allRooms]);

  const getRoomsByFilter = useCallback(
    (filter: string): Room[] => {
      if (filter === 'all') return allRooms;
      return allRooms.filter((r) => r.concept === filter);
    },
    [allRooms],
  );

  return {
    allRooms,
    filters,
    loading,
    error,
    getRoomsByFilter,
    refetch: fetchRooms,
  };
}
