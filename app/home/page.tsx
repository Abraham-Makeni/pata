'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import FeaturedCard from '@/components/cards/FeaturedCard'
import { FeaturedCardSkeleton } from '@/components/ui/Skeletons'
import { CATEGORIES, FEATURED_PROVIDERS, PROVIDERS, getTrendingProviders, getProviderById, Provider } from '@/lib/data'
import { useBookingStore } from '@/store/booking'

const FILTER_TABS = ['All', 'Top Rated', 'New', 'Budget', 'Premium']

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const { lastBookedProviderId } = useBookingStore()
  const [lastBookedProvider, setLastBookedProvider] = useState<Provider | null>(null)

  // Get trending providers
  const trendingProviders = getTrendingProviders()

  // Load last booked provider and simulate loading
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    if (lastBookedProviderId) {
      const provider = getProviderById(lastBookedProviderId)
      setLastBookedProvider(provider || null)
    }

    return () => clearTimeout(timer)
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
    <div className="min-h-screen bg-chalk">
      <Navbar />

      {/* Hero */}
      <div className="bg-ink px-5 pt-7 pb-7">
        <p className="text-stone-400 text-[13px] mb-1">Good afternoon, Brandon</p>
        <h1 className="font-serif text-white text-[30px] font-semibold leading-tight">
          What are you<br />looking for today?
        </h1>
        {/* Search */}
        <div className="mt-5 flex items-center gap-3 bg-white/10 border border-white/15 rounded-full px-4 py-3">
          <span className="text-white/50 text-lg">�</span>
          <input
            type="text"
            placeholder="Search services, providers..."
            className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-[15px]"
          />
        </div>
      </div>

      {/* Categories */}
      <section className="px-5 pt-6 pb-2">
        <h2 className="font-serif text-[22px] font-medium mb-4">Categories</h2>
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
                <div className="bg-stone-100 rounded-3xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer
                  hover:bg-ink hover:text-white group transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-lg">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-stone-200 group-hover:ring-white/30 transition-all duration-300">
                    <img 
                      src={getImageSrc(cat.id)} 
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:grayscale transition-all duration-300"
                    />
                  </div>
                  <span className="text-[13px] font-semibold leading-tight">{cat.name}</span>
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
            <h2 className="font-serif text-[22px] font-medium">Book Again</h2>
            <Link href={`/booking/${lastBookedProvider.id}`} className="text-[13px] text-ink underline font-medium">
              Quick Book
            </Link>
          </div>
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={lastBookedProvider.image} 
                  alt={lastBookedProvider.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[14px]">{lastBookedProvider.name}</p>
                <p className="text-stone-500 text-xs">{lastBookedProvider.specialty}</p>
                <p className="text-[11px] text-stone-400 mt-1">Last booked recently</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="px-5 pt-6 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-[22px] font-medium">Trending in Nairobi 🔥</h2>
          <Link href="/listing" className="text-[13px] text-stone-500 underline">
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
          {isLoading ? (
            // Show skeleton cards while loading
            [1,2,3,4].map(i => <FeaturedCardSkeleton key={i} />)
          ) : filtered.length > 0 ? (
            // Show actual cards when loaded
            filtered.map(p => <FeaturedCard key={p.id} provider={p} />)
          ) : (
            // Show empty state when no results
            <p className="text-stone-400 text-sm py-4">No providers match this filter.</p>
          )}
        </div>
      </section>
    </div>
  )
}
