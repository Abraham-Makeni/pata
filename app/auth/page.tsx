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
          Get Things Done
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
      <button
        onClick={onPress}
        className="flex items-center justify-center gap-2 py-3 border border-stone-200 rounded-xl text-[14px] font-medium hover:border-ink hover:bg-stone-50 transition-all"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>
      <button
        onClick={onPress}
        className="flex items-center justify-center gap-2 py-3 border border-stone-200 rounded-xl text-[14px] font-medium hover:border-ink hover:bg-stone-50 transition-all"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        Apple
      </button>
    </div>
  )
}
