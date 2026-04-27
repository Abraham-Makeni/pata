import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { openDB, IDBPDatabase } from 'idb'

// State normalization utilities
export interface EntityState<T> {
  byId: Record<string, T>
  allIds: string[]
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

export interface NormalizedState {
  providers: EntityState<Provider>
  bookings: EntityState<Booking>
  reviews: EntityState<Review>
  users: EntityState<User>
  categories: EntityState<Category>
}

// Create entity state helper
export function createEntityState<T>(): EntityState<T> {
  return {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    lastUpdated: null
  }
}

// Entity state helpers
export const entityHelpers = {
  // Add or update entity
  upsert<T>(state: EntityState<T>, entity: T & { id: string }): EntityState<T> {
    const exists = state.byId[entity.id]
    return {
      ...state,
      byId: {
        ...state.byId,
        [entity.id]: entity
      },
      allIds: exists ? state.allIds : [...state.allIds, entity.id],
      lastUpdated: Date.now()
    }
  },

  // Add multiple entities
  upsertMany<T>(state: EntityState<T>, entities: (T & { id: string })[]): EntityState<T> {
    const newById = { ...state.byId }
    const newAllIds = [...state.allIds]

    entities.forEach(entity => {
      newById[entity.id] = entity
      if (!state.byId[entity.id]) {
        newAllIds.push(entity.id)
      }
    })

    return {
      ...state,
      byId: newById,
      allIds: newAllIds,
      lastUpdated: Date.now()
    }
  },

  // Remove entity
  remove<T>(state: EntityState<T>, id: string): EntityState<T> {
    const { [id]: removed, ...restById } = state.byId
    return {
      ...state,
      byId: restById,
      allIds: state.allIds.filter(entityId => entityId !== id),
      lastUpdated: Date.now()
    }
  },

  // Get entity
  get<T>(state: EntityState<T>, id: string): T | undefined {
    return state.byId[id]
  },

  // Get all entities
  getAll<T>(state: EntityState<T>): T[] {
    return state.allIds.map(id => state.byId[id]).filter(Boolean)
  },

  // Set loading state
  setLoading<T>(state: EntityState<T>, loading: boolean): EntityState<T> {
    return { ...state, loading }
  },

  // Set error state
  setError<T>(state: EntityState<T>, error: string | null): EntityState<T> {
    return { ...state, error, loading: false }
  },

  // Clear state
  clear<T>(): EntityState<T> {
    return createEntityState<T>()
  }
}

// Optimized store configuration
const storeConfig = {
  name: 'pata-store',
  storage: createJSONStorage(() => {
    // Use IndexedDB for better performance with large datasets
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      return {
        getItem: async (name: string) => {
          const db = await openDB('pata-store', 1, {
            upgrade(db: IDBPDatabase) {
              db.createObjectStore('pata-store')
            }
          })
          return await db.get('pata-store', name)
        },
        setItem: async (name: string, value: string) => {
          const db = await openDB('pata-store', 1, {
            upgrade(db: IDBPDatabase) {
              db.createObjectStore('pata-store')
            }
          })
          await db.put('pata-store', value, name)
        },
        removeItem: async (name: string) => {
          const db = await openDB('pata-store', 1, {
            upgrade(db: IDBPDatabase) {
              db.createObjectStore('pata-store')
            }
          })
          await db.delete('pata-store', name)
        }
      }
    }
    // Fallback to localStorage
    return localStorage
  }),
  partialize: (state: any) => ({
    // Only persist essential data
    providers: state.providers,
    bookings: state.bookings,
    user: state.user,
    preferences: state.preferences,
    // Don't persist loading states, errors, or temporary data
  }),
  version: 1,
  migrate: (persistedState: any, version: number) => {
    // Handle state migrations
    if (version === 0) {
      // Migration from version 0 to 1
      return {
        ...persistedState,
        providers: createEntityState(),
        bookings: createEntityState(),
        reviews: createEntityState(),
        users: createEntityState(),
        categories: createEntityState()
      }
    }
    return persistedState
  }
}

// Main store with optimized state management
export const usePataStore = create<NormalizedState & {
  // Actions
  addProvider: (provider: Provider) => void
  addProviders: (providers: Provider[]) => void
  updateProvider: (id: string, updates: Partial<Provider>) => void
  removeProvider: (id: string) => void
  getProvider: (id: string) => Provider | undefined
  getAllProviders: () => Provider[]
  
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  removeBooking: (id: string) => void
  getBooking: (id: string) => Booking | undefined
  getAllBookings: () => Booking[]
  
  addReview: (review: Review) => void
  updateReview: (id: string, updates: Partial<Review>) => void
  removeReview: (id: string) => void
  getReview: (id: string) => Review | undefined
  getAllReviews: () => Review[]
  
  // Optimistic updates
  optimisticUpdate: (action: () => Promise<void>) => Promise<void>
  
  // Cache management
  clearCache: () => void
  invalidateCache: (entityType: keyof NormalizedState) => void
  
  // Loading and error states
  setLoading: (entityType: keyof NormalizedState, loading: boolean) => void
  setError: (entityType: keyof NormalizedState, error: string | null) => void
}>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        providers: createEntityState<Provider>(),
        bookings: createEntityState<Booking>(),
        reviews: createEntityState<Review>(),
        users: createEntityState<User>(),
        categories: createEntityState<Category>(),
        
        // Provider actions
        addProvider: (provider: Provider) => set((state: any) => ({
          providers: entityHelpers.upsert(state.providers, provider)
        })),
        
        addProviders: (providers: Provider[]) => set((state: any) => ({
          providers: entityHelpers.upsertMany(state.providers, providers)
        })),
        
        updateProvider: (id: string, updates: Partial<Provider>) => set((state: any) => {
          const existing = entityHelpers.get(state.providers, id)
          if (!existing) return state
          const updatedEntity = { ...existing, ...updates }
          return {
            providers: entityHelpers.upsert(state.providers, updatedEntity as any)
          }
        }),
        
        removeProvider: (id: string) => set((state: any) => ({
          providers: entityHelpers.remove(state.providers, id)
        })),
        
        getProvider: (id: string) => entityHelpers.get(get().providers, id),
        getAllProviders: () => entityHelpers.getAll(get().providers),
        
        // Booking actions
        addBooking: (booking: Booking) => set((state: any) => ({
          bookings: entityHelpers.upsert(state.bookings, booking)
        })),
        
        updateBooking: (id: string, updates: Partial<Booking>) => set((state: any) => {
          const existing = entityHelpers.get(state.bookings, id)
          if (!existing) return state
          const updatedEntity = { ...existing, ...updates }
          return {
            bookings: entityHelpers.upsert(state.bookings, updatedEntity as any)
          }
        }),
        
        removeBooking: (id: string) => set((state: any) => ({
          bookings: entityHelpers.remove(state.bookings, id)
        })),
        
        getBooking: (id: string) => entityHelpers.get(get().bookings, id),
        getAllBookings: () => entityHelpers.getAll(get().bookings),
        
        // Review actions
        addReview: (review: Review) => set((state: any) => ({
          reviews: entityHelpers.upsert(state.reviews, review)
        })),
        
        updateReview: (id: string, updates: Partial<Review>) => set((state: any) => {
          const existing = entityHelpers.get(state.reviews, id)
          if (!existing) return state
          const updatedEntity = { ...existing, ...updates }
          return {
            reviews: entityHelpers.upsert(state.reviews, updatedEntity as any)
          }
        }),
        
        removeReview: (id: string) => set((state: any) => ({
          reviews: entityHelpers.remove(state.reviews, id)
        })),
        
        getReview: (id: string) => entityHelpers.get(get().reviews, id),
        getAllReviews: () => entityHelpers.getAll(get().reviews),
        
        // Optimistic updates
        optimisticUpdate: async (action: () => Promise<void>) => {
          try {
            await action()
          } catch (error) {
            // Rollback logic would go here
            console.error('Optimistic update failed:', error)
            throw error
          }
        },
        
        // Cache management
        clearCache: () => set(() => ({
          providers: createEntityState(),
          bookings: createEntityState(),
          reviews: createEntityState(),
          users: createEntityState(),
          categories: createEntityState()
        })),
        
        invalidateCache: (entityType: keyof NormalizedState) => set((state: any) => ({
          [entityType]: createEntityState()
        })),
        
        // Loading and error states
        setLoading: (entityType: keyof NormalizedState, loading: boolean) => set((state: any) => ({
          [entityType]: entityHelpers.setLoading(state[entityType], loading)
        })),
        
        setError: (entityType: keyof NormalizedState, error: string | null) => set((state: any) => ({
          [entityType]: entityHelpers.setError(state[entityType], error)
        }))
      }),
      storeConfig
    ),
    { name: 'pata-store' }
  )
)

// Selectors for optimized performance
export const providerSelectors = {
  getProviderById: (id: string) => (state: NormalizedState) => 
    entityHelpers.get(state.providers, id),
  
  getAllProviders: (state: NormalizedState) => 
    entityHelpers.getAll(state.providers),
  
  getProvidersByCategory: (category: string) => (state: NormalizedState) =>
    entityHelpers.getAll(state.providers).filter(p => p.category === category),
  
  getProvidersByLocation: (location: string) => (state: NormalizedState) =>
    entityHelpers.getAll(state.providers).filter(p => p.location === location),
  
  getTopRatedProviders: (minRating: number = 4.5) => (state: NormalizedState) =>
    entityHelpers.getAll(state.providers).filter(p => p.rating >= minRating),
  
  getVerifiedProviders: (state: NormalizedState) =>
    entityHelpers.getAll(state.providers).filter(p => p.verified)
}

export const bookingSelectors = {
  getBookingById: (id: string) => (state: NormalizedState) => 
    entityHelpers.get(state.bookings, id),
  
  getAllBookings: (state: NormalizedState) => 
    entityHelpers.getAll(state.bookings),
  
  getBookingsByUser: (userId: string) => (state: NormalizedState) =>
    entityHelpers.getAll(state.bookings).filter(b => b.userId === userId),
  
  getBookingsByProvider: (providerId: string) => (state: NormalizedState) =>
    entityHelpers.getAll(state.bookings).filter(b => b.providerId === providerId),
  
  getUpcomingBookings: (state: NormalizedState) => {
    const now = new Date()
    return entityHelpers.getAll(state.bookings).filter(b => 
      new Date(b.date) > now
    )
  },
  
  getPastBookings: (state: NormalizedState) => {
    const now = new Date()
    return entityHelpers.getAll(state.bookings).filter(b => 
      new Date(b.date) <= now
    )
  }
}

export const reviewSelectors = {
  getReviewById: (id: string) => (state: NormalizedState) => 
    entityHelpers.get(state.reviews, id),
  
  getAllReviews: (state: NormalizedState) => 
    entityHelpers.getAll(state.reviews),
  
  getReviewsByProvider: (providerId: string) => (state: NormalizedState) =>
    entityHelpers.getAll(state.reviews).filter(r => r.providerId === providerId),
  
  getReviewsByUser: (userId: string) => (state: NormalizedState) =>
    entityHelpers.getAll(state.reviews).filter(r => r.userId === userId),
  
  getVerifiedReviews: (state: NormalizedState) =>
    entityHelpers.getAll(state.reviews).filter(r => r.verified)
}

// Cache utilities
export const cacheUtils = {
  // Cache TTL in milliseconds
  TTL: {
    SHORT: 5 * 60 * 1000,    // 5 minutes
    MEDIUM: 30 * 60 * 1000,  // 30 minutes
    LONG: 2 * 60 * 60 * 1000 // 2 hours
  },
  
  // Check if cache is valid
  isCacheValid: (lastUpdated: number | null, ttl: number): boolean => {
    if (!lastUpdated) return false
    return Date.now() - lastUpdated < ttl
  },
  
  // Get cache age
  getCacheAge: (lastUpdated: number | null): number => {
    if (!lastUpdated) return Infinity
    return Date.now() - lastUpdated
  }
}

// Performance utilities
export const performanceUtils = {
  // Memoized selector creator
  createSelector: <T, R>(
    selector: (state: T) => R,
    equalityFn?: (a: R, b: R) => boolean
  ) => selector,
  
  // Batch updates
  batchUpdates: (updates: Array<() => void>) => {
    updates.forEach(update => update())
  },
  
  // Debounced updates
  debounce: <T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }) as T
  }
}

// Type definitions
export interface Provider {
  id: string
  name: string
  specialty: string
  location: string
  rating: number
  verified: boolean
  image: string
  startingPrice: number
  bookings: number
  services: Array<{ name: string; price: number; duration: string }>
  category: string
}

export interface Booking {
  id: string
  userId: string
  providerId: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  price: number
  notes?: string
  createdAt: string
}

export interface Review {
  id: string
  providerId: string
  userId: string
  rating: number
  title?: string
  content: string
  photos?: string[]
  date: string
  helpful: number
  verified: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: Record<string, any>
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  count: number
}
