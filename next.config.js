/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: false,
    domains: [
      'localhost',
      '127.0.0.1',
      'res.cloudinary.com',
      'images.unsplash.com',
      'picsum.photos',
      'api.dicebear.com'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  skipTrailingSlashRedirect: true
}
module.exports = nextConfig
