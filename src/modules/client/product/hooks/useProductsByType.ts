"use client";

import { useEffect, useMemo, useState } from 'react'
import { ClientProductBasic } from '../models/product.model'
import { ClientProductsService } from '../services/client.product.service'

export interface ProductsByTypeGroup {
  type: string
  products: ClientProductBasic[]
}

export const useProductsByType = () => {
  const [data, setData] = useState<ClientProductBasic[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    ClientProductsService.getAllBasicInfo()
      .then((all) => {
        if (!active) return
        const uniqueBySlug = Array.from(
          new Map((all || []).map((p) => [p.slug, p])).values()
        )
        setData(uniqueBySlug)
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
  }, [])

  const groups: ProductsByTypeGroup[] = useMemo(() => {
    const map = new Map<string, ClientProductBasic[]>()
    for (const p of data) {
      const key = (p.type || 'Khác').toLowerCase()
      const arr = map.get(key) || []
      arr.push(p)
      map.set(key, arr)
    }
    return Array.from(map.entries()).map(([type, products]) => ({ type, products }))
  }, [data])

  return { groups, isLoading, error }
}


