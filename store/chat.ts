import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ChatMessage = {
  id: string
  sender: 'user' | 'provider'
  text: string
  timestamp: number
}

export type ChatState = {
  chat: {
    [providerId: string]: {
      messages: ChatMessage[]
      isTyping: boolean
    }
  }
  sendMessage: (providerId: string, text: string) => void
  getMessages: (providerId: string) => ChatMessage[]
  setIsTyping: (providerId: string, isTyping: boolean) => void
  clearChat: (providerId: string) => void
  generateMockReply: (providerId: string) => void
}

// Mock provider replies for realistic conversation simulation
const mockReplies = [
  "Hi! Yes, I'm available.",
  "Please book through the app 👍",
  "What time works for you?",
  "Thanks for reaching out!",
  "I'll get back to you soon.",
  "Sure, I can help with that.",
  "Let me check my schedule.",
  "Great! When would you like to come in?",
  "I'm available this week.",
  "Please send me your preferred date.",
]

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chat: {},

      sendMessage: (providerId: string, text: string) => {
        const newMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          sender: 'user',
          text,
          timestamp: Date.now(),
        }

        set((state) => ({
          chat: {
            ...state.chat,
            [providerId]: {
              ...state.chat[providerId],
              messages: [...(state.chat[providerId]?.messages || []), newMessage],
              isTyping: false,
            },
          },
        }))

        // Trigger mock provider reply after a delay
        setTimeout(() => {
          get().generateMockReply(providerId)
        }, 1500 + Math.random() * 1500) // 1.5-3 seconds delay
      },

      getMessages: (providerId: string) => {
        return get().chat[providerId]?.messages || []
      },

      setIsTyping: (providerId: string, isTyping: boolean) => {
        set((state) => ({
          chat: {
            ...state.chat,
            [providerId]: {
              ...state.chat[providerId],
              isTyping,
            },
          },
        }))
      },

      generateMockReply: (providerId: string) => {
        const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)]
        
        const providerMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          sender: 'provider',
          text: randomReply,
          timestamp: Date.now(),
        }

        set((state) => ({
          chat: {
            ...state.chat,
            [providerId]: {
              ...state.chat[providerId],
              messages: [...(state.chat[providerId]?.messages || []), providerMessage],
              isTyping: false,
            },
          },
        }))
      },

      clearChat: (providerId: string) => {
        set((state) => {
          const newChat = { ...state.chat }
          delete newChat[providerId]
          return { chat: newChat }
        })
      },
    }),
    {
      name: 'pata-chat-storage',
      partialize: (state) => ({ chat: state.chat }),
    }
  )
)
