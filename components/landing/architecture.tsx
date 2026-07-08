'use client'

import { motion } from 'framer-motion'

const stages = [
  { name: 'User Query', color: 'from-blue-400 to-blue-600' },
  { name: 'Intent Router', color: 'from-purple-400 to-purple-600' },
  { name: 'Memory Layer', color: 'from-pink-400 to-pink-600' },
  { name: 'Guardrails', color: 'from-red-400 to-red-600' },
  { name: 'Tool Selector', color: 'from-orange-400 to-orange-600' },
  { name: 'Orchestrator', color: 'from-green-400 to-green-600' },
]

const tools = ['SQL Query', 'Analytics', 'Knowledge Base', 'Approval']
const outputs = ['Database', 'Audit Logs', 'Cache', 'LLM']

export default function Architecture() {
  return (
    <section id="architecture" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Enterprise Architecture</h2>
          <p className="text-xl text-gray-600">
            Sophisticated pipeline combining AI, safety, and business logic
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left side - Pipeline */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {stages.map((stage, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`flex-shrink-0 w-32 h-16 rounded-lg bg-gradient-to-r ${stage.color} flex items-center justify-center text-white font-semibold shadow-lg`}
                  >
                    {stage.name}
                  </div>
                  {idx < stages.length - 1 && (
                    <div className="flex-shrink-0">
                      <div className="text-2xl text-gray-400">→</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-6 bg-blue-50 rounded-lg border-2 border-blue-200"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Key Guardrails</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Injection attack detection</li>
                <li>✓ Rate limiting (50 queries/min)</li>
                <li>✓ PII data redaction</li>
                <li>✓ SQL parameterization</li>
              </ul>
            </motion.div>
          </div>

          {/* Right side - Tools & Outputs */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-gray-900 mb-4">Available Tools</h3>
              <div className="space-y-2">
                {tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium"
                  >
                    • {tool}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-gray-900 mb-4">Persistent Layers</h3>
              <div className="space-y-2">
                {outputs.map((output, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-700 font-medium"
                  >
                    • {output}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
