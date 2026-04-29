const CACHE_NAME = 'pata-v1'
const STATIC_CACHE = 'pata-static-v1'
const DYNAMIC_CACHE = 'pata-dynamic-v1'

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/home',
  '/listing',
  '/auth',
  '/manifest.json',
  // Add other static assets as needed
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE
            )
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Handle API requests differently
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Try to serve from cache when offline
          return caches.match(request)
        })
    )
    return
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response
        }

        // Network request for uncached content
        return fetch(request)
          .then((response) => {
            // Cache new successful responses
            if (response.ok && request.url.includes(self.location.origin)) {
              const responseClone = response.clone()
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            // Serve offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/')
            }
          })
      })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  }

  // Handle different notification types
  let notificationTitle = 'PATA'
  let notificationBody = options.body

  try {
    const data = event.data?.json ? event.data.json() : {}
    
    switch (data.type) {
      case 'booking_reminder':
        notificationTitle = 'Booking Reminder'
        notificationBody = `Your appointment with ${data.providerName} is tomorrow at ${data.time}`
        break
      case 'new_provider':
        notificationTitle = 'New Provider Available'
        notificationBody = `${data.providerName} is now available in ${data.category}`
        break
      case 'booking_confirmation':
        notificationTitle = 'Booking Confirmed'
        notificationBody = `Your booking with ${data.providerName} has been confirmed`
        break
      case 'booking_cancellation':
        notificationTitle = 'Booking Cancelled'
        notificationBody = `Your booking with ${data.providerName} has been cancelled`
        break
      default:
        notificationTitle = data.title || 'PATA'
        notificationBody = data.body || options.body
    }
  } catch (error) {
    console.error('Error parsing notification data:', error)
  }

  event.waitUntil(
    self.registration.showNotification(notificationTitle, {
      ...options,
      body: notificationBody,
      data: event.data?.json ? event.data.json() : options.data
    })
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  const { notification, action } = event
  
  if (action === 'explore') {
    // Open the app to relevant page
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (action === 'close') {
    notification.close()
  } else {
    // Default click behavior - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }

  notification.close()
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Background sync function
async function doBackgroundSync() {
  // Sync offline actions when back online
  try {
    // Get offline actions from IndexedDB
    const offlineActions = await getOfflineActions()
    
    // Process each offline action
    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        })
        
        // Remove processed action from IndexedDB
        await removeOfflineAction(action.id)
      } catch (error) {
        console.error('Failed to sync action:', error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// IndexedDB helpers for offline storage
async function getOfflineActions() {
  // This would interact with IndexedDB to get offline actions
  // For now, return empty array
  return []
}

async function removeOfflineAction(actionId) {
  // This would remove the action from IndexedDB
  // For now, do nothing
}

// Periodic sync for content updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent())
  }
})

// Update content function
async function updateContent() {
  try {
    // Fetch latest content
    const response = await fetch('/api/content/latest')
    const data = await response.json()
    
    // Update caches with new content
    const cache = await caches.open(DYNAMIC_CACHE)
    await cache.put('/api/content/latest', new Response(JSON.stringify(data)))
  } catch (error) {
    console.error('Content sync failed:', error)
  }
}
