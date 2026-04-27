import React, { Suspense } from 'react'
import SearchPage from '@/modules/client/search/components/SearchPage'

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SearchPage />
    </Suspense>
  )
}

