import { useState, useEffect } from 'react'
import { supabaseAdmin } from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'

const SiteSettings = () => {
  const navigate = useNavigate()
  
  // --- STATE ---
  const [settings, setSettings] = useState({
    id: 1,
    facebook_url: '',
    tiktok_url: '',
    whatsapp_number: '',
    whatsapp_group_link: ''
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabaseAdmin
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .single()

        if (data) {
          setSettings(data)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // --- HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabaseAdmin
        .from('site_settings')
        .update({
          facebook_url: settings.facebook_url,
          tiktok_url: settings.tiktok_url,
          whatsapp_number: settings.whatsapp_number,
          whatsapp_group_link: settings.whatsapp_group_link
        })
        .eq('id', 1)

      if (error) throw error
      alert('Settings Saved Successfully!')

    } catch (error) {
      console.error('Error:', error)
      alert('Error saving settings.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings({ ...settings, [name]: value })
  }

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT: Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-primary font-bold">Site Settings</h2>
            <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-primary text-sm">Cancel</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Facebook URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Facebook Page URL</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">fb.com/</span>
                <input 
                  type="url"
                  name="facebook_url"
                  required
                  value={settings.facebook_url}
                  onChange={handleChange}
                  className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="yourcompany"
                />
              </div>
            </div>

            {/* TikTok URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">TikTok Profile URL</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                <input 
                  type="url"
                  name="tiktok_url"
                  required
                  value={settings.tiktok_url}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="yourcompany"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">+254</span>
                  <input 
                    type="text"
                    name="whatsapp_number"
                    required
                    value={settings.whatsapp_number}
                    onChange={handleChange}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="712 345 678"
                  />
                </div>
              </div>

              {/* WhatsApp Group Link */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Group Link</label>
                <input 
                  type="url"
                  name="whatsapp_group_link"
                  value={settings.whatsapp_group_link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="https://chat.whatsapp.com/..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-[#05122b] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 018-8 018-8 018-8 018-8 018-8 018-8z" stroke="currentColor" strokeWidth="0"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save All Settings'
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: Smart Info & Visuals */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center border-l border-gray-200">
          <div className="text-center space-y-6 w-full">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Active Channels</p>
            
            {/* Visual Connection Hub */}
            <div className="flex justify-center gap-6 mb-8">
              {/* Facebook */}
              <div className={`p-4 rounded-full border-2 transition-all ${settings.facebook_url ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-100 border-gray-200 text-gray-300'}`}>
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              
              {/* TikTok */}
              <div className={`p-4 rounded-full border-2 transition-all ${settings.tiktok_url ? 'bg-gray-100 border-gray-800 text-gray-900' : 'bg-gray-100 border-gray-200 text-gray-300'}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </div>

              {/* WhatsApp */}
              <div className={`p-4 rounded-full border-2 transition-all ${settings.whatsapp_number ? 'bg-green-50 border-green-200 text-green-600' : 'bg-gray-100 border-gray-200 text-gray-300'}`}>
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
            </div>

            {/* Info Box */}
            <div className="w-full bg-blue-50 rounded-lg p-5 text-left shadow-sm">
              <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Live Updates Active
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Any changes saved here will immediately reflect on your website's Navbar, Footer, and Contact sections.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SiteSettings