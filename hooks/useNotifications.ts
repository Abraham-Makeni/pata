'use client'
import { useState, useEffect } from 'react'
import { NotificationManager } from '@/lib/notifications'

export function useNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const notificationManager = NotificationManager.getInstance()
    
    // Initialize notifications
    notificationManager.initialize().then(setIsSupported)
    
    // Check current permission
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
    
    // Check subscription status
    setIsSubscribed(notificationManager.isSubscribed())
  }, [])

  const requestPermission = async (): Promise<NotificationPermission> => {
    const notificationManager = NotificationManager.getInstance()
    const result = await notificationManager.requestPermission()
    setPermission(result)
    return result
  }

  const subscribe = async (): Promise<boolean> => {
    const notificationManager = NotificationManager.getInstance()
    const subscription = await notificationManager.subscribeToPush()
    setIsSubscribed(!!subscription)
    return !!subscription
  }

  const unsubscribe = async (): Promise<boolean> => {
    const notificationManager = NotificationManager.getInstance()
    const result = await notificationManager.unsubscribeFromPush()
    setIsSubscribed(false)
    return result
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe
  }
}
