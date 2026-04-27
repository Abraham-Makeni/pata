'use client'
import { Provider } from '@/lib/data'
import { ProviderAvatar } from './OptimizedImage'
import StarRating from './StarRating'
import { cn } from '@/lib/utils'

interface ComparisonModalProps {
  providers: Provider[]
  isOpen: boolean
  onClose: () => void
  onRemove: (providerId: string) => void
}

export function ComparisonModal({ providers, isOpen, onClose, onRemove }: ComparisonModalProps) {
  if (!isOpen) return null

  const comparisonFeatures = [
    { key: 'specialty', label: 'Specialty' },
    { key: 'location', label: 'Location' },
    { key: 'rating', label: 'Rating' },
    { key: 'bookings', label: 'Total Bookings' },
    { key: 'startingPrice', label: 'Starting Price' },
    { key: 'verified', label: 'Verified' },
    { key: 'services', label: 'Services' }
  ]

  const getFeatureValue = (provider: Provider, feature: string) => {
    switch (feature) {
      case 'specialty':
        return provider.specialty
      case 'location':
        return provider.location
      case 'rating':
        return <StarRating rating={provider.rating} size="sm" />
      case 'bookings':
        return provider.bookings.toLocaleString()
      case 'startingPrice':
        return `KSh ${provider.startingPrice.toLocaleString()}`
      case 'verified':
        return provider.verified ? '✅ Verified' : 'Not verified'
      case 'services':
        return provider.services.slice(0, 3).map(s => s.name).join(', ')
      default:
        return 'N/A'
    }
  }

  const getBestValue = (feature: string) => {
    if (feature === 'rating') {
      return Math.max(...providers.map(p => p.rating))
    }
    if (feature === 'bookings') {
      return Math.max(...providers.map(p => p.bookings))
    }
    if (feature === 'startingPrice') {
      return Math.min(...providers.map(p => p.startingPrice))
    }
    return null
  }

  const isBestValue = (provider: Provider, feature: string) => {
    const best = getBestValue(feature)
    if (best === null) return false
    
    if (feature === 'rating') {
      return provider.rating === best
    }
    if (feature === 'bookings') {
      return provider.bookings === best
    }
    if (feature === 'startingPrice') {
      return provider.startingPrice === best
    }
    return false
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-black">Compare Providers</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-4">
          {providers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No providers selected for comparison</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Provider Headers */}
                <thead>
                  <tr>
                    <th className="text-left p-3 font-medium text-black">Feature</th>
                    {providers.map(provider => (
                      <th key={provider.id} className="text-center p-3 min-w-[200px]">
                        <div className="space-y-2">
                          <ProviderAvatar
                            src={provider.image}
                            alt={provider.name}
                            size={60}
                            className="mx-auto"
                          />
                          <div>
                            <h3 className="font-medium text-black">{provider.name}</h3>
                            <button
                              onClick={() => onRemove(provider.id)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Comparison Rows */}
                <tbody>
                  {comparisonFeatures.map(feature => (
                    <tr key={feature.key} className="border-t border-gray-100">
                      <td className="p-3 font-medium text-black">{feature.label}</td>
                      {providers.map(provider => (
                        <td
                          key={provider.id}
                          className={cn(
                            "p-3 text-center",
                            isBestValue(provider, feature.key) && "bg-green-50 text-green-700 font-medium"
                          )}
                        >
                          {getFeatureValue(provider, feature.key)}
                          {isBestValue(provider, feature.key) && (
                            <div className="text-xs mt-1">🏆 Best</div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Action Buttons */}
          {providers.length > 0 && (
            <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-xl text-black hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Navigate to booking with first provider
                  window.location.href = `/booking/${providers[0].id}`
                }}
                className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
              >
                Book {providers[0].name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Comparison button for provider cards
interface CompareButtonProps {
  provider: Provider
  isSelected: boolean
  onToggle: () => void
  disabled?: boolean
}

export function CompareButton({ provider, isSelected, onToggle, disabled }: CompareButtonProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        isSelected
          ? "bg-black text-white"
          : "bg-gray-100 text-black hover:bg-gray-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span>⚖️</span>
      <span>{isSelected ? 'Comparing' : 'Compare'}</span>
    </button>
  )
}

// Comparison indicator in header
interface ComparisonIndicatorProps {
  count: number
  maxCount: number
  onOpen: () => void
}

export function ComparisonIndicator({ count, maxCount, onOpen }: ComparisonIndicatorProps) {
  return (
    <button
      onClick={onOpen}
      disabled={count === 0}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
        count > 0
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      )}
    >
      <span>⚖️</span>
      <span>Compare ({count}/{maxCount})</span>
    </button>
  )
}

export default ComparisonModal
