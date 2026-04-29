'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProviderById } from '@/lib/data'

// Mock user data
const userData = {
  name: 'Alex Kimani',
  phone: '+254 712 345 678',
  email: 'alex.kimani@example.com',
  avatar: null,
  savedPlaces: {
    home: 'Nairobi CBD, Moi Avenue',
    work: 'Westlands, Waiyaki Way'
  },
  paymentMethods: [
    { id: 'mpesa', type: 'mobile', last4: '6789', brand: 'M-Pesa', phone: '+254 712 345 678' }
  ]
}

const helpIssues = [
  'Booking cancellation',
  'Payment issues',
  'Provider no-show',
  'Service quality complaint',
  'App technical issues',
  'Account access problems'
]

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [selectedPost, setSelectedPost] = useState<string | null>(null)

  // Check if this is a user profile (me) or provider profile
  if (params.id === 'me') {
    return <UserAccountPage />
  }

  const p = getProviderById(params.id)
  if (!p) return <div className="flex items-center justify-center min-h-screen"><p>Not found</p></div>

  return (
    <div className="min-h-screen bg-surface-soft">

      {/* ── COVER ── */}
      <div className="relative">
        <div className="img-placeholder w-full h-[280px]">
          <img src={p.coverImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
        </div>

        {/* Back */}
        <button onClick={() => router.back()}
          className="absolute top-12 left-4 w-10 h-10 rounded-full glass-dark flex items-center justify-center border border-white/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        {/* Profile pic and name over banner - Twitter style */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="px-5 pb-4">
            <div className="flex items-end gap-4">
              {/* Circular Profile Pic */}
              <div className="img-placeholder w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0 -mb-12">
                <img src={p.avatarImage} alt={p.name} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
              </div>
              
              {/* Business Name and Info */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 style={{ fontFamily:'var(--font-syne)', fontSize:28, fontWeight:800, color:'#fff', letterSpacing:'-1px', lineHeight:1.1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{p.name}</h1>
                  {p.verified && (
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#1DA1F2" strokeWidth="2.5" className="bg-white rounded-full">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  )}
                </div>
                <p className="text-white/90 text-[14px]" style={{ fontFamily:'var(--font-outfit)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{p.tags[0]} · {p.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="px-5 pb-48 pt-20 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: p.rating.toFixed(1), l: 'Rating' },
            { n: p.reviewCount,       l: 'Reviews' },
            { n: p.bookings,          l: 'Bookings' },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-card p-3.5 text-center shadow-card">
              <div style={{ fontFamily:'var(--font-syne)', fontSize:22, fontWeight:800, letterSpacing:'-0.5px' }}>{s.n}</div>
              <div className="text-ink-muted text-[11px] mt-0.5" style={{ fontFamily:'var(--font-outfit)' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex gap-2 flex-wrap">
          {p.tags.map(t => (
            <span key={t} className="bg-white border border-surface-border text-ink-secondary text-[12px] font-medium px-3 py-1.5 rounded-pill shadow-sm"
              style={{ fontFamily:'var(--font-outfit)' }}>{t}</span>
          ))}
        </div>

        {/* About */}
        <Section title="About">
          <p className="text-[14px] leading-relaxed text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>{p.about}</p>
        </Section>

        {/* Posts */}
        <Section title="Posts">
          {/* First Row */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-3">
            {p.galleryImages.slice(0, Math.ceil(p.galleryImages.length / 2)).map((img, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-32 cursor-pointer group"
                onClick={() => setSelectedPost(img)}
              >
                <div className="img-placeholder aspect-square rounded-xl overflow-hidden">
                  <img 
                    src={img} 
                    alt={`${p.name} work ${i+1}`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    onError={e=>{(e.target as HTMLImageElement).style.display='none'}}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Second Row */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {p.galleryImages.slice(Math.ceil(p.galleryImages.length / 2)).map((img, i) => (
              <div 
                key={i + Math.ceil(p.galleryImages.length / 2)} 
                className="flex-shrink-0 w-32 cursor-pointer group"
                onClick={() => setSelectedPost(img)}
              >
                <div className="img-placeholder aspect-square rounded-xl overflow-hidden">
                  <img 
                    src={img} 
                    alt={`${p.name} work ${i + Math.ceil(p.galleryImages.length / 2) + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    onError={e=>{(e.target as HTMLImageElement).style.display='none'}}
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Services */}
        <Section title="Services & Pricing">
          <div className="space-y-2">
            {p.services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-card">
                <div>
                  <p style={{ fontFamily:'var(--font-outfit)', fontSize:14, fontWeight:600 }}>{s.name}</p>
                  <p className="text-ink-muted text-[12px] mt-0.5" style={{ fontFamily:'var(--font-outfit)' }}>{s.duration}</p>
                </div>
                <p style={{ fontFamily:'var(--font-syne)', fontSize:14, fontWeight:700 }}>{s.price}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Reviews */}
        <Section title="Reviews">
          <div className="space-y-3">
            {p.reviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                    style={{ fontFamily:'var(--font-syne)' }}>{r.initials}</div>
                  <div className="flex-1">
                    <p style={{ fontFamily:'var(--font-syne)', fontSize:13, fontWeight:700 }}>{r.author}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-amber-500">{'×'.repeat(r.rating)}</span>
                      <span className="text-[11px] text-ink-faint" style={{ fontFamily:'var(--font-outfit)' }}>{r.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-ink-secondary" style={{ fontFamily:'var(--font-outfit)' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Post Expansion Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Post Image */}
            <div className="relative">
              <img 
                src={selectedPost}
                alt={`${p.name}'s post`}
                className="w-full object-cover rounded-t-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
              >
                <svg width={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Post Info */}
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="img-placeholder w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={p.avatarImage}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[14px]" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] text-ink-muted">
                    <svg width={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M21 10c0 7-9 13-9s-9 3-9 3-9 9 9 9 9-9-3-9-3z"></path><path d="M12 22v-6"></path><path d="M12 18h.01"></path></svg>
                    <span>{p.location}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-surface-soft rounded-full text-[12px] font-medium text-brand hover:bg-surface-muted transition-all" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {p.tags[0]}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-surface-soft rounded-xl">
                <svg width={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M21 10c0 7-9 13-9s-9 3-9 3-9 9 9 9 9-9-3-9-3z"></path><path d="M12 22v-6"></path><path d="M12 18h.01"></path></svg>
                <span className="text-[14px]" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {p.location}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-brand/10 text-brand text-[12px] font-medium rounded-full hover:bg-brand/20 transition-all cursor-pointer"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    #{tag.toLowerCase().replace(/\s+/g, '')}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-surface-soft rounded-xl hover:bg-surface-muted transition-all">
                  <svg width={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67V2h2v3.67l1.06 1.06a5.5 5.5 0 0 0 7.78 0l-1.06 1.06V22h-2v-8.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 0l1.06-1.06V2z"></path></svg>
                  <span className="text-[14px] font-medium" style={{ fontFamily: 'var(--font-outfit)' }}>
                    Like
                  </span>
                </button>
                                <button 
                  onClick={() => router.push(`/booking/${params.id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand/90 transition-all"
                >
                  <svg width={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  <span className="text-[14px] font-medium" style={{ fontFamily: 'var(--font-outfit)' }}>
                    Book Service
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY BOOK BAR */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] glass-bottom px-5 py-4 flex items-center gap-4 z-40">
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-widest text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>Starting from</p>
          <p style={{ fontFamily:'var(--font-syne)', fontSize:22, fontWeight:800, letterSpacing:'-0.5px' }}>KSh {p.startingPrice.toLocaleString()}</p>
        </div>
        <Link href={`/booking/${p.id}`}
          className="flex-1 bg-brand text-white text-center py-4 rounded-2xl font-semibold text-[15px] tap-effect"
          style={{ fontFamily:'var(--font-syne)' }}>
          Book Now
        </Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily:'var(--font-syne)', fontSize:12, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#9a9a92', marginBottom:12 }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function UserAccountPage() {
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editData, setEditData] = useState({
    name: userData.name,
    phone: userData.phone,
    email: userData.email
  })
  const [showLegalOptions, setShowLegalOptions] = useState(false)
  const router = useRouter()

  const handleSaveProfile = () => {
    setShowEditProfile(false)
  }

  const handleLogout = () => {
    router.push('/')
  }

  const handlePaymentMethod = (methodId: string) => {
    router.push(`/payment-methods/${methodId}`)
  }

  const handleAddPaymentMethod = () => {
    router.push('/payment-methods/add')
  }

  const handleSupportCall = () => {
    window.open('tel:0117977749', '_self')
  }

  const handleEmailSupport = () => {
    window.open('mailto:brand0nkkiplangat100@gmail.com', '_blank')
  }

  const handleSavedPlace = (placeType: 'home' | 'work') => {
    router.push(`/saved-places/${placeType}`)
  }

  const handleSettings = (setting: string) => {
    router.push(`/settings/${setting}`)
  }

  const handleLegalOption = (option: string) => {
    router.push(`/legal/${option}`)
  }

  return (
    <div className="min-h-screen bg-surface-soft pb-8">
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
            Account
          </h1>
          <p className="text-white/70 text-[15px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
            Manage your profile and settings
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-5 pt-8">
        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-surface-muted to-surface-soft flex items-center justify-center text-2xl font-bold text-brand relative overflow-hidden" style={{ fontFamily:'var(--font-syne)' }}>
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  userData.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-brand rounded-full flex items-center justify-center text-white shadow-lg hover:bg-brand/90 transition-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
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
                {userData.name}
              </h2>
              <p className="text-ink-muted text-[13px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                {userData.email}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowEditProfile(!showEditProfile)}
            className="w-full py-3 bg-surface-soft rounded-xl text-[14px] font-semibold text-brand hover:bg-surface-muted transition-all flex items-center justify-center gap-2"
            style={{ fontFamily:'var(--font-outfit)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            {showEditProfile ? 'Cancel Edit' : 'Edit Profile'}
          </button>

          {showEditProfile && (
            <div className="mt-5 space-y-4 p-4 bg-surface-soft rounded-xl">
              <div>
                <label className="text-[12px] text-ink-muted mb-2 block font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-border rounded-xl text-[14px] font-medium bg-white focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-[12px] text-ink-muted mb-2 block font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>Phone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-border rounded-xl text-[14px] font-medium bg-white focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-[12px] text-ink-muted mb-2 block font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-surface-border rounded-xl text-[14px] font-medium bg-white focus:border-brand focus:outline-none transition-all"
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

      {/* Payment Methods */}
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
          Payment Methods
        </h3>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          {userData.paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handlePaymentMethod(method.id)}
              className="w-full p-4 hover:bg-surface-soft transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                      {method.brand}
                    </p>
                    <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                      {method.phone}
                    </p>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </button>
          ))}
          <button 
            onClick={handleAddPaymentMethod}
            className="w-full p-4 text-[14px] font-semibold text-brand hover:bg-brand/5 transition-all flex items-center justify-center gap-2 border-t border-surface-border"
            style={{ fontFamily:'var(--font-outfit)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add M-Pesa Account
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
          <button 
            onClick={handleSupportCall}
            className="w-full p-4 border-b border-surface-border hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                    Call Support
                  </p>
                  <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                    0117977749
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
          <button className="w-full p-4 hover:bg-surface-soft transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4m0-4h.01"></path></svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                    Get Help
                  </p>
                  <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                    Common issues and solutions
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
        </div>
      </div>

      {/* Help Issues */}
      <div className="px-5 pt-8">
        <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <h4 
            className="tracking-tight mb-4" 
            style={{ 
              fontFamily:'var(--font-syne)', 
              fontSize:16, 
              fontWeight:700 
            }}
          >
            Common Issues
          </h4>
          <div className="space-y-3 mb-5">
            {helpIssues.map((issue, index) => (
              <div key={index} className="p-3 bg-surface-soft rounded-xl hover:bg-surface-muted transition-all">
                <p className="text-[13px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>{issue}</p>
              </div>
            ))}
          </div>
          <button 
            onClick={handleEmailSupport}
            className="w-full p-4 bg-brand text-white rounded-xl text-center text-[14px] font-semibold hover:bg-brand/90 transition-all flex items-center justify-center gap-2"
            style={{ fontFamily:'var(--font-outfit)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            Email Support
          </button>
        </div>
      </div>

      {/* Saved Places */}
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
          Saved Places
        </h3>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <button 
            onClick={() => handleSavedPlace('home')}
            className="w-full p-4 border-b border-surface-border hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>Home</p>
                  <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                    {userData.savedPlaces.home}
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
          <button 
            onClick={() => handleSavedPlace('work')}
            className="w-full p-4 hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>Work</p>
                  <p className="text-[12px] text-ink-muted font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                    {userData.savedPlaces.work}
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
        </div>
      </div>

      {/* Settings */}
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
          Settings
        </h3>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <button 
            onClick={() => handleSettings('calendar')}
            className="w-full p-4 border-b border-surface-border hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
                <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  Connect Calendar
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
          <button 
            onClick={() => handleSettings('privacy')}
            className="w-full p-4 border-b border-surface-border hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  Privacy
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
          <button 
            onClick={() => handleSettings('security')}
            className="w-full p-4 border-b border-surface-border hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><circle cx="12" cy="12" r="1"></circle><path d="M12 1v6m4.22-4.22-4.24 4.24m6 0l-4.24-4.24M1 12h6m12 0h6m-19.78 4.22l4.24-4.24m4.24 4.24l-4.24-4.24"></path></svg>
                </div>
                <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  Sign In & Security
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
          <button 
            onClick={() => setShowLegalOptions(!showLegalOptions)}
            className="w-full p-4 hover:bg-surface-soft transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-soft flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="13" x2="12" y2="17"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                </div>
                <p className="text-[14px] font-semibold" style={{ fontFamily:'var(--font-outfit)' }}>
                  Legal
                </p>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-ink-muted transition-transform ${showLegalOptions ? 'rotate-90' : ''}`}><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </button>
        </div>
      </div>

      {/* Legal Options (expandable) */}
      {showLegalOptions && (
        <div className="px-5 pt-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300">
            <h4 
              className="tracking-tight mb-4" 
              style={{ 
                fontFamily:'var(--font-syne)', 
                fontSize:16, 
                fontWeight:700 
              }}
            >
              Legal Information
            </h4>
            <div className="space-y-3">
              <button 
                onClick={() => handleLegalOption('accessibility')}
                className="w-full text-left p-4 bg-surface-soft rounded-xl hover:bg-surface-muted transition-all"
              >
                <p className="text-[13px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>Accessibility Commitment</p>
              </button>
              <button 
                onClick={() => handleLegalOption('terms')}
                className="w-full text-left p-4 bg-surface-soft rounded-xl hover:bg-surface-muted transition-all"
              >
                <p className="text-[13px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>Terms and Conditions</p>
              </button>
              <button 
                onClick={() => handleLegalOption('acknowledgements')}
                className="w-full text-left p-4 bg-surface-soft rounded-xl hover:bg-surface-muted transition-all"
              >
                <p className="text-[13px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>Acknowledgements</p>
              </button>
              <button 
                onClick={() => handleLegalOption('privacy')}
                className="w-full text-left p-4 bg-surface-soft rounded-xl hover:bg-surface-muted transition-all"
              >
                <p className="text-[13px] font-medium" style={{ fontFamily:'var(--font-outfit)' }}>Privacy Notice</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-5 pt-8 pb-8">
        <button 
          onClick={handleLogout}
          className="w-full p-4 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-100 transition-all shadow-lg hover:shadow-xl"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span className="text-[15px] font-bold" style={{ fontFamily:'var(--font-outfit)' }}>
            Log Out
          </span>
        </button>
      </div>
    </div>
  )
}
