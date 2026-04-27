import { useState, useEffect } from 'react'

// Progressive loading hook
export function useProgressiveLoading<T>(
  data: T[],
  initialCount: number = 4,
  incrementCount: number = 4,
  delay: number = 100
) {
  const [visibleItems, setVisibleItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial load
    const initialItems = data.slice(0, initialCount)
    setVisibleItems(initialItems)
    setIsLoading(false)

    // Progressive loading for remaining items
    if (data.length > initialCount) {
      let currentIndex = initialCount
      
      const loadMore = () => {
        if (currentIndex < data.length) {
          const nextItems = data.slice(currentIndex, currentIndex + incrementCount)
          setVisibleItems(prev => [...prev, ...nextItems])
          currentIndex += incrementCount
          
          if (currentIndex < data.length) {
            setTimeout(loadMore, delay)
          }
        }
      }
      
      setTimeout(loadMore, delay)
    }
  }, [data, initialCount, incrementCount, delay])

  return { visibleItems, isLoading }
}

// Smart loading state hook
export function useSmartLoading<T>(
  fetcher: () => Promise<T> | T,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const result = await Promise.resolve(fetcher())
        
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [fetcher, ...dependencies, refetchTrigger])

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1)
  }

  return { data, isLoading, error, refetch }
}

// Skeleton loading utilities
export const SKELETON_COUNTS = {
  home: { initial: 4, increment: 2 },
  listing: { initial: 6, increment: 3 },
  profile: { initial: 1, increment: 0 }
}

export function getLoadingMessage(isLoading: boolean, itemCount: number, query?: string): string {
  if (isLoading) {
    if (query) return `Searching for "${query}"...`
    return 'Loading providers...'
  }
  
  if (query && itemCount === 0) {
    return `No results found for "${query}"`
  }
  
  if (itemCount === 0) {
    return 'No providers found'
  }
  
  return ''
}
