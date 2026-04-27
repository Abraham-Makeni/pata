import { create } from 'zustand'
import { Provider, ServiceItem } from '@/lib/data'

type State = {
  provider: Provider | null
  service:  ServiceItem | null
  date:     string | null
  time:     string | null
  ref:      string | null
  setProvider: (p: Provider) => void
  setService:  (s: ServiceItem) => void
  setDate:     (d: string) => void
  setTime:     (t: string) => void
  setRef:      (r: string) => void
  reset:       () => void
}

export const useBookingStore = create<State>((set) => ({
  provider: null, service: null, date: null, time: null, ref: null,
  setProvider: p => set({ provider: p }),
  setService:  s => set({ service:  s }),
  setDate:     d => set({ date:     d }),
  setTime:     t => set({ time:     t }),
  setRef:      r => set({ ref:      r }),
  reset: ()   => set({ provider: null, service: null, date: null, time: null, ref: null }),
}))
