'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function CalendarSettingsPage() {
  const [syncEnabled, setSyncEnabled] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoReminders, setAutoReminders] = useState(true)

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
              Calendar Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-6 pb-8">
        <div className="space-y-6">
          {/* Calendar Sync */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 border-b border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                    <div>
                      <h3 
                        className="text-[16px] font-semibold mb-1" 
                        style={{ fontFamily:'var(--font-syne)' }}
                      >
                        Calendar Sync
                      </h3>
                      <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                        Sync bookings with your device calendar
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSyncEnabled(!syncEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      syncEnabled ? 'bg-brand' : 'bg-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      syncEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
              
              {syncEnabled && (
                <div className="p-4 space-y-3">
                  <div className="bg-surface-soft rounded-xl p-3">
                    <p className="text-[13px] font-medium mb-2" style={{ fontFamily:'var(--font-outfit)' }}>
                      Connected Calendars:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded-lg p-2">
                        <span className="text-[12px]" style={{ fontFamily:'var(--font-outfit)' }}>
                          Google Calendar
                        </span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-brand text-white rounded-xl text-[14px] font-semibold hover:bg-brand/90 transition-all tap-effect" style={{ fontFamily:'var(--font-outfit)' }}>
                    Add Calendar Account
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Reminder Settings */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-4 border-b border-surface-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </div>
                    <div>
                      <h3 
                        className="text-[16px] font-semibold mb-1" 
                        style={{ fontFamily:'var(--font-syne)' }}
                      >
                        Booking Reminders
                      </h3>
                      <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                        Get notified before your appointments
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                      notifications ? 'bg-brand' : 'bg-surface-border'
                    }`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      notifications ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
              
              {notifications && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                      Reminder time
                    </span>
                    <select className="text-[13px] bg-surface-soft rounded-lg px-3 py-2 border border-surface-border" style={{ fontFamily:'var(--font-outfit)' }}>
                      <option>1 hour before</option>
                      <option>2 hours before</option>
                      <option>1 day before</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                      Auto-reminders
                    </span>
                    <button
                      onClick={() => setAutoReminders(!autoReminders)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                        autoReminders ? 'bg-brand' : 'bg-surface-border'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        autoReminders ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Default Settings */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h3 
                    className="text-[16px] font-semibold mb-1" 
                    style={{ fontFamily:'var(--font-syne)' }}
                  >
                    Default Settings
                  </h3>
                  <p className="text-[12px] text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                    Configure default calendar behavior
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                    Default duration
                  </span>
                  <select className="text-[13px] bg-surface-soft rounded-lg px-3 py-2 border border-surface-border" style={{ fontFamily:'var(--font-outfit)' }}>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px]" style={{ fontFamily:'var(--font-outfit)' }}>
                    Buffer time between bookings
                  </span>
                  <select className="text-[13px] bg-surface-soft rounded-lg px-3 py-2 border border-surface-border" style={{ fontFamily:'var(--font-outfit)' }}>
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Sync Status */}
          <section>
            <div className="bg-surface-soft rounded-2xl p-4">
              <h3 
                className="text-[16px] font-semibold mb-3" 
                style={{ fontFamily:'var(--font-syne)' }}
              >
                Sync Status
              </h3>
              <div className="space-y-2 text-[13px] text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>
                <div className="flex items-center justify-between">
                  <span>Last sync:</span>
                  <span className="text-ink-primary font-medium">2 minutes ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bookings synced:</span>
                  <span className="text-ink-primary font-medium">12</span>
                </div>
              </div>
              <button className="w-full mt-3 py-2 border border-surface-border rounded-xl text-[13px] font-semibold text-ink-secondary hover:bg-surface-muted transition-all tap-effect" style={{ fontFamily:'var(--font-outfit)' }}>
                Sync Now
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
