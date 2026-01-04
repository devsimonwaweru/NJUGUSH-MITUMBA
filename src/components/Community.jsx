import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const Community = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [status, setStatus] = useState('') // 'success', 'error', ''
  
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
        console.error("Error fetching settings in Community:", error)
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ name: formData.name, phone_number: formData.phone }])

      if (error) throw error

      setStatus('success')
      setFormData({ name: '', phone: '' })
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <section id="community" className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Decorative Background Shape */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent opacity-10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Join Our Thriving Community</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Don't miss out on flash sales, live unboxing, and daily market updates. Connect with us or subscribe for SMS alerts.
          </p>
        </div>

        {/* Social Buttons - UPDATED TO USE DB LINKS */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
          
          {/* WhatsApp Button - Uses whatsapp_group_link or fallback to whatsapp_number */}
          <a 
            href={settings?.whatsapp_group_link || getWhatsAppLink(settings?.whatsapp_number)} 
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 bg-whatsapp hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg w-full md:w-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            Join WhatsApp Channel
          </a>
          
          {/* Facebook Button - Uses facebook_url */}
          <a 
            href={settings?.facebook_url || "#"} 
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg w-full md:w-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.15L15.71 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z"/></svg>
            Follow on Facebook
          </a>
        </div>

        {/* SMS Opt-in Form */}
        <div className="max-w-xl mx-auto bg-white text-text rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-primary mb-2">Get SMS Alerts</h3>
            <p className="text-sm text-gray-500">We'll text you when premium bales arrive. No spam.</p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-100 text-green-700 p-4 rounded text-center font-bold">
              You have been subscribed successfully! 🎉
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                  required
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  name="phone" 
                  placeholder="Phone Number (e.g. 0712...)" 
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-accent text-primary font-bold py-3 rounded-lg hover:bg-yellow-500 transition shadow-md"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}

export default Community