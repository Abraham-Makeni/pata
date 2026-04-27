'use client'
import { useEffect, useCallback } from 'react'

export function useAccessibility() {
  // Focus management
  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    
    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  // Announce to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  // Skip to main content
  const createSkipLink = useCallback(() => {
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.textContent = 'Skip to main content'
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-4 py-2 rounded z-50'
    skipLink.setAttribute('aria-label', 'Skip to main content')
    
    document.body.insertBefore(skipLink, document.body.firstChild)
  }, [])

  // Keyboard navigation enhancement
  const enhanceKeyboardNavigation = useCallback(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement
        const closeButton = activeElement?.closest('[data-close-on-escape]')?.querySelector('[aria-label*="Close"], [aria-label*="Cancel"]')
        if (closeButton) {
          (closeButton as HTMLElement).click()
        }
      }

      // Enter key on buttons/links
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement
        if (target.tagName === 'BUTTON') {
          target.click()
        } else if (target.tagName === 'A') {
          const link = target as HTMLAnchorElement
          if (!link.href) {
            link.click()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Auto-focus management
  const autoFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      setTimeout(() => {
        element.focus()
        announce('Element focused', 'polite')
      }, 100)
    }
  }, [announce])

  // Initialize accessibility features
  useEffect(() => {
    createSkipLink()
    const cleanup = enhanceKeyboardNavigation()
    
    return cleanup
  }, [createSkipLink, enhanceKeyboardNavigation])

  return {
    trapFocus,
    announce,
    autoFocus
  }
}

// Accessibility utilities
export const a11y = {
  // Generate unique IDs for ARIA relationships
  generateId: (prefix: string = 'a11y') => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Check if element is visible
  isVisible: (element: HTMLElement): boolean => {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)
  },
  
  // Get focusable elements
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')
    
    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
  },
  
  // Set ARIA attributes safely
  setAria: (element: HTMLElement, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(`aria-${key}`, value)
    })
  },
  
  // Remove ARIA attributes
  removeAria: (element: HTMLElement, attributes: string[]) => {
    attributes.forEach(attr => {
      element.removeAttribute(`aria-${attr}`)
    })
  }
}

// Screen reader announcements
export class ScreenReaderAnnouncer {
  private static instance: ScreenReaderAnnouncer
  private announcementArea: HTMLElement | null = null

  private constructor() {
    this.createAnnouncementArea()
  }

  static getInstance(): ScreenReaderAnnouncer {
    if (!ScreenReaderAnnouncer.instance) {
      ScreenReaderAnnouncer.instance = new ScreenReaderAnnouncer()
    }
    return ScreenReaderAnnouncer.instance
  }

  private createAnnouncementArea(): void {
    this.announcementArea = document.createElement('div')
    this.announcementArea.setAttribute('aria-live', 'polite')
    this.announcementArea.setAttribute('aria-atomic', 'true')
    this.announcementArea.className = 'sr-only'
    document.body.appendChild(this.announcementArea)
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcementArea) return

    this.announcementArea.setAttribute('aria-live', priority)
    this.announcementArea.textContent = message
    
    // Clear the announcement after it's read
    setTimeout(() => {
      if (this.announcementArea) {
        this.announcementArea.textContent = ''
      }
    }, 1000)
  }

  announcePageChange(title: string): void {
    this.announce(`Page changed to: ${title}`)
  }

  announceError(message: string): void {
    this.announce(`Error: ${message}`, 'assertive')
  }

  announceSuccess(message: string): void {
    this.announce(`Success: ${message}`)
  }
}

// Keyboard navigation manager
export class KeyboardNavigationManager {
  private static instance: KeyboardNavigationManager
  private currentFocusIndex = 0
  private focusableElements: HTMLElement[] = []

  private constructor() {}

  static getInstance(): KeyboardNavigationManager {
    if (!KeyboardNavigationManager.instance) {
      KeyboardNavigationManager.instance = new KeyboardNavigationManager()
    }
    return KeyboardNavigationManager.instance
  }

  setContainer(container: HTMLElement): void {
    this.focusableElements = a11y.getFocusableElements(container)
    this.currentFocusIndex = 0
  }

  navigateNext(): HTMLElement | null {
    if (this.focusableElements.length === 0) return null
    
    this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length
    const nextElement = this.focusableElements[this.currentFocusIndex]
    nextElement.focus()
    
    return nextElement
  }

  navigatePrevious(): HTMLElement | null {
    if (this.focusableElements.length === 0) return null
    
    this.currentFocusIndex = this.currentFocusIndex === 0 
      ? this.focusableElements.length - 1 
      : this.currentFocusIndex - 1
      
    const previousElement = this.focusableElements[this.currentFocusIndex]
    previousElement.focus()
    
    return previousElement
  }

  navigateFirst(): HTMLElement | null {
    if (this.focusableElements.length === 0) return null
    
    this.currentFocusIndex = 0
    const firstElement = this.focusableElements[0]
    firstElement.focus()
    
    return firstElement
  }

  navigateLast(): HTMLElement | null {
    if (this.focusableElements.length === 0) return null
    
    this.currentFocusIndex = this.focusableElements.length - 1
    const lastElement = this.focusableElements[this.currentFocusIndex]
    lastElement.focus()
    
    return lastElement
  }
}
