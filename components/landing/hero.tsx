'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl top-20 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-green-400/20 rounded-full blur-3xl bottom-40 -right-48 animate-pulse" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full mb-6 border border-green-200">
            <Sparkles size={16} className="text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              Enterprise AI Copilot for Vendor Management
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-pretty">
            Your AI Assistant for{' '}
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Vendor Success
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Natural language queries, real-time analytics, and safe write operations—all with
            human approval gates for enterprise reliability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg"
            >
              View Live Demo
              <ArrowRight size={20} />
            </Link>
            <Link
              href="#architecture"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-primary hover:text-primary transition-all font-semibold text-lg"
            >
              Explore Architecture
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16"
          >
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border border-gray-200 shadow-xl">
              <div className="text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Today's Revenue:</span> ₹8,500 (12 bookings)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Trial Users:</span> 32 (Badminton)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <p className="text-gray-700">
                    <span className="font-semibold">Pending Approvals:</span> 2 membership
                    extensions
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
