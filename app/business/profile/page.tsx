'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function BusinessProfilePage() {
  const router = useRouter()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showBusinessHours, setShowBusinessHours] = useState(false)
  const [showPaymentSettings, setShowPaymentSettings] = useState(false)

  const [businessData, setBusinessData] = useState({
    name: 'Kevo Cuts',
    phone: '+254 712 345 678',
    email: 'info@kevocuts.com',
    location: 'Nairobi CBD, Moi Avenue',
    category: 'Barbershop',
    about: 'Professional barbershop offering classic cuts, modern fades, and premium grooming services for men and kids.',
    workingHours: {
      monday: { open: '9:00 AM', close: '6:00 PM', closed: false },
      tuesday: { open: '9:00 AM', close: '6:00 PM', closed: false },
      wednesday: { open: '9:00 AM', close: '6:00 PM', closed: false },
      thursday: { open: '9:00 AM', close: '6:00 PM', closed: false },
      friday: { open: '9:00 AM', close: '8:00 PM', closed: false },
      saturday: { open: '8:00 AM', close: '8:00 PM', closed: false },
      sunday: { open: '10:00 AM', close: '4:00 PM', closed: false }
    }
  })

  const [editData, setEditData] = useState({
    name: businessData.name,
    phone: businessData.phone,
    email: businessData.email,
    location: businessData.location,
    about: businessData.about
  })

  const handleSaveProfile = () => {
    setBusinessData({ ...businessData, ...editData })
    setShowEditProfile(false)
  }

  const handleLogout = () => {
    router.push('/auth')
  }

  const handleBusinessSettings = (setting: string) => {
    switch (setting) {
      case 'hours':
        setShowBusinessHours(true)
        break
      case 'payment':
        setShowPaymentSettings(true)
        break
      default:
        break
    }
  }

  const businessStats = [
    { label: 'Total Revenue', value: 'KES 245,000', change: '+12%', icon: 'revenue' },
    { label: 'Active Clients', value: '142', change: '+8%', icon: 'clients' },
    { label: 'Avg Rating', value: '4.8', change: '+0.2', icon: 'rating' },
    { label: 'Completion Rate', value: '96%', change: '+2%', icon: 'completion' }
  ]

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand to-brand/90 px-5 pt-14 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <h1 
            className="tracking-tight mb-2" 
            style={{ 
              fontFamily:'var(--font-syne)', 
              fontSize:28, 
              fontWeight:800, 
              color:'#fff', 
              letterSpacing:'-0.5px',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Business Profile
          </h1>
          <p className="text-white/70 text-[15px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
            Manage your business information and settings
          </p>
        </div>
      </div>

      {/* Business Stats */}
      <div className="px-5 pt-8">
        <div className="grid grid-cols-2 gap-3">
          {businessStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 border border-surface-border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
                    {stat.icon === 'revenue' ? (
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    ) : stat.icon === 'clients' ? (
                      <>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </>
                    ) : stat.icon === 'rating' ? (
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    ) : (
                      <>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </>
                    )}
                  </svg>
                </div>
                <span className="text-xs text-ink-muted uppercase tracking-wider" style={{ fontFamily:'var(--font-outfit)' }}>
                  {stat.label}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
                {stat.value}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1" style={{ fontFamily:'var(--font-outfit)' }}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-5 pt-8">
        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-surface-muted to-surface-soft flex items-center justify-center text-2xl font-bold text-brand relative overflow-hidden" style={{ fontFamily:'var(--font-syne)' }}>
                <Image 
                  src="/images/barber.jpg"
                  alt="Kevo Cuts"
                  width={80}
                  height={80}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-brand rounded-full flex items-center justify-center text-white shadow-lg hover:bg-brand/90 transition-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <h2 
                className="leading-tight mb-1" 
                style={{ 
                  fontFamily:'var(--font-syne)', 
                  fontSize:18, 
                  fontWeight:700 
                }}
              >
                {businessData.name}
              </h2>
              <p className="text-ink-muted text-[13px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                {businessData.category} · {businessData.location}
              </p>
              <p className="text-ink-muted text-[12px] font-medium mt-1" style={{ fontFamily:'var(--font-outfit)' }}>
                {businessData.email}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowEditProfile(!showEditProfile)}
            className="w-full py-3 bg-surface-soft rounded-xl text-[14px] font-semibold text-brand hover:bg-surface-muted transition-all flex items-center justify-center gap-2"
            style={{ fontFamily:'var(--font-outfit)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            {showEditProfile ? 'Cancel Edit' : 'Edit Business Profile'}
          </button>

          {showEditProfile && (
            <div className="mt-5 space-y-4 p-4 bg-surface-soft rounded-xl">
              <div>
                <label className="text-[12px] text-ink-muted mb-2 block font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  Business Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-border rounded-xl text-[14px] font-medium bg-white focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-[12px] text-ink-muted mb-2 block font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-border rounded-xl text-[14px] font-medium bg-white focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-[12px] text-ink-muted mb-2 block font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-border rounded-xl text-[14px] font-medium bg-white focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-[12px] text-ink-muted mb-2 block font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  Location
                </label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-border rounded-xl text-[14px] font-medium bg-white focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-[12px] text-ink-muted mb-2 block font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  About Business
                </label>
                <textarea
                  value={editData.about}
                  onChange={(e) => setEditData({...editData, about: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-surface-border rounded-xl text-[14px] font-medium bg-white focus:border-brand focus:outline-none transition-all resize-none"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 py-3 bg-brand text-white rounded-xl text-[14px] font-semibold hover:bg-brand/90 transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-3 border border-surface-border rounded-xl text-[14px] font-semibold text-ink-secondary hover:bg-surface-soft transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Business Settings */}
      <div className="px-5 pt-8">
        <h3 
          className="tracking-tight mb-4" 
          style={{ 
            fontFamily:'var(--font-syne)', 
            fontSize:18, 
            fontWeight:800, 
            letterSpacing:'-0.3px' 
          }}
        >
          Business Settings
        </h3>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <button 
            onClick={() => handleBusinessSettings('hours')}
            className="w-full p-4 border-b border-surface-border hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                    Business Hours
                  </p>
                  <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                    Manage your operating hours
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
          
          <button 
            onClick={() => handleBusinessSettings('payment')}
            className="w-full p-4 hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                    Payment Settings
                  </p>
                  <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                    Manage payment methods and pricing
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Support */}
      <div className="px-5 pt-8">
        <h3 
          className="tracking-tight mb-4" 
          style={{ 
            fontFamily:'var(--font-syne)', 
            fontSize:18, 
            fontWeight:800, 
            letterSpacing:'-0.3px' 
          }}
        >
          Support
        </h3>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <button className="w-full p-4 border-b border-surface-border hover:bg-surface-soft transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                    Business Support
                  </p>
                  <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                    Get help with your business account
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
          <button className="w-full p-4 hover:bg-surface-soft transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                    Help Center
                  </p>
                  <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                    FAQs and business guides
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 pt-8 pb-8">
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white rounded-2xl text-[14px] font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
          style={{ fontFamily:'var(--font-outfit)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Log Out
        </button>
      </div>

      {/* Business Hours Modal */}
      {showBusinessHours && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white rounded-2xl p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily:'var(--font-outfit)' }}>
              Business Hours
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {Object.entries(businessData.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between p-3 bg-surface-soft rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 capitalize" style={{ fontFamily:'var(--font-outfit)' }}>
                      {day}
                    </p>
                    <p className="text-xs text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                      {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-brand text-white text-xs font-medium rounded-lg">
                    Edit
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBusinessHours(false)}
                className="flex-1 py-2 bg-surface-soft rounded-xl text-sm font-medium text-gray-700 hover:bg-surface-muted transition-all"
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings Modal */}
      {showPaymentSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white rounded-2xl p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily:'var(--font-outfit)' }}>
              Payment Settings
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-surface-soft rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>M-Pesa</p>
                      <p className="text-xs text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                        {businessData.phone}
                      </p>
                    </div>
                  </div>
                  <button className="text-xs text-brand font-medium">Edit</button>
                </div>
              </div>
              
              <button className="w-full p-3 border border-dashed border-surface-border rounded-xl text-sm font-medium text-brand hover:bg-surface-soft transition-all flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Payment Method
              </button>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentSettings(false)}
                className="flex-1 py-2 bg-surface-soft rounded-xl text-sm font-medium text-gray-700 hover:bg-surface-muted transition-all"
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
