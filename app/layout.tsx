import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PATA – Find Your Style',
  description: 'Discover and book top local service providers in Nairobi. Barbers, hair stylists, makeup artists, photographers and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="bg-chalk text-ink antialiased max-w-[480px] mx-auto min-h-screen relative">
        {children}
      </body>
    </html>
  )
}
