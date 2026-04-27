import { useState, useCallback, useEffect } from 'react'

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public retryable: boolean = true,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', true)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', false)
    this.name = 'ValidationError'
  }
}

export class SearchError extends AppError {
  constructor(message: string = 'Search failed') {
    super(message, 'SEARCH_ERROR', true)
    this.name = 'SearchError'
  }
}

// Retry mechanism with exponential backoff
export function useRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number
    delay?: number
    backoff?: boolean
    onRetry?: (attempt: number, error: Error) => void
  } = {}
) {
  const { maxRetries = 3, delay = 1000, backoff = true, onRetry } = options
  
  const [state, setState] = useState({
    data: null as T | null,
    error: null as Error | null,
    isLoading: false,
    retryCount: 0
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await operation()
        setState({
          data: result,
          error: null,
          isLoading: false,
          retryCount: 0
        })
        return result
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (attempt === maxRetries || !isRetryableError(lastError)) {
          setState({
            data: null,
            error: lastError,
            isLoading: false,
            retryCount: attempt
          })
          throw lastError
        }
        
        // Calculate delay with exponential backoff
        const retryDelay = backoff ? delay * Math.pow(2, attempt) : delay
        
        onRetry?.(attempt + 1, lastError)
        
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
    }
  }, [operation, maxRetries, delay, backoff, onRetry])

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      retryCount: 0
    })
  }, [])

  const retry = useCallback(() => {
    execute()
  }, [execute])

  return {
    ...state,
    execute,
    retry,
    reset
  }
}

// Check if error is retryable
function isRetryableError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.retryable
  }
  
  // Network errors are typically retryable
  if (error.message.includes('fetch') || 
      error.message.includes('network') ||
      error.message.includes('timeout')) {
    return true
  }
  
  // Validation errors are not retryable
  if (error.message.includes('validation') ||
      error.message.includes('invalid') ||
      error.message.includes('required')) {
    return false
  }
  
  // Default to retryable for unknown errors
  return true
}

// Error logging utility
export function logError(error: Error, context?: string) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
  }
  
  // In production, send to error reporting service
  if (process.env.NODE_ENV === 'production') {
    console.error('Application Error:', errorInfo)
    // TODO: Send to error reporting service (Sentry, etc.)
  } else {
    console.error('Development Error:', errorInfo)
  }
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<[T | null, Error | null]> {
  try {
    const result = await operation()
    return [result, null]
  } catch (error) {
    const appError = error instanceof Error ? error : new Error('Unknown error')
    logError(appError)
    return [fallback ?? null, appError]
  }
}

// Error recovery strategies
export const errorRecovery = {
  search: (query: string) => {
    // Clear search and try again
    return { query: '', retry: true }
  },
  
  network: () => {
    // Wait and retry
    return { delay: 2000, retry: true }
  },
  
  validation: (field: string) => {
    // Clear field and show error
    return { clearField: field, retry: false }
  },
  
  unknown: () => {
    // Generic recovery
    return { message: 'Something went wrong. Please try again.', retry: true }
  }
}

// Error message generator
export function getErrorMessage(error: Error, context?: string): string {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof NetworkError) {
    return 'Connection failed. Please check your internet connection and try again.'
  }
  
  if (error instanceof SearchError) {
    return 'Search failed. Please try again with different keywords.'
  }
  
  if (error instanceof ValidationError) {
    return error.message
  }
  
  // Generic error messages based on context
  switch (context) {
    case 'search':
      return 'Search failed. Please try again.'
    case 'loading':
      return 'Failed to load data. Please refresh the page.'
    case 'booking':
      return 'Booking failed. Please try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}
