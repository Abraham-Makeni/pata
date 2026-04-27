import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Coordinates } from '@/lib/location'
import { getUserLocation } from '@/lib/location'

export type LocationState = {
  userLocation: Coordinates | null
  locationPermission: 'granted' | 'denied' | 'prompt' | null
  isLoading: boolean
  error: string | null
  setUserLocation: (location: Coordinates | null) => void
  setLocationPermission: (permission: 'granted' | 'denied' | 'prompt' | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchUserLocation: () => Promise<void>
  clearLocation: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      userLocation: null,
      locationPermission: null,
      isLoading: false,
      error: null,

      setUserLocation: (location) => set({ userLocation: location }),
      setLocationPermission: (permission) => set({ locationPermission: permission }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      fetchUserLocation: async () => {
        const { isLoading, error, setLoading, setError, setUserLocation, setLocationPermission } = get()
        
        if (isLoading) return

        setLoading(true)
        setError(null)

        try {
          const location = await getUserLocation()
          
          if (location) {
            setUserLocation(location)
            setLocationPermission('granted')
          } else {
            // Check if we can determine the reason for failure
            if (!navigator.geolocation) {
              setError('Geolocation is not supported by your browser')
              setLocationPermission('denied')
            } else {
              setError('Unable to get your location')
              setLocationPermission('denied')
            }
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to get location'
          setError(errorMessage)
          setLocationPermission('denied')
        } finally {
          setLoading(false)
        }
      },

      clearLocation: () => set({ 
        userLocation: null, 
        error: null, 
        locationPermission: null 
      }),
    }),
    {
      name: 'pata-location-storage',
      partialize: (state) => ({
        locationPermission: state.locationPermission,
        // Don't persist userLocation as it should be fresh each session
      }),
    }
  )
)
