import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Provider, ServiceItem } from '@/lib/data'

export type BookingState = {
  provider: Provider | null
  service: ServiceItem | null
  date: string | null       // ISO string  e.g. "2026-05-10"
  time: string | null       // e.g. "10:00 AM"
  ref: string | null
  lastBookedProviderId: string | null
  setProvider: (p: Provider) => void
  setService: (s: ServiceItem) => void
  setDate: (d: string) => void
  setTime: (t: string) => void
  setRef: (r: string) => void
  setLastBookedProvider: (providerId: string) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      provider: null,
      service:  null,
      date:     null,
      time:     null,
      ref:      null,
      lastBookedProviderId: null,
      setProvider: (provider) => set({ provider }),
      setService:  (service)  => set({ service }),
      setDate:     (date)     => set({ date }),
      setTime:     (time)     => set({ time }),
      setRef:      (ref)      => set({ ref }),
      setLastBookedProvider: (providerId) => set({ lastBookedProviderId: providerId }),
      reset: () => set({ provider: null, service: null, date: null, time: null, ref: null }),
    }),
    {
      name: 'pata-booking-storage',
      partialize: (state) => ({ lastBookedProviderId: state.lastBookedProviderId }),
    }
  )
)
