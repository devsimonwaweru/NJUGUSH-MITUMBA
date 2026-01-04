import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'

const AddProduct = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    price_kes: '',
    category: '',
  })
  const [file, setFile] = useState(null) // Stores the actual file object
  const [preview, setPreview] = useState(null) // For showing image preview
  const [uploading, setUploading] = useState(false)

  // Handle File Selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      // Create preview URL so user can see the photo
      setPreview(URL.createObjectURL(selected))
    }
  }

  // Handle Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      alert("Please select an image!")
      return
    }

    setUploading(true)

    try {
      // 1. Upload Image to Supabase Storage ('media' bucket)
      // We create a unique filename: timestamp + original name
      const fileName = `${Date.now()}_${file.name}`
      
      const { error } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // 2. Get Public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(fileName)

      // 3. Insert Product into Database with the Public URL
      const { error: dbError } = await supabase
        .from('products')
        .insert([{
          title: formData.title,
          price_kes: parseInt(formData.price_kes),
          category: formData.category,
          image_url: publicUrl, // Save the URL we just got
          badge: 'New'
        }])

      if (dbError) throw dbError

      alert('Product added successfully!')
      navigate('/admin') // Go back to dashboard

    } catch (error) {
      console.error('Error:', error)
      alert('Error adding product. Check console for details.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-primary font-bold">Add New Bale</h2>
            <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-primary text-sm">Cancel</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bale Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                placeholder="e.g. Men's Sweatpants Mix"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
              <select 
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-primary outline-none"
              >
                <option value="">Select Category</option>
                <option value="Ladies">Ladies</option>
                <option value="Mens">Mens</option>
                <option value="Kids">Kids</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Price (KES)</label>
              <input 
                type="number" 
                required
                value={formData.price_kes}
                onChange={e => setFormData({...formData, price_kes: e.target.value})}
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-primary outline-none"
                placeholder="e.g. 15000"
              />
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
              <label className="block text-sm font-bold text-gray-700 mb-2">Bale Photo</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={uploading}
              className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-[#05122b] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 018 8 0 018-8 018-8 018-8 018-8 018-8z" stroke="currentColor" strokeWidth="0"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </form>
        </div>

        {/* Right: Preview Area */}
        <div className="w-full md:w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center border-l border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">Preview</p>
            
            {preview ? (
              <div className="w-full h-80 rounded-xl shadow-lg overflow-hidden bg-white">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-full h-80 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white">
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012-2 2.942V10a2 2 0 00-2-2H2a2 2 0 00-2 2v7.172a2 2 0 00.586.586l4.586 4.586V14a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h-1m1 4h-1M3 8h12M8 12h8" /></svg>
                <p className="text-gray-400 mt-2 text-sm">Image will appear here</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AddProduct