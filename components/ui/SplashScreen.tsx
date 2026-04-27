'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SplashScreen() {
  const router = useRouter()
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 300)
    const t2 = setTimeout(() => setPhase('out'), 1800)
    const t3 = setTimeout(() => router.replace('/auth'), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [router])

  return (
    <div
      className={`fixed inset-0 bg-ink flex flex-col items-center justify-center z-[9999] transition-opacity duration-500
        ${phase === 'out' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div
        className={`transition-all duration-700 ease-out
          ${phase === 'in' ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'}`}
      >
        <h1 className="font-serif text-white text-[72px] font-semibold tracking-tight leading-none">
          PATA
        </h1>
        <p className="text-stone-400 text-[13px] tracking-[4px] uppercase font-light text-center mt-2">
          Find Your Style
        </p>
      </div>
      <div
        className={`w-1 h-1 rounded-full bg-white mt-10 transition-all duration-500
          ${phase === 'in' ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  )
}
