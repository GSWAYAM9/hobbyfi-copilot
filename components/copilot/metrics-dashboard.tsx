'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react'
import { useCopilotStore } from '@/lib/store'
import { mockVendors } from '@/lib/mock-data'

interface Metrics {
  membershipCount: number
  trialUsersCount: number
  monthlyRevenue: number
  activeUsers: number
}

export default function MetricsDashboard() {
  const { currentVendorId } = useCopilotStore()
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  useEffect(() => {
    if (currentVendorId) {
      const vendor = mockVendors.find((v) => v.id === currentVendorId)
      if (vendor) {
        setMetrics({
          membershipCount: vendor.membershipCount,
          trialUsersCount: vendor.trialUsersCount,
          monthlyRevenue: vendor.monthlyRevenue,
          activeUsers: vendor.membershipCount - vendor.trialUsersCount,
        })
      }
    }
  }, [currentVendorId])

  if (!metrics) return null

  const metricCards = [
    {
      icon: Users,
      label: 'Total Members',
      value: metrics.membershipCount,
      color: 'bg-blue-50 border-blue-200 text-blue-600',
    },
    {
      icon: Calendar,
      label: 'Trial Users',
      value: metrics.trialUsersCount,
      color: 'bg-orange-50 border-orange-200 text-orange-600',
    },
    {
      icon: DollarSign,
      label: 'Monthly Revenue',
      value: `₹${metrics.monthlyRevenue}`,
      color: 'bg-green-50 border-green-200 text-green-600',
    },
    {
      icon: TrendingUp,
      label: 'Active Users',
      value: metrics.activeUsers,
      color: 'bg-purple-50 border-purple-200 text-purple-600',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
    >
      <h2 className="text-xl font-bold mb-6 text-gray-900">Business Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-lg border ${card.color}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={18} />
              <span className="text-xs font-semibold">{card.label}</span>
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
