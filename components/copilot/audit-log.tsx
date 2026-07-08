'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react'
import { useCopilotStore } from '@/lib/store'
import { getAuditLogs } from '@/lib/mock-data'
import { AuditLog as AuditLogType } from '@/lib/types'

export default function AuditLog() {
  const { currentVendorId } = useCopilotStore()
  const [logs, setLogs] = useState<AuditLogType[]>([])

  useEffect(() => {
    if (currentVendorId) {
      const auditLogs = getAuditLogs(currentVendorId)
      setLogs(auditLogs.reverse()) // Most recent first
    }
  }, [currentVendorId])

  const getStatusIcon = (status: AuditLogType['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={16} className="text-green-600" />
      case 'failed':
        return <XCircle size={16} className="text-red-600" />
      case 'pending_approval':
        return <Clock size={16} className="text-yellow-600" />
      case 'rejected':
        return <XCircle size={16} className="text-gray-600" />
      default:
        return <AlertCircle size={16} className="text-gray-600" />
    }
  }

  const getStatusColor = (status: AuditLogType['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'failed':
        return 'bg-red-50 border-red-200'
      case 'pending_approval':
        return 'bg-yellow-50 border-yellow-200'
      case 'rejected':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 h-full"
    >
      <h3 className="text-lg font-bold mb-4 text-gray-900">Audit Log</h3>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No actions logged yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3 rounded-lg border text-sm ${getStatusColor(log.status)}`}
            >
              <div className="flex items-start gap-2 mb-1">
                {getStatusIcon(log.status)}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{log.action}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {log.query}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 ml-6">
                {log.timestamp.toLocaleTimeString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
