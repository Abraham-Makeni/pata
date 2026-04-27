'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBookingStore } from '@/store/booking'

export default function ConfirmationPage() {
  const router = useRouter()
  const { provider, service, date, time, ref, reset } = useBookingStore()

  // Guard: if someone lands here with no booking, redirect home
  useEffect(() => {
    if (!provider) router.replace('/home')
  }, [provider, router])

  if (!provider || !service) return null

  const handleDone = () => {
    reset()
    router.push('/home')
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center">
      {/* Checkmark */}
      <div className="w-20 h-20 rounded-full bg-chalk flex items-center justify-center text-4xl mb-6 animate-pop shadow-2xl">
        ✓
      </div>

      <h1 className="font-serif text-white text-[32px] font-semibold leading-tight mb-2">
        You&apos;re Booked!
      </h1>
      <p className="text-stone-400 text-[14px] leading-relaxed mb-8 max-w-xs">
        Your appointment is confirmed.<br />
        You&apos;ll get a reminder 1 hour before.
      </p>

      {/* Booking card */}
      <div className="glass-card rounded-2xl p-5 w-full max-w-xs text-left mb-8 space-y-0">
        {[
          { key: 'Provider', val: provider.name },
          { key: 'Service',  val: service.name },
          { key: 'Date',     val: date ?? '—' },
          { key: 'Time',     val: time ?? '—' },
          { key: 'Total',    val: service.price },
          { key: 'Ref',      val: ref ?? '—' },
        ].map(row => (
          <div
            key={row.key}
            className="flex justify-between py-3 border-b border-white/10 last:border-0"
          >
            <span className="text-stone-400 text-[13px]">{row.key}</span>
            <span className={`text-white text-[13px] font-medium ${row.key === 'Ref' ? 'font-mono text-xs' : ''}`}>
              {row.val}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={handleDone}
          className="w-full bg-chalk text-ink py-4 rounded-2xl font-semibold text-[15px] hover:bg-stone-200 transition-all active:scale-[0.98]"
        >
          Back to Home
        </button>
        <Link
          href={`/profile/${provider.id}`}
          className="block w-full py-4 rounded-2xl font-semibold text-[15px] text-center text-white border border-white/20 hover:bg-white/10 transition-all"
        >
          View Provider
        </Link>
      </div>
    </div>
  )
}
