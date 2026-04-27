import { Provider } from './data'

export interface FilterState {
  categories: string[]
  rating: number | null
  priceRange: {
    min: number
    max: number
  } | null
  availability: {
    today: boolean
    thisWeek: boolean
    thisMonth: boolean
  }
  verified: boolean
  services: string[]
  locations: string[]
  sortBy: 'relevance' | 'rating' | 'price_low' | 'price_high' | 'bookings'
}

export interface FilterOptions {
  categories: Array<{ id: string; name: string; count: number }>
  services: Array<{ id: string; name: string; count: number }>
  locations: Array<{ id: string; name: string; count: number }>
  maxPrice: number
  minPrice: number
}

export const initialFilterState: FilterState = {
  categories: [],
  rating: null,
  priceRange: null,
  availability: {
    today: false,
    thisWeek: false,
    thisMonth: false
  },
  verified: false,
  services: [],
  locations: [],
  sortBy: 'relevance'
}

export function applyFilters(providers: Provider[], filters: FilterState): Provider[] {
  return providers.filter(provider => {
    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(provider.category)) {
        return false
      }
    }

    // Rating filter
    if (filters.rating !== null) {
      if (provider.rating < filters.rating) {
        return false
      }
    }

    // Price range filter
    if (filters.priceRange) {
      if (provider.startingPrice < filters.priceRange.min || 
          provider.startingPrice > filters.priceRange.max) {
        return false
      }
    }

    // Verified filter
    if (filters.verified && !provider.verified) {
      return false
    }

    // Services filter
    if (filters.services.length > 0) {
      const providerServices = provider.services.map(s => s.name.toLowerCase())
      const hasMatchingService = filters.services.some(service => 
        providerServices.some(ps => ps.includes(service.toLowerCase()))
      )
      if (!hasMatchingService) {
        return false
      }
    }

    // Location filter
    if (filters.locations.length > 0) {
      if (!filters.locations.includes(provider.location)) {
        return false
      }
    }

    // Availability filter (mock implementation)
    if (filters.availability.today || filters.availability.thisWeek || filters.availability.thisMonth) {
      // In a real app, this would check actual availability
      // For now, we'll randomly assign some providers as available
      const isAvailable = Math.random() > 0.5
      if (!isAvailable) {
        return false
      }
    }

    return true
  })
}

export function sortProviders(providers: Provider[], sortBy: FilterState['sortBy']): Provider[] {
  const sorted = [...providers]
  
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'price_low':
      return sorted.sort((a, b) => a.startingPrice - b.startingPrice)
    case 'price_high':
      return sorted.sort((a, b) => b.startingPrice - a.startingPrice)
    case 'bookings':
      return sorted.sort((a, b) => b.bookings - a.bookings)
    case 'relevance':
    default:
      return sorted.sort((a, b) => {
        // Relevance scoring (higher rating + more bookings = more relevant)
        const scoreA = a.rating * 0.7 + (a.bookings / 1000) * 0.3
        const scoreB = b.rating * 0.7 + (b.bookings / 1000) * 0.3
        return scoreB - scoreA
      })
  }
}

export function getFilterOptions(providers: Provider[]): FilterOptions {
  const categories = providers.reduce((acc, provider) => {
    const existing = acc.find(c => c.id === provider.category)
    if (existing) {
      existing.count++
    } else {
      acc.push({ id: provider.category, name: provider.category, count: 1 })
    }
    return acc
  }, [] as Array<{ id: string; name: string; count: number }>)

  const services = providers.reduce((acc, provider) => {
    provider.services.forEach(service => {
      const existing = acc.find(s => s.id === service.name.toLowerCase())
      if (existing) {
        existing.count++
      } else {
        acc.push({ id: service.name.toLowerCase(), name: service.name, count: 1 })
      }
    })
    return acc
  }, [] as Array<{ id: string; name: string; count: number }>)

  const locations = providers.reduce((acc, provider) => {
    const existing = acc.find(l => l.id === provider.location)
    if (existing) {
      existing.count++
    } else {
      acc.push({ id: provider.location, name: provider.location, count: 1 })
    }
    return acc
  }, [] as Array<{ id: string; name: string; count: number }>)

  const prices = providers.map(p => p.startingPrice)
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)

  return {
    categories: categories.sort((a, b) => b.count - a.count),
    services: services.sort((a, b) => b.count - a.count),
    locations: locations.sort((a, b) => b.count - a.count),
    maxPrice,
    minPrice
  }
}

export function serializeFilters(filters: FilterState): string {
  const params = new URLSearchParams()
  
  if (filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','))
  }
  
  if (filters.rating !== null) {
    params.set('rating', filters.rating.toString())
  }
  
  if (filters.priceRange) {
    params.set('priceMin', filters.priceRange.min.toString())
    params.set('priceMax', filters.priceRange.max.toString())
  }
  
  if (filters.availability.today) params.set('available_today', 'true')
  if (filters.availability.thisWeek) params.set('available_this_week', 'true')
  if (filters.availability.thisMonth) params.set('available_this_month', 'true')
  
  if (filters.verified) params.set('verified', 'true')
  
  if (filters.services.length > 0) {
    params.set('services', filters.services.join(','))
  }
  
  if (filters.locations.length > 0) {
    params.set('locations', filters.locations.join(','))
  }
  
  params.set('sort', filters.sortBy)
  
  return params.toString()
}

export function deserializeFilters(searchParams: URLSearchParams): FilterState {
  const filters: FilterState = { ...initialFilterState }
  
  const categories = searchParams.get('categories')
  if (categories) {
    filters.categories = categories.split(',').filter(Boolean)
  }
  
  const rating = searchParams.get('rating')
  if (rating) {
    filters.rating = parseFloat(rating)
  }
  
  const priceMin = searchParams.get('priceMin')
  const priceMax = searchParams.get('priceMax')
  if (priceMin && priceMax) {
    filters.priceRange = {
      min: parseFloat(priceMin),
      max: parseFloat(priceMax)
    }
  }
  
  filters.availability.today = searchParams.get('available_today') === 'true'
  filters.availability.thisWeek = searchParams.get('available_this_week') === 'true'
  filters.availability.thisMonth = searchParams.get('available_this_month') === 'true'
  
  filters.verified = searchParams.get('verified') === 'true'
  
  const services = searchParams.get('services')
  if (services) {
    filters.services = services.split(',').filter(Boolean)
  }
  
  const locations = searchParams.get('locations')
  if (locations) {
    filters.locations = locations.split(',').filter(Boolean)
  }
  
  const sort = searchParams.get('sort')
  if (sort) {
    filters.sortBy = sort as FilterState['sortBy']
  }
  
  return filters
}
