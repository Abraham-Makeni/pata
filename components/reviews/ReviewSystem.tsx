'use client'
import { useState } from 'react'
import { useReviews } from '@/hooks/useReviews'
import { ProviderAvatar } from '@/components/ui/OptimizedImage'
import StarRating from '@/components/ui/StarRating'
import { cn } from '@/lib/utils'

interface ReviewSystemProps {
  providerId: string
  canReview?: boolean
}

export function ReviewSystem({ providerId, canReview = false }: ReviewSystemProps) {
  const {
    reviews,
    userReview,
    isLoading,
    error,
    loadReviews,
    submitReview,
    markHelpful,
    deleteReview,
    getReviewSummary,
    sortReviews
  } = useReviews(providerId)

  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest')
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Load reviews on mount
  useState(() => {
    loadReviews()
  })

  const reviewSummary = getReviewSummary()
  const sortedReviews = sortReviews(sortBy)

  const handleReviewSubmit = async (reviewData: any) => {
    const success = await submitReview(reviewData)
    if (success) {
      setShowReviewForm(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-black">Reviews</h3>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-3xl font-bold text-black">
              {reviewSummary.averageRating.toFixed(1)}
            </div>
            <StarRating rating={reviewSummary.averageRating} size="sm" />
            <div className="text-sm text-gray-600 mt-1">
              {reviewSummary.totalReviews} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-600 w-4">{rating}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${reviewSummary.totalReviews > 0 
                        ? (reviewSummary.distribution[rating as keyof typeof reviewSummary.distribution] / reviewSummary.totalReviews) * 100 
                        : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {reviewSummary.distribution[rating as keyof typeof reviewSummary.distribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          {reviewSummary.verifiedReviews} verified reviews
        </div>
      </div>

      {/* Review Form */}
      {canReview && !userReview && (
        <div className="border border-gray-200 rounded-2xl p-6">
          <h4 className="font-semibold text-black mb-4">Write a Review</h4>
          <ReviewForm
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* User's Review */}
      {userReview && (
        <div className="border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-black">Your Review</h4>
            <button
              onClick={() => deleteReview(userReview.id)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
          <ReviewCard review={userReview} isOwnReview />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map(review => (
          <ReviewCard 
            key={review.id} 
            review={review}
            onHelpful={() => markHelpful(review.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⭐</div>
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading reviews...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}

interface ReviewCardProps {
  review: any
  isOwnReview?: boolean
  onHelpful?: () => void
}

function ReviewCard({ review, isOwnReview = false, onHelpful }: ReviewCardProps) {
  return (
    <div className="border border-gray-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <ProviderAvatar
          src={review.userAvatar}
          alt={review.userName}
          size={48}
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-black">{review.userName}</h4>
                {review.verified && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <StarRating rating={review.rating} size="sm" />
                <span>•</span>
                <span>{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {review.title && (
            <h5 className="font-medium text-black mb-2">{review.title}</h5>
          )}
          
          <p className="text-gray-700 mb-3">{review.content}</p>

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.photos.map((photo: string, index: number) => (
                <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Provider Response */}
          {review.response && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-sm font-medium text-black mb-1">Provider Response</div>
              <p className="text-sm text-gray-700">{review.response.content}</p>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(review.response.date).toLocaleDateString()}
              </div>
            </div>
          )}

          {/* Actions */}
          {!isOwnReview && (
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={onHelpful}
                className="flex items-center gap-1 text-gray-600 hover:text-black"
              >
                👍 Helpful ({review.helpful})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ReviewFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0 || !content.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        rating,
        title: title.trim() || undefined,
        content: content.trim()
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl hover:scale-110 transition-transform"
            >
              {star <= rating ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of your experience"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Review *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this provider..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none h-24"
          required
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !content.trim()}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            isSubmitting || rating === 0 || !content.trim()
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          )}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  )
}

export default ReviewSystem
