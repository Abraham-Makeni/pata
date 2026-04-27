'use client'
import { useState } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export default function ChatInput({ 
  onSend, 
  disabled = false, 
  placeholder = "Type a message..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-stone-200 bg-white/80 backdrop-blur-sm">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-stone-100 border border-stone-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink disabled:opacity-50 disabled:cursor-not-allowed"
        maxLength={500}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="bg-ink text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-stone-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </button>
    </form>
  )
}
