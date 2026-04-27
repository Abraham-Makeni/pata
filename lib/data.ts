export type ServiceItem = {
  name: string
  price: string
  duration: string
}

export type Review = {
  id: string
  author: string
  avatar: string
  rating: number
  date: string
  text: string
  wouldRecommend: boolean
  tags: string[]
}

export type Provider = {
  id: string
  name: string
  slug: string
  emoji: string
  image: string
  specialty: string
  category: string
  location: string
  phone: string
  coordinates: { lat: number; lng: number }
  rating: number
  reviewCount: number
  bookings: number
  bookedCount: number
  repeatClients: number
  startingPrice: number
  tags: string[]
  about: string
  gallery: string[]
  services: ServiceItem[]
  reviews: Review[]
  verified: boolean
  featured?: boolean
}

export type Category = {
  id: string
  name: string
  emoji: string
  description: string
  count: number
}

export const CATEGORIES: Category[] = [
  { id: 'barbers',        name: 'Barbers',         emoji: '',  description: 'Fades, cuts & grooming',       count: 48 },
  { id: 'hair-stylists',  name: 'Hair Stylists',   emoji: '',  description: 'Natural, braids & color',      count: 62 },
  { id: 'tattoo-artists', name: 'Tattoo Artists',  emoji: '', description: 'Custom ink & fine line',       count: 24 },
  { id: 'nail-techs',     name: 'Nail Techs',      emoji: '',  description: 'Gel, art & acrylics',          count: 53 },
  { id: 'makeup-artists', name: 'Makeup Artists',  emoji: '',  description: 'Bridal, glam & editorial',     count: 37 },
  { id: 'photographers',  name: 'Photographers',   emoji: '',  description: 'Portrait, events & content',   count: 41 },
]

export const PROVIDERS: Provider[] = [
  {
    id: '1', name: 'Kevo Cuts', slug: 'kevo-cuts', emoji: '', image: '/kevo-cuts.jpg',
    specialty: 'Fades & Line-ups', category: 'barbers', location: 'Nairobi CBD',
    phone: '+254712345678', coordinates: { lat: -1.2921, lng: 36.8219 },
    rating: 4.9, reviewCount: 212, bookings: 580, bookedCount: 89, repeatClients: 156, startingPrice: 350,
    tags: ['Fades', 'Line-ups', 'Beard', 'Kids'],
    about: "Nairobi's top fade specialist with 7 years of precision work. Kevo brings a global eye to local culture — trained in Johannesburg and London, now back home giving Nairobi its best cuts. Every client walks out looking like the main character.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Classic Cut',           price: 'KSh 350',   duration: '30 min' },
      { name: 'Fade + Line-up',        price: 'KSh 500',   duration: '45 min' },
      { name: 'Beard Trim',            price: 'KSh 250',   duration: '20 min' },
      { name: 'Full Groom Package',    price: 'KSh 750',   duration: '60 min' },
      { name: 'Kids Cut (under 12)',   price: 'KSh 300',   duration: '25 min' },
    ],
    reviews: [
      { id: 'r1', author: 'Maina J.',  avatar: 'M', rating: 5, date: '2 days ago',  text: "Kevo is the absolute GOAT. Perfect fade every single time, I won't go anywhere else in Nairobi.", wouldRecommend: true, tags: ['Clean', 'On time', 'Skilled'] },
      { id: 'r2', author: 'Tobias K.', avatar: 'T', rating: 5, date: '1 week ago',  text: "Professional, clean, and fast. Best barbershop in CBD hands down. The music is always right too.", wouldRecommend: true, tags: ['Professional', 'Quick'] },
      { id: 'r3', author: 'Victor N.', avatar: 'V', rating: 4, date: '2 weeks ago', text: "Great cuts, just a little busy on weekends. Book ahead of time and you're sorted.", wouldRecommend: true, tags: ['Quality'] },
    ],
    verified: true, featured: true,
  },
  {
    id: '2', name: 'Slim Barbers', slug: 'slim-barbers', emoji: '', image: '/slim-barbers.jpg',
    specialty: 'Classic & Modern Cuts', category: 'barbers', location: 'Westlands',
    phone: '+254723456789', coordinates: { lat: -1.2654, lng: 36.8084 },
    rating: 4.7, reviewCount: 98, bookings: 310, bookedCount: 67, repeatClients: 89, startingPrice: 400,
    tags: ['Classic', 'Modern', 'Kids', 'Shave'],
    about: "Family barbershop with 10+ years in Westlands. We welcome everyone from toddlers to grandfathers. Classic techniques with a modern finish. Always a warm, welcoming experience.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Adult Cut',           price: 'KSh 400', duration: '35 min' },
      { name: 'Kids Cut',            price: 'KSh 300', duration: '25 min' },
      { name: 'Straight Razor Shave',price: 'KSh 200', duration: '20 min' },
      { name: 'Cut + Shave Combo',   price: 'KSh 550', duration: '50 min' },
      { name: 'Hair Treatment',      price: 'KSh 600', duration: '30 min' },
    ],
    reviews: [
      { id: 'r4', author: 'James M.', avatar: 'J', rating: 5, date: '3 days ago', text: "Best place for my son's haircuts. Always welcoming and they never make him cry!", wouldRecommend: true, tags: ['Kid-friendly', 'Welcoming'] },
      { id: 'r5', author: 'Grace A.', avatar: 'G', rating: 4, date: '1 week ago', text: "Quick service and fair prices. My go-to spot in Westlands.", wouldRecommend: true, tags: ['Quick', 'Affordable'] },
    ],
    verified: true,
  },
  {
    id: '3', name: 'The Blade Room', slug: 'blade-room', emoji: '', image: '/blade-room.jpg',
    specialty: 'Premium Grooming', category: 'barbers', location: 'Karen',
    phone: '+254734567890', coordinates: { lat: -1.3164, lng: 36.7755 },
    rating: 4.8, reviewCount: 156, bookings: 420, bookedCount: 78, repeatClients: 134, startingPrice: 800,
    tags: ['Premium', 'Beard', 'Hot Towel', 'Luxury'],
    about: "Nairobi's most elevated barbershop experience. Hot towel shaves, premium Kenyan-sourced products, a curated playlist, and artisans who genuinely love their craft. Where grooming meets ritual.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Signature Cut',           price: 'KSh 800',   duration: '45 min' },
      { name: 'Hot Towel Shave',         price: 'KSh 900',   duration: '40 min' },
      { name: 'Beard Sculpt & Condition',price: 'KSh 700',   duration: '35 min' },
      { name: 'The Full Works',          price: 'KSh 1,500', duration: '90 min' },
    ],
    reviews: [
      { id: 'r6', author: 'Dennis O.', avatar: 'D', rating: 5, date: '4 days ago', text: "Premium experience for real. Walked in stressed, walked out like royalty. Worth every shilling.", wouldRecommend: true, tags: ['Luxury', 'Professional'] },
      { id: 'r7', author: 'Mark P.',   avatar: 'M', rating: 5, date: '5 days ago', text: "Hot towel shave was incredible. Felt completely renewed. This is what barbershops should be.", wouldRecommend: true, tags: ['Relaxing', 'Quality'] },
    ],
    verified: true, featured: true,
  },
  {
    id: '4', name: 'Zuri Hair Studio', slug: 'zuri-hair-studio', emoji: '', image: '/zuri-hair-studio.jpg',
    specialty: 'Natural Hair & Braids', category: 'hair-stylists', location: 'Kilimani',
    phone: '+254745678901', coordinates: { lat: -1.2994, lng: 36.8142 },
    rating: 4.9, reviewCount: 289, bookings: 620, bookedCount: 145, repeatClients: 198, startingPrice: 1200,
    tags: ['Natural', 'Braids', 'Locs', 'Protective'],
    about: "Celebrating the crown. A safe space for natural African hair. Specialised in protective styles, loc journeys, chemical-free treatments, and big chops done with love and precision.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Wash & Style',          price: 'KSh 1,200', duration: '60 min'  },
      { name: 'Box Braids',            price: 'KSh 3,500', duration: '240 min' },
      { name: 'Loc Retwist',           price: 'KSh 2,000', duration: '90 min'  },
      { name: 'Big Chop',              price: 'KSh 1,800', duration: '75 min'  },
      { name: 'Deep Condition + Steam',price: 'KSh 900',   duration: '45 min'  },
    ],
    reviews: [
      { id: 'r8', author: 'Amina W.',  avatar: 'A', rating: 5, date: '1 day ago',  text: "Zuri understood my hair goals perfectly. Most stunning result I've ever had.", wouldRecommend: true, tags: ['Expert', 'Patient'] },
      { id: 'r9', author: 'Fatma S.',  avatar: 'F', rating: 5, date: '3 days ago', text: "My locs have never looked better. Professional and genuinely caring.", wouldRecommend: true, tags: ['Caring', 'Skilled'] },
    ],
    verified: true, featured: true,
  },
  {
    id: '5', name: 'Glam House', slug: 'glam-house', emoji: '', image: '/glam-house.jpg',
    specialty: 'Weaves & Color', category: 'hair-stylists', location: 'Lavington',
    phone: '+254756789012', coordinates: { lat: -1.2996, lng: 36.8108 },
    rating: 4.6, reviewCount: 167, bookings: 390, bookedCount: 89, repeatClients: 123, startingPrice: 2500,
    tags: ['Weaves', 'Color', 'Balayage', 'Relaxer'],
    about: "Full-service glam salon specialising in weave installations, balayage, and color corrections. International trends, Nairobi-rooted — with your hair health always the priority.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Weave Install',          price: 'KSh 2,500', duration: '120 min' },
      { name: 'Balayage / Highlights',  price: 'KSh 4,000', duration: '150 min' },
      { name: 'Relaxer',                price: 'KSh 1,500', duration: '90 min'  },
      { name: 'Deep Condition',         price: 'KSh 800',   duration: '40 min'  },
      { name: 'Color Correction',       price: 'KSh 5,500', duration: '180 min' },
    ],
    reviews: [
      { id: 'r10', author: 'Purity N.',  avatar: 'P', rating: 5, date: '5 days ago', text: "My weave looks so natural everyone thinks it's real hair. Amazing!", wouldRecommend: true, tags: ['Natural look', 'Skilled'] },
      { id: 'r11', author: 'Cynthia O.', avatar: 'C', rating: 4, date: '1 week ago', text: "Balayage came out perfect. Exactly the warm tones I wanted.", wouldRecommend: true, tags: ['Color expert'] },
    ],
    verified: true,
  },
  {
    id: '6', name: 'Nailhaus', slug: 'nailhaus', emoji: '', image: '/nailhaus.jpg',
    specialty: 'Nail Art & Gel', category: 'nail-techs', location: 'Ngong Road',
    phone: '+254767890123', coordinates: { lat: -1.3026, lng: 36.8218 },
    rating: 4.8, reviewCount: 203, bookings: 510, bookedCount: 112, repeatClients: 167, startingPrice: 800,
    tags: ['Gel', 'Nail Art', 'Acrylics', 'SNS'],
    about: "Creative nail studio where every set is a piece of art. From clean minimalism to bold Afro-inspired nail art. Using only premium, long-lasting products.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Gel Manicure',         price: 'KSh 800',   duration: '50 min' },
      { name: 'Nail Art (per nail)',   price: 'KSh 150',   duration: '5 min'  },
      { name: 'Full Acrylic Set',      price: 'KSh 1,500', duration: '90 min' },
      { name: 'Gel Pedicure',         price: 'KSh 900',   duration: '60 min' },
      { name: 'Nail Removal + Rebase', price: 'KSh 600',  duration: '40 min' },
    ],
    reviews: [
      { id: 'r12', author: 'Stella K.', avatar: 'S', rating: 5, date: '2 days ago', text: "Best nail art in Nairobi, no competition. The detail work is insane.", wouldRecommend: true, tags: ['Creative', 'Detailed'] },
      { id: 'r13', author: 'Irene M.',  avatar: 'I', rating: 5, date: '4 days ago', text: "My nails are the first thing people notice about me now. Always creative.", wouldRecommend: true, tags: ['Trendy', 'Long-lasting'] },
    ],
    verified: true, featured: true,
  },
  {
    id: '7', name: 'Beat by Adaeze', slug: 'beat-by-adaeze', emoji: '', image: '/beat-by-adaeze.jpg',
    specialty: 'Bridal & Editorial', category: 'makeup-artists', location: 'Parklands',
    phone: '+254778901234', coordinates: { lat: -1.2636, lng: 36.8042 },
    rating: 5.0, reviewCount: 97, bookings: 180, bookedCount: 45, repeatClients: 78, startingPrice: 3500,
    tags: ['Bridal', 'Editorial', 'Glam', 'Airbrush'],
    about: "Award-winning MUA with 8 years across Nairobi, Lagos, and London. Known for celebrating melanin beautifully — long-lasting, skin-first looks, always intentional. Your face is her canvas.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Bridal Makeup (+ trial)', price: 'KSh 8,000', duration: '90 min' },
      { name: 'Evening / Event Glam',    price: 'KSh 4,000', duration: '60 min' },
      { name: 'Natural Everyday Beat',   price: 'KSh 3,500', duration: '50 min' },
      { name: 'Trial / Consultation',    price: 'KSh 2,500', duration: '45 min' },
      { name: 'Airbrush Foundation',     price: 'KSh 1,200', duration: '30 min' },
    ],
    reviews: [
      { id: 'r14', author: 'Wanjiku M.', avatar: 'W', rating: 5, date: '3 days ago', text: "I was a STUNNING bride. Adaeze is magical. I cried when I saw myself — in a good way!", wouldRecommend: true, tags: ['Bridal expert', 'Magical'] },
      { id: 'r15', author: 'Lola A.',    avatar: 'L', rating: 5, date: '1 week ago', text: "Beat was flawless 10 hours later, no touch-ups needed. Incredible.", wouldRecommend: true, tags: ['Long-lasting', 'Professional'] },
    ],
    verified: true, featured: true,
  },
  {
    id: '8', name: 'Lense by Odhis', slug: 'lense-by-odhis', emoji: '', image: '/lense-by-odhis.jpg',
    specialty: 'Portrait & Lifestyle', category: 'photographers', location: 'Muthaiga',
    phone: '+254789012345', coordinates: { lat: -1.2747, lng: 36.8154 },
    rating: 4.9, reviewCount: 142, bookings: 260, bookedCount: 67, repeatClients: 89, startingPrice: 5000,
    tags: ['Portrait', 'Lifestyle', 'Events', 'Corporate'],
    about: "Visual storyteller capturing authentic Nairobi moments. Shot for leading Kenyan brands, international NGOs, and hundreds of individuals. Whether personal or corporate — every frame matters.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Portrait Session (1hr)',      price: 'KSh 5,000',  duration: '60 min'  },
      { name: 'Lifestyle Shoot (2hr)',       price: 'KSh 9,000',  duration: '120 min' },
      { name: 'Event Coverage (half day)',   price: 'KSh 15,000', duration: '240 min' },
      { name: 'Corporate Headshots',         price: 'KSh 6,000',  duration: '60 min'  },
      { name: 'Full Day Coverage',           price: 'KSh 25,000', duration: '480 min' },
    ],
    reviews: [
      { id: 'r16', author: 'Brian O.',    avatar: 'B', rating: 5, date: '1 day ago',  text: "Odhis made me feel comfortable in front of the camera. The photos are stunning.", wouldRecommend: true, tags: ['Professional', 'Comfortable'] },
      { id: 'r17', author: 'Christine N.',avatar: 'C', rating: 5, date: '5 days ago', text: "Covered our company event flawlessly. Exactly what we needed.", wouldRecommend: true, tags: ['Event expert', 'Reliable'] },
    ],
    verified: true, featured: true,
  },
  {
    id: '9', name: 'Ink & Soul', slug: 'ink-and-soul', emoji: '', image: '/ink-and-soul.jpg',
    specialty: 'Fine Line & Illustrative', category: 'tattoo-artists', location: 'Westlands',
    phone: '+254790123456', coordinates: { lat: -1.2655, lng: 36.8083 },
    rating: 4.8, reviewCount: 89, bookings: 310, bookedCount: 56, repeatClients: 67, startingPrice: 2000,
    tags: ['Fine Line', 'Illustrative', 'Color', 'Blackwork'],
    about: "Tattoo studio celebrating African iconography and modern illustration. Every piece is custom-designed. No flash, no shortcuts. Clean studio, sterile equipment, artistry that lasts forever.",
    gallery: ['','','','','','','','',''],
    services: [
      { name: 'Small Tattoo (≤3cm)',    price: 'KSh 2,000',  duration: '60 min'  },
      { name: 'Medium Design (3–8cm)',  price: 'KSh 4,500',  duration: '90 min'  },
      { name: 'Large Piece (8cm+)',     price: 'KSh 9,000',  duration: '180 min' },
      { name: 'Full Sleeve (consult)',  price: 'KSh 35,000+',duration: 'Multi-session' },
      { name: 'Touch-Up',              price: 'KSh 1,000',  duration: '30 min'  },
    ],
    reviews: [
      { id: 'r18', author: 'Kelvin R.', avatar: 'K', rating: 5, date: '2 days ago', text: "Insane line work. My tattoo is a masterpiece — people stop me to ask about it.", wouldRecommend: true, tags: ['Artist', 'Detail-oriented'] },
      { id: 'r19', author: 'Nadia T.',  avatar: 'N', rating: 5, date: '1 week ago', text: "Super professional setup and artistry is next level. Felt safe the whole time.", wouldRecommend: true, tags: ['Clean', 'Professional'] },
    ],
    verified: true,
  },
]

export const FEATURED_PROVIDERS = PROVIDERS.filter(p => p.featured)

export function getProvidersByCategory(categoryId: string): Provider[] {
  return PROVIDERS.filter(p => p.category === categoryId)
}

export function getProviderById(id: string): Provider | undefined {
  return PROVIDERS.find(p => p.id === id)
}

export function getAllProviders(): Provider[] {
  return PROVIDERS
}

// Trending providers: High rating + high bookedCount
export function getTrendingProviders(): Provider[] {
  return PROVIDERS
    .filter(p => p.rating >= 4.7 && p.bookedCount >= 50)
    .sort((a, b) => (b.bookedCount * b.rating) - (a.bookedCount * a.rating))
    .slice(0, 6)
}

// Calculate distance between two coordinates (in km)
export function calculateDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Get providers near a location (mock user location: Nairobi CBD)
export function getNearbyProviders(maxDistance: number = 5): Provider[] {
  const userLocation = { lat: -1.2921, lng: 36.8219 } // Nairobi CBD
  
  return PROVIDERS
    .map(provider => ({
      ...provider,
      distance: calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        provider.coordinates.lat, 
        provider.coordinates.lng
      )
    }))
    .filter(p => p.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}
