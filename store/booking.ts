import { create } from 'zustand'
import { Provider, ServiceItem } from '@/lib/data'

export type BookingState = {
  provider: Provider | null
  service: ServiceItem | null
  date: string | null       // ISO string  e.g. "2026-05-10"
  time: string | null       // e.g. "10:00 AM"
  ref: string | null
  setProvider: (p: Provider) => void
  setService: (s: ServiceItem) => void
  setDate: (d: string) => void
  setTime: (t: string) => void
  setRef: (r: string) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  provider: null,
  service:  null,
  date:     null,
  time:     null,
  ref:      null,
  setProvider: (provider) => set({ provider }),
  setService:  (service)  => set({ service }),
  setDate:     (date)     => set({ date }),
  setTime:     (time)     => set({ time }),
  setRef:      (ref)      => set({ ref }),
  reset: () => set({ provider: null, service: null, date: null, time: null, ref: null }),
}))
