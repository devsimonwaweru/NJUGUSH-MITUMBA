import { useState } from 'react'

import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import CustomerSpotlight from '../components/CustomerSpotlight'
import Products from '../components/Products'
import Branches from '../components/Branches'
import Testimonials from '../components/Testimonials'
import SubmitReview from '../components/SubmitReview'
import Community from '../components/Community'
import Footer from '../components/Footer'

import BusinessGuideModal from '../components/BusinessGuideModal'
import SourcingModal from '../components/SourcingModal'

const LandingPage = () => {
  // Modal state lives HERE below
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isSourcingOpen, setIsSourcingOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">

      <main>
        <Hero
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenSourcing={() => setIsSourcingOpen(true)}
        />

        <TrustStrip />
        <CustomerSpotlight />
        <Products />
        <Branches />
        <Testimonials />
        <SubmitReview />
        <Community />
      </main>

      <Footer />

      {/* MODALS (global overlays) */}
      <BusinessGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <SourcingModal
        isOpen={isSourcingOpen}
        onClose={() => setIsSourcingOpen(false)}
      />

    </div>
  )
}

export default LandingPage
