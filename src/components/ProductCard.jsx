import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const ProductCard = ({ product }) => {
  
  // --- STATE TO HOLD SETTINGS ---
  const [settings, setSettings] = useState(null)

  // --- FETCH SETTINGS ---
  // Note: If you have many products, consider passing 'settings' as a prop 
  // instead of fetching inside each card for better performance.
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
        console.error("Error fetching settings in ProductCard:", error)
      }
    }

    fetchSettings()
  }, [])

  // Helper to format WhatsApp link with pre-filled message
  const getWhatsAppLink = (phone, title) => {
    if (!phone) return '#'
    const cleanPhone = phone.replace(/\D/g, '') // Remove non-digits
    const message = `Hi, I am interested in the ${title}.`
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  }
  
  // --- NEW: Handle Image Errors ---
  const handleImageError = (e) => {
    e.target.src = '/hero-bales.jpg'; // Fallback to your hero image
  };

  return (
    <article className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition duration-300 group">
      
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden bg-gray-100">
        
        {/* Optional Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full z-10">
            {product.badge}
          </span>
        )}
        
        {/* Image with Error Handler */}
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          onError={handleImageError}
        />

        {/* HOVER OVERLAY: WhatsApp Button */}
        {/* UPDATED: Now uses dynamic settings link */}
        <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center backdrop-blur-sm">
          <a 
            href={getWhatsAppLink(settings?.whatsapp_number, product.title)}
            target="_blank"
            rel="noreferrer"
            className="bg-whatsapp text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition duration-300 hover:bg-green-600 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            Order Now
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <div className="text-xs font-bold text-accent uppercase tracking-wide mb-2">
          {product.category}
        </div>
        <h3 className="text-lg font-bold text-primary mb-2 leading-tight">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
           <span className="text-xl font-bold text-text">
             KES {product.price_kes.toLocaleString()}
           </span>
           <span className="text-xs text-gray-400">/ Bale</span>
        </div>
      </div>
      
    </article>
  )
}

export default ProductCard