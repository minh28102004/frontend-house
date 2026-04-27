"use client";

import { useState, useEffect } from "react";
import {
  getFlashSales,
  getActiveFlashSales,
  getFlashSaleBySlug,
} from "../services/flash-sale.service";
import { FlashSale } from "../models/flash-sale.model";

/**
 * Hook để lấy danh sách flash sale
 */
export const useFlashSales = (
  page: number = 1,
  limit: number = 12,
  isActive?: boolean
) => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFlashSales(page, limit, isActive, signal);
        setFlashSales(response.data);
        setTotalPages(response.totalPages);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải danh sách flash sale!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [page, limit, isActive]);

  return { flashSales, loading, error, totalPages };
};

/**
 * Hook để lấy danh sách flash sale đang hoạt động
 */
export const useActiveFlashSales = () => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getActiveFlashSales(signal);
        setFlashSales(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải flash sale đang hoạt động!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  return { flashSales, loading, error };
};

/**
 * Hook để lấy chi tiết flash sale theo slug
 */
export const useFlashSaleBySlug = (slug: string | null) => {
  const [flashSale, setFlashSale] = useState<FlashSale | null>(null);
  const [loading, setLoading] = useState(!!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setFlashSale(null);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFlashSaleBySlug(slug, signal);
        setFlashSale(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Không thể tải thông tin flash sale!");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [slug]);

  return { flashSale, loading, error };
};

