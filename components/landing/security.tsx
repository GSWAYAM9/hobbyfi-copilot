'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, AlertCircle, CheckCircle2, Zap } from 'lucide-react'

const securityFeatures = [
  {
    icon: Shield,
    title: 'Authentication & Authorization',
    description: 'Vendor-scoped access with RBAC for multi-tenant safety',
  },
  {
    icon: Lock,
    title: 'SQL Injection Prevention',
    description: 'Parameterized queries and input validation at every layer',
  },
  {
    icon: AlertCircle,
    title: 'Prompt Injection Detection',
    description: 'Regex patterns detect suspicious inputs before LLM processing',
  },
  {
    icon: Eye,
    title: 'PII Protection',
    description: 'Automatic redaction of sensitive data in logs and responses',
  },
  {
    icon: CheckCircle2,
    title: 'Human Approval Gates',
    description: 'All write operations require vendor review before execution',
  },
  {
    icon: Zap,
    title: 'Audit Logging',
    description: 'Complete audit trail for compliance and forensic analysis',
  },
]

export default function Security() {
  return (
    <section id="security" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full mb-6 border border-red-200">
            <Shield size={16} className="text-red-600" />
            <span className="text-sm text-red-700 font-medium">Enterprise Security</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Security by Design</h2>
          <p className="text-xl text-gray-600">
            Multiple layers of protection for enterprise-grade reliability
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 border border-red-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-red-100 rounded-lg">
                  <feature.icon size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Zero Trust Architecture</h3>
          <p className="mb-4 text-blue-100">
            Every query is verified at multiple stages before any data is accessed or modified.
            Write operations are never executed without explicit vendor approval, ensuring
            accountability and preventing accidental changes.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold mb-2">1. Input Validation</div>
              <p className="text-blue-200">
                All queries screened for injection patterns and rate limits
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2">2. Intent Routing</div>
              <p className="text-blue-200">
                Classified as READ or WRITE, write ops quarantined for approval
              </p>
            </div>
            <div>
              <div className="font-semibold mb-2">3. Safe Execution</div>
              <p className="text-blue-200">
                Parameterized queries + audit logging for full traceability
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
