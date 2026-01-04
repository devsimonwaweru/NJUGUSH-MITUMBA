import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const Branches = () => {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .order('town', { ascending: true })

        if (error) throw error
        setBranches(data)
      } catch (error) {
        console.error("Error fetching branches:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBranches()
  }, [])

  return (
    <section id="branches" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-primary mb-4">Our Branches</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visit us at any of our locations across Kenya. Our teams are ready to serve you with quality mitumba bales.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading branch locations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {branches.map((branch) => (
              <div key={branch.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100 relative overflow-hidden group">
                
                {/* Branch Image Header */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={branch.image_url} 
                    alt={branch.town} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <h3 className="text-white font-bold text-xl">{branch.town}</h3>
                  </div>
                </div>

                {/* Branch Info */}
                <div className="p-6">
                  <div className="font-bold text-accent mb-1">{branch.name}</div>
                  <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {branch.location}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 h-10 line-clamp-2">
                    {branch.description}
                  </p>

                  {/* Phone Number */}
                  <div className="flex items-center gap-2 font-semibold text-primary text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {branch.phone}
                  </div>
                </div>

                {/* FLOATING WHATSAPP BUTTON (Per Branch) */}
                <a 
                  href={`https://wa.me/254${branch.phone.replace(/\D/g,'')}?text=Hi, I am interested in bales at your ${branch.town} branch.`}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 bg-whatsapp text-white p-3 rounded-full shadow-lg hover:scale-110 transition duration-300 flex items-center justify-center z-10 border-2 border-white"
                  title="Chat with this branch"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </a>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

export default Branches