import Link from 'next/link'
import { Provider, calculateDistance } from '@/lib/data'
import StarRating from '@/components/ui/StarRating'

export default function FeaturedCard({ provider: p }: { provider: Provider }) {
  // Calculate distance from Nairobi CBD
  const distance = calculateDistance(
    -1.2921, 36.8219, // Nairobi CBD
    p.coordinates.lat, 
    p.coordinates.lng
  )
  
  return (
    <Link href={`/profile/${p.id}`}>
      <div className="w-[180px] rounded-2xl overflow-hidden bg-stone-100 cursor-pointer hover:scale-[1.02] transition-transform duration-200 flex-shrink-0">
        {/* Image area */}
        <div className="w-full h-[130px] relative">
          <img 
            src={p.image} 
            alt={p.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-0.5 text-[11px] font-semibold flex items-center gap-0.5">
            ★ {p.rating}
          </div>
          {distance <= 2 && (
            <div className="absolute top-2 left-2 bg-ink text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
              Near you
            </div>
          )}
        </div>
        {/* Body */}
        <div className="p-3">
          <p className="font-semibold text-[13px] leading-tight">{p.name}</p>
          <p className="text-stone-500 text-[11px] mt-0.5">{p.specialty}</p>
          
          {/* Trust Signals */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-stone-500">
            <span className="flex items-center gap-0.5">
              <span>🔥</span>
              <span>{p.bookedCount}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span>👥</span>
              <span>{p.repeatClients}</span>
            </span>
          </div>
          
          <p className="font-semibold text-[12px] mt-1.5">
            From KSh {p.startingPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  )
}
