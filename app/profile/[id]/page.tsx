'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProviderById } from '@/lib/data'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const p = getProviderById(params.id)
  if (!p) return <div className="flex items-center justify-center min-h-screen"><p>Not found</p></div>

  return (
    <div className="min-h-screen bg-surface-soft">

      {/* ── COVER ── */}
      <div className="relative">
        <div className="img-placeholder w-full h-[280px]">
          <img src={p.coverImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
        </div>

        {/* Back */}
        <button onClick={() => router.back()}
          className="absolute top-12 left-4 w-10 h-10 rounded-full glass-dark flex items-center justify-center border border-white/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        {/* Name over cover */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-end justify-between">
            <div>
              {p.verified && (
                <span className="inline-flex items-center gap-1 bg-white/20 border border-white/30 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 backdrop-blur-sm"
                  style={{ fontFamily:'var(--font-outfit)' }}>✓ Verified</span>
              )}
              <h1 style={{ fontFamily:'var(--font-syne)', fontSize:26, fontWeight:800, color:'#fff', letterSpacing:'-1px', lineHeight:1.1 }}>{p.name}</h1>
              <p className="text-white/70 text-[13px] mt-1" style={{ fontFamily:'var(--font-outfit)' }}>{p.tags[0]} · {p.location}</p>
            </div>
            {/* Avatar */}
            <div className="img-placeholder w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/40 flex-shrink-0">
              <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="px-5 pb-32 pt-5 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: p.rating.toFixed(1), l: 'Rating' },
            { n: p.reviewCount,       l: 'Reviews' },
            { n: p.bookings,          l: 'Bookings' },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-card p-3.5 text-center shadow-card">
              <div style={{ fontFamily:'var(--font-syne)', fontSize:22, fontWeight:800, letterSpacing:'-0.5px' }}>{s.n}</div>
              <div className="text-ink-muted text-[11px] mt-0.5" style={{ fontFamily:'var(--font-outfit)' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {p.tags.map(t => (
            <span key={t} className="bg-white border border-surface-border text-ink-secondary text-[12px] font-medium px-3 py-1.5 rounded-pill shadow-sm"
              style={{ fontFamily:'var(--font-outfit)' }}>{t}</span>
          ))}
        </div>

        {/* About */}
        <Section title="About">
          <p className="text-[14px] leading-relaxed text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>{p.about}</p>
        </Section>

        {/* Gallery */}
        <Section title="Portfolio">
          <div className="grid grid-cols-3 gap-2">
            {p.galleryImages.map((img, i) => (
              <div key={i} className="img-placeholder aspect-square rounded-xl overflow-hidden">
                <img src={img} alt={`${p.name} work ${i+1}`} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
              </div>
            ))}
          </div>
        </Section>

        {/* Services */}
        <Section title="Services & Pricing">
          <div className="space-y-2">
            {p.services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-card">
                <div>
                  <p style={{ fontFamily:'var(--font-outfit)', fontSize:14, fontWeight:600 }}>{s.name}</p>
                  <p className="text-ink-muted text-[12px] mt-0.5" style={{ fontFamily:'var(--font-outfit)' }}>{s.duration}</p>
                </div>
                <p style={{ fontFamily:'var(--font-syne)', fontSize:14, fontWeight:700 }}>{s.price}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Reviews */}
        <Section title="Reviews">
          <div className="space-y-3">
            {p.reviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                    style={{ fontFamily:'var(--font-syne)' }}>{r.initials}</div>
                  <div className="flex-1">
                    <p style={{ fontFamily:'var(--font-syne)', fontSize:13, fontWeight:700 }}>{r.author}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-amber-500">{'★'.repeat(r.rating)}</span>
                      <span className="text-[11px] text-ink-faint" style={{ fontFamily:'var(--font-outfit)' }}>{r.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── STICKY BOOK BAR ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] glass-bottom px-5 py-4 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>Starting from</p>
          <p style={{ fontFamily:'var(--font-syne)', fontSize:22, fontWeight:800, letterSpacing:'-0.5px' }}>KSh {p.startingPrice.toLocaleString()}</p>
        </div>
        <Link href={`/booking/${p.id}`}
          className="flex-1 bg-brand text-white text-center py-4 rounded-2xl font-semibold text-[15px] tap-effect"
          style={{ fontFamily:'var(--font-syne)' }}>
          Book Now
        </Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily:'var(--font-syne)', fontSize:12, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#9a9a92', marginBottom:12 }}>
        {title}
      </p>
      {children}
    </div>
  )
}
