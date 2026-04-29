'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState('home')

  const navItems = useMemo(() => [
    { 
      id: 'home', 
      label: 'Home', 
      path: '/business/home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      )
    },
    { 
      id: 'services', 
      label: 'Services', 
      path: '/business/services',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24"/>
        </svg>
      )
    },
    { 
      id: 'bookings', 
      label: 'Bookings', 
      path: '/business/bookings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      path: '/business/profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
  ], [])

  const handleNavClick = (item: typeof navItems[0]) => {
    setActiveTab(item.id)
    router.push(item.path)
  }

  // Update active tab based on current pathname
  useEffect(() => {
    const currentTab = navItems.find(item => pathname === item.path)?.id || 'home'
    setActiveTab(currentTab)
  }, [pathname, navItems])

  return (
    <div className="relative mx-auto min-h-screen bg-surface-soft" style={{ maxWidth: 480 }}>
      <div className="pb-16">
        {children}
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-border z-50" style={{ maxWidth: 480, left: '50%', transform: 'translateX(-50%)' }}>
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === item.id
                  ? 'text-brand'
                  : 'text-ink-faint'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-brand' : 'text-ink-faint'}`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
