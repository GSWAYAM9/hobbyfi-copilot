'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'
import { useCopilotStore } from '@/lib/store'
import { ChatMessage as ChatMessageType, QueryResult } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'
import ChatMessage from './chat-message'
import ApprovalModal from './approval-modal'

export default function ChatInterface() {
  const {
    currentVendorId,
    chatHistory,
    isLoading,
    setIsLoading,
    setError,
    addChatMessage,
    pendingApprovals,
  } = useCopilotStore()

  const [input, setInput] = useState('')
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !currentVendorId) return

    // Add user message to chat
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    addChatMessage(userMessage)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/copilot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: currentVendorId,
          query: input,
        }),
      })

      const result: QueryResult = await response.json()

      // Add AI response
      let assistantContent = ''

      if (result.error) {
        assistantContent = `Error: ${result.error}`
      } else if (result.intent === 'write' && result.requiresApproval) {
        const approval = result.result?.details
        assistantContent = `Write operation pending approval: ${result.result?.message}\n\nApproval ID: ${result.approvalRequestId}`
        setSelectedApproval(result.approvalRequestId!)
      } else if (result.result) {
        // Format read results
        if (typeof result.result === 'object') {
          assistantContent = Object.entries(result.result)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}:\n${value.map((v) => `  • ${JSON.stringify(v)}`).join('\n')}`
              }
              return `${key}: ${value}`
            })
            .join('\n')
        } else {
          assistantContent = String(result.result)
        }
      }

      const assistantMessage: ChatMessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        metadata: {
          intent: result.intent,
          approvalId: result.approvalRequestId,
          sql: result.sql,
        },
      }

      addChatMessage(assistantMessage)
    } catch (error) {
      setError('Failed to process query')
      const errorMessage: ChatMessageType = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, an error occurred while processing your query.',
        timestamp: new Date(),
      }
      addChatMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {chatHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <div className="text-4xl mb-4">💬</div>
              <p className="text-gray-600 text-lg font-semibold">Start a conversation</p>
              <p className="text-gray-400 text-sm mt-2">Ask questions about your vendor data</p>
              <div className="mt-8 text-left text-sm text-gray-500 space-y-2">
                <p className="font-semibold">Try asking:</p>
                <p>• "What is my revenue today?"</p>
                <p>• "List trial users in badminton"</p>
                <p>• "Extend Arjun's membership by 30 days"</p>
              </div>
            </motion.div>
          ) : (
            chatHistory.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                showApproval={
                  message.metadata?.approvalId !== undefined &&
                  selectedApproval === message.metadata?.approvalId
                }
              />
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-gray-600"
          >
            <Loader2 size={20} className="animate-spin" />
            <span>Processing...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-4 bg-gray-50 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || !currentVendorId}
          placeholder="Ask me anything about your business..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !currentVendorId}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
        >
          <Send size={20} />
        </button>
      </form>

      {/* Approval Modal */}
      {selectedApproval && (
        <ApprovalModal
          approvalId={selectedApproval}
          onClose={() => setSelectedApproval(null)}
        />
      )}
    </div>
  )
}
