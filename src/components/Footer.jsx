import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

const Footer = () => {
  const [settings, setSettings] = useState(null)

  // --- FETCH SETTINGS ---
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
        console.error("Error fetching settings in Footer:", error)
      }
    }

    fetchSettings()
  }, [])

  // Helper to format WhatsApp link (removes spaces/dashes)
  const getWhatsAppLink = (phone) => {
    if (!phone) return '#'
    const cleanPhone = phone.replace(/\D/g, '') // Removes everything except digits
    return `https://wa.me/${cleanPhone}`
  }

  return (
    <footer className="bg-[#05122b] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand Column */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
              <span className="text-accent">Njugush</span> Mitumba
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted partner for high-quality mitumba bales across Kenya. We empower retailers with Grade A stock at wholesale prices.
            </p>
            {/* Trust Badge */}
            <div className="flex items-center gap-2 bg-primary/50 px-4 py-2 rounded-lg border border-gray-700 w-fit">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              <span className="text-xs font-bold text-white">Verified Supplier</span>
            </div>
          </div>

          {/* 2. Quick Links Column */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-accent transition">Home</a></li>
              <li><a href="#products" className="hover:text-accent transition">New Arrivals</a></li>
              <li><a href="#branches" className="hover:text-accent transition">Our Branches</a></li>
              <li><a href="#testimonials" className="hover:text-accent transition">Customer Reviews</a></li>
              <li><a href="#community" className="hover:text-accent transition">Join Community</a></li>
            </ul>
          </div>

          {/* 3. Contact Info Column - DYNAMIC PHONE */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Nyahururu, Nanyuki, Meru, Kakamega</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {/* DYNAMIC PHONE NUMBER FROM DB */}
                <span>{settings?.whatsapp_number || 'Loading...'}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>sales@njugushmitumba.co.ke</span>
              </li>
            </ul>
          </div>

          {/* 4. Social Media Hub Column - DYNAMIC LINKS */}
          <div>
            <h3 className="text-white font-bold mb-6">Follow Us</h3>
            <div className="space-y-4">
              
              {/* WhatsApp - Uses Group Link or fallback to phone link */}
              <a 
                href={settings?.whatsapp_group_link || getWhatsAppLink(settings?.whatsapp_number)} 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-whatsapp rounded-lg transition group border border-white/10 hover:border-whatsapp"
              >
                <div className="bg-whatsapp p-2 rounded-full text-white group-hover:scale-110 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">WhatsApp Channel</div>
                  <div className="text-xs text-gray-400 group-hover:text-white">Join for daily updates</div>
                </div>
              </a>

              {/* Facebook - Uses DB URL */}
              <a 
                href={settings?.facebook_url || "#"} 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-[#1877F2] rounded-lg transition group border border-white/10 hover:border-[#1877F2]"
              >
                <div className="bg-[#1877F2] p-2 rounded-full text-white group-hover:scale-110 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.15L15.71 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z"/></svg>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Facebook Page</div>
                  <div className="text-xs text-gray-400 group-hover:text-white">Follow for photos</div>
                </div>
              </a>

              {/* TikTok - Uses DB URL */}
              <a 
                href={settings?.tiktok_url || "#"} 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-black rounded-lg transition group border border-white/10 hover:border-black"
              >
                <div className="bg-black p-2 rounded-full text-white group-hover:scale-110 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">TikTok</div>
                  <div className="text-xs text-gray-400 group-hover:text-white">Watch unboxing videos</div>
                </div>
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Copyright Line */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Njugush Mitumba Stores. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer