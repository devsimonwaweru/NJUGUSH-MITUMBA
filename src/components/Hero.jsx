import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const Hero = ({ onOpenGuide }) => {
  
  // --- STATE TO HOLD SETTINGS ---
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
        console.error("Error fetching settings in Hero:", error)
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
    <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden">
      
      {/* 1. Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/hero-bales.jpg" alt="Stack of Mitumba Bales" className="w-full h-full object-cover" />
      </div>

      {/* 2. Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-primary z-10"></div>

      {/* 3. Floating Social Bar (Right Side) */}
      <div className="hidden lg:flex flex-col fixed right-0 top-1/2 -translate-y-1/2 z-50">
        
        {/* Facebook */}
        <div className="group relative">
          <a 
            href={settings?.facebook_url || "#"} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center bg-white/10 hover:bg-[#1877F2] transition-all duration-300 border border-white/20"
          >
            <div className="p-4">
               <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.15L15.71 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z"/></svg>
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 font-bold text-sm mr-4 translate-x-4 group-hover:translate-x-0">
              Like Our Page
            </span>
          </a>
        </div>

        {/* TikTok */}
        <div className="group relative">
          <a 
            href={settings?.tiktok_url || "#"} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center bg-white/10 hover:bg-black transition-all duration-300 border border-white/20"
          >
            <div className="p-4">
               <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 font-bold text-sm mr-4 translate-x-4 group-hover:translate-x-0">
              Watch Videos
            </span>
          </a>
        </div>

        {/* WhatsApp */}
        <div className="group relative">
          <a 
            href={getWhatsAppLink(settings?.whatsapp_number)} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center bg-white/10 hover:bg-whatsapp transition-all duration-300 border border-white/20"
          >
            <div className="p-4">
               <svg className="w-6 h-6 text-whatsapp" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 font-bold text-sm mr-4 translate-x-4 group-hover:translate-x-0">
              Chat With Us
            </span>
          </a>
        </div>

      </div>

      {/* 4. FLOATING GUIDE BUTTON (Bottom Left) */}
      <div className="absolute bottom-8 left-8 z-40 animate-fade-in-up">
        <button 
          onClick={onOpenGuide}
          className="group flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-primary text-white px-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <div className="bg-accent text-primary p-2 rounded-full">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5c-4.142 0-7.5 3.358-7.5 7.5 0 1.397.39 2.736 1.057 3.856l1.743 1.455.508-.61.7-.467.958.286zM6.25 12c0 3.142 2.05 5.85 5.027 6.902l1.934 1.614.508-.61.7-.467.958.286C7.5 19.734 4 16.6 4 12.5 4 8.142 4 5 7.358 5 3.5 3.5 0 3.142 2.05 5.85 5.027 6.902l1.934 1.614.508-.61.7-.467.958.286z" /></svg>
          </div>
          <span className="font-bold text-sm md:text-base tracking-wide group-hover:text-accent transition">
            Start Business Guide
          </span>
        </button>
      </div>

      {/* 5. Main Content */}
      <div className="container mx-auto px-4 relative z-20 flex flex-col items-center animate-fade-in-up">
        
        <span className="bg-accent/20 border border-accent text-accent text-xs font-bold tracking-widest px-4 py-2 rounded-full mb-6 uppercase backdrop-blur-sm">
          Kenya's #1 Importer
        </span>

        <h1 className="text-5xl md:text-7xl font-serif mb-6 text-center leading-tight text-white">
          Premium <span className="text-accent drop-shadow-lg">Mitumba</span> Bales
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl text-center font-light">
          Sourced globally, sold locally. Experience difference in Grade A quality.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          
          <a 
            href="/shop" 
            className="bg-accent text-primary px-10 py-4 rounded-full font-bold text-lg hover-glow hover:scale-105 transition duration-300 text-center shadow-2xl"
          >
            Shop Arrivals
          </a>
          
          <a 
            href="#spotlight" 
            className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition duration-300 text-center"
          >
            See Spotlight
          </a>

        </div>
      </div>
    </section>
  )
}

export default Hero