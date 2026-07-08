'use client'

import { motion } from 'framer-motion'

const techStack = [
  { name: 'Next.js 15', category: 'Frontend' },
  { name: 'React 19', category: 'Frontend' },
  { name: 'TypeScript', category: 'Language' },
  { name: 'Tailwind CSS', category: 'Styling' },
  { name: 'Framer Motion', category: 'Animation' },
  { name: 'Zustand', category: 'State' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Cache' },
]

export default function TechStack() {
  return (
    <section id="tech" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Modern Tech Stack</h2>
          <p className="text-xl text-gray-600">
            Built with production-grade technologies for enterprise reliability
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-center"
            >
              <div className="text-sm text-gray-500 mb-2">{tech.category}</div>
              <div className="font-semibold text-gray-900">{tech.name}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Why This Stack?</h3>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">→</span>
              <span>Full-stack JavaScript for seamless development and deployment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">→</span>
              <span>Type safety with TypeScript prevents runtime errors</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">→</span>
              <span>Edge-ready with Next.js 15 for serverless scaling</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold">→</span>
              <span>Production-grade state management with Zustand</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
