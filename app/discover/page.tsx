'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Username to provider ID mapping
const usernameToProviderId: { [key: string]: string } = {
  'Kevo Cuts': '1',
  'Slim Barbers': '2', 
  'The Blade Room': '3',
  'Zuri Hair Studio': '4',
  'Glam House': '5',
  'Nailhaus': '6',
  'Beat By AdaEze': '7',
  'Lense by Odhis': '8',
  'Ink & Soul': '9'
}

// Mock data for discover content using local images
const mockPosts = [
  {
    id: 1,
    imageUrl: '/images/kevo-cuts.jpg',
    username: 'Kevo Cuts',
    userProfile: '/images/barber.jpg',
    location: 'Nairobi CBD',
    category: 'Barbershop',
    tags: ['#cleancuts', '#taperfade', '#nairobistyle'],
    likes: 245,
    isLiked: false
  },
  {
    id: 2,
    imageUrl: '/images/beat-by-adaeze.jpg',
    username: 'Beat By AdaEze',
    userProfile: '/images/hair-stylist.jpg',
    location: 'Westlands',
    category: 'Salon',
    tags: ['#braids', '#naturalhair', '#kenyanbeauty'],
    likes: 189,
    isLiked: true
  },
  {
    id: 3,
    imageUrl: '/images/zuri-hair-studio.jpg',
    username: 'Zuri Hair Studio',
    userProfile: '/images/makeup-artist.jpg',
    location: 'Kilimani',
    category: 'Barbershop',
    tags: ['#dreads', '#urbanstyle', '#nairobi'],
    likes: 312,
    isLiked: false
  },
  {
    id: 4,
    imageUrl: '/images/nailhaus.jpg',
    username: 'Nailhaus',
    userProfile: '/images/nail-tech.jpg',
    location: 'Karen',
    category: 'Nail Salon',
    tags: ['#nails', '#nailart', '#beautysalon'],
    likes: 156,
    isLiked: false
  },
  {
    id: 5,
    imageUrl: '/images/slim-barbers.jpg',
    username: 'Slim Barbers',
    userProfile: '/images/photographer.jpg',
    location: 'Lavington',
    category: 'Barbershop',
    tags: ['#mensgrooming', '#beardcare', '#classiccut'],
    likes: 278,
    isLiked: true
  },
  {
    id: 6,
    imageUrl: '/images/glam-house.jpg',
    username: 'Glam House',
    userProfile: '/images/beat-by-adaeze.jpg',
    location: 'Thika Road',
    category: 'Unisex Salon',
    tags: ['#unisex', '#familysalon', '#affordable'],
    likes: 423,
    isLiked: false
  },
  {
    id: 7,
    imageUrl: '/images/blade-room.jpg',
    username: 'Blade Room',
    userProfile: '/images/barber.jpg',
    location: 'Parklands',
    category: 'Barbershop',
    tags: ['#sharpcuts', '#precision', '#menscuts'],
    likes: 198,
    isLiked: false
  },
  {
    id: 8,
    imageUrl: '/images/ink-and-soul.jpg',
    username: 'Ink & Soul',
    userProfile: '/images/tattoo-artist.jpg',
    location: 'Eastlands',
    category: 'Tattoo Studio',
    tags: ['#tattoos', '#bodyart', '#customdesigns'],
    likes: 367,
    isLiked: true
  }
]

export default function DiscoverPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null)
  const [posts, setPosts] = useState(mockPosts)

  const handlePostClick = (post: typeof mockPosts[0]) => {
    setSelectedPost(post)
  }

  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Search Bar */}
      <div className="sticky top-0 z-40 bg-surface-soft border-b border-surface-border px-4 py-3">
        <div className="relative max-w-md mx-auto">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-1.5-9-5.5a2.5 2.5 0 0 0-5 0v-1a2.5 2.5 0 0 0 5 0v1"></path><path d="M12 17v6"></path></svg>
          <input
            type="text"
            placeholder="Search styles, services, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-surface-border rounded-full text-[14px] focus:outline-none focus:border-brand transition-all"
            style={{ fontFamily: 'var(--font-outfit)' }}
          />
        </div>
      </div>

      {/* Staggered Grid */}
      <div className="px-4 py-4">
        <div className="columns-2 gap-4 space-y-4">
          {posts.map((post, index) => (
            <div 
              key={post.id}
              className="break-inside-avoid mb-4 cursor-pointer group"
              onClick={() => handlePostClick(post)}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <div className="relative overflow-hidden rounded-xl bg-surface-muted">
                <img 
                  src={post.imageUrl} 
                  alt={`${post.username}'s post`}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                
                {/* Overlay with quick actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(post.id)
                        }}
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30"
                      >
                        <svg width={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={post.isLiked ? 'text-red-500 fill-current' : 'text-white'}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67V2h2v3.67l1.06 1.06a5.5 5.5 0 0 0 7.78 0l-1.06 1.06V22h-2v-8.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 0l1.06-1.06V2z"></path></svg>
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30">
                        <svg width={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1 9.3-3.8 8.5 8.5 0 0 1-.9-3.8v-2a8.38 8.38 0 0 0-9.3 3.8 8.5 8.5 0 0 1 .9 3.8z"></path><path d="M12 17.5v2a1 1 0 0 1 1 0v-2a1 1 0 0 1 1-0z"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Post Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Post Image */}
            <div className="relative">
              <img 
                src={selectedPost.imageUrl}
                alt={`${selectedPost.username}'s post`}
                className="w-full object-cover rounded-t-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              
              {/* Close Button */}
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
              >
                <svg width={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Post Info */}
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <button 
                  onClick={() => router.push(`/profile/${usernameToProviderId[selectedPost.username]}`)}
                  className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                >
                  <img 
                    src={selectedPost.userProfile}
                    alt={selectedPost.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>
                <div className="flex-1">
                  <button 
                    onClick={() => router.push(`/profile/${usernameToProviderId[selectedPost.username]}`)}
                    className="font-semibold text-[14px] text-left hover:text-brand transition-colors" 
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {selectedPost.username}
                  </button>
                  <div className="flex items-center gap-2 text-[12px] text-ink-muted">
                    <svg width={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M21 10c0 7-9 13-9s-9 3-9 3-9 9 9 9 9-9-3-9-3z"></path><path d="M12 22v-6"></path><path d="M12 18h.01"></path></svg>
                    <span>{selectedPost.location}</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-surface-soft rounded-full text-[12px] font-medium text-brand hover:bg-surface-muted transition-all" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {selectedPost.category}
                </button>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-surface-soft rounded-xl">
                <svg width={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M21 10c0 7-9 13-9s-9 3-9 3-9 9 9 9 9-9-3-9-3z"></path><path d="M12 22v-6"></path><path d="M12 18h.01"></path></svg>
                <span className="text-[14px]" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {selectedPost.location}
                </span>
              </div>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPost.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-brand/10 text-brand text-[12px] font-medium rounded-full hover:bg-brand/20 transition-all cursor-pointer"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleLike(selectedPost.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-surface-soft rounded-xl hover:bg-surface-muted transition-all"
                >
                  <svg width={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={selectedPost.isLiked ? 'text-red-500 fill-current' : 'text-ink-muted'}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67V2h2v3.67l1.06 1.06a5.5 5.5 0 0 0 7.78 0l-1.06 1.06V22h-2v-8.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 0l1.06-1.06V2z"></path></svg>
                  <span className="text-[14px] font-medium" style={{ fontFamily: 'var(--font-outfit)' }}>
                    {selectedPost.likes}
                  </span>
                </button>
                                <button 
                  onClick={() => router.push(`/booking/${usernameToProviderId[selectedPost.username]}`)}
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
    </div>
  )
}
