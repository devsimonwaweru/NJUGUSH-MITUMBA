import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import HowToOrderModal from './HowToOrderModal'
import SourcingModal from './SourcingModal'
import { supabase } from '../utils/supabaseClient'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [howToOpen, setHowToOpen] = useState(false)
  const [sourcingOpen, setSourcingOpen] = useState(false)
  const [settings, setSettings] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()
      if (error) console.error(error)
      if (data) setSettings(data)
    }
    fetchSettings()
  }, [])

  const getWhatsAppLink = (phone) => (phone ? `https://wa.me/${phone.replace(/\D/g, '')}` : '#')

  // Smooth scroll to section
  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      // Navigate to home first, then scroll
      navigate('/', { replace: false })
      setTimeout(() => {
        const el = document.querySelector(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100) // small delay to allow home page render
    } else {
      const el = document.querySelector(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="text-accent">Njugush</span> Mitumba
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="text-primary font-medium hover:text-accent transition">Home</Link>
            <Link to="/shop" className="text-primary font-medium hover:text-accent transition">New Arrivals</Link>
            <button onClick={() => scrollToSection('#spotlight')} className="text-primary font-medium hover:text-accent transition">Spotlight</button>
            <button onClick={() => scrollToSection('#branches')} className="text-primary font-medium hover:text-accent transition">Contact Us</button>
            <button onClick={() => scrollToSection('#submit-review')} className="text-primary font-medium hover:text-accent transition">Reviews</button>

            {/* Buttons */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
              <button
                onClick={() => setHowToOpen(true)}
                className="text-primary font-bold border-2 border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition text-sm whitespace-nowrap"
              >
                How It Works
              </button>

              <button
                onClick={() => setSourcingOpen(true)}
                className="text-primary font-bold border-2 border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition text-sm whitespace-nowrap"
              >
                Our Origins
              </button>
            </div>

            {/* Community */}
            <div className="relative group">
              <button className="bg-whatsapp text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition shadow-lg text-sm flex items-center gap-2">
                Join Community
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <a href={settings?.facebook_url || '#'} target="_blank" rel="noreferrer" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1877F2] rounded-t-lg flex items-center gap-2">
                  Facebook Page
                </a>
                <a href={settings?.tiktok_url || '#'} target="_blank" rel="noreferrer" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2">
                  TikTok
                </a>
                <a href={settings?.whatsapp_group_link || getWhatsAppLink(settings?.whatsapp_number)} target="_blank" rel="noreferrer" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-whatsapp rounded-b-lg flex items-center gap-2">
                  WhatsApp Channel
                </a>
              </div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-primary text-2xl">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg z-40">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-primary font-medium block">Home</Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-primary font-medium block">New Arrivals</Link>
            <button onClick={() => { scrollToSection('#spotlight'); setMenuOpen(false) }} className="text-primary font-medium block">Spotlight</button>
            <button onClick={() => { scrollToSection('#branches'); setMenuOpen(false) }} className="text-primary font-medium block">Contact Us</button>
            <button onClick={() => { scrollToSection('#submit-review'); setMenuOpen(false) }} className="text-primary font-medium block">Reviews</button>

            <button onClick={() => { setHowToOpen(true); setMenuOpen(false) }} className="w-full border-2 border-primary text-primary font-bold py-2 rounded-full text-sm text-left">
              How It Works
            </button>
            <button onClick={() => { setSourcingOpen(true); setMenuOpen(false) }} className="w-full border-2 border-primary text-primary font-bold py-2 rounded-full text-sm text-left">
              Our Origins
            </button>
          </div>
        )}
      </nav>

      <HowToOrderModal isOpen={howToOpen} onClose={() => setHowToOpen(false)} />
      <SourcingModal isOpen={sourcingOpen} onClose={() => setSourcingOpen(false)} />
    </>
  )
}

export default Navbar
