'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES, PROVIDERS, getProvidersByCategory } from '@/lib/data'

const SORTS    = ['All','⭐ 4.5+','KSh 0–1K','KSh 1K–5K','Premium']
const LOCATIONS = ['All Areas','Nairobi CBD','Westlands','Kilimani','Karen','Lavington','Parklands','Muthaiga','Ngong Road']

function ListingContent() {
  const router = useRouter()
  const params = useSearchParams()
  const catId  = params.get('category') ?? ''
  const cat    = CATEGORIES.find(c => c.id === catId)
  const [sort, setSort] = useState('All')
  const [loc,  setLoc]  = useState('All Areas')

  const base = catId ? getProvidersByCategory(catId) : PROVIDERS
  const list = base.filter(p => {
    const s = sort === 'All' ? true : sort === '⭐ 4.5+' ? p.rating >= 4.5 : sort === 'KSh 0–1K' ? p.startingPrice < 1000 : sort === 'KSh 1K–5K' ? p.startingPrice >= 1000 && p.startingPrice < 5000 : p.startingPrice >= 5000
    const l = loc === 'All Areas' || p.location === loc
    return s && l
  })

  return (
    <div className="min-h-screen bg-surface-soft pb-6">
      {/* Header */}
      <div className="bg-brand px-5 pt-14 pb-5">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 style={{ fontFamily:'var(--font-syne)', fontSize:26, fontWeight:800, color:'#fff', letterSpacing:'-1px' }}>
          {cat?.name ?? 'All Services'}
        </h1>
        {cat && <p className="text-white/50 text-[13px] mt-1" style={{ fontFamily:'var(--font-outfit)' }}>{cat.count}+ providers · {cat.description}</p>}
      </div>

      {/* Sort */}
      <div className="flex gap-2 px-5 pt-4 pb-1 overflow-x-auto no-scrollbar">
        {SORTS.map(s => (
          <button key={s} onClick={() => setSort(s)}
            className={`px-3.5 py-1.5 rounded-pill text-[12px] font-medium border whitespace-nowrap flex-shrink-0 tap-effect transition-all ${sort===s ? 'bg-brand text-white border-brand' : 'bg-white text-ink-secondary border-surface-border'}`}
            style={{ fontFamily:'var(--font-outfit)' }}>{s}</button>
        ))}
      </div>

      {/* Location */}
      <div className="flex gap-2 px-5 pt-2 pb-3 overflow-x-auto no-scrollbar border-b border-surface-border mb-1">
        {LOCATIONS.map(l => (
          <button key={l} onClick={() => setLoc(l)}
            className={`px-3.5 py-1.5 rounded-pill text-[12px] border whitespace-nowrap flex-shrink-0 tap-effect transition-all ${loc===l ? 'bg-brand/90 text-white border-brand/90' : 'bg-white text-ink-muted border-surface-border'}`}
            style={{ fontFamily:'var(--font-outfit)' }}>
            📍 {l}
          </button>
        ))}
      </div>

      <p className="px-5 pt-3 pb-2 text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
        {list.length} {list.length===1?'provider':'providers'} found
      </p>

      {/* Provider list */}
      <div className="px-5 space-y-3">
        {list.length > 0 ? list.map(p => (
          <Link key={p.id} href={`/profile/${p.id}`}>
            <div className="bg-white rounded-card p-3.5 flex gap-3.5 shadow-card tap-effect border border-transparent hover:border-brand/10 transition-all">
              <div className="img-placeholder w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0">
                <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p style={{ fontFamily:'var(--font-syne)', fontSize:15, fontWeight:700, letterSpacing:'-0.2px' }}>{p.name}</p>
                  {p.verified && <span className="text-[10px] bg-surface-muted text-ink-secondary px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5" style={{ fontFamily:'var(--font-outfit)' }}>✓ Verified</span>}
                </div>
                <p className="text-ink-muted text-[12px] mt-0.5" style={{ fontFamily:'var(--font-outfit)' }}>{p.tags[0]} · {p.location}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-[12px]" style={{ fontFamily:'var(--font-outfit)' }}>
                    <span className="star-gold">★</span>
                    <span className="font-semibold">{p.rating}</span>
                    <span className="text-ink-faint">({p.reviewCount})</span>
                  </span>
                  <span className="font-semibold text-[13px]" style={{ fontFamily:'var(--font-syne)' }}>From KSh {p.startingPrice.toLocaleString()}</span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {p.tags.slice(0,3).map(t => (
                    <span key={t} className="bg-surface-muted text-ink-secondary text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ fontFamily:'var(--font-outfit)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="text-center py-20 text-ink-muted">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold" style={{ fontFamily:'var(--font-syne)' }}>No providers found</p>
            <p className="text-sm mt-1" style={{ fontFamily:'var(--font-outfit)' }}>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ListingPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-ink-muted">Loading…</p></div>}><ListingContent /></Suspense>
}
