'use client'
/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CATEGORIES, PROVIDERS, getFeaturedProviders } from '@/lib/data'

const FILTERS = ['All','Top Rated','Budget','Premium','New']

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const featured = getFeaturedProviders()

  const normalizeText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

  const searchAliases: Record<string, string[]> = {
    haircut: ['haircut', 'haircuts', 'cut', 'cuts', 'lineup', 'lineups', 'fade', 'fades', 'barber'],
    braids: ['braid', 'braids', 'boxbraids', 'protectivestyle'],
    nails: ['nail', 'nails', 'manicure', 'pedicure', 'acrylic', 'gel'],
    makeup: ['makeup', 'bridal', 'glam', 'airbrush'],
    tattoo: ['tattoo', 'tattoos', 'ink'],
    photography: ['photo', 'photos', 'photography', 'portrait', 'event'],
  }

  const getExpandedTokens = (query: string) => {
    const normalized = normalizeText(query)
    const expanded = new Set([normalized])

    Object.values(searchAliases).forEach((aliases) => {
      if (aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized))) {
        aliases.forEach((alias) => expanded.add(alias))
      }
    })

    return Array.from(expanded)
  }

  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return []

    const tokens = getExpandedTokens(trimmed)
    return PROVIDERS.filter((provider) => {
      const searchable = [
        provider.name,
        provider.location,
        provider.category,
        ...provider.tags,
        ...provider.services.map((service) => service.name),
      ]
        .map(normalizeText)
        .join(' ')

      return tokens.some((token) => searchable.includes(token))
    })
  }, [searchQuery])

  const isSearching = searchQuery.trim().length > 0

  const filtered = PROVIDERS.filter(p => {
    if (activeFilter === 'All')       return p.featured
    if (activeFilter === 'Top Rated') return p.rating >= 4.8
    if (activeFilter === 'Budget')    return p.startingPrice < 1000
    if (activeFilter === 'Premium')   return p.startingPrice >= 3000
    if (activeFilter === 'New')       return p.bookings < 300
    return true
  })

  return (
    <div className="min-h-screen bg-surface-soft pb-24">
      {/* ── HEADER ── */}
      <div className="bg-brand px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-5">
          <span style={{ fontFamily:'var(--font-syne)', fontSize:28, fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>PATA</span>
          <div className="flex items-center gap-2">
            <Link href="/notifications" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-base hover:bg-white/20 transition-all">
              🔔
            </Link>
            <Link href="/profile/me">
              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer hover:bg-white/30 transition-all" style={{ fontFamily:'var(--font-syne)' }}>AK</div>
            </Link>
          </div>
        </div>
        <p className="text-white/50 text-[13px] mb-1" style={{ fontFamily:'var(--font-outfit)' }}>Good afternoon 👋</p>
        <h1 style={{ fontFamily:'var(--font-syne)', fontSize:26, fontWeight:700, color:'#fff', lineHeight:1.25, letterSpacing:'-0.5px' }}>
          What service do<br/>you need today?
        </h1>
        {/* Search */}
        <div className="mt-4 flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search services, providers…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder:text-white/40 text-[15px] outline-none"
            style={{ fontFamily:'var(--font-outfit)' }}/>
        </div>
      </div>

      {/* ── SEARCH RESULTS ── */}
      {isSearching && (
        <div className="px-5 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily:'var(--font-syne)', fontSize:18, fontWeight:700, letterSpacing:'-0.3px' }}>
              Search Results
            </h2>
            <span className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
              {searchResults.length} found
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white rounded-card p-4 shadow-card">
              <p className="text-[14px] text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>
                No services matched &quot;{searchQuery}&quot;. Try another service name like haircut, braids, nails, or makeup.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((p) => (
                <Link key={p.id} href={`/profile/${p.id}`}>
                  <div className="bg-white rounded-card p-3 flex gap-3 shadow-card tap-effect">
                    <div className="img-placeholder w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
                      <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p style={{ fontFamily:'var(--font-syne)', fontSize:14, fontWeight:700 }}>{p.name}</p>
                        <span className="text-[11px] text-ink-muted flex-shrink-0 ml-2" style={{ fontFamily:'var(--font-outfit)' }}>{p.location}</span>
                      </div>
                      <p className="text-ink-muted text-[12px] mt-0.5 truncate" style={{ fontFamily:'var(--font-outfit)' }}>
                        {p.services.slice(0, 2).map((service) => service.name).join(' · ')}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[12px] flex items-center gap-1" style={{ fontFamily:'var(--font-outfit)' }}>
                          <span className="star-gold">★</span>
                          <span className="font-semibold">{p.rating}</span>
                          <span className="text-ink-faint">({p.reviewCount})</span>
                        </span>
                        <span className="text-[13px] font-semibold" style={{ fontFamily:'var(--font-syne)' }}>KSh {p.startingPrice.toLocaleString()}+</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CATEGORIES ── */}
      {!isSearching && <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily:'var(--font-syne)', fontSize:18, fontWeight:700, letterSpacing:'-0.3px' }}>Categories</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/listing?category=${cat.id}`}>
              <div className="group tap-effect bg-white rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-all">
                {/* Image */}
                <div className="img-placeholder w-full aspect-[4/3] bg-surface-muted relative">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-40">{cat.icon}</div>
                </div>
                {/* Label */}
                <div className="px-2.5 py-2">
                  <p style={{ fontFamily:'var(--font-syne)', fontSize:12, fontWeight:700, letterSpacing:'0.2px' }}>{cat.name}</p>
                  <p className="text-ink-muted text-[10px] mt-0.5" style={{ fontFamily:'var(--font-outfit)' }}>{cat.count}+ providers</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>}

      {/* ── TRENDING ── */}
      {!isSearching && <div className="pt-7">
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 style={{ fontFamily:'var(--font-syne)', fontSize:18, fontWeight:700, letterSpacing:'-0.3px' }}>Near You</h2>
          <Link href="/listing" className="text-[13px] text-ink-secondary underline" style={{ fontFamily:'var(--font-outfit)' }}>See all</Link>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-5 overflow-x-auto no-scrollbar pb-1 mb-4">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-pill text-[13px] whitespace-nowrap border transition-all flex-shrink-0 tap-effect ${
                activeFilter === f ? 'bg-brand text-white border-brand' : 'bg-white text-ink-secondary border-surface-border'
              }`} style={{ fontFamily:'var(--font-outfit)', fontWeight: activeFilter===f ? 600 : 400 }}>
              {f}
            </button>
          ))}
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-2">
          {filtered.map(p => (
            <Link key={p.id} href={`/profile/${p.id}`}>
              <div className="flex-shrink-0 w-[200px] bg-white rounded-card overflow-hidden shadow-card tap-effect">
                <div className="img-placeholder w-full h-[150px] relative">
                  <img src={p.coverImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                  <div className="absolute bottom-2 left-3 text-white text-[11px] font-semibold flex items-center gap-1" style={{ fontFamily:'var(--font-outfit)' }}>
                    <span className="star-gold">★</span> {p.rating}
                  </div>
                  <div className="absolute bottom-2 right-3 text-white/80 text-[10px]" style={{ fontFamily:'var(--font-outfit)' }}>
                    {p.location}
                  </div>
                </div>
                <div className="p-3">
                  <p style={{ fontFamily:'var(--font-syne)', fontSize:14, fontWeight:700, letterSpacing:'-0.2px' }}>{p.name}</p>
                  <p className="text-ink-muted text-[12px] mt-0.5 truncate" style={{ fontFamily:'var(--font-outfit)' }}>{p.tags[0]} · {p.tags[1]}</p>
                  <p className="mt-2 text-[13px] font-semibold" style={{ fontFamily:'var(--font-syne)' }}>From KSh {p.startingPrice.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>}

      {/* ── QUICK PICKS ── */}
      {!isSearching && <div className="px-5 pt-7">
        <h2 style={{ fontFamily:'var(--font-syne)', fontSize:18, fontWeight:700, letterSpacing:'-0.3px', marginBottom:16 }}>Top Rated</h2>
        <div className="space-y-3">
          {PROVIDERS.filter(p => p.rating >= 4.8).slice(0,3).map(p => (
            <Link key={p.id} href={`/profile/${p.id}`}>
              <div className="bg-white rounded-card p-3 flex gap-3 shadow-card tap-effect">
                <div className="img-placeholder w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden">
                  <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p style={{ fontFamily:'var(--font-syne)', fontSize:14, fontWeight:700 }}>{p.name}</p>
                    <span className="text-[11px] text-ink-muted flex-shrink-0 ml-2" style={{ fontFamily:'var(--font-outfit)' }}>{p.location}</span>
                  </div>
                  <p className="text-ink-muted text-[12px] mt-0.5 truncate" style={{ fontFamily:'var(--font-outfit)' }}>{p.tags.slice(0,2).join(' · ')}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[12px] flex items-center gap-1" style={{ fontFamily:'var(--font-outfit)' }}>
                      <span className="star-gold">★</span>
                      <span className="font-semibold">{p.rating}</span>
                      <span className="text-ink-faint">({p.reviewCount})</span>
                    </span>
                    <span className="text-[13px] font-semibold" style={{ fontFamily:'var(--font-syne)' }}>KSh {p.startingPrice.toLocaleString()}+</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>}
    </div>
  )
}
