import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabaseClient'
import { SettingsProvider } from './context/SettingsContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Modals
import HowToOrderModal from './components/HowToOrderModal'
import SourcingModal from './components/SourcingModal'
import BusinessGuideModal from './components/BusinessGuideModal'

// Pages
import LandingPage from './pages/LandingPage'
import Shop from './pages/Shop'
import Login from './pages/Login'
import AddProduct from './pages/AddProduct'
import AdminDashboard from './pages/AdminDashboard'

// ==========================================
// NEW IMPORTS: Independent Pages
// ==========================================
import Spotlights from './pages/Spotlights'
import SiteSettings from './pages/SiteSettings'

function App() {
  // --- AUTHENTICATION STATE ---
  const [session, setSession] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // --- MODAL STATES ---
  const [isHowToOrderOpen, setIsHowToOrderOpen] = useState(false)
  const [isSourcingOpen, setIsSourcingOpen] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  return (
    <SettingsProvider>
      <Router>
        
        <Routes>
          
          {/* === PUBLIC ROUTES === */}
          
          {/* 1. Landing Page (/) */}
          <Route path="/" element={
            <LandingPage 
              onOpenHowToOrder={() => setIsHowToOrderOpen(true)} 
              onOpenSourcing={() => setIsSourcingOpen(true)} 
              onOpenGuide={() => setIsGuideOpen(true)}
            />
          } />

          {/* 2. Shop Page (/shop) */}
          <Route path="/shop" element={
            <Shop
              onOpenHowToOrder={() => setIsHowToOrderOpen(true)} 
              onOpenSourcing={() => setIsSourcingOpen(true)}
            />
          } />

          {/* 3. Login Page (/login) */}
          <Route path="/login" element={<Login />} />

          {/* 4. Add Product Page (/admin/add-product) */}
          <Route path="/admin/add-product" element={<AddProduct />} />

          {/* === PROTECTED ADMIN ROUTES === */}
          
          {/* If user is logged in, show Admin Pages. If not, Redirect to Login */}
          {session && session.user ? (
            <>
              {/* Main Dashboard */}
              <Route path="/admin" element={<AdminDashboard session={session} />} />
              
              {/* Independent Pages */}
              <Route path="/admin/spotlights" element={<Spotlights />} />
              <Route path="/admin/settings" element={<SiteSettings />} />
            </>
          ) : (
            <>
              <Route path="/admin/*" element={<Navigate to="/login" replace />} />
            </>
          )}

        </Routes>

        {/* === GLOBAL MODALS === */}
        
        {/* 1. How To Order Modal */}
        <HowToOrderModal 
          isOpen={isHowToOrderOpen} 
          onClose={() => setIsHowToOrderOpen(false)} 
        />

        {/* 2. Sourcing Modal */}
        <SourcingModal 
          isOpen={isSourcingOpen} 
          onClose={() => setIsSourcingOpen(false)} 
        />

        {/* 3. Business Guide Modal */}
        <BusinessGuideModal 
          isOpen={isGuideOpen} 
          onClose={() => setIsGuideOpen(false)} 
        />

      </Router>
    </SettingsProvider>
  )
}

export default App