"use client";

import { useEffect, useState } from 'react'
import { ClientProductBasic } from '../models/product.model'
import { ClientProductsService } from '../services/product.service'

export const useProducts = (slug: string) => {
  const [data, setData] = useState<ClientProductBasic | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(null)
    ClientProductsService.getBySlug(slug)
      .then((product) => {
        if (!active) return
        setData(product)
      })
      .catch((e: any) => {
        if (!active) return
        setError(e?.message || 'Lỗi tải sản phẩm')
      })
      .finally(() => {
        if (!active) return
        setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [slug])

  return { data, isLoading, error }
}

