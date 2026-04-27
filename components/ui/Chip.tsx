type Props = {
  label: string
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export default function Chip({ label, active = false, onClick, size = 'md' }: Props) {
  const pad = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-[13px]'
  return (
    <button
      onClick={onClick}
      className={`rounded-full font-medium border transition-all whitespace-nowrap ${pad}
        ${active
          ? 'bg-ink text-chalk border-ink'
          : 'bg-white text-ink border-stone-200 hover:border-ink hover:bg-stone-50'
        }`}
    >
      {label}
    </button>
  )
}
