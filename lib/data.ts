export type ServiceItem = {
  name: string
  price: string
  duration: string
}

export type Review = {
  id: string
  author: string
  initials: string
  rating: number
  date: string
  text: string
}

export type Provider = {
  id: string
  name: string
  slug: string
  category: string
  location: string
  rating: number
  reviewCount: number
  bookings: number
  startingPrice: number
  tags: string[]
  about: string
  services: ServiceItem[]
  reviews: Review[]
  verified: boolean
  featured?: boolean
  // Image references — all replaced by Windsurf with real images
  coverImage: string     // provider cover/hero image
  avatarImage: string    // provider avatar (square)
  galleryImages: string[]  // portfolio gallery (9 images each)
  // Map coordinates (Nairobi area)
  coordinates?: {
    lat: number
    lng: number
  }
}

export type Category = {
  id: string
  name: string
  icon: string          // emoji fallback
  image: string         // category card image — replaced by Windsurf
  description: string
  count: number
}

// ─────────────────────────────────────────────
// CATEGORIES  (6 total → 6 category images)
// ─────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  {
    id: 'barbers',
    name: 'Barbers',
    icon: '✂️',
    image: '/images/categories/barbers.jpg',
    description: 'Fades, cuts & grooming',
    count: 48,
  },
  {
    id: 'hair-stylists',
    name: 'Hair Stylists',
    icon: '💇',
    image: '/images/categories/hair-stylists.jpg',
    description: 'Natural, braids & color',
    count: 62,
  },
  {
    id: 'tattoo-artists',
    name: 'Tattoo Artists',
    icon: '🖊️',
    image: '/images/categories/tattoo-artists.jpg',
    description: 'Custom ink & fine line',
    count: 24,
  },
  {
    id: 'nail-techs',
    name: 'Nail Techs',
    icon: '💅',
    image: '/images/categories/nail-techs.jpg',
    description: 'Gel, art & acrylics',
    count: 53,
  },
  {
    id: 'makeup-artists',
    name: 'Makeup Artists',
    icon: '💄',
    image: '/images/categories/makeup-artists.jpg',
    description: 'Bridal, glam & editorial',
    count: 37,
  },
  {
    id: 'photographers',
    name: 'Photographers',
    icon: '📷',
    image: '/images/categories/photographers.jpg',
    description: 'Portrait, events & content',
    count: 41,
  },
]

// ─────────────────────────────────────────────
// PROVIDERS
// Per provider:  1 cover + 1 avatar + 9 gallery = 11 images
// 9 providers × 11 = 99 provider images
// + 6 category images = 105 total
// ─────────────────────────────────────────────
export const PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Kevo Cuts',
    slug: 'kevo-cuts',
    category: 'barbers',
    location: 'Nairobi CBD',
    coordinates: { lat: -1.2833, lng: 36.8175 },
    rating: 4.9,
    reviewCount: 212,
    bookings: 580,
    startingPrice: 350,
    tags: ['Fades', 'Line-ups', 'Beard', 'Kids'],
    about: "Nairobi's top fade specialist with 7 years of precision work. Trained in Johannesburg and London, now back home giving Nairobi its cleanest cuts. Every client walks out looking like the main character.",
    coverImage: '/images/providers/kevo-cuts/cover.jpg',
    avatarImage: '/images/providers/kevo-cuts/avatar.jpg',
    galleryImages: [
      '/images/providers/kevo-cuts/gallery-1.jpg',
      '/images/providers/kevo-cuts/gallery-2.jpg',
      '/images/providers/kevo-cuts/gallery-3.jpg',
      '/images/providers/kevo-cuts/gallery-4.jpg',
      '/images/providers/kevo-cuts/gallery-5.jpg',
      '/images/providers/kevo-cuts/gallery-6.jpg',
    ],
    services: [
      { name: 'Classic Cut',         price: 'KSh 350',   duration: '30 min' },
      { name: 'Fade + Line-up',      price: 'KSh 500',   duration: '45 min' },
      { name: 'Beard Trim',          price: 'KSh 250',   duration: '20 min' },
      { name: 'Full Groom Package',  price: 'KSh 750',   duration: '60 min' },
      { name: 'Kids Cut',            price: 'KSh 300',   duration: '25 min' },
    ],
    reviews: [
      { id: 'r1', author: 'Maina J.',  initials: 'MJ', rating: 5, date: '2 days ago',  text: "Kevo is the GOAT. Perfect fade every single time — I won't go anywhere else in Nairobi." },
      { id: 'r2', author: 'Tobias K.', initials: 'TK', rating: 5, date: '1 week ago',  text: "Professional, clean, and fast. Best barbershop in CBD hands down." },
      { id: 'r3', author: 'Victor N.', initials: 'VN', rating: 4, date: '2 weeks ago', text: "Great cuts, just busy on weekends. Book ahead and you're sorted." },
    ],
    verified: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Slim Barbers',
    slug: 'slim-barbers',
    category: 'barbers',
    location: 'Westlands',
    coordinates: { lat: -1.2562, lng: 36.8021 },
    rating: 4.7,
    reviewCount: 98,
    bookings: 310,
    startingPrice: 400,
    tags: ['Classic', 'Modern', 'Kids', 'Shave'],
    about: "Family barbershop with 10+ years in Westlands. Classic techniques with a modern finish. We welcome everyone — from toddlers to grandfathers.",
    coverImage: '/images/providers/slim-barbers/cover.jpg',
    avatarImage: '/images/providers/slim-barbers/avatar.jpg',
    galleryImages: [
      '/images/providers/slim-barbers/gallery-1.jpg',
      '/images/providers/slim-barbers/gallery-2.jpg',
      '/images/providers/slim-barbers/gallery-3.jpg',
      '/images/providers/slim-barbers/gallery-4.jpg',
      '/images/providers/slim-barbers/gallery-5.jpg',
      '/images/providers/slim-barbers/gallery-6.jpg',
    ],
    services: [
      { name: 'Adult Cut',            price: 'KSh 400', duration: '35 min' },
      { name: 'Kids Cut',             price: 'KSh 300', duration: '25 min' },
      { name: 'Straight Razor Shave', price: 'KSh 200', duration: '20 min' },
      { name: 'Cut + Shave Combo',    price: 'KSh 550', duration: '50 min' },
    ],
    reviews: [
      { id: 'r4', author: 'James M.', initials: 'JM', rating: 5, date: '3 days ago', text: "Best place for my son's cuts. Always welcoming, never makes him cry!" },
      { id: 'r5', author: 'Grace A.', initials: 'GA', rating: 4, date: '1 week ago', text: "Quick service and fair prices. My go-to in Westlands." },
    ],
    verified: true,
  },
  {
    id: '3',
    name: 'The Blade Room',
    slug: 'blade-room',
    category: 'barbers',
    location: 'Karen',
    coordinates: { lat: -1.3220, lng: 36.7102 },
    rating: 4.8,
    reviewCount: 156,
    bookings: 420,
    startingPrice: 800,
    tags: ['Premium', 'Beard', 'Hot Towel', 'Luxury'],
    about: "Nairobi's most elevated grooming experience. Hot towel shaves, premium Kenyan-sourced products, a curated playlist. Where grooming becomes ritual.",
    coverImage: '/images/providers/blade-room/cover.jpg',
    avatarImage: '/images/providers/blade-room/avatar.jpg',
    galleryImages: [
      '/images/providers/blade-room/gallery-1.jpg',
      '/images/providers/blade-room/gallery-2.jpg',
      '/images/providers/blade-room/gallery-3.jpg',
      '/images/providers/blade-room/gallery-4.jpg',
      '/images/providers/blade-room/gallery-5.jpg',
      '/images/providers/blade-room/gallery-6.jpg',
    ],
    services: [
      { name: 'Signature Cut',            price: 'KSh 800',   duration: '45 min' },
      { name: 'Hot Towel Shave',          price: 'KSh 900',   duration: '40 min' },
      { name: 'Beard Sculpt & Condition', price: 'KSh 700',   duration: '35 min' },
      { name: 'The Full Works',           price: 'KSh 1,500', duration: '90 min' },
    ],
    reviews: [
      { id: 'r6', author: 'Dennis O.', initials: 'DO', rating: 5, date: '4 days ago', text: "Walked in stressed, walked out like royalty. Worth every shilling." },
      { id: 'r7', author: 'Mark P.',   initials: 'MP', rating: 5, date: '5 days ago', text: "Hot towel shave was incredible. This is what barbershops should be." },
    ],
    verified: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Zuri Hair Studio',
    slug: 'zuri-hair-studio',
    category: 'hair-stylists',
    location: 'Kilimani',
    coordinates: { lat: -1.2950, lng: 36.7650 },
    rating: 4.9,
    reviewCount: 289,
    bookings: 620,
    startingPrice: 1200,
    tags: ['Natural', 'Braids', 'Locs', 'Protective'],
    about: "Celebrating the crown. A safe space for natural African hair — protective styles, loc journeys, chemical-free treatments, and big chops done with love.",
    coverImage: '/images/providers/zuri-hair/cover.jpg',
    avatarImage: '/images/providers/zuri-hair/avatar.jpg',
    galleryImages: [
      '/images/providers/zuri-hair/gallery-1.jpg',
      '/images/providers/zuri-hair/gallery-2.jpg',
      '/images/providers/zuri-hair/gallery-3.jpg',
      '/images/providers/zuri-hair/gallery-4.jpg',
      '/images/providers/zuri-hair/gallery-5.jpg',
      '/images/providers/zuri-hair/gallery-6.jpg',
    ],
    services: [
      { name: 'Wash & Style',           price: 'KSh 1,200', duration: '60 min'  },
      { name: 'Box Braids',             price: 'KSh 3,500', duration: '240 min' },
      { name: 'Loc Retwist',            price: 'KSh 2,000', duration: '90 min'  },
      { name: 'Big Chop',               price: 'KSh 1,800', duration: '75 min'  },
      { name: 'Deep Condition + Steam', price: 'KSh 900',   duration: '45 min'  },
    ],
    reviews: [
      { id: 'r8', author: 'Amina W.', initials: 'AW', rating: 5, date: '1 day ago',  text: "Zuri understood my hair goals perfectly. Most stunning result I've ever had." },
      { id: 'r9', author: 'Fatma S.', initials: 'FS', rating: 5, date: '3 days ago', text: "My locs have never looked better. Professional and genuinely caring." },
    ],
    verified: true,
    featured: true,
  },
  {
    id: '5',
    name: 'Glam House',
    slug: 'glam-house',
    category: 'hair-stylists',
    location: 'Lavington',
    coordinates: { lat: -1.2638, lng: 36.7805 },
    rating: 4.6,
    reviewCount: 167,
    bookings: 390,
    startingPrice: 2500,
    tags: ['Weaves', 'Color', 'Balayage', 'Relaxer'],
    about: "Full-service salon specialising in weave installations, balayage, and color corrections. International trends, Nairobi-rooted — hair health always the priority.",
    coverImage: '/images/providers/glam-house/cover.jpg',
    avatarImage: '/images/providers/glam-house/avatar.jpg',
    galleryImages: [
      '/images/providers/glam-house/gallery-1.jpg',
      '/images/providers/glam-house/gallery-2.jpg',
      '/images/providers/glam-house/gallery-3.jpg',
      '/images/providers/glam-house/gallery-4.jpg',
      '/images/providers/glam-house/gallery-5.jpg',
      '/images/providers/glam-house/gallery-6.jpg',
    ],
    services: [
      { name: 'Weave Install',         price: 'KSh 2,500', duration: '120 min' },
      { name: 'Balayage / Highlights', price: 'KSh 4,000', duration: '150 min' },
      { name: 'Relaxer',               price: 'KSh 1,500', duration: '90 min'  },
      { name: 'Deep Condition',        price: 'KSh 800',   duration: '40 min'  },
      { name: 'Color Correction',      price: 'KSh 5,500', duration: '180 min' },
    ],
    reviews: [
      { id: 'r10', author: 'Purity N.',  initials: 'PN', rating: 5, date: '5 days ago', text: "My weave looks so natural everyone thinks it's real. Amazing work." },
      { id: 'r11', author: 'Cynthia O.', initials: 'CO', rating: 4, date: '1 week ago', text: "Balayage came out perfect. Exactly the warm tones I wanted." },
    ],
    verified: true,
  },
  {
    id: '6',
    name: 'Nailhaus',
    slug: 'nailhaus',
    category: 'nail-techs',
    location: 'Ngong Road',
    coordinates: { lat: -1.2877, lng: 36.7480 },
    rating: 4.8,
    reviewCount: 203,
    bookings: 510,
    startingPrice: 800,
    tags: ['Gel', 'Nail Art', 'Acrylics', 'SNS'],
    about: "Creative nail studio where every set is art. From clean minimalism to bold Afro-inspired nail art. Only premium, long-lasting products.",
    coverImage: '/images/providers/nailhaus/cover.jpg',
    avatarImage: '/images/providers/nailhaus/avatar.jpg',
    galleryImages: [
      '/images/providers/nailhaus/gallery-1.jpg',
      '/images/providers/nailhaus/gallery-2.jpg',
      '/images/providers/nailhaus/gallery-3.jpg',
      '/images/providers/nailhaus/gallery-4.jpg',
      '/images/providers/nailhaus/gallery-5.jpg',
      '/images/providers/nailhaus/gallery-6.jpg',
    ],
    services: [
      { name: 'Gel Manicure',          price: 'KSh 800',   duration: '50 min' },
      { name: 'Nail Art (per nail)',    price: 'KSh 150',   duration: '5 min'  },
      { name: 'Full Acrylic Set',       price: 'KSh 1,500', duration: '90 min' },
      { name: 'Gel Pedicure',          price: 'KSh 900',   duration: '60 min' },
      { name: 'Nail Removal + Rebase', price: 'KSh 600',   duration: '40 min' },
    ],
    reviews: [
      { id: 'r12', author: 'Stella K.', initials: 'SK', rating: 5, date: '2 days ago', text: "Best nail art in Nairobi. The detail work is absolutely insane." },
      { id: 'r13', author: 'Irene M.',  initials: 'IM', rating: 5, date: '4 days ago', text: "My nails are the first thing people notice about me now." },
    ],
    verified: true,
    featured: true,
  },
  {
    id: '7',
    name: 'Beat by Adaeze',
    slug: 'beat-by-adaeze',
    category: 'makeup-artists',
    location: 'Parklands',
    coordinates: { lat: -1.2680, lng: 36.8025 },
    rating: 5.0,
    reviewCount: 97,
    bookings: 180,
    startingPrice: 3500,
    tags: ['Bridal', 'Editorial', 'Glam', 'Airbrush'],
    about: "Award-winning MUA with 8 years across Nairobi, Lagos, and London. Known for celebrating melanin beautifully — long-lasting, skin-first looks, always intentional.",
    coverImage: '/images/providers/beat-by-adaeze/cover.jpg',
    avatarImage: '/images/providers/beat-by-adaeze/avatar.jpg',
    galleryImages: [
      '/images/providers/beat-by-adaeze/gallery-1.jpg',
      '/images/providers/beat-by-adaeze/gallery-2.jpg',
      '/images/providers/beat-by-adaeze/gallery-3.jpg',
      '/images/providers/beat-by-adaeze/gallery-4.jpg',
      '/images/providers/beat-by-adaeze/gallery-5.jpg',
      '/images/providers/beat-by-adaeze/gallery-6.jpg',
    ],
    services: [
      { name: 'Bridal Makeup (+ trial)', price: 'KSh 8,000', duration: '90 min' },
      { name: 'Evening Glam',            price: 'KSh 4,000', duration: '60 min' },
      { name: 'Natural Beat',            price: 'KSh 3,500', duration: '50 min' },
      { name: 'Trial / Consultation',    price: 'KSh 2,500', duration: '45 min' },
      { name: 'Airbrush Foundation',     price: 'KSh 1,200', duration: '30 min' },
    ],
    reviews: [
      { id: 'r14', author: 'Wanjiku M.', initials: 'WM', rating: 5, date: '3 days ago', text: "I was a STUNNING bride. Adaeze is magical. I cried when I saw myself." },
      { id: 'r15', author: 'Lola A.',    initials: 'LA', rating: 5, date: '1 week ago', text: "Beat was flawless 10 hours later. No touch-ups needed whatsoever." },
    ],
    verified: true,
    featured: true,
  },
  {
    id: '8',
    name: 'Lense by Odhis',
    slug: 'lense-by-odhis',
    category: 'photographers',
    location: 'Muthaiga',
    coordinates: { lat: -1.2420, lng: 36.8120 },
    rating: 4.9,
    reviewCount: 142,
    bookings: 260,
    startingPrice: 5000,
    tags: ['Portrait', 'Lifestyle', 'Events', 'Corporate'],
    about: "Visual storyteller capturing authentic Nairobi moments. Shot for leading Kenyan brands, NGOs, and individuals who want their story told right.",
    coverImage: '/images/providers/lense-by-odhis/cover.jpg',
    avatarImage: '/images/providers/lense-by-odhis/avatar.jpg',
    galleryImages: [
      '/images/providers/lense-by-odhis/gallery-1.jpg',
      '/images/providers/lense-by-odhis/gallery-2.jpg',
      '/images/providers/lense-by-odhis/gallery-3.jpg',
      '/images/providers/lense-by-odhis/gallery-4.jpg',
      '/images/providers/lense-by-odhis/gallery-5.jpg',
      '/images/providers/lense-by-odhis/gallery-6.jpg',
    ],
    services: [
      { name: 'Portrait Session (1hr)',    price: 'KSh 5,000',  duration: '60 min'  },
      { name: 'Lifestyle Shoot (2hr)',     price: 'KSh 9,000',  duration: '120 min' },
      { name: 'Event Coverage (half day)', price: 'KSh 15,000', duration: '240 min' },
      { name: 'Corporate Headshots',       price: 'KSh 6,000',  duration: '60 min'  },
      { name: 'Full Day Coverage',         price: 'KSh 25,000', duration: '480 min' },
    ],
    reviews: [
      { id: 'r16', author: 'Brian O.',     initials: 'BO', rating: 5, date: '1 day ago',  text: "Odhis made me feel so comfortable. The photos are genuinely stunning." },
      { id: 'r17', author: 'Christine N.', initials: 'CN', rating: 5, date: '5 days ago', text: "Covered our company event flawlessly. Exactly what we needed." },
    ],
    verified: true,
    featured: true,
  },
  {
    id: '9',
    name: 'Ink & Soul',
    slug: 'ink-and-soul',
    category: 'tattoo-artists',
    location: 'Westlands',
    coordinates: { lat: -1.2535, lng: 36.7980 },
    rating: 4.8,
    reviewCount: 89,
    bookings: 310,
    startingPrice: 2000,
    tags: ['Fine Line', 'Illustrative', 'Color', 'Blackwork'],
    about: "Tattoo studio celebrating African iconography and modern illustration. Every piece is custom-designed. Clean studio, sterile equipment, artistry that lasts forever.",
    coverImage: '/images/providers/ink-and-soul/cover.jpg',
    avatarImage: '/images/providers/ink-and-soul/avatar.jpg',
    galleryImages: [
      '/images/providers/ink-and-soul/gallery-1.jpg',
      '/images/providers/ink-and-soul/gallery-2.jpg',
      '/images/providers/ink-and-soul/gallery-3.jpg',
      '/images/providers/ink-and-soul/gallery-4.jpg',
      '/images/providers/ink-and-soul/gallery-5.jpg',
      '/images/providers/ink-and-soul/gallery-6.jpg',
    ],
    services: [
      { name: 'Small Tattoo (≤3cm)',   price: 'KSh 2,000',   duration: '60 min'      },
      { name: 'Medium (3–8cm)',        price: 'KSh 4,500',   duration: '90 min'      },
      { name: 'Large Piece (8cm+)',    price: 'KSh 9,000',   duration: '180 min'     },
      { name: 'Full Sleeve',           price: 'KSh 35,000+', duration: 'Multi-session'},
      { name: 'Touch-Up',             price: 'KSh 1,000',   duration: '30 min'      },
    ],
    reviews: [
      { id: 'r18', author: 'Kelvin R.', initials: 'KR', rating: 5, date: '2 days ago', text: "Insane line work. My tattoo is a masterpiece — people stop me to ask about it." },
      { id: 'r19', author: 'Nadia T.',  initials: 'NT', rating: 5, date: '1 week ago', text: "Super professional setup. Artistry is next level. Felt completely safe." },
    ],
    verified: true,
  },
]

export function getProvidersByCategory(id: string) { return PROVIDERS.filter(p => p.category === id) }
export function getProviderById(id: string)        { return PROVIDERS.find(p => p.id === id) }
export function getFeaturedProviders()             { return PROVIDERS.filter(p => p.featured) }
export function getAllProviders()                  { return PROVIDERS }
