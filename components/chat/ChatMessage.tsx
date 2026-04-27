'use client'

interface ChatMessageProps {
  message: {
    id: string
    sender: 'user' | 'provider'
    text: string
    timestamp: number
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user'
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2 rounded-2xl text-sm ${
            isUser
              ? 'bg-ink text-white rounded-br-sm'
              : 'bg-white border border-stone-200 text-stone-900 rounded-bl-sm'
          }`}
        >
          <p className="leading-relaxed break-words">{message.text}</p>
        </div>
        <p className={`text-[10px] text-stone-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {time}
        </p>
      </div>
    </div>
  )
}
