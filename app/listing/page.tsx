'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import ProviderCard from '@/components/cards/ProviderCard'
import { ProviderCardSkeleton } from '@/components/ui/Skeletons'
import { CATEGORIES, PROVIDERS, getProvidersByCategory, calculateDistance } from '@/lib/data'
import { useLocationStore } from '@/store/location'

// Dynamically import MapView for performance
const MapView = dynamic(() => import('@/components/map/MapView'), {
  loading: () => (
    <div className="h-[400px] bg-stone-100 rounded-2xl flex items-center justify-center">
      <div className="text-stone-500 text-sm">Loading map...</div>
    </div>
  ),
  ssr: false,
})

const SORT_OPTIONS = ['All', '4.5+ Stars', 'Verified Only', 'KSh 0–1K', 'KSh 1K–5K', 'Premium']
const LOCATIONS   = ['All Areas', 'Nairobi CBD', 'Westlands', 'Kilimani', 'Karen', 'Lavington']
const DISTANCES   = ['Any Distance', 'Within 1km', 'Within 3km', 'Within 5km', 'Within 10km']

function ListingContent() {
  const searchParams = useSearchParams()
  const categoryId   = searchParams.get('category') ?? ''
  const category     = CATEGORIES.find(c => c.id === categoryId)

  const [activeSort, setActiveSort]   = useState('All')
  const [activeLoc,  setActiveLoc]    = useState('All Areas')
  const [activeDist, setActiveDist]  = useState('Any Distance')
  const [viewMode, setViewMode]       = useState<'list' | 'map'>('list')
  
  const { userLocation } = useLocationStore()

  const baseList = categoryId ? getProvidersByCategory(categoryId) : PROVIDERS

  const filtered = baseList.filter(p => {
    const sortOk =
      activeSort === 'All'         ? true :
      activeSort === '4.5+ Stars'  ? p.rating >= 4.5 :
      activeSort === 'Verified Only' ? p.verified :
      activeSort === 'KSh 0–1K'   ? p.startingPrice < 1000 :
      activeSort === 'KSh 1K–5K'  ? p.startingPrice >= 1000 && p.startingPrice < 5000 :
      activeSort === 'Premium'     ? p.startingPrice >= 5000 : true

    const locOk = activeLoc === 'All Areas' || p.location === activeLoc
    
    // Distance calculation from Nairobi CBD
    const distance = calculateDistance(-1.2921, 36.8219, p.coordinates.lat, p.coordinates.lng)
    const distOk = 
      activeDist === 'Any Distance' ? true :
      activeDist === 'Within 1km'   ? distance <= 1 :
      activeDist === 'Within 3km'   ? distance <= 3 :
      activeDist === 'Within 5km'   ? distance <= 5 :
      activeDist === 'Within 10km'  ? distance <= 10 : true
    
    return sortOk && locOk && distOk
  })

  return (
    <div className="min-h-screen bg-chalk">
      <Navbar
        showBack
        backHref="/home"
        title={category?.name ?? 'All Providers'}
        rightSlot={<span />}
      />

      {/* Category info */}
      {category && (
        <div className="px-5 py-3 border-b border-stone-100">
          <p className="text-stone-500 text-[13px]">
            {category.count}+ providers · {category.description}
          </p>
        </div>
      )}

      {/* Sort chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-3 snap-scroll border-b border-stone-100">
        {SORT_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setActiveSort(s)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition-all flex-shrink-0
              ${activeSort === s
                ? 'bg-ink text-chalk border-ink'
                : 'bg-white text-ink border-stone-200 hover:border-stone-400'
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Location chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-2.5 snap-scroll border-b border-stone-100">
        {LOCATIONS.map(l => (
          <button
            key={l}
            onClick={() => setActiveLoc(l)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition-all flex-shrink-0
              ${activeLoc === l
                ? 'bg-stone-800 text-chalk border-stone-800'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
          >
            📍 {l}
          </button>
        ))}
      </div>

      {/* Distance chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-2.5 snap-scroll border-b border-stone-100">
        {DISTANCES.map(d => (
          <button
            key={d}
            onClick={() => setActiveDist(d)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition-all flex-shrink-0
              ${activeDist === d
                ? 'bg-green-600 text-chalk border-green-600'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
          >
            📏 {d}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2 px-5 py-2.5 border-b border-stone-100">
        <button
          onClick={() => setViewMode('list')}
          className={`flex-1 px-3.5 py-2 rounded-xl text-[13px] font-medium border transition-all
            ${viewMode === 'list'
              ? 'bg-ink text-chalk border-ink'
              : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
        >
          📋 List View
        </button>
        <button
          onClick={() => setViewMode('map')}
          className={`flex-1 px-3.5 py-2 rounded-xl text-[13px] font-medium border transition-all
            ${viewMode === 'map'
              ? 'bg-ink text-chalk border-ink'
              : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
        >
          🗺️ Map View
        </button>
      </div>

      {/* Results */}
      {viewMode === 'list' ? (
        <div className="px-5 py-4 space-y-3">
          <p className="text-[12px] text-stone-400 font-medium mb-1">
            {filtered.length} {filtered.length === 1 ? 'provider' : 'providers'} found
          </p>
          {filtered.length > 0
            ? filtered.map(p => <ProviderCard key={p.id} provider={p} />)
            : (
              <div className="text-center py-16 text-stone-400">
                <p className="text-3xl mb-3">🔍</p>
                <p className="font-medium">No providers found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )
          }
        </div>
      ) : (
        <div className="px-5 py-4">
          <p className="text-[12px] text-stone-400 font-medium mb-3">
            {filtered.length} {filtered.length === 1 ? 'provider' : 'providers'} on map
          </p>
          {filtered.length > 0 ? (
            <div className="space-y-4">
              <MapView 
                providers={filtered}
                center={userLocation || { lat: -1.2921, lng: 36.8219 }}
                height="calc(100vh - 300px)"
                onProviderClick={(provider) => {
                  // Could add navigation to provider profile or show details
                  console.log('Provider clicked:', provider)
                }}
              />
              {/* Optional: Bottom sheet with provider cards */}
              <div className="max-h-48 overflow-y-auto space-y-2 pb-4">
                <p className="text-[11px] text-stone-500 font-medium mb-2">Providers on map:</p>
                {filtered.slice(0, 3).map(p => (
                  <div key={p.id} className="bg-white border border-stone-200 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-stone-500 truncate">{p.specialty}</p>
                    </div>
                    <p className="text-xs font-semibold text-stone-900">
                      KSh {p.startingPrice.toLocaleString()}
                    </p>
                  </div>
                ))}
                {filtered.length > 3 && (
                  <p className="text-xs text-stone-400 text-center">
                    +{filtered.length - 3} more providers
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <p className="text-3xl mb-3">🗺️</p>
              <p className="font-medium">No providers found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ListingPage() {
  return (
    <Suspense fallback={
      <div className="px-5 py-4 space-y-3">
        {[1,2,3,4].map(i => <ProviderCardSkeleton key={i} />)}
      </div>
    }>
      <ListingContent />
    </Suspense>
  )
}
