import Link from 'next/link'
import { Provider } from '@/lib/data'
import StarRating from '@/components/ui/StarRating'

export default function ProviderCard({ provider: p }: { provider: Provider }) {
  return (
    <Link href={`/profile/${p.id}`}>
      <div className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-3 hover:border-ink hover:shadow-lg transition-all duration-200 cursor-pointer">
        {/* Avatar */}
        <div className="w-[68px] h-[68px] rounded-xl bg-stone-100 flex items-center justify-center text-3xl flex-shrink-0">
          {p.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-[15px] leading-tight">{p.name}</p>
              <p className="text-stone-500 text-xs mt-0.5">{p.specialty} · {p.location}</p>
            </div>
            {p.verified && (
              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                ✓ Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={p.rating} count={p.reviewCount} />
            <span className="ml-auto font-semibold text-sm">
              From KSh {p.startingPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-1.5 mt-2 flex-wrap">
            {p.tags.slice(0, 3).map(tag => (
              <span key={tag} className="bg-stone-100 text-stone-600 text-[11px] font-medium px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
