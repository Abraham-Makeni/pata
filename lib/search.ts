import { Provider } from './data'
import { SearchError, safeAsync } from './error-handling'

export interface SearchFilters {
  query: string
  category?: string
  rating?: number
  priceRange?: { min: number; max: number }
  verified?: boolean
}

export function searchProviders(providers: Provider[], filters: SearchFilters): Provider[] {
  try {
    const { query, category, rating, priceRange, verified } = filters

    // Validate inputs
    if (query && query.length > 100) {
      throw new SearchError('Search query is too long')
    }

    if (rating && (rating < 0 || rating > 5)) {
      throw new SearchError('Invalid rating filter')
    }

    if (priceRange && (priceRange.min < 0 || priceRange.max < priceRange.min)) {
      throw new SearchError('Invalid price range filter')
    }

    return providers.filter(provider => {
      // Text search (name, specialty, tags, location)
      if (query && query.trim()) {
        const searchQuery = query.toLowerCase().trim()
        const searchableText = [
          provider.name,
          provider.specialty,
          provider.category,
          provider.location,
          ...provider.tags,
          ...provider.services.map(service => service.name)
        ].join(' ').toLowerCase()
        
        if (!searchableText.includes(searchQuery)) {
          return false
        }
      }

      // Category filter
      if (category && category !== 'all') {
        if (provider.category !== category) {
          return false
        }
      }

      // Rating filter
      if (rating && rating > 0) {
        if (provider.rating < rating) {
          return false
        }
      }

      // Price range filter
      if (priceRange) {
        if (provider.startingPrice < priceRange.min || provider.startingPrice > priceRange.max) {
          return false
        }
      }

      // Verified filter
      if (verified !== undefined) {
        if (provider.verified !== verified) {
          return false
        }
      }

      return true
    })
  } catch (error) {
    if (error instanceof SearchError) {
      throw error
    }
    throw new SearchError(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Async search with error handling
export async function searchProvidersAsync(
  providers: Provider[],
  filters: SearchFilters
): Promise<Provider[]> {
  return new Promise((resolve, reject) => {
    try {
      // Simulate async search (in real app, this would be an API call)
      setTimeout(() => {
        try {
          const results = searchProviders(providers, filters)
          resolve(results)
        } catch (error) {
          reject(error)
        }
      }, 0)
    } catch (error) {
      reject(error)
    }
  })
}

// Safe search with fallback
export async function safeSearchProviders(
  providers: Provider[],
  filters: SearchFilters,
  fallback: Provider[] = []
): Promise<Provider[]> {
  const [results, error] = await safeAsync(() => searchProvidersAsync(providers, filters))
  
  if (error) {
    console.error('Search error:', error)
    return fallback
  }
  
  return results || fallback
}

// Debounce utility function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}
