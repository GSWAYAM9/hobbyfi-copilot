'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Navbar() {
  const [blur, setBlur] = useState(false)

  const handleScroll = () => {
    setBlur(window.scrollY > 50)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Tech Stack', href: '#tech' },
    { label: 'Security', href: '#security' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        blur
          ? 'backdrop-blur-xl bg-white/80 border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-green-600">HobbyFi</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            Copilot
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Demo
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
