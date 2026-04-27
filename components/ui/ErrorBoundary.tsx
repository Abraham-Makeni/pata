'use client'
import React from 'react'
import { logError, getErrorMessage, AppError } from '@/lib/error-handling'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void; errorId?: string }>
  context?: string
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return { hasError: true, error, errorId }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { context } = this.props
    logError(error, context || 'ErrorBoundary')
    
    // Log additional error info
    console.error('ErrorBoundary caught an error:', {
      error,
      errorInfo,
      context,
      errorId: this.state.errorId
    })
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset, errorId }: { error?: Error; reset: () => void; errorId?: string }) {
  const errorMessage = error ? getErrorMessage(error) : 'An unexpected error occurred'
  const isRetryable = error instanceof AppError ? error.retryable : true
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
      <div className="text-3xl mb-3">⚠️</div>
      <h3 className="font-semibold text-black mb-2">Something went wrong</h3>
      <p className="text-sm text-gray-600 mb-4">
        {errorMessage}
      </p>
      {process.env.NODE_ENV === 'development' && errorId && (
        <p className="text-xs text-gray-400 mb-4">
          Error ID: {errorId}
        </p>
      )}
      {isRetryable && (
        <button
          onClick={reset}
          className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
        >
          Try Again
        </button>
      )}
      {!isRetryable && (
        <p className="text-sm text-gray-500">
          This action cannot be retried. Please refresh the page.
        </p>
      )}
    </div>
  )
}

// Search-specific error boundary
export function SearchErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      context="search"
      fallback={({ error, reset }) => (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">🔍</div>
          <h3 className="font-semibold text-black mb-2">Search failed</h3>
          <p className="text-sm text-gray-600 mb-4">
            {error ? getErrorMessage(error, 'search') : 'Unable to complete search. Please try again.'}
          </p>
          <button
            onClick={reset}
            className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
          >
            Retry Search
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

// Loading-specific error boundary
export function LoadingErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      context="loading"
      fallback={({ error, reset }) => (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <h3 className="font-semibold text-black mb-2">Failed to load</h3>
          <p className="text-sm text-gray-600 mb-4">
            {error ? getErrorMessage(error, 'loading') : 'Unable to load content. Please refresh the page.'}
          </p>
          <button
            onClick={reset}
            className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
          >
            Try Again
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
