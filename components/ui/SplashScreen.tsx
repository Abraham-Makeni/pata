'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SplashScreen() {
  const router = useRouter()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 1900)
    const nav  = setTimeout(() => router.replace('/auth'), 2400)
    return () => { clearTimeout(hide); clearTimeout(nav) }
  }, [router])

  return (
    <div className={`fixed inset-0 z-[9999] bg-brand flex flex-col items-center justify-center
      transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

      {/* Logo mark */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="text-white"
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: '-4px',
            lineHeight: 1,
            animation: 'splashLogo 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both',
          }}
        >
          PATA
        </div>
        <div
          className="text-white/40 tracking-[6px] uppercase text-[11px] font-light"
          style={{
            fontFamily: 'var(--font-outfit)',
            animation: 'splashLogo 0.6s ease 0.5s both',
          }}
        >
          Services Near You
        </div>
      </div>

      {/* Loading bar */}
      <div className="absolute bottom-16 w-12 h-[2px] bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/60 rounded-full" style={{ animation: 'loadBar 1.6s ease 0.3s both' }} />
      </div>

      <style>{`
        @keyframes splashLogo {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes loadBar {
          from { width:0%; }
          to   { width:100%; }
        }
      `}</style>
    </div>
  )
}
