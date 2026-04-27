'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => router.push('/home'), 800)
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      {/* Hero top */}
      <div className="flex-none px-6 pt-20 pb-10 text-center">
        <h1 className="font-serif text-white text-[56px] font-semibold tracking-tight leading-none">
          PATA
        </h1>
        <p className="text-stone-400 text-[12px] tracking-[4px] uppercase font-light mt-2">
          Find Your Style
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-chalk rounded-t-[28px] px-6 pt-8 pb-12">
        {/* Tab */}
        <div className="flex bg-stone-100 rounded-full p-1 mb-7">
          {(['signin', 'signup'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200
                ${tab === t ? 'bg-ink text-chalk shadow-sm' : 'text-stone-500 hover:text-ink'}`}
            >
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Sign In Form */}
        {tab === 'signin' && (
          <div className="space-y-4 page-enter">
            <Field label="Email" type="email" placeholder="you@example.com" />
            <Field label="Password" type="password" placeholder="••••••••" />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-ink text-chalk py-4 rounded-2xl font-semibold text-[15px] mt-2 hover:bg-stone-700 transition-all disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <Divider />
            <SocialButtons onPress={handleSubmit} />
          </div>
        )}

        {/* Sign Up Form */}
        {tab === 'signup' && (
          <div className="space-y-4 page-enter">
            <Field label="Full Name" type="text" placeholder="Your name" />
            <Field label="Email" type="email" placeholder="you@example.com" />
            <Field label="Phone" type="tel" placeholder="+254 7XX XXX XXX" />
            <Field label="Password" type="password" placeholder="Create a password" />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-ink text-chalk py-4 rounded-2xl font-semibold text-[15px] mt-2 hover:bg-stone-700 transition-all disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <Divider />
            <SocialButtons onPress={handleSubmit} />
            <p className="text-center text-[12px] text-stone-400 leading-relaxed mt-2">
              By signing up you agree to our{' '}
              <Link href="#" className="text-ink underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" className="text-ink underline">Privacy Policy</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-wider uppercase text-stone-500 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-stone-100 border border-transparent rounded-xl text-[15px] outline-none focus:border-ink focus:bg-white transition-all placeholder:text-stone-400"
      />
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 text-stone-400 text-[13px]">
      <div className="flex-1 h-px bg-stone-200" />
      or continue with
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  )
}

function SocialButtons({ onPress }: { onPress: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[{ icon: '🍎', label: 'Apple' }, { icon: '🌐', label: 'Google' }].map(s => (
        <button
          key={s.label}
          onClick={onPress}
          className="flex items-center justify-center gap-2 py-3 border border-stone-200 rounded-xl text-[14px] font-medium hover:border-ink hover:bg-stone-50 transition-all"
        >
          {s.icon} {s.label}
        </button>
      ))}
    </div>
  )
}
