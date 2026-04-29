'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'in'|'up'>('in')
  const [loading, setLoading] = useState(false)
  const [accountType, setAccountType] = useState<'book'|'offer'|null>(null)
  const [loginType, setLoginType] = useState<'user'|'business'>('user')

  const submit = () => {
    setLoading(true)
    if (tab === 'in') {
      // Sign in logic
      if (loginType === 'business') {
        setTimeout(() => router.push('/business/home'), 900)
      } else {
        setTimeout(() => router.push('/home'), 900)
      }
    } else {
      // Create account logic
      if (accountType === 'offer') {
        setTimeout(() => router.push('/business/home'), 900)
      } else {
        setTimeout(() => router.push('/home'), 900)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>

      {/* Top — brand */}
      <div className="flex-none pt-20 pb-10 flex flex-col items-center gap-2 px-6">
        <div style={{ fontFamily:'var(--font-syne)', fontSize:64, fontWeight:800, color:'#fff', letterSpacing:'-3px', lineHeight:1 }}>
          PATA
        </div>
        <p className="text-white/40 text-[12px] tracking-[5px] uppercase" style={{ fontFamily:'var(--font-outfit)' }}>
          Services Near You
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-surface-soft rounded-t-[32px] px-5 pt-7 pb-10">

        {/* Tab switcher */}
        <div className="flex bg-surface-muted rounded-full p-1 mb-6">
          {(['in','up'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-full text-[14px] transition-all duration-200 ${tab===t ? 'bg-brand text-white shadow font-medium' : 'text-ink-muted'}`}
              style={{ fontFamily:'var(--font-outfit)' }}>
              {t==='in' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {tab === 'up' && <Field label="Full Name"    type="text"     ph="Your name" />}
          <Field label="Email"       type="email"    ph="you@example.com" />
          {tab === 'up' && <Field label="Phone"       type="tel"      ph="+254 7XX XXX XXX" />}
          <Field label="Password"    type="password" ph="••••••••" />

          {tab === 'in' && (
            <div>
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-ink-muted mb-3"
                style={{ fontFamily:'var(--font-outfit)' }}>Login Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLoginType('user')}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-medium tap-effect transition-all ${
                    loginType === 'user' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border border-surface-border'
                  }`}
                  style={{ fontFamily:'var(--font-outfit)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  User
                </button>
                <button
                  onClick={() => setLoginType('business')}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-medium tap-effect transition-all ${
                    loginType === 'business' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border border-surface-border'
                  }`}
                  style={{ fontFamily:'var(--font-outfit)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 21h18"/>
                    <path d="M5 21V7l8-4v18"/>
                    <rect x="9" y="9" width="4" height="4"/>
                    <rect x="9" y="14" width="4" height="4"/>
                  </svg>
                  Business
                </button>
              </div>
            </div>
          )}

          {tab === 'up' && (
            <div>
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-ink-muted mb-3"
                style={{ fontFamily:'var(--font-outfit)' }}>Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAccountType('book')}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-medium tap-effect transition-all ${
                    accountType === 'book' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border border-surface-border'
                  }`}
                  style={{ fontFamily:'var(--font-outfit)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="m16 10-4 4-4-4"/>
                  </svg>
                  Book Services
                </button>
                <button
                  onClick={() => setAccountType('offer')}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[14px] font-medium tap-effect transition-all ${
                    accountType === 'offer' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border border-surface-border'
                  }`}
                  style={{ fontFamily:'var(--font-outfit)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  Offer Services
                </button>
              </div>
            </div>
          )}

          <button onClick={submit} disabled={loading}
            className="w-full py-4 rounded-2xl font-semibold text-[15px] mt-2 tap-effect transition-all"
            style={{ background: '#0a0a0a', color:'#fff', fontFamily:'var(--font-outfit)',
              opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Just a sec…' : tab === 'in' ? 'Sign In' : 'Create Account'}
          </button>

          <div className="flex items-center gap-3 text-ink-faint text-[12px]">
            <div className="flex-1 h-px bg-surface-border" />
            or continue with
            <div className="flex-1 h-px bg-surface-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[{icon:'🍎',lbl:'Apple'},{icon:'G',lbl:'Google'}].map(s => (
              <button key={s.lbl} onClick={submit}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-surface-border text-[14px] font-medium tap-effect hover:border-brand transition-all bg-white"
                style={{ fontFamily:'var(--font-outfit)' }}>
                <span className={s.lbl==='Google' ? 'font-bold text-[16px]' : ''}>{s.icon}</span> {s.lbl}
              </button>
            ))}
          </div>

          {tab === 'up' && (
            <p className="text-center text-[12px] text-ink-muted leading-relaxed">
              By signing up you agree to our <span className="text-brand underline cursor-pointer">Terms</span> and <span className="text-brand underline cursor-pointer">Privacy Policy</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, type, ph }: { label:string; type:string; ph:string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-widest uppercase text-ink-muted mb-1.5"
        style={{ fontFamily:'var(--font-outfit)' }}>{label}</label>
      <input type={type} placeholder={ph}
        className="w-full px-4 py-3.5 bg-white border border-surface-border rounded-2xl text-[15px] placeholder:text-ink-faint focus:border-brand transition-all"
        style={{ fontFamily:'var(--font-outfit)' }} />
    </div>
  )
}
