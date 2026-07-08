'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useCopilotStore } from '@/lib/store'
import { Vendor } from '@/lib/types'
import ChatInterface from '@/components/copilot/chat-interface'
import MetricsDashboard from '@/components/copilot/metrics-dashboard'
import AuditLog from '@/components/copilot/audit-log'

export default function DemoPage() {
  const { currentVendorId, setCurrentVendor, clearChat } = useCopilotStore()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAudit, setShowAudit] = useState(false)

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors')
      const data = await response.json()
      setVendors(data.vendors)
      if (data.vendors.length > 0) {
        setCurrentVendor(data.vendors[0].id)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVendorChange = (vendorId: string) => {
    setCurrentVendor(vendorId)
    clearChat()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading demo environment...</p>
        </div>
      </div>
    )
  }

  const selectedVendor = vendors.find((v) => v.id === currentVendorId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </Link>
            <div className="text-2xl font-bold text-primary">HobbyFi Copilot</div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={currentVendorId || ''}
              onChange={(e) => handleVendorChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name} ({vendor.sport})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowAudit(!showAudit)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              {showAudit ? 'Hide Audit Log' : 'Show Audit Log'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-2">Currently logged in as:</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-gray-900">{selectedVendor.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedVendor.location} • {selectedVendor.sport}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedVendor.membershipCount}
                    </div>
                    <div className="text-xs text-gray-600">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{selectedVendor.monthlyRevenue}
                    </div>
                    <div className="text-xs text-gray-600">Monthly</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedVendor.trialUsersCount}
                    </div>
                    <div className="text-xs text-gray-600">Trial Users</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main chat + metrics */}
          <div className="lg:col-span-2 space-y-6">
            <ChatInterface />
            <MetricsDashboard />
          </div>

          {/* Sidebar */}
          <div>
            {showAudit ? (
              <AuditLog />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold mb-4 text-gray-900">Try These Queries</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                    <p className="text-xs font-mono text-blue-700">
                      "What is my revenue today?"
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
                    <p className="text-xs font-mono text-green-700">
                      "List trial users"
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors">
                    <p className="text-xs font-mono text-purple-700">
                      "How many active members do I have?"
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors">
                    <p className="text-xs font-mono text-orange-700">
                      "Extend Priya's membership"
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Instructions</h4>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li>✓ Use natural language for read queries</li>
                    <li>✓ Write operations require approval</li>
                    <li>✓ All actions are audit logged</li>
                    <li>✓ Switch vendors in the dropdown</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
