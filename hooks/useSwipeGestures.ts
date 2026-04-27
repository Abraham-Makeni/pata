'use client'
import { useRef, useEffect, useCallback, useState } from 'react'

interface SwipeGestureOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  preventDefault?: boolean
}

export function useSwipeGestures(options: SwipeGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefault = false
  } = options

  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const endX = useRef<number>(0)
  const endY = useRef<number>(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }
    endX.current = e.touches[0].clientX
    endY.current = e.touches[0].clientY
  }, [preventDefault])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const deltaX = endX.current - startX.current
    const deltaY = endY.current - startY.current

    // Check for horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      }
    }
    // Check for vertical swipe
    else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

// Hook for pull-to-refresh
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const startY = useRef<number>(0)
  const currentY = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const threshold = 80 // Pull distance to trigger refresh

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isPulling) {
      currentY.current = e.touches[0].clientY
      const distance = currentY.current - startY.current
      
      if (distance > 0 && distance < threshold * 2) {
        setPullDistance(Math.min(distance, threshold * 2))
        e.preventDefault()
      }
    }
  }, [isPulling, threshold])

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true)
      setPullDistance(0)
      
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setIsPulling(false)
      }
    } else {
      setPullDistance(0)
      setIsPulling(false)
    }
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    containerRef,
    isPulling,
    pullDistance,
    isRefreshing,
    pullProgress: Math.min(pullDistance / threshold, 1)
  }
}

// Hook for swipeable cards
export function useSwipeableCard(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 100
) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragX(0)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    const startX = e.clientX
    const currentX = startX - dragX
    setDragX(currentX)
  }, [isDragging, dragX])

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return
    
    if (Math.abs(dragX) > threshold) {
      if (dragX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (dragX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }
    
    setIsDragging(false)
    setDragX(0)
  }, [isDragging, dragX, threshold, onSwipeLeft, onSwipeRight])

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e as any)
    }
    
    const handleGlobalMouseUp = () => {
      handleMouseUp()
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    cardRef,
    isDragging,
    dragX,
    dragProgress: Math.abs(dragX) / threshold
  }
}
