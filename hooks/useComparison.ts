'use client'
import { useState, useCallback } from 'react'
import { Provider } from '@/lib/data'

export function useComparison() {
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const maxComparisons = 3

  const addToComparison = useCallback((provider: Provider) => {
    setSelectedProviders(prev => {
      const exists = prev.some(p => p.id === provider.id)
      if (exists) {
        return prev
      }
      
      if (prev.length >= maxComparisons) {
        // Replace the first provider if at max capacity
        return [...prev.slice(1), provider]
      }
      
      return [...prev, provider]
    })
  }, [])

  const removeFromComparison = useCallback((providerId: string) => {
    setSelectedProviders(prev => prev.filter(p => p.id !== providerId))
  }, [])

  const clearComparison = useCallback(() => {
    setSelectedProviders([])
  }, [])

  const toggleComparison = useCallback((provider: Provider) => {
    const exists = selectedProviders.some(p => p.id === provider.id)
    if (exists) {
      removeFromComparison(provider.id)
    } else {
      addToComparison(provider)
    }
  }, [selectedProviders, addToComparison, removeFromComparison])

  const openComparisonModal = useCallback(() => {
    if (selectedProviders.length >= 2) {
      setIsModalOpen(true)
    }
  }, [selectedProviders])

  const closeComparisonModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const isProviderSelected = useCallback((providerId: string) => {
    return selectedProviders.some(p => p.id === providerId)
  }, [selectedProviders])

  const canCompare = selectedProviders.length >= 2

  return {
    selectedProviders,
    isModalOpen,
    maxComparisons,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparison,
    openComparisonModal,
    closeComparisonModal,
    isProviderSelected,
    canCompare
  }
}
