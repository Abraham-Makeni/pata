'use client'

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState, useCallback } from 'react'
import Link from 'next/link'

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

// Default center (Nairobi)
const defaultCenter = {
  lat: -1.2921,
  lng: 36.8219,
}

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
}

// Provider marker icon
const markerIcon = {
  path: 'M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
  fillColor: '#0a0a0a',
  fillOpacity: 1,
  strokeColor: '#ffffff',
  strokeWeight: 2,
  scale: 1.5,
}

interface MapProps {
  providers: Array<{
    id: string
    name: string
    location: string
    rating: number
    startingPrice: number
    tags: string[]
    coordinates?: {
      lat: number
      lng: number
    }
  }>
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  showInfoWindow?: boolean
  onMarkerClick?: (providerId: string) => void
}

export default function ProviderMap({
  providers,
  center = defaultCenter,
  zoom = 13,
  height = '100%',
  showInfoWindow = true,
  onMarkerClick,
}: MapProps) {
  const [selectedProvider, setSelectedProvider] = useState<any>(null)

  const onMarkerClickHandler = useCallback((provider: any) => {
    setSelectedProvider(provider)
    onMarkerClick?.(provider.id)
  }, [onMarkerClick])

  // Filter providers that have coordinates
  const providersWithCoords = providers.filter(p => p.coordinates)

  return (
    <GoogleMap
      mapContainerStyle={{ ...mapContainerStyle, height }}
      center={center}
      zoom={zoom}
      options={mapOptions}
    >
      {providersWithCoords.map((provider) => (
        <Marker
          key={provider.id}
          position={provider.coordinates!}
          icon={markerIcon}
          onClick={() => onMarkerClickHandler(provider)}
        />
      ))}

      {showInfoWindow && selectedProvider && (
        <InfoWindow
          position={selectedProvider.coordinates!}
          onCloseClick={() => setSelectedProvider(null)}
        >
          <div className="p-2 min-w-[180px]">
            <Link href={`/profile/${selectedProvider.id}`}>
              <h3 className="font-semibold text-sm text-gray-900 hover:text-blue-600">
                {selectedProvider.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-1">{selectedProvider.location}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium">★ {selectedProvider.rating}</span>
              <span className="text-xs text-gray-500">From KSh {selectedProvider.startingPrice}</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

// Lazy-loaded map wrapper
const mapLib = {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
}

export { mapLib }