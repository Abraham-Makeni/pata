'use client'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  fallbackSrc,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [imgError, setImgError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    if (!imgError && fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
      setImgError(true)
    } else {
      setIsLoading(false)
      setImgError(true)
      onError?.()
    }
  }

  // Generate blur data URL for better perceived performance
  const generateBlurDataURL = (imageSrc: string): string => {
    // Simple blur placeholder - in production, you'd want to generate this properly
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.4"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e5e7eb"/>
            <stop offset="100%" style="stop-color:#d1d5db"/>
          </linearGradient>
        </defs>
      </svg>`
    ).toString('base64')}`
  }

  const imageProps = {
    src: imgSrc,
    alt,
    priority,
    fill,
    sizes: sizes || (fill ? undefined : '100vw'),
    quality,
    placeholder: placeholder as 'blur' | 'empty' | undefined,
    blurDataURL: blurDataURL || (placeholder === 'blur' ? generateBlurDataURL(src) : undefined),
    className: cn(
      'transition-opacity duration-300',
      isLoading ? 'opacity-0' : 'opacity-100',
      imgError ? 'bg-gray-200' : '',
      className
    ),
    onLoad: handleLoad,
    onError: handleError,
    ...props
  }

  if (fill) {
    return (
      <div className={cn('relative overflow-hidden', className)}>
        <Image {...imageProps} />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-1">🖼️</div>
              <div className="text-xs">Image not available</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        {...imageProps}
        width={width}
        height={height}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      {imgError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-400 text-center">
            <div className="text-2xl mb-1">🖼️</div>
            <div className="text-xs">Image not available</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Specialized components for common use cases

export function ProviderAvatar({
  src,
  alt,
  size = 68,
  className,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & { size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-xl object-cover', className)}
      sizes={`${size}px`}
      priority={size <= 100}
      placeholder="blur"
      {...props}
    />
  )
}

export function CategoryImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height' | 'fill'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={64}
      height={64}
      className={cn('rounded-2xl object-cover', className)}
      sizes="64px"
      placeholder="blur"
      {...props}
    />
  )
}

export function HeroImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={cn('object-cover', className)}
      sizes="100vw"
      priority
      quality={85}
      placeholder="blur"
      {...props}
    />
  )
}

export function LazyImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('transition-all duration-500', className)}
      placeholder="blur"
      quality={75}
      priority={false}
      {...props}
    />
  )
}
