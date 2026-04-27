'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBookingStore } from '@/store/booking'

export default function ConfirmationPage() {
  const router = useRouter()
  const { provider, service, date, time, ref, reset } = useBookingStore()

  useEffect(() => { if (!provider) router.replace('/home') }, [provider, router])
  if (!provider || !service) return null

  const done = () => { reset(); router.push('/home') }

  return (
    <div className="min-h-screen bg-brand flex flex-col items-center justify-center px-6 py-12">

      {/* Check */}
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 animate-pop shadow-2xl">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h1 style={{ fontFamily:'var(--font-syne)', fontSize:36, fontWeight:800, color:'#fff', letterSpacing:'-2px', textAlign:'center', marginBottom:8 }}>
        Booked!
      </h1>
      <p className="text-white/50 text-[14px] text-center leading-relaxed mb-8" style={{ fontFamily:'var(--font-outfit)' }}>
        Your appointment is confirmed.<br/>Reminder sent 1 hour before.
      </p>

      {/* Booking card */}
      <div className="w-full max-w-xs rounded-card p-5 mb-8" style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)' }}>
        {[
          ['Provider', provider.name],
          ['Service',  service.name],
          ['Date',     date ?? '—'],
          ['Time',     time ?? '—'],
          ['Total',    service.price],
          ['Ref #',    ref ?? '—'],
        ].map(([k,v]) => (
          <div key={k} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
            <span className="text-white/40 text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>{k}</span>
            <span className={`text-white text-[13px] font-medium ${k==='Ref #'?'font-mono text-[11px]':''}`} style={{ fontFamily: k==='Ref #'?'monospace':'var(--font-outfit)' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-3">
        <button onClick={done}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-white text-brand tap-effect hover:bg-white/90 transition-all"
          style={{ fontFamily:'var(--font-syne)' }}>
          Back to Home
        </button>
        <button onClick={() => router.push(`/profile/${provider.id}`)}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] text-white tap-effect transition-all"
          style={{ fontFamily:'var(--font-syne)', border:'1px solid rgba(255,255,255,0.2)' }}>
          View Provider
        </button>
      </div>
    </div>
  )
}
