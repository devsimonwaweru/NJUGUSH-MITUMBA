import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'

const SubmitReview = () => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [formData, setFormData] = useState({
    customer_name: '',
    location: '',
    content: ''
  })
  const [status, setStatus] = useState('') // 'loading', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert("Please select a star rating!")
      return
    }

    setStatus('loading')

    try {
      // Insert with is_published = false by default (requires Admin approval)
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          ...formData,
          rating: rating,
          is_published: false, // Pending Approval
          avatar_url: 'https://ui-avatars.com/api/?name=' + formData.customer_name + '&background=random' // Auto avatar
        }])

      if (error) throw error

      setStatus('success')
      setFormData({ customer_name: '', location: '', content: '' })
      setRating(0)
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <section id="submit-review" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left: Info */}
          <div className="bg-primary text-white p-8 md:w-1/3 flex flex-col justify-center text-center md:text-left">
            <h3 className="text-2xl font-serif text-accent mb-4">Share Your Story</h3>
            <p className="text-sm text-gray-300 mb-6">
              Did we help your business grow? How was the quality of our bales? Your feedback helps other retailers.
            </p>
            <div className="flex justify-center md:justify-start gap-2 text-accent text-4xl">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-8 md:w-2/3">
            
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-green-100 text-green-700 p-4 rounded-full mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-xl font-bold text-primary mb-2">Thank You!</h4>
                <p className="text-gray-500 text-sm">Your story has been submitted. Once verified, it will appear on our website.</p>
                <button 
                  onClick={() => setStatus('')} 
                  className="mt-6 text-accent text-sm font-bold hover:underline"
                >
                  Submit another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Name</label>
                  <input 
                    type="text" 
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    placeholder="e.g. John Doe"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Town/City</label>
                  <input 
                    type="text" 
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    placeholder="e.g. Mombasa"
                  />
                </div>

                {/* Rating Stars */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => {
                      const ratingValue = i + 1
                      return (
                        <svg
                          key={i}
                          onClick={() => setRating(ratingValue)}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                          className="w-8 h-8 cursor-pointer transition-transform hover:scale-110"
                          fill={ratingValue <= (hover || rating) ? "#F4B400" : "#E5E7EB"}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      )
                    })}
                  </div>
                </div>

                {/* Story Text */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Story</label>
                  <textarea 
                    name="content"
                    required
                    value={formData.content}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    placeholder="Tell us about the bales you bought..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-[#05122b] transition shadow-md disabled:opacity-50"
                >
                  {status === 'loading' ? 'Submitting...' : 'Submit Review'}
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

export default SubmitReview