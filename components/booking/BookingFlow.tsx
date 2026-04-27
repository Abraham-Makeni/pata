'use client'
import { useState, useEffect } from 'react'
import { Provider } from '@/lib/data'
import { useBooking } from '@/hooks/useBooking'
import { ProviderAvatar } from '@/components/ui/OptimizedImage'
import StarRating from '@/components/ui/StarRating'
import { cn } from '@/lib/utils'

interface BookingFlowProps {
  provider: Provider
  onBookingComplete?: (bookingId: string) => void
  onCancel?: () => void
}

export function BookingFlow({ provider, onBookingComplete, onCancel }: BookingFlowProps) {
  const {
    bookingState,
    isProcessing,
    error,
    getTimeSlots,
    setProvider,
    setSelectedDate,
    setSelectedTimeSlot,
    setServiceType,
    setNotes,
    toggleInstantBooking,
    processBooking,
    resetBooking,
    isReadyToBook,
    getBookingSummary
  } = useBooking()

  const [selectedDateInput, setSelectedDateInput] = useState('')

  // Initialize with provided provider
  useEffect(() => {
    setProvider(provider)
  }, [provider, setProvider])

  const timeSlots = getTimeSlots()
  const bookingSummary = getBookingSummary()

  // Handle date selection
  const handleDateSelect = (dateString: string) => {
    const date = new Date(dateString)
    setSelectedDate(date)
    setSelectedDateInput(dateString)
  }

  // Handle booking submission
  const handleBookingSubmit = async () => {
    const success = await processBooking()
    if (success && onBookingComplete) {
      onBookingComplete(`booking_${Date.now()}`)
    }
  }

  // Get available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    
    return dates
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">Book with {provider.name}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <StarRating rating={provider.rating} />
          <span>•</span>
          <span>{provider.location}</span>
          <span>•</span>
          <span>{provider.bookings} bookings</span>
        </div>
      </div>

      {/* Provider Info */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <div className="flex gap-4">
          <ProviderAvatar
            src={provider.image}
            alt={provider.name}
            size={80}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-black mb-1">{provider.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{provider.specialty}</p>
            <div className="flex items-center gap-2">
              {provider.verified && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  ✓ Verified
                </span>
              )}
              <span className="text-sm text-gray-500">
                Starting from KSh {provider.startingPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Selection */}
      <div className="mb-6">
        <h3 className="font-semibold text-black mb-3">Select Service</h3>
        <div className="grid grid-cols-2 gap-3">
          {provider.services.map(service => (
            <button
              key={service.name}
              onClick={() => setServiceType(service.name)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                bookingState.serviceType === service.name
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="font-medium">{service.name}</div>
              <div className="text-sm opacity-75">KSh {service.price.toLocaleString()}</div>
              <div className="text-xs opacity-60">{service.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <h3 className="font-semibold text-black mb-3">Select Date</h3>
        <div className="grid grid-cols-4 gap-2">
          {getAvailableDates().map(date => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
              className={cn(
                "p-3 rounded-xl border text-center transition-all",
                bookingState.selectedDate?.toDateString() === date.toDateString()
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className="text-sm">{date.getDate()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot Selection */}
      {bookingState.selectedDate && (
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-3">Select Time</h3>
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => slot.available && setSelectedTimeSlot(slot)}
                disabled={!slot.available}
                className={cn(
                  "p-2 rounded-lg border text-center transition-all text-sm",
                  !slot.available
                    ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : bookingState.selectedTimeSlot?.id === slot.id
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div>{slot.startTime}</div>
                {slot.price && (
                  <div className="text-xs opacity-75">KSh {slot.price}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <h3 className="font-semibold text-black mb-3">Notes (Optional)</h3>
        <textarea
          value={bookingState.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any special requests or notes..."
          className="w-full p-3 border border-gray-200 rounded-xl resize-none h-24"
        />
      </div>

      {/* Instant Booking */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={bookingState.isInstantBooking}
            onChange={toggleInstantBooking}
            className="rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="text-sm text-black">
            Instant booking (skip confirmation)
          </span>
        </label>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Booking Summary */}
      {bookingSummary && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-black mb-2">Booking Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="text-black font-medium">{bookingSummary.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="text-black font-medium">{bookingSummary.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="text-black font-medium">{bookingSummary.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="text-black font-medium">KSh {bookingSummary.price.toLocaleString()}</span>
            </div>
            {bookingSummary.instantBooking && (
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="text-green-600 font-medium">Instant Booking</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-black hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleBookingSubmit}
          disabled={!isReadyToBook || isProcessing}
          className={cn(
            "flex-1 px-4 py-3 rounded-xl font-medium transition-all",
            isReadyToBook && !isProcessing
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          {isProcessing ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  )
}

export default BookingFlow
