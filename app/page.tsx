import Navbar from '@/components/landing/navbar'
import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import Architecture from '@/components/landing/architecture'
import TechStack from '@/components/landing/tech-stack'
import Security from '@/components/landing/security'
import Footer from '@/components/landing/footer'

export const metadata = {
  title: 'HobbyFi Copilot - AI Vendor Assistant',
  description:
    'Enterprise AI copilot for vendor management. Natural language queries, real-time analytics, and safe write operations with human approval.',
}

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <Architecture />
      <TechStack />
      <Security />
      <Footer />
    </main>
  )
}
