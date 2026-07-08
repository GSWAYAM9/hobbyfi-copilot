'use client'

import { motion } from 'framer-motion'
import { ChatMessage as ChatMessageType } from '@/lib/types'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ChatMessageProps {
  message: ChatMessageType
  showApproval?: boolean
}

export default function ChatMessage({ message, showApproval }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg group relative ${
          isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>

        {!isUser && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
            title="Copy message"
          >
            {copied ? (
              <Check size={16} className="text-green-600" />
            ) : (
              <Copy size={16} className="text-gray-600" />
            )}
          </button>
        )}

        {message.metadata?.sql && (
          <div className="mt-2 pt-2 border-t border-gray-300/50">
            <div className="text-xs font-mono opacity-75">
              <div className="font-semibold mb-1">SQL Generated:</div>
              <code className="block bg-black/10 p-2 rounded overflow-x-auto">
                {message.metadata.sql}
              </code>
            </div>
          </div>
        )}

        {message.metadata?.aiModel && !isUser && (
          <div className="mt-2 pt-2 border-t border-gray-300/50 flex items-center gap-2">
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {message.metadata.aiConfigured ? '🤖 Groq AI' : '🔄 Demo Mode'}
            </span>
            <span className="text-xs text-gray-500">{message.metadata.aiModel}</span>
          </div>
        )}

        <div className="text-xs opacity-70 mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  )
}
