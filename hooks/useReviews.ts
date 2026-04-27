'use client'
import { useState, useCallback } from 'react'

export interface Review {
  id: string
  providerId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title?: string
  content: string
  photos?: string[]
  date: string
  helpful: number
  verified: boolean
  response?: {
    content: string
    date: string
  }
}

export interface ReviewSubmission {
  rating: number
  title?: string
  content: string
  photos?: File[]
}

export function useReviews(providerId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userReview, setUserReview] = useState<Review | null>(null)

  // Mock data - in real app, this would come from API
  const mockReviews: Review[] = [
    {
      id: '1',
      providerId,
      userId: 'user1',
      userName: 'Sarah M.',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      title: 'Amazing experience!',
      content: 'Professional service and great attention to detail. Would definitely recommend!',
      photos: ['/api/placeholder/300/200'],
      date: '2024-01-15',
      helpful: 12,
      verified: true,
      response: {
        content: 'Thank you so much for your kind words! We appreciate your business.',
        date: '2024-01-16'
      }
    },
    {
      id: '2',
      providerId,
      userId: 'user2',
      userName: 'John D.',
      rating: 4,
      title: 'Good service',
      content: 'Overall good experience, but the wait time was a bit longer than expected.',
      date: '2024-01-10',
      helpful: 8,
      verified: false
    },
    {
      id: '3',
      providerId,
      userId: 'user3',
      userName: 'Emily R.',
      userAvatar: '/api/placeholder/40/40',
      rating: 5,
      content: 'Excellent! Very professional and skilled. Will definitely come back.',
      photos: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      date: '2024-01-05',
      helpful: 15,
      verified: true
    }
  ]

  // Load reviews
  const loadReviews = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter reviews for this provider
      const providerReviews = mockReviews.filter(review => review.providerId === providerId)
      setReviews(providerReviews)
      
      // Check if current user has already reviewed (mock implementation)
      const currentUserReview = providerReviews.find(review => review.userId === 'current_user')
      setUserReview(currentUserReview || null)
    } catch (err) {
      setError('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }, [providerId])

  // Submit review
  const submitReview = useCallback(async (reviewData: ReviewSubmission): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newReview: Review = {
        id: `review_${Date.now()}`,
        providerId,
        userId: 'current_user',
        userName: 'You',
        rating: reviewData.rating,
        title: reviewData.title,
        content: reviewData.content,
        photos: reviewData.photos ? reviewData.photos.map((_, index) => `/api/placeholder/300/200?photo=${index}`) : [],
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        verified: false
      }
      
      setReviews(prev => [newReview, ...prev])
      setUserReview(newReview)
      
      return true
    } catch (err) {
      setError('Failed to submit review')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [providerId])

  // Mark review as helpful
  const markHelpful = useCallback(async (reviewId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ))
      
      return true
    } catch (err) {
      setError('Failed to mark review as helpful')
      return false
    }
  }, [])

  // Delete review
  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setReviews(prev => prev.filter(review => review.id !== reviewId))
      if (userReview?.id === reviewId) {
        setUserReview(null)
      }
      
      return true
    } catch (err) {
      setError('Failed to delete review')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userReview])

  // Calculate rating distribution
  const getRatingDistribution = useCallback(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    
    return distribution
  }, [reviews])

  // Calculate average rating
  const getAverageRating = useCallback(() => {
    if (reviews.length === 0) return 0
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return total / reviews.length
  }, [reviews])

  // Get review summary
  const getReviewSummary = useCallback(() => {
    const totalReviews = reviews.length
    const averageRating = getAverageRating()
    const distribution = getRatingDistribution()
    
    return {
      totalReviews,
      averageRating,
      distribution,
      verifiedReviews: reviews.filter(r => r.verified).length
    }
  }, [reviews, getAverageRating, getRatingDistribution])

  // Sort reviews
  const sortReviews = useCallback((sortBy: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful') => {
    const sorted = [...reviews]
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating)
      case 'helpful':
        return sorted.sort((a, b) => b.helpful - a.helpful)
      default:
        return sorted
    }
  }, [reviews])

  return {
    reviews,
    userReview,
    isLoading,
    error,
    loadReviews,
    submitReview,
    markHelpful,
    deleteReview,
    getRatingDistribution,
    getAverageRating,
    getReviewSummary,
    sortReviews
  }
}
