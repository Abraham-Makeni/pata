'use client'

import Link from 'next/link'

const businessUpdates = [
  {
    id: 'b1',
    business: 'Kevo Cuts',
    title: '20% off fades this weekend',
    detail: 'Offer runs Fri-Sun. Book early to secure your slot.',
    time: '2h ago',
    type: 'discount',
  },
  {
    id: 'b2',
    business: 'Nailhaus',
    title: 'Closed for 3 days',
    detail: 'Studio renovation in progress. Reopens on Monday at 9:00 AM.',
    time: '5h ago',
    type: 'closure',
  },
  {
    id: 'b3',
    business: 'Beat by Adaeze',
    title: 'New bridal package available',
    detail: 'Includes trial glam and wedding-day touch-up.',
    time: '1d ago',
    type: 'update',
  },
]

const accountTips = [
  {
    id: 'a1',
    title: 'Enable 2FA for better account security',
    detail: 'Turn on two-factor authentication to protect your bookings and payments.',
    time: 'Today',
  },
  {
    id: 'a2',
    title: 'Review your active sessions',
    detail: 'Sign out devices you no longer use to keep your account safe.',
    time: 'Yesterday',
  },
  {
    id: 'a3',
    title: 'Update your recovery email',
    detail: 'A verified recovery email makes account recovery faster.',
    time: '2d ago',
  },
]

const typeBadgeClass: Record<string, string> = {
  discount: 'bg-emerald-50 text-emerald-700',
  closure: 'bg-rose-50 text-rose-600',
  update: 'bg-blue-50 text-blue-700',
}

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-surface-soft pb-8">
      <div className="sticky top-0 z-20 bg-surface-soft/95 backdrop-blur-sm border-b border-surface-border">
        <div className="px-5 pt-14 pb-4">
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-ink-secondary hover:text-ink transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.4px' }}>
              Notifications
            </h1>
          </div>
          <p className="text-[13px] text-ink-muted mt-2" style={{ fontFamily: 'var(--font-outfit)' }}>
            Updates from businesses you follow and account safety tips.
          </p>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px' }}>
              Following Updates
            </h2>
            <span className="text-[12px] text-ink-muted" style={{ fontFamily: 'var(--font-outfit)' }}>
              {businessUpdates.length} new
            </span>
          </div>

          <div className="space-y-3">
            {businessUpdates.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-[13px] text-ink-muted" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {item.business}
                    </p>
                    <p className="text-[15px] font-semibold text-ink mt-0.5" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {item.title}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${typeBadgeClass[item.type] || 'bg-surface-soft text-ink-muted'}`}
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="text-[13px] text-ink-secondary leading-relaxed" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {item.detail}
                </p>
                <p className="text-[11px] text-ink-faint mt-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3" style={{ fontFamily: 'var(--font-syne)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px' }}>
            Account Tips
          </h2>
          <div className="space-y-3">
            {accountTips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-2xl p-4 shadow-card border border-surface-border">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4m0-4h.01"></path>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-ink" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {tip.title}
                    </p>
                    <p className="text-[13px] text-ink-secondary mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {tip.detail}
                    </p>
                    <p className="text-[11px] text-ink-faint mt-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                      {tip.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
