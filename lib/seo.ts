// SEO optimization utilities
export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  siteName?: string
  locale?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

export class SEOOptimizer {
  private static instance: SEOOptimizer
  private defaultConfig: SEOProps = {
    title: 'PATA - Find & Book Professional Services',
    description: 'Connect with top-rated professionals in Nairobi. Book appointments for barbers, stylists, tattoo artists, nail techs, makeup artists, and photographers.',
    keywords: ['barber', 'hair stylist', 'tattoo artist', 'nail tech', 'makeup artist', 'photographer', 'Nairobi', 'Kenya', 'booking', 'appointments'],
    image: '/images/og-image.jpg',
    type: 'website',
    siteName: 'PATA',
    locale: 'en_KE'
  }

  private constructor() {}

  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer()
    }
    return SEOOptimizer.instance
  }

  // Generate meta tags
  generateMetaTags(props: SEOProps = {}): Array<{ name: string; content: string } | { property: string; content: string }> {
    const config = { ...this.defaultConfig, ...props }
    const tags: Array<{ name: string; content: string } | { property: string; content: string }> = []

    // Basic meta tags
    tags.push({ name: 'title', content: config.title! })
    tags.push({ name: 'description', content: config.description! })
    tags.push({ name: 'keywords', content: config.keywords?.join(', ') || '' })

    // Open Graph tags
    tags.push({ property: 'og:title', content: config.title! })
    tags.push({ property: 'og:description', content: config.description! })
    tags.push({ property: 'og:image', content: config.image! })
    tags.push({ property: 'og:url', content: config.url || 'https://pata.co.ke' })
    tags.push({ property: 'og:type', content: config.type! })
    tags.push({ property: 'og:site_name', content: config.siteName! })
    tags.push({ property: 'og:locale', content: config.locale! })

    // Twitter Card tags
    tags.push({ name: 'twitter:card', content: 'summary_large_image' })
    tags.push({ name: 'twitter:title', content: config.title! })
    tags.push({ name: 'twitter:description', content: config.description! })
    tags.push({ name: 'twitter:image', content: config.image! })

    // Article specific tags
    if (config.type === 'article') {
      tags.push({ property: 'article:author', content: config.author || '' })
      tags.push({ property: 'article:published_time', content: config.publishedTime || '' })
      tags.push({ property: 'article:modified_time', content: config.modifiedTime || '' })
      tags.push({ property: 'article:section', content: config.section || '' })
      
      if (config.tags) {
        config.tags.forEach(tag => {
          tags.push({ property: 'article:tag', content: tag })
        })
      }
    }

    // Additional meta tags
    tags.push({ name: 'robots', content: 'index, follow' })
    tags.push({ name: 'googlebot', content: 'index, follow' })
    tags.push({ name: 'language', content: 'English' })
    tags.push({ name: 'geo.region', content: 'KE-NB' })
    tags.push({ name: 'geo.placename', content: 'Nairobi' })
    tags.push({ name: 'ICBM', content: '-1.2921, 36.8219' })

    return tags
  }

  // Generate structured data (JSON-LD)
  generateStructuredData(type: string, data: any): StructuredData {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type
    }

    switch (type) {
      case 'WebSite':
        return {
          ...baseData,
          name: this.defaultConfig.siteName,
          url: 'https://pata.co.ke',
          description: this.defaultConfig.description,
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://pata.co.ke/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        }

      case 'LocalBusiness':
        return {
          ...baseData,
          name: this.defaultConfig.siteName,
          description: this.defaultConfig.description,
          url: 'https://pata.co.ke',
          telephone: '+254-700-000-000',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Moi Avenue',
            addressLocality: 'Nairobi',
            addressRegion: 'Nairobi',
            postalCode: '00100',
            addressCountry: 'KE'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -1.2921,
            longitude: 36.8219
          },
          openingHours: 'Mo-Su 00:00-23:59',
          priceRange: '$$'
        }

      case 'Service':
        return {
          ...baseData,
          name: data.name,
          description: data.description,
          provider: {
            '@type': 'LocalBusiness',
            name: data.providerName
          },
          areaServed: {
            '@type': 'City',
            name: 'Nairobi'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Services',
            itemListElement: data.services?.map((service: any) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: service.name,
                description: service.description
              }
            }))
          }
        }

      case 'Person':
        return {
          ...baseData,
          name: data.name,
          jobTitle: data.specialty,
          description: data.description,
          image: data.image,
          telephone: data.phone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: data.location,
            addressCountry: 'KE'
          },
          knowsAbout: data.services?.map((service: any) => service.name),
          offers: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: data.specialty
            },
            price: data.startingPrice,
            priceCurrency: 'KES'
          }
        }

      case 'Review':
        return {
          ...baseData,
          itemReviewed: {
            '@type': 'Person',
            name: data.providerName
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: data.rating,
            bestRating: 5
          },
          author: {
            '@type': 'Person',
            name: data.authorName
          },
          reviewBody: data.content,
          datePublished: data.date
        }

      case 'BreadcrumbList':
        return {
          ...baseData,
          itemListElement: data.breadcrumbs.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        }

      default:
        return baseData
    }
  }

  // Generate sitemap
  generateSitemap(): string {
    const pages = [
      { url: 'https://pata.co.ke', priority: 1.0, changefreq: 'daily' },
      { url: 'https://pata.co.ke/home', priority: 0.9, changefreq: 'daily' },
      { url: 'https://pata.co.ke/listing', priority: 0.8, changefreq: 'daily' },
      { url: 'https://pata.co.ke/auth', priority: 0.7, changefreq: 'monthly' },
      { url: 'https://pata.co.ke/about', priority: 0.6, changefreq: 'monthly' },
      { url: 'https://pata.co.ke/contact', priority: 0.6, changefreq: 'monthly' }
    ]

    // Add category pages
    const categories = ['barbers', 'hair-stylists', 'tattoo-artists', 'nail-techs', 'makeup-artists', 'photographers']
    categories.forEach(category => {
      pages.push({
        url: `https://pata.co.ke/listing?category=${category}`,
        priority: 0.7,
        changefreq: 'weekly'
      })
    })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return sitemap
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /static/

Sitemap: https://pata.co.ke/sitemap.xml`
  }

  // Optimize images for SEO
  optimizeImageForSEO(imageUrl: string, alt: string, title?: string): {
    src: string
    alt: string
    title?: string
    loading: 'lazy' | 'eager'
    sizes: string
  } {
    return {
      src: imageUrl,
      alt,
      title,
      loading: 'lazy',
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    }
  }

  // Generate hreflang tags for internationalization
  generateHreflangTags(currentUrl: string): Array<{ rel: string; hrefLang: string; href: string }> {
    const languages = [
      { code: 'en', url: currentUrl },
      { code: 'sw', url: currentUrl.replace('/en/', '/sw/') },
      { code: 'x-default', url: currentUrl }
    ]

    return languages.map(lang => ({
      rel: 'alternate',
      hrefLang: lang.code,
      href: lang.url
    }))
  }

  // Generate canonical URL
  generateCanonicalUrl(path?: string): string {
    const baseUrl = 'https://pata.co.ke'
    return path ? `${baseUrl}${path}` : baseUrl
  }

  // Generate page-specific SEO
  generatePageSEO(pageType: string, data: any): SEOProps {
    switch (pageType) {
      case 'home':
        return {
          title: 'PATA - Find & Book Professional Services in Nairobi',
          description: 'Connect with top-rated professionals in Nairobi. Book appointments for barbers, stylists, tattoo artists, nail techs, makeup artists, and photographers.',
          keywords: ['barber', 'hair stylist', 'tattoo artist', 'nail tech', 'makeup artist', 'photographer', 'Nairobi', 'Kenya', 'booking', 'appointments']
        }

      case 'listing':
        return {
          title: `Browse ${data.category || 'Professionals'} in Nairobi | PATA`,
          description: `Find and book the best ${data.category || 'professionals'} in Nairobi. View ratings, compare prices, and book appointments online.`,
          keywords: [data.category, 'Nairobi', 'Kenya', 'booking', 'appointments', 'professionals']
        }

      case 'profile':
        return {
          title: `${data.provider.name} - ${data.provider.specialty} in Nairobi | PATA`,
          description: `Book an appointment with ${data.provider.name}, a ${data.provider.specialty} in ${data.provider.location}. ${data.provider.rating} stars, ${data.provider.bookings} bookings.`,
          keywords: [data.provider.name, data.provider.specialty, data.provider.location, 'Nairobi', 'Kenya'],
          type: 'profile'
        }

      case 'booking':
        return {
          title: `Book Appointment with ${data.provider.name} | PATA`,
          description: `Book an appointment with ${data.provider.name} for ${data.service}. Available time slots, instant booking, and secure payment.`,
          keywords: ['booking', 'appointment', data.provider.name, data.service, 'Nairobi']
        }

      default:
        return this.defaultConfig
    }
  }
}

// SEO utilities for Next.js pages
export function generateSEOHead(seo: SEOProps) {
  const optimizer = SEOOptimizer.getInstance()
  const metaTags = optimizer.generateMetaTags(seo)
  const structuredData = optimizer.generateStructuredData('WebSite', seo)
  const canonicalUrl = optimizer.generateCanonicalUrl(seo.url)
  const hreflangTags = optimizer.generateHreflangTags(seo.url || '')

  return {
    title: seo.title,
    description: seo.description,
    canonical: canonicalUrl,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: seo.siteName,
      images: seo.image ? [{ url: seo.image }] : [],
      locale: seo.locale,
      type: seo.type
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: seo.image ? [seo.image] : []
    },
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangTags.reduce((acc, tag) => {
        acc[tag.hrefLang] = tag.href
        return acc
      }, {} as Record<string, string>)
    }
  }
}

// SEO utilities
export const seoUtils = {
  // Generate slug from text
  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  // Generate readable URL
  generateReadableUrl: (title: string, id?: string): string => {
    const slug = seoUtils.generateSlug(title)
    return id ? `${slug}-${id}` : slug
  },

  // Optimize text length for SEO
  optimizeTextLength: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3).trim() + '...'
  },

  // Generate keywords from content
  extractKeywords: (content: string): string[] => {
    const words = content.toLowerCase().split(/\s+/)
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']
    
    return words
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .filter((word, index, array) => array.indexOf(word) === index)
      .slice(0, 10)
  },

  // Validate SEO score
  validateSEO: (seo: SEOProps): {
    score: number
    issues: string[]
    recommendations: string[]
  } => {
      const issues: string[] = []
      const recommendations: string[] = []
      let score = 100

      // Title validation
      if (!seo.title) {
        issues.push('Missing title')
        score -= 20
      } else if (seo.title.length < 30) {
        recommendations.push('Title should be at least 30 characters')
        score -= 10
      } else if (seo.title.length > 60) {
        recommendations.push('Title should be under 60 characters')
        score -= 5
      }

      // Description validation
      if (!seo.description) {
        issues.push('Missing description')
        score -= 20
      } else if (seo.description.length < 120) {
        recommendations.push('Description should be at least 120 characters')
        score -= 10
      } else if (seo.description.length > 160) {
        recommendations.push('Description should be under 160 characters')
        score -= 5
      }

      // Image validation
      if (!seo.image) {
        issues.push('Missing image')
        score -= 10
      }

      // Keywords validation
      if (!seo.keywords || seo.keywords.length === 0) {
        recommendations.push('Add keywords for better SEO')
        score -= 5
      }

      return { score, issues, recommendations }
    }
}
