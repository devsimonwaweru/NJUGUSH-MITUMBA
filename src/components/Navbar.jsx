import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

const Navbar = ({ onOpenHowToOrder, onOpenSourcing }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  // --- STATE TO HOLD SETTINGS ---
  const [settings, setSettings] = useState(null)

  // --- FETCH SETTINGS ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single()
        
        if (data) {
          setSettings(data)
        }
      } catch (error) {
        console.error("Error fetching settings in Navbar:", error)
      }
    }

    fetchSettings()
  }, [])

  // Helper to format WhatsApp link
  const getWhatsAppLink = (phone) => {
    if (!phone) return '#'
    const cleanPhone = phone.replace(/\D/g, '') // Removes everything except digits
    return `https://wa.me/${cleanPhone}`
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <span className="text-accent">Njugush</span> Mitumba
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          
          {/* Standard Links */}
          <Link to="/" className="text-primary font-medium hover:text-accent transition">Home</Link>
          <Link to="/shop" className="text-primary font-medium hover:text-accent transition">New Arrivals</Link>
          <a href="#spotlight" className="text-primary font-medium hover:text-accent transition">Spotlight</a>
          {/* UPDATED: Contact Us now goes to Branches */}
          <a href="#branches" className="text-primary font-medium hover:text-accent transition">Contact Us</a>
          <a href="#submit-review" className="text-primary font-medium hover:text-accent transition">Reviews</a>
          
          {/* Info Buttons Group */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
            
            {/* How It Works */}
            <button 
              onClick={onOpenHowToOrder}
              className="text-primary font-bold border-2 border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition text-sm whitespace-nowrap"
            >
              How It Works
            </button>

            {/* Our Origins */}
            <button 
              onClick={onOpenSourcing}
              className="text-primary font-bold border-2 border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition text-sm whitespace-nowrap"
            >
              Our Origins
            </button>

          </div>

          {/* Join Community Dropdown */}
          <div className="relative group">
             <button className="bg-whatsapp text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition shadow-lg text-sm flex items-center gap-2">
              Join Community
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            
            {/* Dropdown Menu - UPDATED WITH DYNAMIC LINKS */}
             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <a 
                href={settings?.facebook_url || "#"} 
                target="_blank"
                rel="noreferrer"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1877F2] rounded-t-lg flex items-center gap-2"
              >
                Facebook Page
              </a>
              <a 
                href={settings?.tiktok_url || "#"} 
                target="_blank"
                rel="noreferrer"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2"
              >
                TikTok
              </a>
              <a 
                href={settings?.whatsapp_group_link || getWhatsAppLink(settings?.whatsapp_number)} 
                target="_blank"
                rel="noreferrer"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-whatsapp rounded-b-lg flex items-center gap-2"
              >
                WhatsApp Channel
              </a>
            </div>
          </div>

        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-primary focus:outline-none">
          {isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-lg">
          
          <Link to="/" className="text-primary font-medium block" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/shop" className="text-primary font-medium block" onClick={() => setIsOpen(false)}>New Arrivals</Link>
          <a href="#spotlight" className="text-primary font-medium block" onClick={() => setIsOpen(false)}>Spotlight</a>
          
          {/* UPDATED: Mobile Contact Us now goes to Branches */}
          <a href="#branches" className="text-primary font-medium block" onClick={() => setIsOpen(false)}>Contact Us</a>
          
          <a href="#submit-review" className="text-primary font-medium block" onClick={() => setIsOpen(false)}>Reviews</a>
          
          {/* Mobile Buttons */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <button 
              onClick={() => { onOpenHowToOrder(); setIsOpen(false); }} 
              className="w-full border-2 border-primary text-primary font-bold py-2 rounded-full text-sm text-left"
            >
              How It Works
            </button>
            <button 
              onClick={() => { onOpenSourcing(); setIsOpen(false); }} 
              className="w-full border-2 border-primary text-primary font-bold py-2 rounded-full text-sm text-left"
            >
              Our Origins
            </button>
          </div>
          
          {/* Note: This links to the section where the big buttons are */}
          <a href="#community" className="text-whatsapp font-bold block text-center" onClick={() => setIsOpen(false)}>Join WhatsApp</a>
        </div>
      )}
    </nav>
  )
}

export default Navbar