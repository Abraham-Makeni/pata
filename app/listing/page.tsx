'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import ProviderCard from '@/components/cards/ProviderCard'
import { ProviderCardSkeleton } from '@/components/ui/Skeletons'
import { CATEGORIES, PROVIDERS, getProvidersByCategory } from '@/lib/data'

const SORT_OPTIONS = ['All', '4.5+ Stars', 'Verified Only', 'KSh 0–1K', 'KSh 1K–5K', 'Premium']
const LOCATIONS   = ['All Areas', 'Nairobi CBD', 'Westlands', 'Kilimani', 'Karen', 'Lavington']

function ListingContent() {
  const searchParams = useSearchParams()
  const categoryId   = searchParams.get('category') ?? ''
  const category     = CATEGORIES.find(c => c.id === categoryId)

  const [activeSort, setActiveSort]   = useState('All')
  const [activeLoc,  setActiveLoc]    = useState('All Areas')

  const baseList = categoryId ? getProvidersByCategory(categoryId) : PROVIDERS

  const filtered = baseList.filter(p => {
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
        <div className="px-5 py-3 border-b border-stone-100">
          <p className="text-stone-500 text-[13px]">
            {category.count}+ providers · {category.description}
          </p>
        </div>
      )}

      {/* Sort chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-3 snap-scroll border-b border-stone-100">
        {SORT_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setActiveSort(s)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition-all flex-shrink-0
              ${activeSort === s
                ? 'bg-ink text-chalk border-ink'
                : 'bg-white text-ink border-stone-200 hover:border-stone-400'
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Location chips */}
      <div className="flex gap-2 overflow-x-auto px-5 py-2.5 snap-scroll border-b border-stone-100">
        {LOCATIONS.map(l => (
          <button
            key={l}
            onClick={() => setActiveLoc(l)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border whitespace-nowrap transition-all flex-shrink-0
              ${activeLoc === l
                ? 'bg-stone-800 text-chalk border-stone-800'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
              }`}
          >
            📍 {l}
          </button>
        ))}
      </div>

      
      {/* Results */}
      <div className="px-5 py-4 space-y-3">
        <p className="text-[12px] text-stone-400 font-medium mb-1">
          {filtered.length} {filtered.length === 1 ? 'provider' : 'providers'} found
        </p>
        {filtered.length > 0
          ? filtered.map(p => <ProviderCard key={p.id} provider={p} />)
          : (
            <div className="text-center py-16 text-stone-400">
              <p className="text-3xl mb-3">🔍</p>
              <p className="font-medium">No providers found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )
        }
      </div>
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
