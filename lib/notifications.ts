export interface NotificationData {
  type: 'booking_reminder' | 'new_provider' | 'booking_confirmation' | 'booking_cancellation' | 'general'
  title: string
  body: string
  data?: Record<string, any>
  icon?: string
  badge?: string
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
}

// Use the built-in PushSubscription type from the browser API

export class NotificationManager {
  private static instance: NotificationManager
  private subscription: PushSubscription | null = null
  private isSupported = false

  private constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  // Initialize notification system
  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Push notifications not supported')
      return false
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered')

      // Get existing subscription
      this.subscription = await registration.pushManager.getSubscription()
      
      return true
    } catch (error) {
      console.error('Failed to initialize notifications:', error)
      return false
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    console.log('Notification permission:', permission)
    return permission
  }

  // Check if notifications are enabled
  async isEnabled(): Promise<boolean> {
    if (!this.isSupported) return false
    
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  // Subscribe to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.isSupported) {
      throw new Error('Push notifications not supported')
    }

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BLj_WaD5V3sKJjOa1CqHq2Q4v8X9Y7Z6W5T4S3R2P1Q0N9M8L7K6J5H4G3F2D1E0A9'
        ) as BufferSource
      })

      this.subscription = subscription
      console.log('Push subscription successful:', subscription)
      
      // Send subscription to server
      if (subscription) {
        await this.sendSubscriptionToServer(subscription)
      }
      
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.subscription) {
      return true
    }

    try {
      const unsubscribed = await this.subscription.unsubscribe()
      const oldSubscription = this.subscription
      this.subscription = null
      
      // Remove subscription from server
      if (oldSubscription) {
        await this.removeSubscriptionFromServer(oldSubscription)
      }
      
      console.log('Unsubscribed from push notifications')
      return unsubscribed
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  // Send local notification
  async sendLocalNotification(data: NotificationData): Promise<void> {
    if (!this.isSupported) return

    try {
      const registration = await navigator.serviceWorker.ready
      
      // Send message to service worker
      registration.active?.postMessage({
        type: 'SHOW_NOTIFICATION',
        data
      })
    } catch (error) {
      console.error('Failed to send local notification:', error)
    }
  }

  // Schedule booking reminder
  async scheduleBookingReminder(bookingData: {
    providerName: string
    time: string
    date: Date
    bookingId: string
  }): Promise<void> {
    const reminderDate = new Date(bookingData.date)
    reminderDate.setDate(reminderDate.getDate() - 1) // Remind 1 day before
    reminderDate.setHours(9, 0, 0, 0) // Remind at 9 AM

    const now = new Date()
    const delay = reminderDate.getTime() - now.getTime()

    if (delay > 0) {
      setTimeout(() => {
        this.sendLocalNotification({
          type: 'booking_reminder',
          title: 'Booking Reminder',
          body: `Your appointment with ${bookingData.providerName} is tomorrow at ${bookingData.time}`,
          data: {
            bookingId: bookingData.bookingId,
            providerName: bookingData.providerName,
            time: bookingData.time
          },
          actions: [
            {
              action: 'view_booking',
              title: 'View Booking'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        })
      }, delay)
    }
  }

  // Send new provider notification
  async notifyNewProvider(providerData: {
    name: string
    category: string
    location: string
  }): Promise<void> {
    await this.sendLocalNotification({
      type: 'new_provider',
      title: 'New Provider Available',
      body: `${providerData.name} is now available in ${providerData.category}`,
      data: providerData,
      actions: [
        {
          action: 'view_provider',
          title: 'View Provider'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    })
  }

  // Send booking confirmation
  async sendBookingConfirmation(bookingData: {
    providerName: string
    time: string
    date: string
    bookingId: string
  }): Promise<void> {
    await this.sendLocalNotification({
      type: 'booking_confirmation',
      title: 'Booking Confirmed',
      body: `Your booking with ${bookingData.providerName} has been confirmed`,
      data: bookingData,
      actions: [
        {
          action: 'view_booking',
          title: 'View Booking'
        },
        {
          action: 'add_to_calendar',
          title: 'Add to Calendar'
        }
      ]
    })
  }

  // Send booking cancellation notification
  async sendBookingCancellation(bookingData: {
    providerName: string
    reason?: string
    bookingId: string
  }): Promise<void> {
    await this.sendLocalNotification({
      type: 'booking_cancellation',
      title: 'Booking Cancelled',
      body: `Your booking with ${bookingData.providerName} has been cancelled${bookingData.reason ? `: ${bookingData.reason}` : ''}`,
      data: bookingData,
      actions: [
        {
          action: 'rebook',
          title: 'Rebook'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    })
  }

  // Get current subscription
  getSubscription(): PushSubscription | null {
    return this.subscription
  }

  // Check if subscribed
  isSubscribed(): boolean {
    return !!this.subscription
  }

  // Helper method to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      })
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
    }
  }

  // Remove subscription from server
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      })
    } catch (error) {
      console.error('Failed to remove subscription from server:', error)
    }
  }
}

