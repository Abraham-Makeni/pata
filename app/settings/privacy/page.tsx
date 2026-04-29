'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function PrivacySettingsPage() {
  const [locationSharing, setLocationSharing] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [dataCollection, setDataCollection] = useState(true)
  const [analytics, setAnalytics] = useState(false)

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
              Privacy Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 pb-8">
        <div className="space-y-6">
          {/* Location Privacy */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 border-b border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                      <h3 
                        className="text-[16px] font-semibold mb-1" 
                        style={{ fontFamily:'var(--font-syne)' }}
                      >
                        Location Services
                      </h3>
                      <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                        Allow app to access your location
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLocationSharing(!locationSharing)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      locationSharing ? 'bg-brand' : 'bg-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      locationSharing ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
              
              {locationSharing && (
                <div className="p-4 space-y-3">
                  <div className="bg-surface-soft rounded-xl p-3">
                    <p className="text-[13px] font-medium mb-2" style={{ fontFamily:'var(--font-outfit)' }}>
                      Location is used for:
                    </p>
                    <ul className="space-y-1 text-[12px] text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>
                      <li>• Finding nearby service providers</li>
                      <li>• Showing accurate travel times</li>
                      <li>• Location-based recommendations</li>
                    </ul>
                  </div>
                  <button className="w-full py-2 border border-surface-border rounded-xl text-[13px] font-semibold text-ink-secondary hover:bg-surface-muted transition-all tap-effect" style={{ fontFamily:'var(--font-outfit)' }}>
                    Manage Location Permissions
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Profile Visibility */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 border-b border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <div>
                      <h3 
                        className="text-[16px] font-semibold mb-1" 
                        style={{ fontFamily:'var(--font-syne)' }}
                      >
                        Profile Visibility
                      </h3>
                      <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                        Make your profile visible to others
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setProfileVisibility(!profileVisibility)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      profileVisibility ? 'bg-brand' : 'bg-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      profileVisibility ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
              
              {profileVisibility && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                      Who can see your profile
                    </span>
                    <select className="text-[13px] bg-surface-soft rounded-lg px-3 py-2 border border-surface-border" style={{ fontFamily:'var(--font-outfit)' }}>
                      <option>Everyone</option>
                      <option>Service providers only</option>
                      <option>No one</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                      Show phone number
                    </span>
                    <button className="relative w-12 h-6 rounded-full bg-brand transition-colors duration-200">
                      <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-6 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 border-b border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                    </div>
                    <div>
                      <h3 
                        className="text-[16px] font-semibold mb-1" 
                        style={{ fontFamily:'var(--font-syne)' }}
                      >
                        Data Collection
                      </h3>
                      <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                        Allow us to collect usage data
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDataCollection(!dataCollection)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      dataCollection ? 'bg-brand' : 'bg-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      dataCollection ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
              
              {dataCollection && (
                <div className="p-4 space-y-3">
                  <div className="bg-surface-soft rounded-xl p-3">
                    <p className="text-[13px] font-medium mb-2" style={{ fontFamily:'var(--font-outfit)' }}>
                      We collect:
                    </p>
                    <ul className="space-y-1 text-[12px] text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>
                      <li>• App usage statistics</li>
                      <li>• Booking patterns</li>
                      <li>• Search queries (anonymized)</li>
                      <li>• Crash reports</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                      Share anonymous analytics
                    </span>
                    <button
                      onClick={() => setAnalytics(!analytics)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        analytics ? 'bg-brand' : 'bg-surface-border'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        analytics ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Data Management */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div>
                  <h3 
                    className="text-[16px] font-semibold mb-1" 
                    style={{ fontFamily:'var(--font-syne)' }}
                  >
                    Data Management
                  </h3>
                  <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                    Control your personal data
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-3 border border-surface-border rounded-xl text-[13px] font-semibold text-ink-secondary hover:bg-surface-muted transition-all tap-effect flex items-center justify-center gap-2" style={{ fontFamily:'var(--font-outfit)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  Download My Data
                </button>
                <button className="w-full py-3 bg-surface-soft rounded-xl text-[13px] font-semibold text-ink-secondary hover:bg-surface-muted transition-all tap-effect flex items-center justify-center gap-2" style={{ fontFamily:'var(--font-outfit)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  View Data Usage
                </button>
                <button className="w-full py-3 border border-red-200 rounded-xl text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-all tap-effect flex items-center justify-center gap-2" style={{ fontFamily:'var(--font-outfit)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Delete My Account
                </button>
              </div>
            </div>
          </section>

          {/* Privacy Policy Link */}
          <section>
            <div className="bg-surface-soft rounded-2xl p-4">
              <p className="text-[13px] text-ink-secondary mb-3" style={{ fontFamily:'var(--font-outfit)' }}>
                Learn more about how we protect your privacy
              </p>
              <Link 
                href="/legal/privacy"
                className="inline-flex items-center gap-2 text-brand text-[14px] font-semibold hover:underline"
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                Read Privacy Notice
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
