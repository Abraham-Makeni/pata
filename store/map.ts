import { create } from 'zustand'

interface MapState {
  // User location
  userLocation: { lat: number; lng: number } | null
  locationLoading: boolean
  locationError: string | null
  
  // Map center
  mapCenter: { lat: number; lng: number }
  mapZoom: number
  
  // Selected provider
  selectedProviderId: string | null
  
  // Actions
  setUserLocation: (location: { lat: number; lng: number } | null) => void
  setLocationLoading: (loading: boolean) => void
  setLocationError: (error: string | null) => void
  setMapCenter: (center: { lat: number; lng: number }) => void
  setMapZoom: (zoom: number) => void
  setSelectedProvider: (providerId: string | null) => void
  detectUserLocation: () => void
}

export const useMapStore = create<MapState>((set, get) => ({
  // Initial state
  userLocation: null,
  locationLoading: false,
  locationError: null,
  mapCenter: { lat: -1.2921, lng: 36.8219 }, // Nairobi CBD
  mapZoom: 13,
  selectedProviderId: null,

  // Actions
  setUserLocation: (location) => set({ userLocation: location }),
  setLocationLoading: (loading) => set({ locationLoading: loading }),
  setLocationError: (error) => set({ locationError: error }),
  setMapCenter: (center) => set({ mapCenter: center }),
  setMapZoom: (zoom) => set({ mapZoom: zoom }),
  setSelectedProvider: (providerId) => set({ selectedProviderId: providerId }),

  // Detect user location using browser Geolocation API
  detectUserLocation: () => {
    const { setUserLocation, setLocationLoading, setLocationError, setMapCenter } = get()
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(location)
        setMapCenter(location)
        setLocationLoading(false)
      },
      (error) => {
        let errorMessage = 'Unable to detect your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setLocationError(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    )
  },
}))