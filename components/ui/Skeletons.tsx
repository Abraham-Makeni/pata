export function ProviderCardSkeleton() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-3">
      <div className="w-[68px] h-[68px] rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  )
}

export function FeaturedCardSkeleton() {
  return (
    <div className="w-[180px] rounded-2xl overflow-hidden flex-shrink-0">
      <div className="skeleton h-[130px] w-full" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  )
}
