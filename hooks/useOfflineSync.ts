'use client'
import { useState, useEffect } from 'react'
import { OfflineSyncManager, OfflineStorage } from '@/lib/offline'

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingActions, setPendingActions] = useState(0)

  useEffect(() => {
    const syncManager = OfflineSyncManager.getInstance()
    const storage = OfflineStorage.getInstance()
    
    syncManager.init().then(() => {
      // Initial status
      setIsOnline(storage.isOnline())
    })

    // Listen for connection changes
    const cleanup = storage.onConnectionChange((online) => {
      setIsOnline(online)
    })

    return cleanup
  }, [])

  const storeAction = async (action: {
    type: string
    url: string
    method: string
    headers?: Record<string, string>
    body?: string
  }) => {
    const syncManager = OfflineSyncManager.getInstance()
    await syncManager.storeAction(action)
    setPendingActions((prev: number) => prev + 1)
  }

  const forceSync = async () => {
    const syncManager = OfflineSyncManager.getInstance()
    await syncManager.forceSync()
    setPendingActions(0)
  }

  return {
    isOnline,
    isSyncing,
    pendingActions,
    storeAction,
    forceSync
  }
}
