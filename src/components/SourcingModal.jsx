import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const SourcingModal = ({ isOpen, onClose }) => {
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
        console.error("Error fetching settings in Sourcing Modal:", error)
      }
    }

    fetchSettings()
  }, [])

  // Helper to format WhatsApp link
  const getWhatsAppLink = (phone) => {
    if (!phone) return '#'
    const cleanPhone = phone.replace(/\D/g, '') 
    return `https://wa.me/${cleanPhone}`
  }

  if (!isOpen) return null

  return (
    // Overlay
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="bg-white relative z-10 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-primary p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif text-white">Global Sourcing</h2>
          <button onClick={onClose} className="text-white hover:text-accent transition">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          <p className="text-center text-gray-500 mb-8">
            We import Grade A & Cream selections directly from the world's top fashion hubs.
          </p>

          {/* 5-Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            
            {/* China */}
            <div className="text-center group hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-sm group-hover:shadow-md transition">CN</div>
              <h3 className="text-lg font-bold text-primary">China</h3>
              <p className="text-xs text-gray-600 mt-2">Massive variety of trendy summer wear.</p>
            </div>

            {/* UK */}
            <div className="text-center group hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-sm group-hover:shadow-md transition">UK</div>
              <h3 className="text-lg font-bold text-primary">United Kingdom</h3>
              <p className="text-xs text-gray-600 mt-2">High street brands like Primark & Next.</p>
            </div>

            {/* Canada */}
            <div className="text-center group hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-sm group-hover:shadow-md transition">CA</div>
              <h3 className="text-lg font-bold text-primary">Canada</h3>
              <p className="text-xs text-gray-600 mt-2">Premium winter wear and cotton fabrics.</p>
            </div>

            {/* Taiwan */}
            <div className="text-center group hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-sm group-hover:shadow-md transition">TW</div>
              <h3 className="text-lg font-bold text-primary">Taiwan</h3>
              <p className="text-xs text-gray-600 mt-2">Specialized fabric blends and unique selection.</p>
            </div>

            {/* Korea */}
            <div className="text-center group hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-sm group-hover:shadow-md transition">KR</div>
              <h3 className="text-lg font-bold text-primary">Korea</h3>
              <p className="text-xs text-gray-600 mt-2">Trendy K-Fashion styles and vibrant colors.</p>
            </div>

          </div>

        </div>

        {/* Footer with Dynamic CTA */}
        <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div>
            <h4 className="font-bold text-primary">Looking for specific items?</h4>
            <p className="text-xs text-gray-500">Chat with our sourcing agent directly.</p>
          </div>

          <div className="flex gap-3">
             <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
               Close
             </button>
             
             {/* Dynamic WhatsApp Link */}
             <a 
               href={`${getWhatsAppLink(settings?.whatsapp_number)}?text=Hi, I am interested in sourcing from China/UK/Canada.`}
               target="_blank"
               rel="noreferrer"
               className="bg-whatsapp hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2"
             >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
               Chat Agent
             </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SourcingModal