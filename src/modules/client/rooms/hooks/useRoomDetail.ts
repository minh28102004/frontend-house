"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { BackendRoom } from '../services/rooms.service';

export interface RoomDetail {
  _id: string;
  num: string;
  concept: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  thumbnail: string;
  gallery: string[];
  isVisible: boolean;
}

export function useRoomDetail() {
  const params = useParams();
  const concept = params.concept as string;

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(async () => {
    if (!concept) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/roomsapi/${encodeURIComponent(concept)}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Phòng không tồn tại');
        } else {
          setError('Không thể tải thông tin phòng');
        }
        return;
      }
      const data: BackendRoom = await res.json();
      setRoom(data as RoomDetail);
    } catch {
      setError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [concept]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  return { room, loading, error, refetch: fetchRoom };
}
