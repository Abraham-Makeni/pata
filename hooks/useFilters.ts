'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Provider } from '@/lib/data'
import { 
  FilterState, 
  FilterOptions, 
  initialFilterState, 
  applyFilters, 
  sortProviders, 
  getFilterOptions,
  serializeFilters,
  deserializeFilters
} from '@/lib/filters'

export function useFilters(providers: Provider[]) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Initialize filters from URL or default state
  const [filters, setFilters] = useState<FilterState>(() => {
    return deserializeFilters(searchParams)
  })

  // Get filter options from providers
  const filterOptions = getFilterOptions(providers)

  // Apply filters and sorting to providers
  const filteredProviders = useCallback(() => {
    let filtered = applyFilters(providers, filters)
    filtered = sortProviders(filtered, filters.sortBy)
    return filtered
  }, [providers, filters])

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const queryString = serializeFilters(newFilters)
    const url = queryString ? `${pathname}?${queryString}` : pathname
    router.push(url, { scroll: false })
  }, [pathname, router])

  // Update filters and sync with URL
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    updateURL(updatedFilters)
  }, [filters, updateURL])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilterState)
    updateURL(initialFilterState)
  }, [updateURL])

  // Toggle category filter
  const toggleCategory = useCallback((categoryId: string) => {
    const categories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId]
    
    updateFilters({ categories })
  }, [filters.categories, updateFilters])

  // Toggle service filter
  const toggleService = useCallback((serviceId: string) => {
    const services = filters.services.includes(serviceId)
      ? filters.services.filter(s => s !== serviceId)
      : [...filters.services, serviceId]
    
    updateFilters({ services })
  }, [filters.services, updateFilters])

  // Toggle location filter
  const toggleLocation = useCallback((locationId: string) => {
    const locations = filters.locations.includes(locationId)
      ? filters.locations.filter(l => l !== locationId)
      : [...filters.locations, locationId]
    
    updateFilters({ locations })
  }, [filters.locations, updateFilters])

  // Update rating filter
  const setRating = useCallback((rating: number | null) => {
    updateFilters({ rating })
  }, [updateFilters])

  // Update price range filter
  const setPriceRange = useCallback((priceRange: FilterState['priceRange']) => {
    updateFilters({ priceRange })
  }, [updateFilters])

  // Update availability filter
  const setAvailability = useCallback((availability: FilterState['availability']) => {
    updateFilters({ availability })
  }, [updateFilters])

  // Toggle verified filter
  const toggleVerified = useCallback(() => {
    updateFilters({ verified: !filters.verified })
  }, [filters.verified, updateFilters])

  // Update sort by
  const setSortBy = useCallback((sortBy: FilterState['sortBy']) => {
    updateFilters({ sortBy })
  }, [updateFilters])

  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return JSON.stringify(filters) !== JSON.stringify(initialFilterState)
  }, [filters])

  // Get count of active filters
  const activeFilterCount = useCallback(() => {
    let count = 0
    if (filters.categories.length > 0) count++
    if (filters.rating !== null) count++
    if (filters.priceRange !== null) count++
    if (filters.availability.today || filters.availability.thisWeek || filters.availability.thisMonth) count++
    if (filters.verified) count++
    if (filters.services.length > 0) count++
    if (filters.locations.length > 0) count++
    return count
  }, [filters])

  // Sync with URL when search params change
  useEffect(() => {
    const urlFilters = deserializeFilters(searchParams)
    setFilters(urlFilters)
  }, [searchParams])

  return {
    filters,
    filterOptions,
    filteredProviders: filteredProviders(),
    updateFilters,
    resetFilters,
    toggleCategory,
    toggleService,
    toggleLocation,
    setRating,
    setPriceRange,
    setAvailability,
    toggleVerified,
    setSortBy,
    hasActiveFilters: hasActiveFilters(),
    activeFilterCount: activeFilterCount()
  }
}
