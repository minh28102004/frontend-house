import { API_URL_CLIENT, apiRoutes } from '@/config/apiRoutes'

export interface AdminMapItem {
  _id?: string
  name: string
  address: string
  phone: string
  email: string
  latitude?: number
  longitude?: number
  hours?: string
  embedUrl?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

const MAPS_API = API_URL_CLIENT + apiRoutes.MAPS.BASE

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message || `Request failed: ${res.status}`)
  }
  return res.json()
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const MapsAdminService = {
  getAll: async (page = 1, limit = 10, isActive?: boolean) => {
    const url = API_URL_CLIENT + apiRoutes.MAPS.GET_ALL(page, limit, isActive)
    const res = await fetch(url)
    return handleResponse<{ data: AdminMapItem[]; total: number; page: number; totalPages: number }>(res)
  },
  getActive: async () => {
    const res = await fetch(API_URL_CLIENT + apiRoutes.MAPS.GET_ACTIVE)
    return handleResponse<AdminMapItem[]>(res)
  },
  getOne: async (id: string) => {
    const res = await fetch(API_URL_CLIENT + apiRoutes.MAPS.GET_BY_ID(id))
    return handleResponse<AdminMapItem>(res)
  },
  create: async (payload: Partial<AdminMapItem>) => {
    const res = await fetch(MAPS_API, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    return handleResponse<AdminMapItem>(res)
  },
  update: async (id: string, payload: Partial<AdminMapItem>) => {
    const res = await fetch(API_URL_CLIENT + apiRoutes.MAPS.UPDATE(id), {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    return handleResponse<AdminMapItem>(res)
  },
  remove: async (id: string) => {
    const res = await fetch(API_URL_CLIENT + apiRoutes.MAPS.DELETE(id), {
      method: 'DELETE',
      headers: authHeaders(),
    })
    return handleResponse<AdminMapItem>(res)
  },
}


