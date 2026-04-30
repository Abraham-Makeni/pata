'use client'
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProviderById } from '@/lib/data'
import { useBookingStore } from '@/store/booking'

const DAYS = ['S','M','T','W','T','F','S']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const TIMES = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM']
const BUSY = new Set([1,4,7,10])

export default function BookingPage({ params }: { params: { id: string } }) {
  const router  = useRouter()
  const store   = useBookingStore()
  const p       = getProviderById(params.id)
  const today   = new Date()

  const [yr,  setYr]  = useState(today.getFullYear())
  const [mo,  setMo]  = useState(today.getMonth())
  const [day, setDay] = useState<number|null>(null)
  const [time,setTime]= useState<string|null>(null)
  const [svc, setSvc] = useState(0)

  if (!p) return null

  const firstDay   = new Date(yr, mo, 1).getDay()
  const daysInMo   = new Date(yr, mo+1, 0).getDate()
  const isPast = (d: number) => new Date(yr,mo,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate())

  const prev = () => { if(mo===0){setMo(11);setYr(y=>y-1)}else setMo(m=>m-1); setDay(null);setTime(null) }
  const next = () => { if(mo===11){setMo(0);setYr(y=>y+1)}else setMo(m=>m+1); setDay(null);setTime(null) }

  const service = p.services[svc]
  const dateStr = day ? `${MONTHS_S[mo]} ${day}, ${yr}` : null
  const canBook = !!day && !!time

  const confirm = () => {
    const ref = 'PATA-' + Math.random().toString(36).slice(2,10).toUpperCase()
    store.setProvider(p); store.setService(service)
    store.setDate(dateStr!); store.setTime(time!); store.setRef(ref)
    router.push('/confirmation')
  }

  return (
    <div className="min-h-screen bg-surface-soft pb-10">
      {/* Header */}
      <div className="bg-brand px-5 pt-14 pb-5">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="img-placeholder w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
          </div>
          <div>
            <h1 style={{ fontFamily:'var(--font-syne)', fontSize:18, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>{p.name}</h1>
            <p className="text-white/50 text-[12px]" style={{ fontFamily:'var(--font-outfit)' }}>{p.location}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-6">
        {/* Service select */}
        <div>
          <Label>Select Service</Label>
          <div className="space-y-2">
            {p.services.map((s,i) => (
              <button key={i} onClick={() => setSvc(i)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border transition-all tap-effect text-left ${
                  svc===i ? 'bg-brand border-brand text-white' : 'bg-white border-surface-border'
                }`}>
                <div>
                  <p style={{ fontFamily:'var(--font-outfit)', fontSize:14, fontWeight:600 }}>{s.name}</p>
                  <p className={`text-[12px] mt-0.5 ${svc===i?'text-white/60':'text-ink-muted'}`} style={{ fontFamily:'var(--font-outfit)' }}>{s.duration}</p>
                </div>
                <p style={{ fontFamily:'var(--font-syne)', fontSize:14, fontWeight:700 }}>{s.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-card p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prev} className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-xl">‹</button>
            <p style={{ fontFamily:'var(--font-syne)', fontSize:15, fontWeight:700 }}>{MONTHS[mo]} {yr}</p>
            <button onClick={next} className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-xl">›</button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d,i) => <div key={i} className="text-center text-[10px] font-bold text-ink-faint py-1 tracking-wider" style={{ fontFamily:'var(--font-syne)' }}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({length: firstDay}).map((_,i) => <div key={`e${i}`}/>)}
            {Array.from({length: daysInMo}).map((_,i) => {
              const d = i+1
              const past = isPast(d)
              const sel  = d === day
              const tod  = d === today.getDate() && mo === today.getMonth() && yr === today.getFullYear()
              return (
                <button key={d} disabled={past} onClick={() => { setDay(d); setTime(null) }}
                  className={`aspect-square flex items-center justify-center text-[14px] rounded-full mx-auto w-9 transition-all
                    ${past ? 'text-ink-faint cursor-not-allowed' :
                      sel  ? 'bg-brand text-white font-semibold' :
                      tod  ? 'ring-2 ring-brand font-bold' :
                      'hover:bg-surface-muted'}`}
                  style={{ fontFamily:'var(--font-outfit)' }}>{d}</button>
              )
            })}
          </div>
        </div>

        {/* Times */}
        {day && (
          <div>
            <Label>Available Times — {MONTHS_S[mo]} {day}</Label>
            <div className="grid grid-cols-3 gap-2">
              {TIMES.map((t,i) => {
                const busy = BUSY.has(i)
                const sel  = t === time
                return (
                  <button key={t} disabled={busy} onClick={() => setTime(t)}
                    className={`py-3 rounded-2xl border text-[13px] font-medium transition-all tap-effect
                      ${busy ? 'bg-surface-muted text-ink-faint border-transparent cursor-not-allowed line-through' :
                        sel  ? 'bg-brand text-white border-brand' :
                        'bg-white border-surface-border hover:border-brand'}`}
                    style={{ fontFamily:'var(--font-outfit)' }}>{t}</button>
                )
              })}
            </div>
          </div>
        )}

        {/* Summary */}
        {canBook && (
          <div className="bg-white rounded-card p-4 shadow-card">
            <Label>Booking Summary</Label>
            {[
              ['Provider', p.name],
              ['Service',  service.name],
              ['Date',     dateStr!],
              ['Time',     time!],
              ['Total',    service.price],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between items-center py-3 border-b border-surface-border last:border-0">
                <span className="text-ink-muted text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>{k}</span>
                <span style={{ fontFamily: k==='Total'?'var(--font-syne)':'var(--font-outfit)', fontWeight: k==='Total'?700:500, fontSize:13 }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={confirm} disabled={!canBook}
          className={`w-full py-4 rounded-2xl font-semibold text-[15px] transition-all tap-effect ${
            canBook ? 'bg-brand text-white' : 'bg-surface-muted text-ink-faint cursor-not-allowed'
          }`} style={{ fontFamily:'var(--font-syne)' }}>
          {canBook ? 'Confirm Booking' : 'Select a date & time'}
        </button>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily:'var(--font-syne)', fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#9a9a92', marginBottom:10 }}>{children}</p>
}
