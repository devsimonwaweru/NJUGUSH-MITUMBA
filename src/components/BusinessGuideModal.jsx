import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const BusinessGuideModal = ({ isOpen, onClose }) => {
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
        console.error("Error fetching settings in Modal:", error)
      }
    }

    fetchSettings()
  }, [])

  // Helper to format WhatsApp link (removes spaces/dashes)
  const getWhatsAppLink = (phone) => {
    if (!phone) return '254711111222' // Fallback default
    const cleanPhone = phone.replace(/\D/g, '') // Removes everything except digits
    return cleanPhone
  }

  if (!isOpen) return null

  return (
    // Overlay
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="bg-white relative z-10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-primary p-6 flex justify-between items-center border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-serif text-white">How to Start a Mitumba Business</h2>
            <p className="text-gray-300 text-sm">A step-by-step guide to profit</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-accent transition">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto bg-gray-50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: Steps 1-5 */}
            <div className="space-y-6">
              
              {/* Step 1 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                  <h3 className="font-bold text-primary text-lg">Raise Capital</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">You must start with a full bale.</p>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-xs font-bold text-yellow-800 uppercase">Example</p>
                  <p className="text-sm font-medium text-gray-700">Sweatpants bale → KSh 12,000</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                  <h3 className="font-bold text-primary text-lg">Choose One Product</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Start with one fast-moving item only.</p>
                <div className="text-sm text-gray-700">
                  <p><strong>Example:</strong> Sweatpants</p>
                  <p className="text-xs text-gray-500 italic mt-1">This helps you understand pricing, demand, and customer behavior.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                  <h3 className="font-bold text-primary text-lg">Buy From Trusted Importer</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Buy sealed bales</li>
                  <li>Confirm Bale Grade (A/B/C)</li>
                  <li>Confirm estimated pieces (65–80 for sweatpants)</li>
                </ul>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                  <h3 className="font-bold text-primary text-lg">Sort The Bale</h3>
                </div>
                <p className="text-sm text-gray-600">After opening bale, separate higher quality from lower quality pieces.</p>
                <p className="text-xs text-accent font-bold mt-1">Why? This helps in pricing and faster sales.</p>
              </div>

              {/* Step 5 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">5</span>
                  <h3 className="font-bold text-primary text-lg">Choose Selling Point</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Market stall</li>
                  <li>• Roadside space</li>
                  <li>• Small shop</li>
                  <li>• Online (WhatsApp, Facebook, TikTok)</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2 italic">Start where costs are low.</p>
              </div>

            </div>

            {/* RIGHT COLUMN: Steps 6-10 */}
            <div className="space-y-6">
              
              {/* Step 6 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-accent hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-accent text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">6</span>
                  <h3 className="font-bold text-primary text-lg">Set Your Price</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Price based on quality and demand.</p>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><strong>Sweatpants Example:</strong> KSh 300 – 350 / piece</p>
                  <p><strong>Pieces per bale:</strong> 65 – 80</p>
                </div>
              </div>

              {/* Step 7: Calculation Table */}
              <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-accent relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-accent text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">7</span>
                  <h3 className="font-bold text-primary text-lg">Calculate Profit</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 text-gray-500">Case</th>
                        <th className="py-2 text-gray-500">Pieces</th>
                        <th className="py-2 text-gray-500">Price</th>
                        <th className="py-2 text-gray-500">Revenue</th>
                        <th className="py-2 text-primary font-bold">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2 font-medium">Lowest</td>
                        <td className="py-2">65 × 300</td>
                        <td className="py-2 text-gray-500">(Bale: 12k)</td>
                        <td className="py-2">19,500</td>
                        <td className="py-2 font-bold text-green-600">7,500</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Average</td>
                        <td className="py-2">72 × 325</td>
                        <td className="py-2 text-gray-500">(Bale: 12k)</td>
                        <td className="py-2">23,400</td>
                        <td className="py-2 font-bold text-green-600">11,400</td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="py-2 font-bold text-accent">Best</td>
                        <td className="py-2 font-bold text-accent">80 × 350</td>
                        <td className="py-2 text-gray-500">(Bale: 12k)</td>
                        <td className="py-2 font-bold">28,000</td>
                        <td className="py-2 font-bold text-green-700 text-lg">16,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">(Before rent and small expenses)</p>
              </div>

              {/* Step 8 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">8</span>
                  <h3 className="font-bold text-primary text-lg">Market Product</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Display clearly</li>
                  <li>Post daily on WhatsApp status</li>
                  <li>Use short TikTok & Facebook videos</li>
                  <li>Offer small discounts for bulk buyers</li>
                </ul>
              </div>

              {/* Step 9 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">9</span>
                  <h3 className="font-bold text-primary text-lg">Manage Money</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Track daily sales</li>
                  <li>Separate business and personal money</li>
                  <li>Reinvest profit into next bale</li>
                </ul>
              </div>

              {/* Step 10 */}
              <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-primary hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">10</span>
                  <h3 className="font-bold text-primary text-lg">Grow Business</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Buy more bales</li>
                  <li>Add new product categories</li>
                  <li>Move to a better location</li>
                  <li>Build a brand</li>
                </ul>
              </div>

            </div>
          </div>

          {/* EXTRA TIPS */}
          <div className="mt-8 bg-primary text-white p-6 rounded-xl">
            <h3 className="text-xl font-serif font-bold text-accent mb-4">Pro Tips for Success</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <span className="text-2xl">🚀</span>
                <p><strong>Consistency:</strong> Open your stall/shop daily. Trust takes time to build.</p>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🤝</span>
                <p><strong>Service:</strong> Treat every customer well. They will return with friends.</p>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER WITH FLOATING CTA */}
        <div className="p-6 bg-white border-t border-gray-200 flex justify-between items-center sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          
          <div>
            <h4 className="font-bold text-primary">Need more help?</h4>
            <p className="text-xs text-gray-500">Talk to our experts today.</p>
          </div>

          <div className="flex gap-3">
             <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
               Close
             </button>
             
             {/* Floating CTA inside modal - UPDATED LINK */}
             <a 
               href={`https://wa.me/${getWhatsAppLink(settings?.whatsapp_number)}?text=Hi, I need help starting a Mitumba business.`}
               target="_blank"
               rel="noreferrer"
               className="bg-whatsapp hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition flex items-center gap-2"
             >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
               Contact an Expert
             </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BusinessGuideModal