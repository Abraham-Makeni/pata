'use client'
import { useState, Suspense, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import ProviderCard from '@/components/cards/ProviderCard'
import { ProviderCardSkeleton } from '@/components/ui/Skeletons'
import { CATEGORIES, PROVIDERS, getProvidersByCategory } from '@/lib/data'
import { searchProviders, debounce } from '@/lib/search'
import { useProgressiveLoading, getLoadingMessage } from '@/lib/loading'
import { SearchError } from '@/lib/error-handling'
import { SearchErrorBoundary, LoadingErrorBoundary } from '@/components/ui/ErrorBoundary'

const SORT_OPTIONS = ['All', '4.5+ Stars', 'Verified Only', 'KSh 0–1K', 'KSh 1K–5K', 'Premium']
const LOCATIONS   = ['All Areas', 'Nairobi CBD', 'Westlands', 'Kilimani', 'Karen', 'Lavington']

function ListingContent() {
  const searchParams = useSearchParams()
  const categoryId   = searchParams.get('category') ?? ''
  const category     = CATEGORIES.find(c => c.id === categoryId)

  const [activeSort, setActiveSort]   = useState('All')
  const [activeLoc,  setActiveLoc]    = useState('All Areas')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<Error | null>(null)

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

  const baseList = categoryId ? getProvidersByCategory(categoryId) : PROVIDERS

  // Apply search filter first with error handling
  let searchFiltered = baseList
  if (searchQuery) {
    try {
      searchFiltered = searchProviders(baseList, { query: searchQuery })
    } catch (error) {
      setSearchError(error instanceof Error ? error : new Error('Search failed'))
      searchFiltered = []
    }
  }

  const filtered = searchFiltered.filter(p => {
    const sortOk =
      activeSort === 'All'         ? true :
      activeSort === '4.5+ Stars'  ? p.rating >= 4.5 :
      activeSort === 'Verified Only' ? p.verified :
      activeSort === 'KSh 0–1K'   ? p.startingPrice < 1000 :
      activeSort === 'KSh 1K–5K'  ? p.startingPrice >= 1000 && p.startingPrice < 5000 :
      activeSort === 'Premium'     ? p.startingPrice >= 5000 : true

    const locOk = activeLoc === 'All Areas' || p.location === activeLoc
    
    return sortOk && locOk
  })

  // Progressive loading for providers
  const { visibleItems, isLoading } = useProgressiveLoading(
    filtered,
    6, // initial count
    3, // increment count
    150 // delay between batches
  )

  return (
    <div className="min-h-screen bg-chalk">
      <Navbar
        showBack
        backHref="/home"
        title={category?.name ?? 'All Providers'}
        rightSlot={<span />}
      />

      {/* Category info */}
      {category && (
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-gray-500 text-[13px]">
            {category.count}+ providers · {category.description}
          </p>
        </div>
      )}

      {/* Search */}
      <div className="px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-full px-4 py-2.5">
          <span className="text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search providers, services..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1 bg-transparent outline-none text-black placeholder:text-gray-400 text-[14px] font-sans"
          />
          {isSearching && (
            <span className="text-gray-400 text-sm">Searching...</span>
          )}
        </div>
        {searchQuery && (
          <>
            {searchError ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <p className="text-red-600 text-sm">
                  Search failed: {searchError.message}
                </p>
                <button
                  onClick={() => {
                    setSearchError(null)
                    handleSearchChange({ target: { value: searchQuery } } as React.ChangeEvent<HTMLInputElement>)
                  }}
                  className="text-red-600 text-xs underline mt-1"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-xs mt-2">
                {filtered.length} results for &quot;{searchQuery}&quot;
              </p>
            )}
          </>
        )}
      </div>

      {/* Sort chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-3 snap-scroll border-b border-gray-100">
        {SORT_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setActiveSort(s)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition-all flex-shrink-0
              ${activeSort === s
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-200 hover:border-gray-400'
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Location chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-2.5 snap-scroll border-b border-gray-100">
        {LOCATIONS.map(l => (
          <button
            key={l}
            onClick={() => setActiveLoc(l)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition-all flex-shrink-0
              ${activeLoc === l
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
          >
            📍 {l}
          </button>
        ))}
      </div>

      
      {/* Results */}
      <LoadingErrorBoundary>
        <SearchErrorBoundary>
          <div className="px-5 py-4 space-y-3">
        <p className="text-[12px] text-gray-400 font-medium mb-1">
          {filtered.length} {filtered.length === 1 ? 'provider' : 'providers'} found
          {searchQuery && ` for "${searchQuery}"`}
          {isLoading && visibleItems.length < filtered.length && ` (${visibleItems.length} loaded)`}
        </p>
        {visibleItems.length > 0 ? (
          <>
            {visibleItems.map(p => <ProviderCard key={p.id} provider={p} />)}
            {isLoading && visibleItems.length < filtered.length && (
              // Show loading skeletons while more items are loading
              <>
                <ProviderCardSkeleton />
                <ProviderCardSkeleton />
                <ProviderCardSkeleton />
              </>
            )}
          </>
        ) : filtered.length > 0 ? (
          // Show loading skeletons while initially loading
          <>
            <ProviderCardSkeleton />
            <ProviderCardSkeleton />
            <ProviderCardSkeleton />
          </>
        ) : (
          // Show empty state when no results
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-medium">
              {getLoadingMessage(false, filtered.length, searchQuery) || 'No providers found'}
            </p>
            <p className="text-sm mt-1">
              {searchQuery ? 'Try different keywords' : 'Try adjusting your filters'}
            </p>
          </div>
        )}
      </div>
        </SearchErrorBoundary>
      </LoadingErrorBoundary>
    </div>
  )
}

export default function ListingPage() {
  return (
    <Suspense fallback={
      <div className="px-5 py-4 space-y-3">
        {[1,2,3,4].map(i => <ProviderCardSkeleton key={i} />)}
      </div>
    }>
      <ListingContent />
    </Suspense>
  )
}
