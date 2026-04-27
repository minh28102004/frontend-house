'use client'

import React, { useEffect, useState } from 'react'
import { API_URL_CLIENT, apiRoutes } from '@/config/apiRoutes'

interface Store {
  id: string
  name: string
  address: string
  phone: string
  email: string
  latitude?: number
  longitude?: number
  hours?: string
  embedUrl?: string
}

interface MapProps {
  stores?: Store[]
  height?: string
}

// Danh sach dia diem Another House
const defaultStores: Store[] = [
  {
    id: '1',
    name: 'Another House - Quan 1',
    address: '123 Nguyen Hue, Quan 1, TP. Ho Chi Minh',
    phone: '0901 113 179',
    email: 'cskh@anotherhouse.vn',
    latitude: 10.7769,
    longitude: 106.7009,
    hours: '24/7 Check-in'
  },
  {
    id: '2',
    name: 'Another House - Quan 3',
    address: '456 Vo Van Tan, Quan 3, TP. Ho Chi Minh',
    phone: '0901 113 179',
    email: 'cskh@anotherhouse.vn',
    latitude: 10.7831,
    longitude: 106.6909,
    hours: '24/7 Check-in'
  },
  {
    id: '3',
    name: 'Another House - Quan 7',
    address: '789 Nguyen Thi Thap, Quan 7, TP. Ho Chi Minh',
    phone: '0901 113 179',
    email: 'cskh@anotherhouse.vn',
    latitude: 10.7300,
    longitude: 106.7216,
    hours: '24/7 Check-in'
  },
  {
    id: '4',
    name: 'Another House - Quan 10',
    address: '321 Ly Thai To, Quan 10, TP. Ho Chi Minh',
    phone: '0901 113 179',
    email: 'cskh@anotherhouse.vn',
    latitude: 10.7736,
    longitude: 106.6679,
    hours: '24/7 Check-in'
  }
]

const Map: React.FC<MapProps> = ({
  stores,
  height = "600px"
}) => {
  const [fetchedStores, setFetchedStores] = useState<Store[]>(stores || [])
  const [selectedStore, setSelectedStore] = useState<Store>((stores || defaultStores)[0])

  // Tải danh sách cửa hàng đang hoạt động nếu không truyền props
  useEffect(() => {
    if (stores && stores.length) return
    const load = async () => {
      try {
        const res = await fetch(API_URL_CLIENT + apiRoutes.MAPS.GET_ACTIVE)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        // Chuẩn hóa id
        const normalized: Store[] = (Array.isArray(data) ? data : []).map((s: any) => ({
          id: s._id || s.id,
          name: s.name,
          address: s.address,
          phone: s.phone,
          email: s.email,
          latitude: s.latitude,
          longitude: s.longitude,
          hours: s.hours,
          embedUrl: s.embedUrl,
        }))
        if (normalized.length) {
          setFetchedStores(normalized)
          setSelectedStore(normalized[0])
        } else {
          setFetchedStores(defaultStores)
          setSelectedStore(defaultStores[0])
        }
      } catch (error) {
        console.error('Error loading maps:', error)
        setFetchedStores(defaultStores)
        setSelectedStore(defaultStores[0])
      }
    }
    load()
  }, [stores])

  // URL iframe: ưu tiên embedUrl; nếu không có thì dùng lat,lng; cuối cùng là địa chỉ
  const mapUrl = selectedStore.embedUrl && selectedStore.embedUrl.startsWith('http')
    ? selectedStore.embedUrl
    : (typeof selectedStore.latitude === 'number' && typeof selectedStore.longitude === 'number')
      ? `https://www.google.com/maps?q=${selectedStore.latitude},${selectedStore.longitude}&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&output=embed`

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store)
  }

  return (
    <div className="w-full bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 min-h-[600px]" style={{ minHeight: height }}>
        {/* Bản đồ - 60% (6/10) */}
        <div className="lg:col-span-6 w-full h-full">
          <div className="w-full h-full" style={{ height: '100%', minHeight: height }}>
            <iframe
              key={selectedStore.id}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Danh sách cửa hàng - 40% (4/10) */}
        <div className="lg:col-span-4 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Danh sách cửa hàng</h2>

            {/* Danh sách các cửa hàng */}
            <div className="space-y-3">
              {(stores || fetchedStores).map((store) => (
                <button
                  key={store.id}
                  onClick={() => handleStoreClick(store)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedStore.id === store.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <h4 className={`font-semibold mb-1 ${
                    selectedStore.id === store.id ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {store.name}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{store.address}</p>
                  {store.hours && (
                    <p className="text-xs text-gray-500 mt-1">Giờ: {store.hours}</p>
                  )}
                </button>
              ))}
            </div>

            {/* Thông tin cửa hàng được chọn - đưa xuống dưới danh sách */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6 border border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{selectedStore.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600">{selectedStore.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${selectedStore.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-gray-900">{selectedStore.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${selectedStore.email}`} className="text-gray-600 hover:text-gray-900">{selectedStore.email}</a>
                </div>
                {selectedStore.hours && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">Giờ mở cửa: {selectedStore.hours}</span>
                  </div>
                )}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStore.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Mở trong Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map