import { useState, useEffect } from 'react'
import { supabaseAdmin } from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'

const Spotlights = () => {
  const navigate = useNavigate()
  
  // Data State
  const [spotlights, setSpotlights] = useState([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [formData, setFormData] = useState({ 
    customer_name: '', 
    headline: '', 
    story: '', 
    tiktok_url: '', 
    facebook_url: '' 
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [editingSpotlight, setEditingSpotlight] = useState(null)

  // --- FETCH DATA ---
  const fetchSpotlights = async () => {
    try {
      const { data } = await supabaseAdmin
        .from('spotlights')
        .select('*')
        .order('created_at', { ascending: false })
      setSpotlights(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSpotlights() }, [])

  // --- HANDLERS ---

  // 1. ADD NEW
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      alert("Please select a photo for the spotlight!")
      return
    }
    setLoading(true)

    try {
      // Upload to Storage
      const fileName = `${Date.now()}_${file.name}`
      const { error: uploadError } = await supabaseAdmin.storage
        .from('media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      // Get Public URL
      const { data: { publicUrl } } = await supabaseAdmin.storage
        .from('media')
        .getPublicUrl(fileName)

      // Insert into DB
      const { error } = await supabaseAdmin.from('spotlights').insert([{
        customer_name: formData.customer_name,
        headline: formData.headline,
        story: formData.story,
        tiktok_url: formData.tiktok_url,
        facebook_url: formData.facebook_url,
        image_url: publicUrl,
        is_active: true
      }])

      if (error) throw error

      alert('Spotlight Published Successfully!')
      // Reset Form
      setFormData({ customer_name: '', headline: '', story: '', tiktok_url: '', facebook_url: '' })
      setFile(null)
      setPreview(null)
      document.getElementById('spotlight-file-input').value = ''
      fetchSpotlights()

    } catch (error) {
      console.error('Error:', error)
      alert('Error adding spotlight.')
    } finally {
      setLoading(false)
    }
  }

  // 2. HANDLE EDIT (OPEN FORM)
  const handleEdit = (s) => {
    setEditingSpotlight(s)
    window.scrollTo(0, 0)
  }

  // 3. UPDATE EXISTING
  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabaseAdmin.from('spotlights').update(editingSpotlight).eq('id', editingSpotlight.id)
      if (error) throw error
      alert('Spotlight Updated!')
      setEditingSpotlight(null)
      fetchSpotlights()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // 4. DELETE
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this spotlight?')) return
    try {
      const { error } = await supabaseAdmin.from('spotlights').delete().eq('id', id)
      if (error) throw error
      alert('Spotlight deleted')
      fetchSpotlights()
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Error deleting spotlight')
    }
  }

  // 5. TOGGLE STATUS
  const handleToggle = async (id, newStatus) => {
    const { error } = await supabaseAdmin.from('spotlights').update({ is_active: newStatus }).eq('id', id)
    if (!error) fetchSpotlights()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex flex-col">
      
      {/* HEADER */}
      <div className="bg-primary text-white p-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">Spotlights Page</h1>
          <button onClick={() => navigate('/admin')} className="text-sm font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">Back to Dashboard</button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto">
        
        {/* FORM SECTION */}
        {editingSpotlight && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 p-6 md:p-8">
                <h3 className="text-xl font-bold text-primary mb-6">Edit Spotlight</h3>
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Customer Name</label>
                    <input required value={editingSpotlight.customer_name} onChange={(e) => setEditingSpotlight({...editingSpotlight, customer_name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Headline</label>
                    <input required value={editingSpotlight.headline} onChange={(e) => setEditingSpotlight({...editingSpotlight, headline: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Success Story</label>
                    <textarea required rows="4" value={editingSpotlight.story} onChange={(e) => setEditingSpotlight({...editingSpotlight, story: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={editingSpotlight.tiktok_url} onChange={(e) => setEditingSpotlight({...editingSpotlight, tiktok_url: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3" placeholder="TikTok URL" />
                    <input value={editingSpotlight.facebook_url} onChange={(e) => setEditingSpotlight({...editingSpotlight, facebook_url: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3" placeholder="Facebook URL" />
                  </div>
                  <div className="flex gap-4 justify-end">
                    <button type="button" onClick={() => setEditingSpotlight(null)} className="px-6 py-2 border border-gray-300 rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-2 rounded font-bold hover:bg-[#05122b] disabled:opacity-50">Save</button>
                  </div>
                </form>
              </div>
              <div className="w-full md:w-1/3 bg-gray-50 p-8 flex items-center justify-center">
                <img src={editingSpotlight.image_url} alt="Current" className="max-h-60 object-cover rounded-lg shadow" />
              </div>
            </div>
          </div>
        )}

        {/* ADD FORM */}
        {!editingSpotlight && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 p-6 md:p-8">
                <h3 className="text-xl font-bold text-primary mb-6">Add New Spotlight</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Customer Name</label>
                    <input required value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Headline</label>
                    <input required value={formData.headline} onChange={(e) => setFormData({...formData, headline: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Success Story</label>
                    <textarea required rows="4" value={formData.story} onChange={(e) => setFormData({...formData, story: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3"></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input value={formData.tiktok_url} onChange={(e) => setFormData({...formData, tiktok_url: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3" placeholder="TikTok URL" />
                    <input value={formData.facebook_url} onChange={(e) => setFormData({...formData, facebook_url: e.target.value})} className="w-full border border-gray-300 rounded-lg p-3" placeholder="Facebook URL" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Photo</label>
                    <input id="spotlight-file-input" type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)); } }} className="w-full text-sm text-gray-500" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-whatsapp text-white py-3 rounded-lg font-bold hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? 'Uploading...' : 'Publish Spotlight'}
                  </button>
                </form>
              </div>
              <div className="w-full md:w-1/3 bg-gray-50 p-8 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-60 object-cover rounded-lg shadow" />
                ) : (
                  <div className="text-center text-gray-400">No Image Selected</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spotlights.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <img src={s.image_url} alt={s.customer_name} className="w-full h-full object-cover" />
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
              <h4 className="font-bold text-lg mb-1">{s.customer_name}</h4>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{s.headline}</p>
              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                <button onClick={() => handleEdit(s)} className="flex-1 bg-primary text-white py-2 rounded text-xs font-bold">Edit</button>
                <button onClick={() => handleToggle(s.id, s.is_active)} className="flex-1 bg-whatsapp text-white py-2 rounded text-xs font-bold">{s.is_active ? 'Hide' : 'Show'}</button>
                <button onClick={() => handleDelete(s.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded text-xs font-bold">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Spotlights