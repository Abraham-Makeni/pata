'use client'
import { useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'
import { Provider } from '@/lib/data'
import { NAIROBI_CENTER } from '@/lib/location'
import StarRating from '@/components/ui/StarRating'
import { MapErrorBoundary } from '@/components/ui/ErrorBoundary'

interface MapViewProps {
  providers: Provider[]
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  onProviderClick?: (provider: Provider) => void
  showProviderInfo?: boolean
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const options = {
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f7' }],
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#616161' }],
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#f5f5f7' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#c9c9c9' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#eeeeee' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
}

export default function MapView({ 
  providers, 
  center = NAIROBI_CENTER, 
  zoom = 13,
  height = '400px',
  onProviderClick,
  showProviderInfo = true 
}: MapViewProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Don't even try to load maps if no API key is provided
  if (!apiKey) {
    return (
      <div 
        className="bg-stone-100 rounded-2xl flex flex-col items-center justify-center text-center p-6"
        style={{ height }}
      >
        <div className="text-3xl mb-3">🗺️</div>
        <div className="text-stone-500 text-sm mb-2">Map unavailable</div>
        <div className="text-xs text-stone-400 max-w-[200px]">
          Google Maps API key is required to display maps
        </div>
      </div>
    )
  }

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })

  if (loadError) {
    return (
      <div 
        className="bg-stone-100 rounded-2xl flex flex-col items-center justify-center text-center p-6"
        style={{ height }}
      >
        <div className="text-3xl mb-3">🗺️</div>
        <div className="text-stone-500 text-sm mb-2">Unable to load map</div>
        <div className="text-xs text-stone-400 max-w-[200px]">
          Check your internet connection or API key configuration
        </div>
      </div>
    )
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMarkerClick = useCallback((provider: Provider) => {
    setSelectedProvider(provider)
    if (onProviderClick) {
      onProviderClick(provider)
    }
  }, [onProviderClick])

  const createCustomMarkerIcon = (provider: Provider) => {
    const isVerified = provider.verified
    const rating = provider.rating
    
    // Create a simple marker icon with provider info
    return {
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: isVerified ? '#1a1a1a' : '#6b7280',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 1.5,
      anchor: new google.maps.Point(12, 24),
      labelOrigin: new google.maps.Point(12, 10),
    }
  }

  return (
    <MapErrorBoundary>
      <div className="relative rounded-2xl overflow-hidden" style={{ height }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={options}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {providers.map((provider) => (
            <Marker
              key={provider.id}
              position={provider.coordinates}
              icon={createCustomMarkerIcon(provider)}
              onClick={() => handleMarkerClick(provider)}
              label={{
                text: provider.rating.toFixed(1),
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            />
          ))}

        {selectedProvider && showProviderInfo && (
          <InfoWindow
            position={selectedProvider.coordinates}
            onCloseClick={() => setSelectedProvider(null)}
          >
            <div className="bg-white p-3 rounded-xl shadow-lg min-w-[200px]">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedProvider.image} 
                    alt={selectedProvider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-stone-900 truncate">
                    {selectedProvider.name}
                  </h3>
                  <p className="text-xs text-stone-500 truncate">
                    {selectedProvider.specialty}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={selectedProvider.rating} size="sm" />
                    <span className="text-xs text-stone-500">
                      ({selectedProvider.reviewCount})
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-stone-900 mt-1">
                    From KSh {selectedProvider.startingPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedProvider.verified && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                    ✓ Verified
                  </span>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      </div>
    </MapErrorBoundary>
  )
}
