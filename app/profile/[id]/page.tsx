'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProviderById } from '@/lib/data'
import StarRating from '@/components/ui/StarRating'

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const p = getProviderById(params.id)

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
        <div className="h-[220px] bg-gradient-to-br from-ink to-stone-600 flex items-center justify-center text-[72px]">
          {p.emoji}
        </div>
        {/* Back btn */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-base border border-white/20 hover:bg-black/60 transition-all"
        >
          ←
        </button>
        {/* Avatar */}
        <div className="absolute -bottom-10 left-5 w-20 h-20 rounded-[18px] bg-stone-100 border-[3px] border-chalk flex items-center justify-center text-4xl shadow-lg">
          {p.emoji}
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

        {/* Tags */}
        <div className="flex gap-2 flex-wrap mt-4">
          {p.tags.map(tag => (
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
          {p.gallery.map((item, i) => (
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
          {p.services.map((s, i) => (
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
          {p.reviews.map(r => (
            <div key={r.id} className="bg-white border border-stone-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
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
              <p className="text-[13px] leading-relaxed text-stone-600">{r.text}</p>
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
