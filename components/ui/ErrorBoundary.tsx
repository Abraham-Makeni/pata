'use client'
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center">
      <div className="text-3xl mb-3">⚠️</div>
      <h3 className="font-semibold text-stone-900 mb-2">Something went wrong</h3>
      <p className="text-sm text-stone-600 mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="bg-ink text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-700 transition-all"
      >
        Try Again
      </button>
    </div>
  )
}

// Map-specific error boundary
export function MapErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div className="h-[400px] bg-stone-100 rounded-2xl flex flex-col items-center justify-center text-center p-6">
          <div className="text-3xl mb-3">🗺️</div>
          <h3 className="font-semibold text-stone-900 mb-2">Map unavailable</h3>
          <p className="text-sm text-stone-600 mb-4">
            {error?.message || 'Unable to load the map. Please check your connection.'}
          </p>
          <button
            onClick={reset}
            className="bg-ink text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-700 transition-all"
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
