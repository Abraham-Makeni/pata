// IndexedDB for offline data storage
export class OfflineStorage {
  private static instance: OfflineStorage
  private dbName = 'pata-offline'
  private version = 1
  private db: IDBDatabase | null = null

  private constructor() {}

  static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage()
    }
    return OfflineStorage.instance
  }

  // Initialize IndexedDB
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create stores for different data types
        if (!db.objectStoreNames.contains('providers')) {
          db.createObjectStore('providers', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('bookings')) {
          db.createObjectStore('bookings', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('reviews')) {
          db.createObjectStore('reviews', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('actions')) {
          db.createObjectStore('actions', { keyPath: 'id', autoIncrement: true })
        }
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'url' })
        }
      }
    })
  }

  // Store providers offline
  async storeProviders(providers: any[]): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(['providers'], 'readwrite')
    const store = transaction.objectStore('providers')

    for (const provider of providers) {
      await store.put({
        ...provider,
        cachedAt: Date.now()
      })
    }
  }

  // Get providers from cache
  async getProviders(): Promise<any[]> {
    if (!this.db) return []

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['providers'], 'readonly')
      const store = transaction.objectStore('providers')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Store booking offline
  async storeBooking(booking: any): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(['bookings'], 'readwrite')
    const store = transaction.objectStore('bookings')
    
    await store.put({
      ...booking,
      cachedAt: Date.now()
    })
  }

  // Get bookings from cache
  async getBookings(): Promise<any[]> {
    if (!this.db) return []

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['bookings'], 'readonly')
      const store = transaction.objectStore('bookings')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Store offline action for sync
  async storeOfflineAction(action: {
    type: string
    url: string
    method: string
    headers?: Record<string, string>
    body?: string
    timestamp: number
  }): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(['actions'], 'readwrite')
    const store = transaction.objectStore('actions')
    
    await store.add(action)
  }

  // Get offline actions for sync
  async getOfflineActions(): Promise<any[]> {
    if (!this.db) return []

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['actions'], 'readonly')
      const store = transaction.objectStore('actions')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Remove offline action after sync
  async removeOfflineAction(id: number): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(['actions'], 'readwrite')
    const store = transaction.objectStore('actions')
    
    await store.delete(id)
  }

  // Cache API response
  async cacheResponse(url: string, response: Response): Promise<void> {
    if (!this.db) return

    const transaction = this.db.transaction(['cache'], 'readwrite')
    const store = transaction.objectStore('cache')
    
    const clonedResponse = response.clone()
    const data = await clonedResponse.text()
    
    await store.put({
      url,
      data,
      headers: Object.fromEntries(response.headers.entries()),
      status: response.status,
      cachedAt: Date.now()
    })
  }

  // Get cached response
  async getCachedResponse(url: string): Promise<Response | null> {
    if (!this.db) return null

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cache'], 'readonly')
      const store = transaction.objectStore('cache')
      const request = store.get(url)

      request.onsuccess = () => {
        const cached = request.result
        if (!cached) {
          resolve(null)
          return
        }

        // Check if cache is still valid (24 hours)
        const age = Date.now() - cached.cachedAt
        if (age > 24 * 60 * 60 * 1000) {
          resolve(null)
          return
        }

        const response = new Response(cached.data, {
          status: cached.status,
          headers: cached.headers
        })
        resolve(response)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Clear all cached data
  async clearCache(): Promise<void> {
    if (!this.db) return

    const stores = ['providers', 'bookings', 'reviews', 'cache']
    
    for (const storeName of stores) {
      const transaction = this.db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      await store.clear()
    }
  }

  // Check if online
  isOnline(): boolean {
    return navigator.onLine
  }

  // Listen for online/offline events
  onConnectionChange(callback: (online: boolean) => void): () => void {
    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }
}

// Offline sync manager
export class OfflineSyncManager {
  private static instance: OfflineSyncManager
  public storage = OfflineStorage.getInstance()
  private isSyncing = false

  private constructor() {}

  static getInstance(): OfflineSyncManager {
    if (!OfflineSyncManager.instance) {
      OfflineSyncManager.instance = new OfflineSyncManager()
    }
    return OfflineSyncManager.instance
  }

  // Initialize offline sync
  async init(): Promise<void> {
    await this.storage.init()
    
    // Listen for connection changes
    this.storage.onConnectionChange((online) => {
      if (online && !this.isSyncing) {
        this.syncOfflineActions()
      }
    })

    // Sync immediately if online
    if (this.storage.isOnline()) {
      this.syncOfflineActions()
    }
  }

  // Store action for later sync
  async storeAction(action: {
    type: string
    url: string
    method: string
    headers?: Record<string, string>
    body?: string
  }): Promise<void> {
    await this.storage.storeOfflineAction({
      ...action,
      timestamp: Date.now()
    })
  }

  // Sync offline actions
  private async syncOfflineActions(): Promise<void> {
    if (this.isSyncing || !this.storage.isOnline()) return

    this.isSyncing = true

    try {
      const actions = await this.storage.getOfflineActions()
      
      for (const action of actions) {
        try {
          const response = await fetch(action.url, {
            method: action.method,
            headers: action.headers,
            body: action.body
          })

          if (response.ok) {
            // Remove successful action from queue
            await this.storage.removeOfflineAction(action.id)
          }
        } catch (error) {
          console.error('Failed to sync action:', error)
        }
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      this.isSyncing = false
    }
  }

  // Force sync
  async forceSync(): Promise<void> {
    await this.syncOfflineActions()
  }

  // Get sync status
  getSyncStatus(): {
    isOnline: boolean
    isSyncing: boolean
    pendingActions: number
  } {
    return {
      isOnline: this.storage.isOnline(),
      isSyncing: this.isSyncing,
      pendingActions: 0 // Would need to implement count
    }
  }
}

