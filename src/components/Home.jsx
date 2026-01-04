import { useState } from 'react'
import Hero from './Hero'
import Community from './Community'
import BusinessGuideModal from './BusinessGuideModal'
import SourcingModal from './SourcingModal'

const Home = () => {
  // State to manage Modals on the Home page
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [isSourcingOpen, setIsSourcingOpen] = useState(false)

  return (
    <main className="w-full">
      
      {/* 1. HERO SECTION */}
      {/* Pass the open functions to Hero so buttons work */}
      <Hero 
        onOpenGuide={() => setIsGuideOpen(true)} 
        onOpenSourcing={() => setIsSourcingOpen(true)} 
      />

      {/* 2. COMMUNITY SECTION */}
      <Community />

      {/* 3. MODALS (Rendered at bottom z-index high) */}
      <BusinessGuideModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
      />
      
      <SourcingModal 
        isOpen={isSourcingOpen} 
        onClose={() => setIsSourcingOpen(false)} 
      />

    </main>
  )
}

export default Home