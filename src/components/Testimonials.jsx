import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('newest') // 'newest' or 'highest'

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        let query = supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)

        // Sorting Logic
        if (filter === 'newest') {
          query = query.order('created_at', { ascending: false })
        } else {
          query = query.order('rating', { ascending: false })
        }

        const { data, error } = await query

        if (error) throw error
        setTestimonials(data)
      } catch (error) {
        console.error("Error fetching testimonials:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [filter])

  return (
    <section id="testimonials" className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif text-primary mb-4">Customer Success Stories</h2>
            <p className="text-gray-600">Real stories from retailers across Kenya.</p>
          </div>

          <div className="flex gap-4">
             {/* Filter Buttons */}
             <button 
               onClick={() => setFilter('newest')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition ${filter === 'newest' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
             >
               Newest
             </button>
             <button 
               onClick={() => setFilter('highest')}
               className={`px-6 py-2 rounded-full text-sm font-bold transition ${filter === 'highest' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
             >
               Highest Rated
             </button>
             
             {/* Link to Review Form */}
             <a 
               href="#submit-review" 
               className="bg-accent text-primary px-6 py-2 rounded-full text-sm font-bold hover:bg-yellow-500 shadow-md transition whitespace-nowrap flex items-center gap-2"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5h-1v5z" /></svg>
               Write Your Story
             </a>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading stories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col relative hover:-translate-y-2 transition duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-whatsapp font-semibold text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                    Verified Buyer
                  </div>
                  
                  {/* Display Stars */}
                  {review.rating && (
                    <div className="flex text-accent text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quote */}
                <p className="text-gray-600 italic mb-6 flex-grow text-sm leading-relaxed">
                  "{review.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <img 
                    src={review.avatar_url} 
                    alt={review.customer_name} 
                    className="w-14 h-14 rounded-full object-cover bg-gray-200 border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-primary text-base">{review.customer_name}</h4>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 12" /></svg>
                      {review.location}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}

export default Testimonials