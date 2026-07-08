'use client'

import { motion } from 'framer-motion'
import { MessageSquare, BarChart3, Users, Lock, Zap, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Natural Language Queries',
    description:
      'Ask questions in plain English. "What is my revenue today?" gets instant answers with generated SQL.',
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description:
      'Real-time metrics: revenue, bookings, trial users, memberships—all accessible via one unified assistant.',
  },
  {
    icon: Users,
    title: 'User Management',
    description:
      'Extend memberships, manage trial users, track inactive members—all with a single command.',
  },
  {
    icon: Lock,
    title: 'Safety First Design',
    description:
      'Write operations require vendor approval. Prevents accidental changes with human-in-the-loop workflow.',
  },
  {
    icon: Zap,
    title: 'Smart Tool Orchestration',
    description:
      'Intelligent routing between SQL queries, analytics, knowledge bases—optimized for vendor needs.',
  },
  {
    icon: CheckCircle,
    title: 'Audit & Compliance',
    description:
      'Every action is logged. Full audit trail for compliance, security, and vendor accountability.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">AI Superpowers for Vendors</h2>
          <p className="text-xl text-gray-600">
            Everything you need to run your business efficiently
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                  <feature.icon size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
