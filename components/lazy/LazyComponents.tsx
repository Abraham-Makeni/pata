'use client'
import React, { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <motion.div
      className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
)

// Loading skeleton for cards
const CardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4">
    <div className="flex gap-3">
      <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
      </div>
    </div>
  </div>
)

// Lazy loaded components with proper error boundaries
export const LazyBookingFlow = lazy(() => 
  import('@/components/booking/BookingFlow')
)

export const LazyComparisonModal = lazy(() => import('@/components/ui/ComparisonModal'))
export const LazyAdvancedFilters = lazy(() => import('@/components/ui/AdvancedFilters'))
export const LazyReviewSystem = lazy(() => import('@/components/reviews/ReviewSystem'))
export const LazyThemeToggle = lazy(() => import('@/components/ui/ThemeToggle'))

// Route-based lazy loading
export const LazyHomePage = lazy(() => import('@/app/home/page'))
export const LazyListingPage = lazy(() => import('@/app/listing/page'))
export const LazyAuthPage = lazy(() => import('@/app/auth/page'))

// Component wrapper with loading states
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LazyWrapper({ children, fallback = <LoadingSpinner />, className }: LazyWrapperProps) {
  return (
    <Suspense 
      fallback={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={className}
        >
          {fallback}
        </motion.div>
      }
    >
      {children}
    </Suspense>
  )
}

// Progressive loading wrapper
interface ProgressiveLoaderProps {
  children: React.ReactNode
  delay?: number
  fallback?: React.ReactNode
}

export function ProgressiveLoader({ children, delay = 200, fallback = <LoadingSpinner /> }: ProgressiveLoaderProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!showContent) {
    return <motion.div initial={{ opacity: 0 }}>{fallback}</motion.div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </motion.div>
  )
}

// Intersection Observer lazy loading
interface LazyLoadProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  fallback?: React.ReactNode
}

export function LazyLoad({ children, threshold = 0.1, rootMargin = '50px', fallback = <LoadingSpinner /> }: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div ref={ref}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Suspense fallback={fallback}>
            {children}
          </Suspense>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }}>
          {fallback}
        </motion.div>
      )}
    </div>
  )
}

// Grid lazy loading for lists
interface LazyGridProps {
  children: React.ReactNode[]
  itemsPerLoad?: number
  threshold?: number
  fallback?: React.ReactNode
}

export function LazyGrid({ 
  children, 
  itemsPerLoad = 6, 
  threshold = 0.1,
  fallback = <LoadingSpinner />
}: LazyGridProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad)
  const [hasMore, setHasMore] = useState(children.length > itemsPerLoad)

  const loadMore = useCallback(() => {
    const nextCount = Math.min(visibleCount + itemsPerLoad, children.length)
    setVisibleCount(nextCount)
    setHasMore(nextCount < children.length)
  }, [visibleCount, itemsPerLoad, children.length])

  const visibleItems = children.slice(0, visibleCount)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleItems.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Suspense fallback={<CardSkeleton />}>
              {child}
            </Suspense>
          </motion.div>
        ))}
      </div>
      
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-8"
        >
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Load More
          </button>
        </motion.div>
      )}
    </div>
  )
}

// Image lazy loading component
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  threshold?: number
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  placeholder = '/api/placeholder/300/200',
  threshold = 0.1 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsInView(true)
          setCurrentSrc(src)
        }
      },
      { threshold }
    )

    const currentRef = imgRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [src, threshold])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}

// Route-based loading states
export const RouteLoadingStates = {
  home: (
    <div className="flex flex-col gap-4 p-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="h-32 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  ),
  listing: (
    <div className="flex flex-col gap-4 p-4">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  ),
  auth: (
    <div className="flex flex-col gap-4 p-4 max-w-md mx-auto">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
      <div className="h-12 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}

// Error boundary for lazy loaded components
interface LazyErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void; errorId?: string }>
}

export function LazyErrorBoundary({ children, fallback }: LazyErrorBoundaryProps) {
  const DefaultFallback = () => (
    <div className="p-4 text-center">
      <p className="text-gray-600">Failed to load component</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-black text-white rounded-lg"
      >
        Retry
      </button>
    </div>
  )

  return (
    <ErrorBoundary fallback={fallback ? fallback : DefaultFallback}>
      {children}
    </ErrorBoundary>
  )
}
