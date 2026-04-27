# PATA — Service Discovery & Booking App

> Discover and book trusted local service providers in Nairobi.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open → http://localhost:3000

---

## 📁 Project Structure

```
pata/
├── app/
│   ├── page.tsx               Splash screen
│   ├── layout.tsx             Root layout
│   ├── globals.css            Global styles (Syne + Outfit fonts)
│   ├── auth/page.tsx          Sign In / Create Account
│   ├── home/page.tsx          Dashboard (categories + nearby)
│   ├── listing/page.tsx       Filtered provider list
│   ├── profile/[id]/page.tsx  Provider profile + gallery
│   ├── booking/[id]/page.tsx  Calendar + time booking
│   └── confirmation/page.tsx  Booking confirmed
├── components/
│   └── ui/SplashScreen.tsx
├── lib/data.ts                All mock data + image paths
├── store/booking.ts           Zustand state
└── public/images/             ← ADD YOUR IMAGES HERE
```

---

## 🖼 IMAGE GUIDE (for Windsurf)

See **WINDSURF_IMAGES.md** for the full image insertion instructions.

**Total images needed: 60**
- 6 category images
- 9 providers × 6 gallery images = 54 provider images

---

## 🎨 Design System

| Token         | Value                        |
|---------------|------------------------------|
| Display font  | Syne (700–800 weight)        |
| Body font     | Outfit (300–600 weight)      |
| Brand / Dark  | `#0a0a0a`                    |
| Background    | `#F7F7F5`                    |
| Cards         | `#ffffff` + soft shadow      |
| Gold accent   | `#C9A84C` (star ratings)     |
| Border radius | 20px cards, 999px pills      |

## 🧭 Flow

```
/ → /auth → /home → /listing?category=X → /profile/[id] → /booking/[id] → /confirmation
```

## 📦 Stack

- Next.js 14 · React 18 · TypeScript 5
- Tailwind CSS 3
- Zustand 4 (booking state)
- Google Fonts: Syne + Outfit
