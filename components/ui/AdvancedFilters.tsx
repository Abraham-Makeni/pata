'use client'
import { useState } from 'react'
import { FilterState, FilterOptions } from '@/lib/filters'
import { cn } from '@/lib/utils'

interface AdvancedFiltersProps {
  filters: FilterState
  filterOptions: FilterOptions
  onFiltersChange: (filters: Partial<FilterState>) => void
  onReset: () => void
  isOpen: boolean
  onToggle: () => void
  activeFilterCount: number
}

export function AdvancedFilters({
  filters,
  filterOptions,
  onFiltersChange,
  onReset,
  isOpen,
  onToggle,
  activeFilterCount
}: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    availability: true,
    services: false,
    locations: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0
    const currentRange = filters.priceRange || { min: filterOptions.minPrice, max: filterOptions.maxPrice }
    
    if (type === 'min') {
      onFiltersChange({
        priceRange: { ...currentRange, min: Math.min(numValue, currentRange.max) }
      })
    } else {
      onFiltersChange({
        priceRange: { ...currentRange, max: Math.max(numValue, currentRange.min) }
      })
    }
  }

  const handleAvailabilityChange = (type: keyof FilterState['availability'], checked: boolean) => {
    onFiltersChange({
      availability: { ...filters.availability, [type]: checked }
    })
  }

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
          activeFilterCount > 0
            ? "bg-black text-white"
            : "bg-gray-100 text-black hover:bg-gray-200"
        )}
      >
        <span>🔍</span>
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-black">Filters</h3>
              <button
                onClick={onReset}
                className="text-sm text-gray-500 hover:text-black transition-colors"
              >
                Reset all
              </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('categories')}
                className="flex items-center justify-between w-full mb-3 text-left"
              >
                <h4 className="font-medium text-black">Categories</h4>
                <span className="text-gray-400">
                  {expandedSections.categories ? '−' : '+'}
                </span>
              </button>
              {expandedSections.categories && (
                <div className="space-y-2">
                  {filterOptions.categories.map(category => (
                    <label
                      key={category.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.id)}
                        onChange={() => {
                          const categories = filters.categories.includes(category.id)
                            ? filters.categories.filter(c => c !== category.id)
                            : [...filters.categories, category.id]
                          onFiltersChange({ categories })
                        }}
                        className="rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-sm text-black">{category.name}</span>
                      <span className="text-xs text-gray-400">({category.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full mb-3 text-left"
              >
                <h4 className="font-medium text-black">Price Range</h4>
                <span className="text-gray-400">
                  {expandedSections.price ? '−' : '+'}
                </span>
              </button>
              {expandedSections.price && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Min Price</label>
                    <input
                      type="number"
                      value={filters.priceRange?.min || ''}
                      onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                      placeholder={filterOptions.minPrice.toString()}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Max Price</label>
                    <input
                      type="number"
                      value={filters.priceRange?.max || ''}
                      onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                      placeholder={filterOptions.maxPrice.toString()}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('rating')}
                className="flex items-center justify-between w-full mb-3 text-left"
              >
                <h4 className="font-medium text-black">Rating</h4>
                <span className="text-gray-400">
                  {expandedSections.rating ? '−' : '+'}
                </span>
              </button>
              {expandedSections.rating && (
                <div className="space-y-2">
                  {[4.5, 4.0, 3.5, 3.0].map(rating => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => onFiltersChange({ rating })}
                        className="text-black focus:ring-black"
                      />
                      <span className="text-sm text-black">
                        {rating}+ ⭐
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === null}
                      onChange={() => onFiltersChange({ rating: null })}
                      className="text-black focus:ring-black"
                    />
                    <span className="text-sm text-black">Any rating</span>
                  </label>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection('availability')}
                className="flex items-center justify-between w-full mb-3 text-left"
              >
                <h4 className="font-medium text-black">Availability</h4>
                <span className="text-gray-400">
                  {expandedSections.availability ? '−' : '+'}
                </span>
              </button>
              {expandedSections.availability && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={filters.availability.today}
                      onChange={(e) => handleAvailabilityChange('today', e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-black">Available today</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={filters.availability.thisWeek}
                      onChange={(e) => handleAvailabilityChange('thisWeek', e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-black">Available this week</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={filters.availability.thisMonth}
                      onChange={(e) => handleAvailabilityChange('thisMonth', e.target.checked)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-black">Available this month</span>
                  </label>
                </div>
              )}
            </div>

            {/* Verified */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={() => onFiltersChange({ verified: !filters.verified })}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm text-black">Verified providers only</span>
              </label>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h4 className="font-medium text-black mb-3">Sort by</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ sortBy: e.target.value as FilterState['sortBy'] })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="bookings">Most Booked</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedFilters
