'use client'
import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'

const noNavRoutes = ['/auth', '/auth/', '/business', '/business/']

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Check if current route should not show navigation
  const shouldHideNav = noNavRoutes.some(route => pathname === route || pathname.startsWith(route))

  return (
    <div className="relative mx-auto min-h-screen bg-surface-soft" style={{ maxWidth: 480 }}>
      <div className={shouldHideNav ? '' : 'pb-16'}>
        {children}
      </div>
      {!shouldHideNav && <BottomNav />}
    </div>
  )
}
