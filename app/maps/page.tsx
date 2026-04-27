'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { PROVIDERS, CATEGORIES } from '@/lib/data'
import { useMapStore } from '@/store/map'

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

// Nairobi center
const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219,
}

// Map options
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: 'greedy',
}

// Custom marker icon
const createMarkerIcon = (category: string) => {
  const colors: Record<string, string> = {
    'barbers': '#0a0a0a',
    'hair-stylists': '#8B5CF6',
    'nail-techs': '#EC4899',
    'makeup-artists': '#F43F5E',
    'photographers': '#0EA5E9',
    'tattoo-artists': '#10B981',
  }
  
  return {
    path: 'M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
    fillColor: colors[category] || '#0a0a0a',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: 1.5,
  }
}

const categoryColors: Record<string, string> = {
  'barbers': 'bg-black',
  'hair-stylists': 'bg-purple-500',
  'nail-techs': 'bg-pink-500',
  'makeup-artists': 'bg-rose-500',
  'photographers': 'bg-sky-500',
  'tattoo-artists': 'bg-emerald-500',
}

export default function MapsPage() {
  const [selectedProvider, setSelectedProvider] = useState<any>(null)
  const [showList, setShowList] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  
  const { userLocation, locationLoading, locationError, detectUserLocation, setMapCenter } = useMapStore()

  // Filter providers by category
  const filteredProviders = useMemo(() => {
    if (activeCategory === 'all') return PROVIDERS
    return PROVIDERS.filter(p => p.category === activeCategory)
  }, [activeCategory])

  // Providers with coordinates
  const providersWithCoords = useMemo(() => 
    filteredProviders.filter(p => p.coordinates),
  [filteredProviders])

  const onMarkerClick = useCallback((provider: any) => {
    setSelectedProvider(provider)
  }, [])

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setSelectedProvider(null)
    
    // Center map on first provider of that category
    if (categoryId !== 'all') {
      const firstProvider = PROVIDERS.find(p => p.category === categoryId && p.coordinates)
      if (firstProvider?.coordinates) {
        setMapCenter(firstProvider.coordinates)
      }
    }
  }

  return (
    <div className="min-h-screen bg-surface-soft pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface-soft/95 backdrop-blur-sm border-b border-surface-border">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-serif text-xl font-semibold text-ink">Explore</h1>
            <button 
              onClick={detectUserLocation}
              disabled={locationLoading}
              className="w-9 h-9 rounded-full bg-white border border-surface-border flex items-center justify-center text-sm tap-effect"
            >
              {locationLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>📍</span>
              )}
            </button>
          </div>
          
          {/* Location status */}
          {userLocation && (
            <p className="text-xs text-green-600 mb-2">✓ Your location detected</p>
          )}
          {locationError && (
            <p className="text-xs text-orange-500 mb-2">{locationError}</p>
          )}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === 'all' 
                ? 'bg-ink text-white' 
                : 'bg-white text-ink-secondary border border-surface-border'
            }`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id 
                  ? categoryColors[cat.id] + ' text-white' 
                  : 'bg-white text-ink-secondary border border-surface-border'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map / List Toggle */}
      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-ink-muted">
          {providersWithCoords.length} providers found
        </p>
        <button
          onClick={() => setShowList(!showList)}
          className="text-xs font-medium text-ink-secondary underline"
        >
          {showList ? 'Show Map' : 'Show List'}
        </button>
      </div>

      {/* Map View */}
      {!showList && (
        <div className="h-[calc(100vh-220px)] relative">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={userLocation || defaultCenter}
              zoom={activeCategory === 'all' ? 12 : 14}
              options={mapOptions}
              className="h-full w-full"
            >
              {/* User location marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: '#3B82F6',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    scale: 1.2,
                  }}
                  title="Your Location"
                />
              )}

              {/* Provider markers */}
              {providersWithCoords.map((provider) => (
                <Marker
                  key={provider.id}
                  position={provider.coordinates!}
                  icon={createMarkerIcon(provider.category)}
                  onClick={() => onMarkerClick(provider)}
                />
              ))}

              {/* Info Window */}
              {selectedProvider && selectedProvider.coordinates && (
                <InfoWindow
                  position={selectedProvider.coordinates}
                  onCloseClick={() => setSelectedProvider(null)}
                >
                  <div className="p-2 min-w-[160px]">
                    <Link href={`/profile/${selectedProvider.id}`}>
                      <h3 className="font-semibold text-sm text-gray-900 hover:text-blue-600">
                        {selectedProvider.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedProvider.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs">★ {selectedProvider.rating}</span>
                      <span className="text-xs text-gray-500">From KSh {selectedProvider.startingPrice}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{selectedProvider.tags?.slice(0, 2).join(' · ')}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      {/* List View */}
      {showList && (
        <div className="px-4 pb-4 space-y-3">
          {filteredProviders.map(provider => (
            <Link key={provider.id} href={`/profile/${provider.id}`}>
              <div className="bg-white rounded-card p-3 flex gap-3 shadow-card tap-effect">
                <div className="w-14 h-14 rounded-xl bg-stone-100 flex-shrink-0 flex items-center justify-center text-2xl">
                  {CATEGORIES.find(c => c.id === provider.category)?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-sm">{provider.name}</p>
                    <span className="text-[10px] text-ink-muted flex-shrink-0 ml-2">{provider.location}</span>
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5 truncate">
                    {provider.tags?.slice(0, 2).join(' · ')}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs flex items-center gap-1">
                      <span className="star-gold">★</span>
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-ink-faint">({provider.reviewCount})</span>
                    </span>
                    <span className="text-xs font-semibold">KSh {provider.startingPrice}+</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}