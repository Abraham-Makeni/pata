'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import Image from 'next/image'

const BUSINESS_ID = '1'
const BUSINESS_UPLOADS_KEY = `businessUploads:${BUSINESS_ID}`

export default function BusinessHomePage() {
  const [activeSection, setActiveSection] = useState<'insights' | 'analytics' | 'posts' | 'uploads'>('insights')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Mock data for demonstration
  const insights = [
    { label: 'Total Bookings', value: '142', change: '+12%', trend: 'up' },
    { label: 'Revenue This Month', value: 'KES 45,000', change: '+8%', trend: 'up' },
    { label: 'New Customers', value: '28', change: '+15%', trend: 'up' },
    { label: 'Avg. Rating', value: '4.8', change: '+0.2', trend: 'up' },
  ]

  const analytics = [
    { day: 'Mon', bookings: 12, revenue: 3800 },
    { day: 'Tue', bookings: 18, revenue: 5700 },
    { day: 'Wed', bookings: 15, revenue: 4750 },
    { day: 'Thu', bookings: 22, revenue: 6900 },
    { day: 'Fri', bookings: 25, revenue: 7800 },
    { day: 'Sat', bookings: 30, revenue: 9400 },
    { day: 'Sun', bookings: 20, revenue: 6200 },
  ]

  const posts = [
    { id: 1, title: 'Weekend Special: 20% Off All Services', status: 'published', date: '2024-04-28', engagement: '245 views' },
    { id: 2, title: 'New Hair Treatment Available', status: 'published', date: '2024-04-25', engagement: '189 views' },
    { id: 3, title: 'Holiday Hours Update', status: 'draft', date: '2024-04-22', engagement: 'Not published' },
  ]

  useEffect(() => {
    const storedUploads = window.localStorage.getItem(BUSINESS_UPLOADS_KEY)
    if (!storedUploads) return

    try {
      const parsed = JSON.parse(storedUploads) as string[]
      if (Array.isArray(parsed)) {
        setUploadedImages(parsed)
      }
    } catch {
      // Ignore malformed local storage payloads.
    }
  }, [])

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    const readFileAsDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })

    const dataUrls = await Promise.all(Array.from(files).map(readFileAsDataUrl))
    setUploadedImages((prev) => {
      const nextUploads = [...dataUrls, ...prev].slice(0, 24)
      window.localStorage.setItem(BUSINESS_UPLOADS_KEY, JSON.stringify(nextUploads))
      return nextUploads
    })
    event.target.value = ''
  }

  const handleRemoveUploadedImage = (image: string) => {
    setUploadedImages((prev) => {
      const nextUploads = prev.filter((item) => item !== image)
      window.localStorage.setItem(BUSINESS_UPLOADS_KEY, JSON.stringify(nextUploads))
      return nextUploads
    })
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Profile Header */}
      <div className="bg-white px-4 py-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <Image 
              src="/images/barber.jpg"
              alt="Kevo Cuts"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
              Kevo Cuts
            </h1>
            <p className="text-sm text-ink-muted">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white px-4 py-3 border-b border-surface-border">
        <div className="flex gap-6">
          {[
            { id: 'insights', label: 'Insights' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'posts', label: 'Posts' },
            { id: 'uploads', label: 'Uploads' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeSection === section.id
                  ? 'text-brand border-brand'
                  : 'text-ink-muted border-transparent hover:text-ink-faint'
              }`}
              style={{ fontFamily:'var(--font-outfit)' }}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Insights Section */}
        {activeSection === 'insights' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
              Key Insights
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl border border-surface-border">
                  <p className="text-xs text-ink-muted uppercase tracking-wider mb-1" style={{ fontFamily:'var(--font-outfit)' }}>
                    {insight.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{insight.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
                      <polyline points="17,6 23,6 23,12"/>
                    </svg>
                    <span className="text-xs text-green-500 font-medium">{insight.change}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-surface-border p-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily:'var(--font-outfit)' }}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New booking from John D.</p>
                      <p className="text-xs text-ink-muted">2 minutes ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Payment received</p>
                      <p className="text-xs text-ink-muted">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
              Weekly Analytics
            </h2>
            
            {/* Simple Bar Chart */}
            <div className="bg-white rounded-2xl border border-surface-border p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontFamily:'var(--font-outfit)' }}>
                Bookings This Week
              </h3>
              <div className="space-y-2">
                {analytics.map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-ink-muted w-8" style={{ fontFamily:'var(--font-outfit)' }}>
                      {day.day}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div 
                        className="bg-brand h-full rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(day.bookings / 30) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">{day.bookings}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl border border-surface-border p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4" style={{ fontFamily:'var(--font-outfit)' }}>
                Revenue Overview
              </h3>
              <div className="space-y-2">
                {analytics.map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-ink-muted w-8" style={{ fontFamily:'var(--font-outfit)' }}>
                      {day.day}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(day.revenue / 9400) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">KES {day.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts Management Section */}
        {activeSection === 'posts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                Posts Management
              </h2>
              <button className="px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg tap-effect" style={{ fontFamily:'var(--font-outfit)' }}>
                Create Post
              </button>
            </div>
            
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-surface-border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1" style={{ fontFamily:'var(--font-outfit)' }}>
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-ink-muted">
                        <span>{post.date}</span>
                        <span>·</span>
                        <span>{post.engagement}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-border">
                    <button className="text-xs text-brand font-medium">Edit</button>
                    <span className="text-ink-muted">·</span>
                    <button className="text-xs text-brand font-medium">View</button>
                    <span className="text-ink-muted">·</span>
                    <button className="text-xs text-red-500 font-medium">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploads Section */}
        {activeSection === 'uploads' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-surface-border p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily:'var(--font-outfit)' }}>
                Upload Portfolio Images
              </h2>
              <p className="text-xs text-ink-muted mb-4" style={{ fontFamily:'var(--font-outfit)' }}>
                Images uploaded here appear on your business profile under Posts.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-brand/90 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14m-7-7h14"></path>
                </svg>
                Add Images
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUploadImages} />
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                  Uploaded ({uploadedImages.length})
                </h3>
              </div>

              {uploadedImages.length === 0 ? (
                <p className="text-xs text-ink-muted" style={{ fontFamily:'var(--font-outfit)' }}>
                  No uploads yet. Add images to show your latest work.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative group">
                      <img src={image} alt={`Upload ${index + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                      <button
                        onClick={() => handleRemoveUploadedImage(image)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
