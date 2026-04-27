type Props = { rating: number; count?: number; size?: 'sm' | 'md' }

export default function StarRating({ rating, count, size = 'sm' }: Props) {
  const sz = size === 'sm' ? 'text-xs' : 'text-sm'
  return (
    <span className={`flex items-center gap-1 ${sz} font-semibold`}>
      <span className="text-amber-500">⭐</span>
      <span>{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-stone-400 font-normal">({count})</span>
      )}
    </span>
  )
}
