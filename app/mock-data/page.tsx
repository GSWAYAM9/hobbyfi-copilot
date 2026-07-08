'use client'

import Link from 'next/link'
import { ArrowLeft, Users, Zap, BookOpen, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const VENDORS = [
  {
    id: 'vendor_1',
    name: 'Smash Arena',
    sport: 'Badminton',
    email: 'contact@smasharena.com',
    location: 'Bangalore, India',
    city: 'Bangalore',
    membershipCount: 245,
    monthlyRevenue: 125000,
    trialUsersCount: 32,
  },
  {
    id: 'vendor_2',
    name: 'Cricket Connect',
    sport: 'Cricket',
    email: 'info@cricketconnect.com',
    location: 'Mumbai, India',
    city: 'Mumbai',
    membershipCount: 180,
    monthlyRevenue: 98000,
    trialUsersCount: 28,
  },
  {
    id: 'vendor_3',
    name: 'Tennis Pro',
    sport: 'Tennis',
    email: 'hello@tennispro.com',
    location: 'New Delhi, India',
    city: 'New Delhi',
    membershipCount: 156,
    monthlyRevenue: 87500,
    trialUsersCount: 22,
  },
]

const USERS = [
  {
    id: 'user_1',
    vendorId: 'vendor_1',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@email.com',
    sport: 'Badminton',
    status: 'active',
    membershipExpiry: '+30 days',
    trialExpiry: 'Expired',
    joinedAt: '2024-01-15',
  },
  {
    id: 'user_2',
    vendorId: 'vendor_1',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    sport: 'Badminton',
    status: 'trial',
    membershipExpiry: '+60 days',
    trialExpiry: '+5 days',
    joinedAt: '2024-06-20',
  },
  {
    id: 'user_3',
    vendorId: 'vendor_1',
    name: 'Rahul Nair',
    email: 'rahul.nair@email.com',
    sport: 'Badminton',
    status: 'active',
    membershipExpiry: '+15 days',
    trialExpiry: 'Expired',
    joinedAt: '2024-02-10',
  },
  {
    id: 'user_4',
    vendorId: 'vendor_1',
    name: 'Kavya Reddy',
    email: 'kavya.reddy@email.com',
    sport: 'Badminton',
    status: 'trial',
    membershipExpiry: '+30 days',
    trialExpiry: '+2 days',
    joinedAt: '2024-07-01',
  },
  {
    id: 'user_5',
    vendorId: 'vendor_1',
    name: 'Siddharth Joshi',
    email: 'siddharth.j@email.com',
    sport: 'Badminton',
    status: 'inactive',
    membershipExpiry: 'Expired',
    trialExpiry: 'Expired',
    joinedAt: '2023-12-01',
  },
]

const BOOKINGS = [
  {
    id: 'booking_1',
    userId: 'user_1',
    userName: 'Arjun Mehta',
    vendorId: 'vendor_1',
    court: 'Court A',
    startTime: 'Today, 6:00 PM',
    endTime: 'Today, 7:00 PM',
    amount: 500,
    status: 'confirmed',
  },
  {
    id: 'booking_2',
    userId: 'user_2',
    userName: 'Priya Sharma',
    vendorId: 'vendor_1',
    court: 'Court B',
    startTime: 'Today, 7:30 PM',
    endTime: 'Today, 8:30 PM',
    amount: 500,
    status: 'confirmed',
  },
  {
    id: 'booking_3',
    userId: 'user_3',
    userName: 'Rahul Nair',
    vendorId: 'vendor_1',
    court: 'Court C',
    startTime: 'Today, 4:00 PM',
    endTime: 'Today, 5:00 PM',
    amount: 500,
    status: 'completed',
  },
  {
    id: 'booking_4',
    userId: 'user_4',
    userName: 'Kavya Reddy',
    vendorId: 'vendor_1',
    court: 'Court A',
    startTime: 'Today, 2:00 PM',
    endTime: 'Today, 3:00 PM',
    amount: 500,
    status: 'completed',
  },
  {
    id: 'booking_5',
    userId: 'user_1',
    userName: 'Arjun Mehta',
    vendorId: 'vendor_1',
    court: 'Court B',
    startTime: 'Yesterday, 5:00 PM',
    endTime: 'Yesterday, 6:00 PM',
    amount: 500,
    status: 'completed',
  },
]

const APPROVAL_REQUESTS = [
  {
    id: 'approval_1',
    vendorId: 'vendor_1',
    action: 'extend_membership',
    targetUser: 'Arjun Mehta',
    change: 'Extend membership by 30 days',
    status: 'pending',
    createdAt: '2024-07-08 10:30 AM',
  },
  {
    id: 'approval_2',
    vendorId: 'vendor_1',
    action: 'extend_trial',
    targetUser: 'Priya Sharma',
    change: 'Extend trial by 7 days',
    status: 'pending',
    createdAt: '2024-07-08 11:15 AM',
  },
]

export default function MockDataPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/demo"
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span>Back to Demo</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mock Data Schema</h1>
          <div className="w-32" />
        </div>
      </motion.header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Vendors Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Vendors (3 vendors)</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {VENDORS.map((vendor) => (
                <motion.div
                  key={vendor.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 font-mono">{vendor.id}</p>
                    <h3 className="text-lg font-bold text-gray-900">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.sport}</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Email:</strong> {vendor.email}</p>
                    <p><strong>Location:</strong> {vendor.location}</p>
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Members</p>
                        <p className="font-bold text-blue-600">{vendor.membershipCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Revenue</p>
                        <p className="font-bold text-green-600">₹{vendor.monthlyRevenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Trials</p>
                        <p className="font-bold text-orange-600">{vendor.trialUsersCount}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Users Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Users (5 members in Smash Arena)</h2>
            </div>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Membership</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Trial Expiry</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {USERS.map((user, idx) => (
                      <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-3 text-xs font-mono text-gray-600">{user.id}</td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : user.status === 'trial'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-600">{user.membershipExpiry}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{user.trialExpiry}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{user.joinedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* Bookings Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-purple-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Bookings (5 bookings today)</h2>
            </div>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">User</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Court</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {BOOKINGS.map((booking, idx) => (
                      <tr key={booking.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-3 text-xs font-mono text-gray-600">{booking.id}</td>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">{booking.userName}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{booking.court}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">
                          {booking.startTime} - {booking.endTime}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900">₹{booking.amount}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* Approval Requests Section */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-orange-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Approval Requests (Dynamic)</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {APPROVAL_REQUESTS.map((request) => (
                <motion.div
                  key={request.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 font-mono">{request.id}</p>
                    <p className="text-sm font-semibold text-gray-600 mt-1">Action: {request.action.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Target User:</strong> {request.targetUser}</p>
                    <p><strong>Change:</strong> {request.change}</p>
                    <p><strong>Created:</strong> {request.createdAt}</p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      {request.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Usage Info */}
          <motion.section variants={itemVariants} className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">How the Copilot Uses This Data</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ <strong>Revenue Query:</strong> "What is my revenue today?" → Calculates from Bookings</li>
              <li>✓ <strong>Trial Users:</strong> "List trial users of badminton" → Filters Users by status and sport</li>
              <li>✓ <strong>Active Members:</strong> "How many active members?" → Counts active Users</li>
              <li>✓ <strong>Write Operations:</strong> "Extend Priya's trial by 7 days" → Creates Approval Request</li>
              <li>✓ <strong>Audit Log:</strong> All operations tracked and logged for compliance</li>
            </ul>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}
