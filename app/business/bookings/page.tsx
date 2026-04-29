'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function BusinessBookingsPage() {
  const [bookings, setBookings] = useState([
    {
      id: 'PATA-ABC123',
      customer: { name: 'John Doe', phone: '+254 712 345 678', avatar: '/images/barber.jpg' },
      service: { name: 'Classic Haircut', duration: '30 mins', price: 'KES 500' },
      date: 'Apr 28, 2024',
      time: '10:00 AM',
      status: 'confirmed',
      createdAt: '2024-04-25T14:30:00'
    },
    {
      id: 'PATA-XYZ789',
      customer: { name: 'Sarah Kimani', phone: '+254 723 456 789', avatar: '/images/hair-stylist.jpg' },
      service: { name: 'Beard Trim & Style', duration: '20 mins', price: 'KES 300' },
      date: 'Apr 29, 2024',
      time: '2:30 PM',
      status: 'pending',
      createdAt: '2024-04-25T16:45:00'
    },
    {
      id: 'PATA-DEF456',
      customer: { name: 'Michael Ochieng', phone: '+254 734 567 890', avatar: '/images/photographer.jpg' },
      service: { name: 'Hair Fade', duration: '45 mins', price: 'KES 800' },
      date: 'Apr 27, 2024',
      time: '11:00 AM',
      status: 'completed',
      createdAt: '2024-04-24T10:20:00'
    },
    {
      id: 'PATA-GHI789',
      customer: { name: 'Grace Wanjiru', phone: '+254 745 678 901', avatar: '/images/beat-by-adaeze.jpg' },
      service: { name: 'Kids Haircut', duration: '25 mins', price: 'KES 400' },
      date: 'Apr 30, 2024',
      time: '3:00 PM',
      status: 'pending',
      createdAt: '2024-04-25T18:15:00'
    },
    {
      id: 'PATA-JKL012',
      customer: { name: 'David Muriuki', phone: '+254 756 789 012', avatar: '/images/tattoo-artist.jpg' },
      service: { name: 'Hair Treatment', duration: '60 mins', price: 'KES 1,200' },
      date: 'Apr 26, 2024',
      time: '1:00 PM',
      status: 'cancelled',
      createdAt: '2024-04-23T12:00:00'
    }
  ])

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed': return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      case 'confirmed':
        return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      case 'completed':
        return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      case 'cancelled':
        return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      default:
        return null
    }
  }

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    ))
  }

  const filteredBookings = selectedFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === selectedFilter)

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-surface-border">
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
          Bookings
        </h1>
        <p className="text-sm text-ink-muted mt-1">Manage customer bookings and appointments</p>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-surface-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span className="text-xs text-ink-muted uppercase tracking-wider" style={{ fontFamily:'var(--font-outfit)' }}>Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
              {stats.total}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-surface-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-600">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span className="text-xs text-ink-muted uppercase tracking-wider" style={{ fontFamily:'var(--font-outfit)' }}>Pending</span>
            </div>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
              {stats.pending}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-1 border border-surface-border">
          <div className="grid grid-cols-5 gap-1">
            {[
              { key: 'all', label: 'All', count: stats.total },
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
              { key: 'completed', label: 'Completed', count: stats.completed },
              { key: 'cancelled', label: 'Cancelled', count: stats.cancelled }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key as any)}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  selectedFilter === filter.key
                    ? 'bg-brand text-white'
                    : 'text-ink-muted hover:bg-surface-soft'
                }`}
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                {filter.label}
                {filter.count > 0 && (
                  <span className="ml-1 text-xs opacity-75">({filter.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl p-4 border border-surface-border">
              {/* Booking Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src={booking.customer.avatar}
                      alt={booking.customer.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                      {booking.customer.name}
                    </h3>
                    <p className="text-sm text-ink-muted">{booking.customer.phone}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              {/* Booking Details */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>Service</span>
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                    {booking.service.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>Duration</span>
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                    {booking.service.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>Date & Time</span>
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                    {booking.date} at {booking.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>Price</span>
                  <span className="text-sm font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
                    {booking.service.price}
                  </span>
                </div>
              </div>

              {/* Booking Reference */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                <span className="text-xs text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                  Ref: {booking.id}
                </span>
                <div className="flex items-center gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-all"
                        style={{ fontFamily:'var(--font-outfit)' }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-all"
                        style={{ fontFamily:'var(--font-outfit)' }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-all"
                        style={{ fontFamily:'var(--font-outfit)' }}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="px-3 py-1.5 bg-surface-soft text-gray-700 text-xs font-medium rounded-lg hover:bg-surface-muted transition-all"
                        style={{ fontFamily:'var(--font-outfit)' }}
                      >
                        Details
                      </button>
                    </>
                  )}
                  {booking.status === 'completed' && (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-3 py-1.5 bg-surface-soft text-gray-700 text-xs font-medium rounded-lg hover:bg-surface-muted transition-all"
                      style={{ fontFamily:'var(--font-outfit)' }}
                    >
                      View Details
                    </button>
                  )}
                  {booking.status === 'cancelled' && (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-3 py-1.5 bg-surface-soft text-gray-700 text-xs font-medium rounded-lg hover:bg-surface-muted transition-all"
                      style={{ fontFamily:'var(--font-outfit)' }}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-surface-border text-center">
            <div className="w-16 h-16 bg-surface-soft rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily:'var(--font-outfit)' }}>
              No {selectedFilter === 'all' ? '' : selectedFilter} bookings
            </h3>
            <p className="text-sm text-ink-muted">
              {selectedFilter === 'all' 
                ? 'You have no bookings yet. Bookings will appear here when customers make appointments.'
                : `No ${selectedFilter} bookings found.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-surface-soft flex items-center justify-center hover:bg-surface-muted transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image 
                    src={selectedBooking.customer.avatar}
                    alt={selectedBooking.customer.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                    {selectedBooking.customer.name}
                  </h4>
                  <p className="text-sm text-ink-muted">{selectedBooking.customer.phone}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-surface-border">
                {[
                  ['Service', selectedBooking.service.name],
                  ['Duration', selectedBooking.service.duration],
                  ['Date', selectedBooking.date],
                  ['Time', selectedBooking.time],
                  ['Price', selectedBooking.service.price],
                  ['Status', selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)],
                  ['Reference', selectedBooking.id],
                ].map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                      {key}
                    </span>
                    <span className="text-sm font-medium text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 py-2 bg-surface-soft rounded-xl text-sm font-medium text-gray-700 hover:bg-surface-muted transition-all"
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                Close
              </button>
              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedBooking.id, 'completed')
                    setSelectedBooking(null)
                  }}
                  className="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
