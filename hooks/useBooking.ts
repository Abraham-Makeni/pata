'use client'
import { useState, useEffect, useCallback } from 'react'
import { Provider } from '@/lib/data'

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
  price?: number
}

export interface BookingState {
  provider: Provider | null
  selectedDate: Date | null
  selectedTimeSlot: TimeSlot | null
  serviceType: string | null
  notes: string
  isInstantBooking: boolean
}

export const initialBookingState: BookingState = {
  provider: null,
  selectedDate: null,
  selectedTimeSlot: null,
  serviceType: null,
  notes: '',
  isInstantBooking: false
}

export function useBooking() {
  const [bookingState, setBookingState] = useState<BookingState>(initialBookingState)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate mock time slots for a given date
  const generateTimeSlots = useCallback((date: Date, provider: Provider): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const startHour = 9
    const endHour = 18
    const slotDuration = 30 // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const endTime = `${hour.toString().padStart(2, '0')}:${(minute + slotDuration).toString().padStart(2, '0')}`
        
        // Random availability for demo (in real app, this would come from API)
        const available = Math.random() > 0.3
        
        slots.push({
          id: `${date.toISOString()}-${startTime}`,
          startTime,
          endTime,
          available,
          price: available ? provider.startingPrice : undefined
        })
      }
    }

    return slots
  }, [])

  // Get available time slots for selected date
  const getTimeSlots = useCallback((): TimeSlot[] => {
    if (!bookingState.provider || !bookingState.selectedDate) {
      return []
    }
    return generateTimeSlots(bookingState.selectedDate, bookingState.provider)
  }, [bookingState.provider, bookingState.selectedDate, generateTimeSlots])

  // Set provider
  const setProvider = useCallback((provider: Provider) => {
    setBookingState(prev => ({
      ...prev,
      provider,
      selectedDate: null,
      selectedTimeSlot: null,
      serviceType: null
    }))
    setError(null)
  }, [])

  // Set selected date
  const setSelectedDate = useCallback((date: Date | null) => {
    setBookingState(prev => ({
      ...prev,
      selectedDate: date,
      selectedTimeSlot: null
    }))
    setError(null)
  }, [])

  // Set selected time slot
  const setSelectedTimeSlot = useCallback((timeSlot: TimeSlot | null) => {
    setBookingState(prev => ({
      ...prev,
      selectedTimeSlot: timeSlot
    }))
    setError(null)
  }, [])

  // Set service type
  const setServiceType = useCallback((serviceType: string | null) => {
    setBookingState(prev => ({
      ...prev,
      serviceType
    }))
    setError(null)
  }, [])

  // Set notes
  const setNotes = useCallback((notes: string) => {
    setBookingState(prev => ({
      ...prev,
      notes
    }))
  }, [])

  // Toggle instant booking
  const toggleInstantBooking = useCallback(() => {
    setBookingState(prev => ({
      ...prev,
      isInstantBooking: !prev.isInstantBooking
    }))
  }, [])

  // Validate booking
  const validateBooking = useCallback((): string | null => {
    if (!bookingState.provider) {
      return 'Please select a provider'
    }
    if (!bookingState.selectedDate) {
      return 'Please select a date'
    }
    if (!bookingState.selectedTimeSlot) {
      return 'Please select a time slot'
    }
    if (!bookingState.serviceType) {
      return 'Please select a service type'
    }
    if (!bookingState.selectedTimeSlot.available) {
      return 'Selected time slot is not available'
    }
    return null
  }, [bookingState])

  // Process booking
  const processBooking = useCallback(async (): Promise<boolean> => {
    const validationError = validateBooking()
    if (validationError) {
      setError(validationError)
      return false
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real app, this would make an API call to create the booking
      console.log('Booking created:', {
        provider: bookingState.provider?.name,
        date: bookingState.selectedDate?.toISOString(),
        timeSlot: bookingState.selectedTimeSlot,
        serviceType: bookingState.serviceType,
        notes: bookingState.notes,
        instantBooking: bookingState.isInstantBooking
      })

      // Reset booking state on success
      setBookingState(initialBookingState)
      return true
    } catch (err) {
      setError('Failed to create booking. Please try again.')
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [bookingState, validateBooking])

  // Reset booking
  const resetBooking = useCallback(() => {
    setBookingState(initialBookingState)
    setError(null)
    setIsProcessing(false)
  }, [])

  // Check if booking is ready
  const isReadyToBook = useCallback(() => {
    return !!(
      bookingState.provider &&
      bookingState.selectedDate &&
      bookingState.selectedTimeSlot &&
      bookingState.serviceType &&
      bookingState.selectedTimeSlot.available
    )
  }, [bookingState])

  // Get booking summary
  const getBookingSummary = useCallback(() => {
    if (!bookingState.provider || !bookingState.selectedDate || !bookingState.selectedTimeSlot) {
      return null
    }

    return {
      provider: bookingState.provider.name,
      service: bookingState.serviceType,
      date: bookingState.selectedDate.toLocaleDateString(),
      time: `${bookingState.selectedTimeSlot.startTime} - ${bookingState.selectedTimeSlot.endTime}`,
      price: bookingState.selectedTimeSlot.price || bookingState.provider.startingPrice,
      instantBooking: bookingState.isInstantBooking
    }
  }, [bookingState])

  return {
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
    isReadyToBook: isReadyToBook(),
    getBookingSummary
  }
}
