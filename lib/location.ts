import { Provider } from './data'

export type Coordinates = {
  lat: number
  lng: number
}

/**
 * Get user's current location using browser geolocation API
 * @returns Promise<Coordinates | null>
 */
export function getUserLocation(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser')
      resolve(null)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        console.warn('Error getting user location:', error.message)
        resolve(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    )
  })
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1  
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Sort providers by distance from user location
 * @param providers Array of providers
 * @param userLocation User's coordinates
 * @returns Providers sorted by distance (closest first)
 */
export function sortProvidersByDistance(
  providers: Provider[],
  userLocation: Coordinates
): (Provider & { distance: number })[] {
  return providers
    .map(provider => ({
      ...provider,
      distance: getDistance(
        userLocation.lat,
        userLocation.lng,
        provider.coordinates.lat,
        provider.coordinates.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
}

/**
 * Get providers near a location within a specified radius
 * @param providers Array of providers
 * @param center Center coordinates
 * @param radiusKm Radius in kilometers
 * @returns Providers within the radius, sorted by distance
 */
export function getProvidersWithinRadius(
  providers: Provider[],
  center: Coordinates,
  radiusKm: number
): (Provider & { distance: number })[] {
  return sortProvidersByDistance(providers, center)
    .filter(provider => provider.distance <= radiusKm)
}

/**
 * Get "near you" providers (within 2km)
 * @param providers Array of providers  
 * @param userLocation User's coordinates
 * @returns Providers within 2km, sorted by distance
 */
export function getNearYouProviders(
  providers: Provider[],
  userLocation: Coordinates | null
): (Provider & { distance: number })[] {
  if (!userLocation) return []
  return getProvidersWithinRadius(providers, userLocation, 2)
}

/**
 * Default Nairobi coordinates for fallback
 */
export const NAIROBI_CENTER: Coordinates = {
  lat: -1.2921,
  lng: 36.8219,
}

/**
 * Generate Google Maps directions URL
 * @param destination Destination coordinates
 * @returns Google Maps directions URL
 */
export function getDirectionsUrl(destination: Coordinates): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`
}

/**
 * Generate Google Maps search URL for a location
 * @param query Search query
 * @returns Google Maps search URL
 */
export function getMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
