'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useCopilotStore } from '@/lib/store'

interface ApprovalModalProps {
  approvalId: string
  onClose: () => void
}

export default function ApprovalModal({ approvalId, onClose }: ApprovalModalProps) {
  const { currentVendorId, updateApprovalStatus, removePendingApproval } = useCopilotStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null)

  const handleApprove = async () => {
    if (!currentVendorId) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/copilot/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId,
          vendorId: currentVendorId,
          action: 'approve',
        }),
      })

      if (response.ok) {
        setStatus('approved')
        updateApprovalStatus(approvalId, 'approved')
        setTimeout(() => {
          removePendingApproval(approvalId)
          onClose()
        }, 2000)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!currentVendorId) return

    setIsProcessing(true)
    try {
      const response = await fetch('/api/copilot/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalId,
          vendorId: currentVendorId,
          action: 'reject',
        }),
      })

      if (response.ok) {
        setStatus('rejected')
        updateApprovalStatus(approvalId, 'rejected')
        setTimeout(() => {
          removePendingApproval(approvalId)
          onClose()
        }, 2000)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4"
        >
          <div className="p-6">
            {status === null && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle size={24} className="text-yellow-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Approval Required</h2>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 text-sm mb-4">
                    This operation will modify data in your system. Please review and approve to
                    proceed.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Action:</span> Membership Extension
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">Duration:</span> 30 days
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">ID:</span> {approvalId.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <XCircle size={18} />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <CheckCircle size={18} />
                    )}
                    Approve
                  </button>
                </div>
              </>
            )}

            {status === 'approved' && (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Approved!</h3>
                <p className="text-gray-600 text-sm">
                  Your operation has been approved and executed successfully.
                </p>
              </div>
            )}

            {status === 'rejected' && (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <XCircle size={32} className="text-red-600" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rejected</h3>
                <p className="text-gray-600 text-sm">
                  The operation has been rejected and was not executed.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
