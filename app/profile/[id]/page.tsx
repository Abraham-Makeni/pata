'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProviderById, Provider } from '@/lib/data'
import StarRating from '@/components/ui/StarRating'
import { ProfileSkeleton } from '@/components/ui/Skeletons'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [provider, setProvider] = useState<Provider | null>(null)

  useEffect(() => {
    // Simulate loading and fetch provider data
    const timer = setTimeout(() => {
      const p = getProviderById(params.id)
      setProvider(p || null)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [params.id])

  if (isLoading) {
    return <ProfileSkeleton />
  }

  const p = provider

  if (!p) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-2xl">404</p>
        <p className="text-stone-500">Provider not found</p>
        <Link href="/home" className="text-ink underline text-sm">← Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-chalk">
      {/* Cover */}
      <div className="relative">
        <div className="h-[220px] relative">
          <img 
            src={p.image} 
            alt={p.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ink/80 to-stone-600/80"></div>
        </div>
        {/* Back btn */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-base border border-white/20 hover:bg-black/60 transition-all"
        >
          ←
        </button>
        {/* Avatar */}
        <div className="absolute -bottom-10 left-5 w-20 h-20 rounded-[18px] overflow-hidden border-[3px] border-chalk shadow-lg">
          <img 
            src={p.image} 
            alt={p.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pt-14 pb-28">
        {/* Name + verified */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-[26px] font-semibold leading-tight">{p.name}</h1>
            <p className="text-stone-500 text-[14px] mt-1">{p.specialty} · {p.location}</p>
          </div>
          {p.verified && (
            <span className="text-[12px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-medium mt-1">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { num: p.rating.toFixed(1), lbl: 'Rating' },
            { num: p.reviewCount,       lbl: 'Reviews' },
            { num: p.bookings,          lbl: 'Bookings' },
          ].map(s => (
            <div key={s.lbl} className="bg-stone-100 rounded-xl p-3 text-center">
              <div className="font-serif text-[20px] font-semibold">{s.num}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* WhatsApp Contact */}
        <a
          href={`https://wa.me/${p.phone?.replace(/\D/g, '') || ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-4 bg-green-500 text-white py-3 rounded-xl font-medium text-[14px] hover:bg-green-600 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
          </svg>
          Contact on WhatsApp
        </a>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mt-4">
          {p.tags.map((tag: string) => (
            <span key={tag} className="bg-stone-100 text-stone-600 text-[12px] font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* About */}
        <SectionLabel>About</SectionLabel>
        <p className="text-[14px] leading-relaxed text-stone-600">{p.about}</p>

        {/* Portfolio gallery */}
        <SectionLabel>Portfolio</SectionLabel>
        <div className="grid grid-cols-3 gap-1.5">
          {p.gallery.map((item: string, i: number) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-[28px] hover:scale-[1.03] transition-transform cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Services & Pricing */}
        <SectionLabel>Services & Pricing</SectionLabel>
        <div className="space-y-2">
          {p.services.map((s: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3.5 bg-stone-100 rounded-xl"
            >
              <div>
                <p className="text-[14px] font-medium">{s.name}</p>
                <p className="text-[12px] text-stone-400 mt-0.5">{s.duration}</p>
              </div>
              <p className="font-semibold text-[14px]">{s.price}</p>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <SectionLabel>Reviews</SectionLabel>
        <div className="space-y-3">
          {p.reviews.map((r: any) => (
            <div key={r.id} className="bg-white border border-stone-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-[14px] font-semibold">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[13px]">{r.author}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                      <StarRating rating={r.rating} size="sm" />
                      <span>·</span>
                      <span>{r.date}</span>
                    </div>
                  </div>
                </div>
                {r.wouldRecommend && (
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-[11px] font-medium">
                    <span>👍</span>
                    <span>Recommends</span>
                  </div>
                )}
              </div>
              
              <p className="text-[13px] leading-relaxed text-stone-600 mb-3">{r.text}</p>
              
              {/* Review Tags */}
              {r.tags && r.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {r.tags.map((tag: string) => (
                    <span key={tag} className="bg-stone-100 text-stone-600 text-[11px] font-medium px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Book Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] glass border-t border-stone-200 px-5 py-4 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Starting from</p>
          <p className="font-serif text-[22px] font-semibold">
            KSh {p.startingPrice.toLocaleString()}
          </p>
        </div>
        <Link
          href={`/booking/${p.id}`}
          className="flex-1 bg-ink text-chalk py-4 rounded-2xl font-semibold text-[15px] text-center hover:bg-stone-700 transition-all"
        >
          Book Now
        </Link>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[1.5px] uppercase text-stone-400 mt-7 mb-3">
      {children}
    </p>
  )
}
