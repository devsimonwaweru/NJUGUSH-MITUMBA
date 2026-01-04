import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const CustomerSpotlight = () => {
  const [spotlight, setSpotlight] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const { data, error } = await supabase
          .from('spotlights')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error("Spotlight Error:", error)
          throw error
        }
        setSpotlight(data)
      } catch (error) {
        console.error("Error fetching spotlight:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSpotlight()
  }, [])

  if (loading) return null
  if (!spotlight) return null // If no data, hide section

  return (
    <section id="spotlight" className="py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img 
                src={spotlight.image_url} 
                alt={spotlight.customer_name} 
                className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <span className="inline-block bg-alert text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wider">
              Customer of the Week
            </span>
            <h2 className="text-4xl font-serif text-primary mb-2">{spotlight.customer_name}</h2>
            <h3 className="text-2xl font-bold text-accent mb-6">{spotlight.headline}</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">{spotlight.story}</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {spotlight.tiktok_url && (
                <a href={spotlight.tiktok_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-bold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  Watch on TikTok
                </a>
              )}
              {spotlight.facebook_url && (
                <a href={spotlight.facebook_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.15L15.71 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z"/></svg>
                  Watch on Facebook
                </a>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default CustomerSpotlight