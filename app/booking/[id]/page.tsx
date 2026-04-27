'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import { getProviderById } from '@/lib/data'
import { useBookingStore } from '@/store/booking'

const DAYS    = ['SUN','MON','TUE','WED','THU','FRI','SAT']
const MONTHS  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM',
]
const UNAVAILABLE_INDICES = new Set([1, 4, 7, 10])

export default function BookingPage({ params }: { params: { id: string } }) {
  const router   = useRouter()
  const provider = getProviderById(params.id)
  const store    = useBookingStore()

  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [day,   setDay]   = useState<number | null>(null)
  const [time,  setTime]  = useState<string | null>(null)
  const [selectedServiceIdx, setServiceIdx] = useState(0)

  if (!provider) return null

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth     = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setDay(null); setTime(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setDay(null); setTime(null)
  }

  const isPast = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const service = provider.services[selectedServiceIdx]
  const dateStr = day ? `${MONTHS_SHORT[month]} ${day}, ${year}` : null
  const canBook = !!day && !!time

  const handleConfirm = () => {
    const ref = 'PATA-' + Math.random().toString(36).slice(2, 10).toUpperCase()
    store.setProvider(provider)
    store.setService(service)
    store.setDate(dateStr ?? '')
    store.setTime(time ?? '')
    store.setRef(ref)
    router.push('/confirmation')
  }

  return (
    <div className="min-h-screen bg-chalk">
      <Navbar showBack title="Book a Session" rightSlot={<span />} />

      <div className="px-5 pb-10">
        {/* Provider header */}
        <div className="flex items-center gap-3 py-4 border-b border-stone-100 mb-5">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-2xl">
            {provider.emoji}
          </div>
          <div>
            <p className="font-semibold text-[15px]">{provider.name}</p>
            <p className="text-stone-500 text-[13px]">{provider.location}</p>
          </div>
        </div>

        {/* Service selector */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">Select Service</p>
        <div className="space-y-2 mb-6">
          {provider.services.map((s, i) => (
            <button
              key={i}
              onClick={() => setServiceIdx(i)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-left
                ${selectedServiceIdx === i
                  ? 'border-ink bg-ink text-chalk'
                  : 'border-stone-200 bg-white hover:border-stone-400'
                }`}
            >
              <div>
                <p className="font-medium text-[14px]">{s.name}</p>
                <p className={`text-[12px] mt-0.5 ${selectedServiceIdx === i ? 'text-stone-300' : 'text-stone-400'}`}>
                  {s.duration}
                </p>
              </div>
              <p className="font-semibold text-[14px]">{s.price}</p>
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-lg hover:bg-stone-200 transition-all">
            ‹
          </button>
          <p className="font-semibold text-[15px]">{MONTHS[month]} {year}</p>
          <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-lg hover:bg-stone-200 transition-all">
            ›
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-stone-400 py-1 tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d      = i + 1
            const past   = isPast(d)
            const sel    = d === day
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            return (
              <button
                key={d}
                disabled={past}
                onClick={() => { setDay(d); setTime(null) }}
                className={`aspect-square flex items-center justify-center text-[14px] rounded-full mx-auto w-9 transition-all
                  ${past  ? 'text-stone-300 cursor-not-allowed' :
                    sel   ? 'bg-ink text-chalk font-semibold' :
                    isToday ? 'font-bold text-ink hover:bg-stone-100' :
                    'text-ink hover:bg-stone-100'
                  }`}
              >
                {d}
              </button>
            )
          })}
        </div>

        {/* Time slots */}
        {day && (
          <div className="mt-7">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Available Times — {MONTHS_SHORT[month]} {day}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((t, i) => {
                const unavail = UNAVAILABLE_INDICES.has(i)
                const sel = t === time
                return (
                  <button
                    key={t}
                    disabled={unavail}
                    onClick={() => setTime(t)}
                    className={`py-3 rounded-xl border text-[13px] font-medium transition-all
                      ${unavail ? 'bg-stone-100 text-stone-300 border-stone-100 cursor-not-allowed line-through' :
                        sel     ? 'bg-ink text-chalk border-ink' :
                        'bg-white text-ink border-stone-200 hover:border-ink'
                      }`}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Summary */}
        {canBook && (
          <div className="mt-7 bg-stone-100 rounded-2xl p-4 space-y-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-3">Booking Summary</p>
            {[
              { label: 'Provider', value: provider.name },
              { label: 'Service',  value: service.name },
              { label: 'Date',     value: dateStr ?? '' },
              { label: 'Time',     value: time ?? '' },
              { label: 'Total',    value: service.price },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2.5 border-b border-stone-200 last:border-0">
                <span className="text-stone-500 text-[14px]">{row.label}</span>
                <span className={`text-[14px] font-semibold ${row.label === 'Total' ? 'font-bold' : ''}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Confirm btn */}
        <button
          onClick={handleConfirm}
          disabled={!canBook}
          className={`w-full mt-6 py-4 rounded-2xl font-semibold text-[15px] transition-all
            ${canBook
              ? 'bg-ink text-chalk hover:bg-stone-700 active:scale-[0.98]'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
        >
          {canBook ? 'Confirm Booking' : 'Select a date and time'}
        </button>
      </div>
    </div>
  )
}
