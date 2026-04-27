// Performance monitoring and Web Vitals tracking
import { useState, useEffect, useCallback } from 'react'

export interface WebVitals {
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte
  inp: number // Interaction to Next Paint
}

export interface PerformanceMetrics {
  vitals: WebVitals
  timestamp: number
  url: string
  userAgent: string
  connection?: {
    effectiveType: string
    downlink: number
    rtt: number
  }
}

export interface ErrorInfo {
  message: string
  stack?: string
  timestamp: number
  url: string
  userAgent: string
  userId?: string
  sessionId?: string
  level: 'error' | 'warning' | 'info'
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics[] = []
  private errors: ErrorInfo[] = []
  private observers: PerformanceObserver[] = []
  private isRecording = false

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Start monitoring
  startMonitoring(): void {
    if (this.isRecording) return
    
    this.isRecording = true
    this.setupObservers()
    this.setupErrorTracking()
    this.setupPageLoadTracking()
  }

  // Stop monitoring
  stopMonitoring(): void {
    this.isRecording = false
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }

  // Setup performance observers
  private setupObservers(): void {
    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry
        this.updateMetric('lcp', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const eventEntry = entry as PerformanceEventTiming
          this.updateMetric('fid', eventEntry.processingStart - eventEntry.startTime)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.updateMetric('cls', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)

      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcpEntry = entries.find((entry: PerformanceEntry) => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          this.updateMetric('fcp', fcpEntry.startTime)
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(fcpObserver)

      // Time to First Byte
      const ttfbObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const navigationEntry = entries.find((entry: PerformanceEntry) => entry.entryType === 'navigation')
        if (navigationEntry) {
          const navEntry = navigationEntry as PerformanceNavigationTiming
          this.updateMetric('ttfb', navEntry.responseStart - navEntry.requestStart)
        }
      })
      ttfbObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(ttfbObserver)

    } catch (error) {
      console.error('Failed to setup performance observers:', error)
    }
  }

  // Update metric
  private updateMetric(name: keyof WebVitals, value: number): void {
    const currentMetrics = this.metrics[this.metrics.length - 1] || this.createEmptyMetrics()
    currentMetrics.vitals[name] = value
    currentMetrics.timestamp = Date.now()
  }

  // Create empty metrics object
  private createEmptyMetrics(): PerformanceMetrics {
    return {
      vitals: {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0,
        inp: 0
      },
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo()
    }
  }

  // Get connection information
  private getConnectionInfo(): PerformanceMetrics['connection'] {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      }
    }
    return undefined
  }

  // Setup error tracking
  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        stack: event.error?.stack,
        level: 'error'
      })
    })

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled promise rejection: ${event.reason}`,
        stack: event.reason?.stack,
        level: 'error'
      })
    })
  }

  // Track error
  trackError(error: Partial<ErrorInfo>): void {
    const errorInfo: ErrorInfo = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      level: error.level || 'error'
    }

    this.errors.push(errorInfo)
    
    // Send to analytics service
    this.sendErrorToAnalytics(errorInfo)
  }

  // Setup page load tracking
  private setupPageLoadTracking(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.recordPageLoadMetrics()
      }, 0)
    })
  }

  // Record page load metrics
  private recordPageLoadMetrics(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const metrics = this.createEmptyMetrics()
    
    if (navigation) {
      metrics.vitals.fcp = navigation.responseStart - navigation.fetchStart
      metrics.vitals.ttfb = navigation.responseStart - navigation.requestStart
    }

    this.metrics.push(metrics)
    
    // Send to analytics
    this.sendMetricsToAnalytics(metrics)
  }

  // Get current metrics
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  // Get all errors
  getAllErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  // Send metrics to analytics
  private sendMetricsToAnalytics(metrics: PerformanceMetrics): void {
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics, Vercel Analytics, etc.
      console.log('Sending metrics to analytics:', metrics)
    }
  }

  // Send error to analytics
  private sendErrorToAnalytics(error: ErrorInfo): void {
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, Bugsnag, etc.
      console.log('Sending error to analytics:', error)
    }
  }

  // Calculate performance score
  calculatePerformanceScore(): number {
    const metrics = this.getCurrentMetrics()
    if (!metrics) return 0

    const { vitals } = metrics
    let score = 100

    // LCP scoring (0-100, 100 = <2.5s)
    if (vitals.lcp > 4000) score -= 50
    else if (vitals.lcp > 2500) score -= 25

    // FID scoring (0-100, 100 = <100ms)
    if (vitals.fid > 300) score -= 50
    else if (vitals.fid > 100) score -= 25

    // CLS scoring (0-100, 100 = <0.1)
    if (vitals.cls > 0.25) score -= 50
    else if (vitals.cls > 0.1) score -= 25

    // TTFB scoring (0-100, 100 = <800ms)
    if (vitals.ttfb > 1800) score -= 50
    else if (vitals.ttfb > 800) score -= 25

    return Math.max(0, score)
  }

  // Get performance recommendations
  getRecommendations(): string[] {
    const metrics = this.getCurrentMetrics()
    if (!metrics) return []

    const recommendations: string[] = []
    const { vitals } = metrics

    if (vitals.lcp > 2500) {
      recommendations.push('Optimize images and reduce server response time to improve LCP')
    }

    if (vitals.fid > 100) {
      recommendations.push('Reduce JavaScript execution time to improve FID')
    }

    if (vitals.cls > 0.1) {
      recommendations.push('Ensure proper image dimensions and avoid layout shifts to improve CLS')
    }

    if (vitals.ttfb > 800) {
      recommendations.push('Use CDN and enable compression to improve TTFB')
    }

    return recommendations
  }

  // Clear metrics and errors
  clearData(): void {
    this.metrics = []
    this.errors = []
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [errors, setErrors] = useState<ErrorInfo[]>([])
  const [score, setScore] = useState(0)
  const [recommendations, setRecommendations] = useState<string[]>([])

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance()
    
    monitor.startMonitoring()
    
    // Update metrics periodically
    const interval = setInterval(() => {
      const currentMetrics = monitor.getCurrentMetrics()
      const allErrors = monitor.getAllErrors()
      
      setMetrics(currentMetrics)
      setErrors(allErrors)
      setScore(monitor.calculatePerformanceScore())
      setRecommendations(monitor.getRecommendations())
    }, 1000)

    return () => {
      clearInterval(interval)
      monitor.stopMonitoring()
    }
  }, [])

  const trackError = useCallback((error: Partial<ErrorInfo>) => {
    const monitor = PerformanceMonitor.getInstance()
    monitor.trackError(error)
  }, [])

  return {
    metrics,
    errors,
    score,
    recommendations,
    trackError
  }
}

// Performance utilities
export const performanceUtils = {
  // Measure function execution time
  measureTime: <T extends (...args: any[]) => any>(
    fn: T,
    name?: string
  ): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      
      console.log(`${name || fn.name}: ${end - start}ms`)
      
      return result
    }) as T
  },

  // Mark performance milestones
  mark: (name: string) => {
    performance.mark(name)
  },

  // Measure between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    performance.measure(name, startMark, endMark)
    
    const entries = performance.getEntriesByName(name, 'measure')
    const latestEntry = entries[entries.length - 1]
    
    return latestEntry?.duration || 0
  },

  // Get resource timing
  getResourceTiming: (url: string) => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    return entries.find(entry => entry.name === url)
  },

  // Analyze resource performance
  analyzeResources: () => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    const analysis = {
      totalResources: resources.length,
      totalSize: resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0),
      slowResources: resources.filter(resource => resource.duration > 1000),
      largeResources: resources.filter(resource => (resource.transferSize || 0) > 1000000),
      cachedResources: resources.filter(resource => resource.transferSize === 0)
    }

    return analysis
  }
}
