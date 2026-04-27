'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import FeaturedCard from '@/components/cards/FeaturedCard'
import { FeaturedCardSkeleton } from '@/components/ui/Skeletons'
import { CATEGORIES, FEATURED_PROVIDERS, PROVIDERS, getTrendingProviders, getProviderById, Provider } from '@/lib/data'
import { useBookingStore } from '@/store/booking'
import { searchProviders, debounce } from '@/lib/search'
import { SearchError } from '@/lib/error-handling'
import { useProgressiveLoading, getLoadingMessage } from '@/lib/loading'
import { useRetry, safeAsync } from '@/lib/error-handling'
import { SearchErrorBoundary, LoadingErrorBoundary } from '@/components/ui/ErrorBoundary'
import { CategoryImage, ProviderAvatar } from '@/components/ui/OptimizedImage'

const FILTER_TABS = ['All', 'Top Rated', 'New', 'Budget', 'Premium']

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<Error | null>(null)
  const { lastBookedProviderId } = useBookingStore()
  const [lastBookedProvider, setLastBookedProvider] = useState<Provider | null>(null)

  // Get trending providers
  const trendingProviders = getTrendingProviders()

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setIsSearching(false)
      setSearchQuery(query)
    }, 300),
    []
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setIsSearching(true)
    setSearchError(null)
    debouncedSearch(query)
  }

  // Filter providers based on search and active filter
  const filteredProviders = useMemo(() => {
    try {
      let baseProviders = trendingProviders

      // Apply search filter with error handling
      if (searchQuery) {
        baseProviders = searchProviders(PROVIDERS, { query: searchQuery })
      }

      // Apply active filter
      if (activeFilter !== 'All') {
        baseProviders = baseProviders.filter(p => {
          if (activeFilter === 'Top Rated') return p.rating >= 4.8
          if (activeFilter === 'New') return p.bookings < 300
          if (activeFilter === 'Budget') return p.startingPrice < 1000
          if (activeFilter === 'Premium') return p.startingPrice >= 3000
          return true
        })
      }

      return baseProviders.slice(0, 8)
    } catch (error) {
      setSearchError(error instanceof Error ? error : new Error('Search failed'))
      return []
    }
  }, [searchQuery, activeFilter, trendingProviders])

  // Show search results when searching
  const displayProviders = searchQuery ? filteredProviders : trendingProviders

  // Progressive loading for providers
  const { visibleItems, isLoading } = useProgressiveLoading(
    displayProviders,
    4, // initial count
    2, // increment count
    100 // delay between batches
  )

  // Load last booked provider (no artificial delay)
  useEffect(() => {
    if (lastBookedProviderId) {
      const provider = getProviderById(lastBookedProviderId)
      setLastBookedProvider(provider || null)
    }
  }, [lastBookedProviderId])

  const filtered = activeFilter === 'All' 
    ? trendingProviders 
    : PROVIDERS.filter(p => {
        if (activeFilter === 'Top Rated') return p.rating >= 4.8
        if (activeFilter === 'New')       return p.bookings < 300
        if (activeFilter === 'Budget')    return p.startingPrice < 1000
        if (activeFilter === 'Premium')   return p.startingPrice >= 3000
        return true
      }).slice(0, 8)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-black px-5 pt-7 pb-7">
        <p className="text-gray-400 text-[13px] mb-1">Good afternoon, Brandon</p>
        <h1 className="font-sans text-white text-[30px] font-semibold leading-tight">
          What&apos;s good,<br />how can we be of service today?
        </h1>
        {/* Search */}
        <div className="mt-5 flex items-center gap-3 bg-white/10 border border-white/15 rounded-full px-4 py-3">
          <span className="text-white/50 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search services, providers..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-[15px] font-sans"
          />
          {isSearching && (
            <span className="text-white/50 text-sm">Searching...</span>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-4">
            {searchError ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-200 text-sm">
                  Search failed: {searchError.message}
                </p>
                <button
                  onClick={() => {
                    setSearchError(null)
                    handleSearchChange({ target: { value: searchQuery } } as React.ChangeEvent<HTMLInputElement>)
                  }}
                  className="text-red-200 text-xs underline mt-1"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <p className="text-white/80 text-sm mb-3">
                {filteredProviders.length} results for &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <section className="px-5 pt-6 pb-2">
        <h2 className="font-sans text-[22px] font-medium mb-4 text-black">Categories</h2>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map(cat => {
            const getImageSrc = (categoryId: string) => {
              const imageMap: { [key: string]: string } = {
                'barbers': '/barber.jpg',
                'hair-stylists': '/hair-stylist.jpg',
                'tattoo-artists': '/tattoo-artist.jpg',
                'nail-techs': '/nail-tech.jpg',
                'makeup-artists': '/makeup-artist.jpg',
                'photographers': '/photographer.jpg'
              }
              return imageMap[categoryId] || ''
            }
            
            return (
              <Link key={cat.id} href={`/listing?category=${cat.id}`}>
                <div className="bg-gray-100 rounded-3xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer
                  hover:bg-black hover:text-white group transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-stone-200 group-hover:ring-white/30 transition-all duration-300">
                    <CategoryImage
                      src={getImageSrc(cat.id)}
                      alt={cat.name}
                      className="group-hover:grayscale transition-all duration-300"
                      fallbackSrc="/api/placeholder/64/64"
                    />
                  </div>
                  <span className="text-[13px] font-semibold leading-tight font-sans text-black">{cat.name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Rebooking Section */}
      {lastBookedProvider && (
        <section className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-sans text-[22px] font-medium text-black">Book Again</h2>
            <Link href={`/booking/${lastBookedProvider.id}`} className="text-[13px] text-black underline font-medium font-sans">
              Quick Book
            </Link>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex gap-3">
              <ProviderAvatar
                src={lastBookedProvider.image}
                alt={lastBookedProvider.name}
                size={48}
                fallbackSrc="/api/placeholder/48/48"
              />
              <div className="flex-1">
                <p className="font-semibold text-[14px] font-sans text-black">{lastBookedProvider.name}</p>
                <p className="text-gray-500 text-xs font-sans">{lastBookedProvider.specialty}</p>
                <p className="text-[11px] text-gray-400 mt-1 font-sans">Last booked recently</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending / Search Results */}
      <LoadingErrorBoundary>
        <SearchErrorBoundary>
          <section className="px-5 pt-6 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-sans text-[22px] font-medium text-black">
            {searchQuery ? `Search Results` : 'Trending in Nairobi 🔥'}
          </h2>
          <Link href="/listing" className="text-[13px] text-black underline font-sans">
            See all
          </Link>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide snap-scroll mb-4">
          {FILTER_TABS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-[13px] font-medium border whitespace-nowrap transition-all flex-shrink-0
                ${activeFilter === f
                  ? 'bg-ink text-chalk border-ink'
                  : 'bg-white text-ink border-stone-200 hover:border-ink'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards scroll */}
        <div className="flex gap-3 overflow-x-auto snap-scroll pb-2">
          {isLoading && visibleItems.length === 0 ? (
            // Show skeleton cards while initially loading
            [1,2,3,4].map(i => <FeaturedCardSkeleton key={i} />)
          ) : visibleItems.length > 0 ? (
            // Show progressively loaded cards
            <>
              {visibleItems.map(p => <FeaturedCard key={p.id} provider={p} />)}
              {isLoading && visibleItems.length < displayProviders.length && (
                // Show loading skeleton while more items are loading
                <FeaturedCardSkeleton />
              )}
            </>
          ) : (
            // Show empty state when no results
            <p className="text-gray-400 text-sm py-4">
              {getLoadingMessage(false, displayProviders.length, searchQuery)}
            </p>
          )}
        </div>
      </section>
        </SearchErrorBoundary>
      </LoadingErrorBoundary>
    </div>
  )
}
