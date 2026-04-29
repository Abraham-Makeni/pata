'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function SecuritySettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [biometric, setBiometric] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('1hour')

  return (
    <div className="min-h-screen bg-surface-soft pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand to-brand/90 px-5 pt-14 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/profile/me" className="text-white/80 hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 
              className="tracking-tight" 
              style={{ 
                fontFamily:'var(--font-syne)', 
                fontSize:24, 
                fontWeight:800, 
                color:'#fff', 
                letterSpacing:'-0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Sign In & Security
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 pb-8">
        <div className="space-y-6">
          {/* Security Status */}
          <section>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <div>
                  <h3 
                    className="text-[16px] font-semibold text-green-800 mb-1" 
                    style={{ fontFamily:'var(--font-syne)' }}
                  >
                    Your Account is Secure
                  </h3>
                  <p className="text-[13px] text-green-700" style={{ fontFamily:'var(--font-outfit)' }}>
                    Security score: 8/10 - Good protection
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Two-Factor Authentication */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 border-b border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <div>
                      <h3 
                        className="text-[16px] font-semibold mb-1" 
                        style={{ fontFamily:'var(--font-syne)' }}
                      >
                        Two-Factor Authentication
                      </h3>
                      <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      twoFactor ? 'bg-brand' : 'bg-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      twoFactor ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
              
              {twoFactor && (
                <div className="p-4 space-y-3">
                  <div className="bg-surface-soft rounded-xl p-3">
                    <p className="text-[13px] font-medium mb-2" style={{ fontFamily:'var(--font-outfit)' }}>
                      2FA Methods:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                          <span className="text-[12px]" style={{ fontFamily:'var(--font-outfit)' }}>
                            SMS +254 712 *** 678
                          </span>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                          <span className="text-[12px]" style={{ fontFamily:'var(--font-outfit)' }}>
                            Email: a***@example.com
                          </span>
                        </div>
                        <button className="text-[12px] text-brand font-medium">Setup</button>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-surface-border rounded-xl text-[13px] font-semibold text-ink-secondary hover:bg-surface-muted transition-all tap-effect" style={{ fontFamily:'var(--font-outfit)' }}>
                    Change 2FA Settings
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Biometric Authentication */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 border-b border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <div>
                      <h3 
                        className="text-[16px] font-semibold mb-1" 
                        style={{ fontFamily:'var(--font-syne)' }}
                      >
                        Biometric Authentication
                      </h3>
                      <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                        Use fingerprint or face ID
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setBiometric(!biometric)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      biometric ? 'bg-brand' : 'bg-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      biometric ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
              
              {biometric && (
                <div className="p-4 space-y-3">
                  <div className="bg-surface-soft rounded-xl p-3">
                    <p className="text-[13px] font-medium mb-2" style={{ fontFamily:'var(--font-outfit)' }}>
                      Available methods:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded-lg p-2">
                        <span className="text-[12px]" style={{ fontFamily:'var(--font-outfit)' }}>
                          Fingerprint
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg p-2">
                        <span className="text-[12px]" style={{ fontFamily:'var(--font-outfit)' }}>
                          Face ID
                        </span>
                        <span className="text-[12px] text-ink-muted">Not available</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Session Management */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <div>
                  <h3 
                    className="text-[16px] font-semibold mb-1" 
                    style={{ fontFamily:'var(--font-syne)' }}
                  >
                    Session Management
                  </h3>
                  <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                    Control how long you stay signed in
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                    Auto-logout after
                  </span>
                  <select 
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="text-[13px] bg-surface-soft rounded-lg px-3 py-2 border border-surface-border" 
                    style={{ fontFamily:'var(--font-outfit)' }}
                  >
                    <option value="30min">30 minutes</option>
                    <option value="1hour">1 hour</option>
                    <option value="4hours">4 hours</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <button className="w-full py-2 border border-surface-border rounded-xl text-[13px] font-semibold text-ink-secondary hover:bg-surface-muted transition-all tap-effect" style={{ fontFamily:'var(--font-outfit)' }}>
                  Sign Out All Other Devices
                </button>
              </div>
            </div>
          </section>

          {/* Password */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <div>
                  <h3 
                    className="text-[16px] font-semibold mb-1" 
                    style={{ fontFamily:'var(--font-syne)' }}
                  >
                    Password
                  </h3>
                  <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                    Change your password
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-surface-soft rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                      Password strength
                    </span>
                    <span className="text-[13px] text-green-600 font-medium">Strong</span>
                  </div>
                  <div className="w-full bg-surface-border rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
                <button className="w-full py-3 bg-brand text-white rounded-xl text-[14px] font-semibold hover:bg-brand/90 transition-all tap-effect" style={{ fontFamily:'var(--font-outfit)' }}>
                  Change Password
                </button>
              </div>
            </div>
          </section>

          {/* Login Activity */}
          <section>
            <div className="bg-surface-soft rounded-2xl p-4">
              <h3 
                className="text-[16px] font-semibold mb-3" 
                style={{ fontFamily:'var(--font-syne)' }}
              >
                Recent Login Activity
              </h3>
              <div className="space-y-2 text-[13px] text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>
                <div className="flex items-center justify-between">
                  <span>Today, 2:30 PM</span>
                  <span className="text-green-600">✓ This device</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Yesterday, 6:15 PM</span>
                  <span className="text-ink-muted">iPhone 12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dec 20, 10:00 AM</span>
                  <span className="text-ink-muted">Windows PC</span>
                </div>
              </div>
              <button className="w-full mt-3 py-2 border border-surface-border rounded-xl text-[13px] font-semibold text-ink-secondary hover:bg-surface-muted transition-all tap-effect" style={{ fontFamily:'var(--font-outfit)' }}>
                View Full Activity
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
