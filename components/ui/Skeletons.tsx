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
        <div className="flex gap-2 mt-2">
          <div className="skeleton h-2 w-8 rounded-full" />
          <div className="skeleton h-2 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center gap-3 hover:border-ink transition-all duration-200">
      <div className="w-12 h-12 rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1">
        <div className="skeleton h-4 w-2/3 rounded mb-1" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
      <div className="skeleton h-6 w-12 rounded-full" />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-chalk">
      {/* Cover skeleton */}
      <div className="relative">
        <div className="h-[220px] skeleton" />
        <div className="absolute -bottom-10 left-5 w-20 h-20 rounded-[18px] skeleton border-[3px] border-chalk" />
      </div>
      
      {/* Body skeleton */}
      <div className="px-5 pt-14 pb-28 space-y-4">
        <div className="space-y-2">
          <div className="skeleton h-8 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-stone-100 rounded-xl p-3 text-center">
              <div className="skeleton h-6 w-12 mx-auto rounded mb-1" />
              <div className="skeleton h-3 w-16 mx-auto rounded" />
            </div>
          ))}
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2">
          {[1,2,3].map(i => (
            <div key={i} className="skeleton h-6 w-20 rounded-full" />
          ))}
        </div>
        
        {/* Content sections */}
        {[1,2,3].map(i => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="space-y-1">
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-4 w-4/6 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
