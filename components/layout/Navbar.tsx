'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type NavbarProps = {
  title?: string
  showBack?: boolean
  backHref?: string
  rightSlot?: React.ReactNode
  dark?: boolean
  transparent?: boolean
}

export default function Navbar({
  title,
  showBack = false,
  backHref,
  rightSlot,
  dark = false,
  transparent = false,
}: NavbarProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) router.push(backHref)
    else router.back()
  }

  const base = transparent
    ? 'bg-transparent'
    : dark
    ? 'glass-dark border-b border-white/10'
    : 'glass'

  return (
    <nav className={`sticky top-0 z-50 px-4 h-14 flex items-center justify-between ${base}`}>
      {/* Left */}
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={handleBack}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all
              ${dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
          >
            ←
          </button>
        ) : (
          <Link href="/home">
            <span className={`font-sans text-2xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-black'}`}>
              PATA
            </span>
          </Link>
        )}
        {title && (
          <span className={`font-sans text-xl font-medium ${dark ? 'text-white' : 'text-black'}`}>
            {title}
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {rightSlot ?? (
          !showBack && (
            <>
              <button className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all font-sans
                ${dark ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}>
                🔔
              </button>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-semibold cursor-pointer">
                AK
              </div>
            </>
          )
        )}
      </div>
    </nav>
  )
}
