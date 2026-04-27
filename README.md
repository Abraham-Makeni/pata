# PATA – Get Things Done

> A local service discovery & booking platform for Nairobi. Barbers, hair stylists, tattoo artists, makeup artists, nail techs, and photographers.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([download](https://nodejs.org))
- **npm** 9+ (comes with Node)

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npm run dev
```

### 3. Open in browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
pata/
├── app/
│   ├── page.tsx              # Splash screen (auto-redirects to /auth)
│   ├── layout.tsx            # Root layout + global fonts
│   ├── globals.css           # Tailwind + custom styles
│   ├── auth/
│   │   └── page.tsx          # Sign In / Sign Up
│   ├── home/
│   │   └── page.tsx          # Home (categories + trending)
│   ├── listing/
│   │   └── page.tsx          # Provider listing with filters
│   ├── profile/[id]/
│   │   └── page.tsx          # Provider profile + gallery + reviews
│   ├── booking/[id]/
│   │   └── page.tsx          # Calendar + time slot booking
│   └── confirmation/
│       └── page.tsx          # Booking confirmed screen
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx        # Sticky navbar (glass effect)
│   ├── cards/
│   │   ├── ProviderCard.tsx  # Card for listing page
│   │   └── FeaturedCard.tsx  # Card for home scroll
│   └── ui/
│       ├── StarRating.tsx    # Reusable star rating
│       ├── Chip.tsx          # Filter chip button
│       ├── Skeletons.tsx     # Loading skeletons
│       └── SplashScreen.tsx  # Animated splash
│
├── lib/
│   └── data.ts               # All mock data (9 providers, 6 categories)
│
├── store/
│   └── booking.ts            # Zustand booking state
│
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

---

## 🎨 Design System

| Token       | Value                   |
|-------------|-------------------------|
| Primary     | `#0a0a0a` (ink)         |
| Background  | `#fafafa` (chalk)       |
| Font serif  | Playfair Display        |
| Font sans   | DM Sans                 |
| Radius      | `rounded-2xl` / `rounded-full` |
| Glass nav   | `backdrop-blur(20px)`   |

---

## 🧭 User Flow

```
/ (Splash) → /auth → /home → /listing?category=... → /profile/[id] → /booking/[id] → /confirmation
```

---

## 🛠 Tech Stack

| Tool           | Version   | Purpose                    |
|----------------|-----------|----------------------------|
| Next.js        | 14        | Routing + SSR framework    |
| React          | 18        | UI library                 |
| TypeScript     | 5         | Type safety                |
| Tailwind CSS   | 3         | Utility-first styling      |
| Framer Motion  | 11        | Animations                 |
| Zustand        | 4         | Lightweight state mgmt     |

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Deploy to Vercel (free)

```bash
npx vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

---

Built with passion in Nairobi.
