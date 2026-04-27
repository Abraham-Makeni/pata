'use client'
import React from 'react'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

interface GlobalErrorBoundaryProps {
  children: React.ReactNode
}

export default function GlobalErrorBoundary({ children }: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div className="min-h-screen bg-chalk flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-xl font-semibold text-stone-900 mb-2">
              Application Error
            </h1>
            <p className="text-sm text-stone-600 mb-6">
              Something went wrong with the application. This has been logged and we'll look into it.
            </p>
            {error && (
              <details className="text-left mb-4 p-3 bg-stone-50 rounded-lg">
                <summary className="text-xs font-medium text-stone-500 cursor-pointer mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-stone-400 whitespace-pre-wrap break-all">
                  {error.message}
                </pre>
              </details>
            )}
            <div className="space-y-2">
              <button
                onClick={reset}
                className="w-full bg-ink text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-700 transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-stone-100 text-stone-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-200 transition-all"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
