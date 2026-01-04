import { useState, useEffect } from 'react'
import { supabaseAdmin } from '../utils/supabaseClient'
import { useNavigate } from 'react-router-dom'

// eslint-disable-next-line no-empty-pattern
const AdminDashboard = ({ }) => {
  const navigate = useNavigate()
  
  // --- TABS ---
  const [activeTab, setActiveTab] = useState('products')
  
  // --- DATA STATES ---
  const [products, setProducts] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [branches, setBranches] = useState([])
  
  // New States for Integration
  const [siteSettings, setSiteSettings] = useState({ id: 1, facebook_url: '', tiktok_url: '', whatsapp_number: '', whatsapp_group_link: '' })
  const [spotlights, setSpotlights] = useState([])
  
  const [loading, setLoading] = useState(false)

  // --- FORM STATES ---
  
  // Product Form
  const [formData, setFormData] = useState({ title: '', price_kes: '', category: '', image_url: '' })
  const [file, setFile] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Branch Form
  const [editingBranch, setEditingBranch] = useState(null)

  // Spotlight Form
  const [spotlightForm, setSpotlightForm] = useState({ customer_name: '', headline: '', story: '', tiktok_url: '', facebook_url: '' })
  const [spotlightFile, setSpotlightFile] = useState(null)
  const [editingSpotlight, setEditingSpotlight] = useState(null)

  // --- FETCH DATA LOGIC ---
  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'products') {
        const { data } = await supabaseAdmin.from('products').select('*').order('created_at', { ascending: false })
        setProducts(data || [])
      } else if (activeTab === 'reviews') {
        const { data } = await supabaseAdmin.from('testimonials').select('*').order('created_at', { ascending: false })
        setTestimonials(data || [])
      } else if (activeTab === 'branches') {
        const { data } = await supabaseAdmin.from('branches').select('*')
        setBranches(data || [])
      } else if (activeTab === 'settings') {
        const { data } = await supabaseAdmin.from('site_settings').select('*').eq('id', 1).single()
        if (data) setSiteSettings(data)
      } else if (activeTab === 'spotlights') {
        const { data } = await supabaseAdmin.from('spotlights').select('*').order('created_at', { ascending: false })
        setSpotlights(data || [])
      }
    } catch (error) {
      console.error('Error fetching:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [activeTab])

  // --- PRODUCT HANDLERS ---
  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalImageUrl = formData.image_url
      if (file) {
        const fileName = `${Date.now()}_${file.name}`
        const { error: uploadError } = await supabaseAdmin.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = await supabaseAdmin.storage.from('media').getPublicUrl(fileName)
        finalImageUrl = publicUrl
      }

      if (editingProduct) {
        const { error } = await supabaseAdmin.from('products').update({ title: formData.title, price_kes: parseInt(formData.price_kes), category: formData.category, image_url: finalImageUrl }).eq('id', editingProduct.id)
        if (error) throw error
        alert('Product Updated!')
        setEditingProduct(null)
      } else {
        const { error } = await supabaseAdmin.from('products').insert([{ title: formData.title, price_kes: parseInt(formData.price_kes), category: formData.category, image_url: finalImageUrl, badge: 'New' }])
        if (error) throw error
        alert('Product Added!')
      }
      setFormData({ title: '', price_kes: '', category: '', image_url: '' })
      setFile(null)
      document.getElementById('product-file-input').value = ''
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving product.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure?')) return
    const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
    if (!error) fetchData()
  }

  // --- REVIEW HANDLERS ---
  const handleApprove = async (id, currentStatus) => {
    const newStatus = !currentStatus
    const { error } = await supabaseAdmin.from('testimonials').update({ is_published: newStatus }).eq('id', id)
    if (!error) fetchData()
  }
  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure?')) return
    const { error } = await supabaseAdmin.from('testimonials').delete().eq('id', id)
    if (!error) fetchData()
  }

  // --- BRANCH HANDLERS ---
  const handleUpdateBranch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabaseAdmin.from('branches').update(editingBranch).eq('id', editingBranch.id)
      if (error) throw error
      alert('Branch Updated!')
      setEditingBranch(null)
      fetchData()
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabaseAdmin.from('site_settings').update(siteSettings).eq('id', 1)
      if (error) throw error
      alert('Settings Saved!')
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert('Error saving settings')
    } finally {
      setLoading(false)
    }
  }

  // --- SPOTLIGHT HANDLERS ---
  const handleSpotlightSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalImageUrl = editingSpotlight ? editingSpotlight.image_url : ''
      
      if (spotlightFile) {
        const fileName = `${Date.now()}_${spotlightFile.name}`
        const { error: uploadError } = await supabaseAdmin.storage.from('media').upload(fileName, spotlightFile, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = await supabaseAdmin.storage.from('media').getPublicUrl(fileName)
        finalImageUrl = publicUrl
      }

      if (editingSpotlight) {
        const { error } = await supabaseAdmin.from('spotlights').update({
          ...editingSpotlight,
          image_url: spotlightFile ? finalImageUrl : editingSpotlight.image_url
        }).eq('id', editingSpotlight.id)
        if (error) throw error
        alert('Spotlight Updated!')
        setEditingSpotlight(null)
      } else {
        if (!spotlightFile) { alert('Please select an image'); setLoading(false); return; }
        const { error } = await supabaseAdmin.from('spotlights').insert([{
          ...spotlightForm,
          image_url: finalImageUrl,
          is_active: true
        }])
        if (error) throw error
        alert('Spotlight Added!')
      }
      
      // Reset Form
      setSpotlightForm({ customer_name: '', headline: '', story: '', tiktok_url: '', facebook_url: '' })
      setSpotlightFile(null)
      document.getElementById('spotlight-file-input').value = ''
      fetchData()

    } catch (error) {
      console.error('Error:', error)
      alert('Error saving spotlight.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSpotlight = async (id) => {
    if (!confirm('Are you sure?')) return
    const { error } = await supabaseAdmin.from('spotlights').delete().eq('id', id)
    if (!error) fetchData()
  }

  const handleToggleSpotlight = async (id, status) => {
    const { error } = await supabaseAdmin.from('spotlights').update({ is_active: !status }).eq('id', id)
    if (!error) fetchData()
  }

  // --- LOGOUT ---
  const handleLogout = async () => {
    await supabaseAdmin.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-primary text-white hidden md:block flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="font-serif text-2xl">Njugush<span className="text-accent">Admin</span></h2>
        </div>
        <div className="flex-1 py-4 space-y-2 overflow-y-auto">
          <button onClick={() => { setActiveTab('products'); setEditingProduct(null); }} className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition ${activeTab === 'products' ? 'bg-gray-800 border-l-4 border-accent' : ''}`}>Products</button>
          <button onClick={() => { setActiveTab('reviews'); }} className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition ${activeTab === 'reviews' ? 'bg-gray-800 border-l-4 border-accent' : ''}`}>Reviews ({testimonials.filter(t => !t.is_published).length})</button>
          <button onClick={() => { setActiveTab('branches'); setEditingBranch(null); }} className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition ${activeTab === 'branches' ? 'bg-gray-800 border-l-4 border-accent' : ''}`}>Branches</button>
          
          {/* Integrated Tabs for Uniformity */}
          <button onClick={() => { setActiveTab('spotlights'); setEditingSpotlight(null); }} className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 ${activeTab === 'spotlights' ? 'bg-gray-800 border-l-4 border-accent' : ''}`}>
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 4 2.343.082.864 1.125 2.253 1.125 3.437a5.444 5.444 0 01-1.392-3.665 5.845 5.845 0 01-3.85-2.354 8.332 8.332 0 01-4.455-1.789c-.876-1.334-1.628-2.856-1.628-4.737 0-1.022.326-1.966.856-2.649a8.316 8.316 0 01-4.454-1.79 4.915 4.915 0 00-3.25-1.35 8.316 8.316 0 00-4.455 1.79c-2.015.745-3.494 1.658-3.85 2.649a2.981 2.981 0 00-1.628 2.736 2.981 2.981 0 01.856 2.649z" /></svg>
            Spotlights
          </button>
          
          <button onClick={() => { setActiveTab('settings'); }} className={`w-full text-left px-6 py-3 hover:bg-gray-700 transition flex items-center gap-3 ${activeTab === 'settings' ? 'bg-gray-800 border-l-4 border-accent' : ''}`}>
             <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 4 2.343.082.864 1.125 2.253 1.125 3.437a5.444 5.444 0 01-1.392-3.665 5.845 5.845 0 01-3.85-2.354 8.332 8.332 0 01-4.455-1.789c-.876-1.334-1.628-2.856-1.628-4.737 0-1.022.326-1.966.856-2.649a8.316 8.316 0 01-4.454-1.79 4.915 4.915 0 00-3.25-1.35 8.316 8.316 0 00-4.455 1.79c-2.015.745-3.494 1.658-3.85 2.649a2.981 2.981 0 00-1.628 2.736 2.981 2.981 0 01.856 2.649z" /></svg>
            Site Settings
          </button>

        </div>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full text-left px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">Logout</button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* === PRODUCTS TAB === */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-primary">Manage Products</h3>
              <button onClick={() => setEditingProduct(null)} className="bg-whatsapp text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition shadow-lg flex items-center gap-2 text-sm">Add New Bale</button>
            </div>
              
            {(editingProduct || (!editingProduct && activeTab === 'products')) && (
              <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-accent mb-8">
                <h4 className="font-bold text-lg mb-4 text-accent">{editingProduct ? 'Edit Bale' : 'Add New Bale'}</h4>
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-bold mb-1">Title</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Price (KES)</label>
                    <input required type="number" value={formData.price_kes} onChange={e => setFormData({...formData, price_kes: e.target.value})} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border p-2 rounded">
                      <option value="">Select Category</option>
                      <option value="Ladies">Ladies</option>
                      <option value="Mens">Mens</option>
                      <option value="Kids">Kids</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-1">Bale Photo</label>
                    <input id="product-file-input" type="file" accept="image/*" onChange={(e) => { const s = e.target.files[0]; if(s){ setFile(s); } }} className="w-full border p-2 rounded bg-gray-50" />
                  </div>
                  <div className="md:col-span-2 flex gap-4 justify-end mt-2">
                    <button type="button" onClick={() => { setEditingProduct(null); setFormData({ title: '', price_kes: '', category: '', image_url: '' }); }} className="px-6 py-2 border border-gray-300 rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-accent text-primary px-6 py-2 rounded font-bold hover:bg-yellow-500 disabled:opacity-50">
                      {loading ? 'Saving...' : 'Save Bale'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-2"><img src={p.image_url} className="w-12 h-12 rounded object-cover border border-gray-200" /></td>
                      <td className="p-4">{p.title}</td>
                      <td className="p-4">{p.price_kes}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => { setEditingProduct(p); setFormData(p); }} className="text-blue-500 hover:text-blue-700 font-bold text-sm">Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700 font-bold text-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === REVIEWS TAB === */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-primary">Manage Reviews</h3>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending: {testimonials.filter(t => !t.is_published).length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 relative">
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${t.is_published ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.is_published ? 'Published' : 'Pending'}
                  </span>
                  <h4 className="font-bold text-lg mb-1">{t.customer_name} ({t.rating}/5)</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10 overflow-hidden text-ellipsis">"{t.content}"</p>
                  <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                    <button onClick={() => handleApprove(t.id, t.is_published)} className={`px-3 py-2 rounded text-xs font-bold ${t.is_published ? 'bg-gray-100 text-gray-600' : 'bg-green-600 text-white'}`}>
                      {t.is_published ? 'Unpublish' : 'Approve'}
                    </button>
                    <button onClick={() => handleDeleteReview(t.id)} className="px-3 py-2 rounded text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === BRANCHES TAB === */}
        {activeTab === 'branches' && (
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6">Manage Branches</h3>
            {editingBranch && (
              <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-accent mb-6">
                <h4 className="font-bold text-lg mb-4 text-accent">Edit Branch: {editingBranch.town}</h4>
                <form onSubmit={handleUpdateBranch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold mb-1">Name</label><input value={editingBranch.name} onChange={e => setEditingBranch({...editingBranch, name: e.target.value})} className="w-full border p-2 rounded" /></div>
                  <div><label className="block text-sm font-bold mb-1">Town</label><input value={editingBranch.town} onChange={e => setEditingBranch({...editingBranch, town: e.target.value})} className="w-full border p-2 rounded" /></div>
                  <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Location</label><input value={editingBranch.location} onChange={e => setEditingBranch({...editingBranch, location: e.target.value})} className="w-full border p-2 rounded" /></div>
                  <div><label className="block text-sm font-bold mb-1">Phone</label><input value={editingBranch.phone} onChange={e => setEditingBranch({...editingBranch, phone: e.target.value})} className="w-full border p-2 rounded" /></div>
                  <div className="flex gap-4 justify-end mt-2">
                    <button type="button" onClick={() => setEditingBranch(null)} className="px-4 py-2 border border-gray-300 rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-accent text-primary px-6 py-2 rounded font-bold hover:bg-yellow-500 disabled:opacity-50">Update</button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {branches.map(b => (
                <div key={b.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-bold text-primary">{b.name}</h4>
                  <p className="text-sm text-gray-500">{b.town}</p>
                  <button onClick={() => setEditingBranch(b)} className="mt-4 w-full bg-primary text-white py-2 rounded text-xs font-bold hover:bg-[#05122b]">Edit Info</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === SPOTLIGHTS TAB (NEW) === */}
        {activeTab === 'spotlights' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-primary">Spotlights</h3>
              <button onClick={() => setEditingSpotlight(null)} className="bg-whatsapp text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition shadow-lg flex items-center gap-2 text-sm">Add New</button>
            </div>

            {/* Add/Edit Form */}
            {(editingSpotlight || (!editingSpotlight && activeTab === 'spotlights')) && (
               <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-accent mb-8">
                <h4 className="font-bold text-lg mb-4 text-accent">{editingSpotlight ? 'Edit Spotlight' : 'Add New Spotlight'}</h4>
                <form onSubmit={handleSpotlightSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div><label className="block text-sm font-bold mb-1">Customer Name</label><input required name="customer_name" value={editingSpotlight ? editingSpotlight.customer_name : spotlightForm.customer_name} onChange={e => editingSpotlight ? setEditingSpotlight({...editingSpotlight, customer_name: e.target.value}) : setSpotlightForm({...spotlightForm, customer_name: e.target.value})} className="w-full border p-2 rounded" /></div>
                   <div><label className="block text-sm font-bold mb-1">Headline</label><input required name="headline" value={editingSpotlight ? editingSpotlight.headline : spotlightForm.headline} onChange={e => editingSpotlight ? setEditingSpotlight({...editingSpotlight, headline: e.target.value}) : setSpotlightForm({...spotlightForm, headline: e.target.value})} className="w-full border p-2 rounded" /></div>
                   <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Story</label><textarea required rows="3" name="story" value={editingSpotlight ? editingSpotlight.story : spotlightForm.story} onChange={e => editingSpotlight ? setEditingSpotlight({...editingSpotlight, story: e.target.value}) : setSpotlightForm({...spotlightForm, story: e.target.value})} className="w-full border p-2 rounded"></textarea></div>
                   <div><label className="block text-sm font-bold mb-1">TikTok</label><input name="tiktok_url" value={editingSpotlight ? editingSpotlight.tiktok_url : spotlightForm.tiktok_url} onChange={e => editingSpotlight ? setEditingSpotlight({...editingSpotlight, tiktok_url: e.target.value}) : setSpotlightForm({...spotlightForm, tiktok_url: e.target.value})} className="w-full border p-2 rounded" /></div>
                   <div><label className="block text-sm font-bold mb-1">Facebook</label><input name="facebook_url" value={editingSpotlight ? editingSpotlight.facebook_url : spotlightForm.facebook_url} onChange={e => editingSpotlight ? setEditingSpotlight({...editingSpotlight, facebook_url: e.target.value}) : setSpotlightForm({...spotlightForm, facebook_url: e.target.value})} className="w-full border p-2 rounded" /></div>
                   <div className="md:col-span-2"><label className="block text-sm font-bold mb-1">Photo</label><input id="spotlight-file-input" type="file" accept="image/*" onChange={(e) => { const s = e.target.files[0]; if(s){ setSpotlightFile(s); } }} className="w-full border p-2 rounded bg-gray-50" /></div>
                   <div className="md:col-span-2 flex gap-4 justify-end mt-2">
                    <button type="button" onClick={() => { setEditingSpotlight(null); setSpotlightForm({ customer_name: '', headline: '', story: '', tiktok_url: '', facebook_url: '' }); }} className="px-6 py-2 border border-gray-300 rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-accent text-primary px-6 py-2 rounded font-bold hover:bg-yellow-500 disabled:opacity-50">{loading ? 'Saving...' : 'Save Spotlight'}</button>
                  </div>
                </form>
              </div>
            )}

            {/* Spotlight List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spotlights.map(s => (
                <div key={s.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative">
                  <div className="relative h-40 mb-3 rounded overflow-hidden">
                    <img src={s.image_url} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {s.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <h4 className="font-bold text-primary mb-1">{s.customer_name}</h4>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{s.headline}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingSpotlight(s); setSpotlightForm(s); }} className="flex-1 bg-primary text-white py-2 rounded text-xs font-bold">Edit</button>
                    <button onClick={() => handleToggleSpotlight(s.id, s.is_active)} className="flex-1 bg-whatsapp text-white py-2 rounded text-xs font-bold">{s.is_active ? 'Hide' : 'Show'}</button>
                    <button onClick={() => handleDeleteSpotlight(s.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded text-xs font-bold">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === ENHANCED SETTINGS TAB === */}
        {activeTab === 'settings' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left: Input Form */}
             <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-primary mb-6">Global Configuration</h3>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    
                    {/* Facebook Input with Icon */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Facebook URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </div>
                        <input 
                          required 
                          value={siteSettings.facebook_url} 
                          onChange={e => setSiteSettings({...siteSettings, facebook_url: e.target.value})} 
                          className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                          placeholder="https://facebook.com/yourpage" 
                        />
                      </div>
                    </div>

                    {/* TikTok Input with Icon */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">TikTok URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                        </div>
                        <input 
                          required 
                          value={siteSettings.tiktok_url} 
                          onChange={e => setSiteSettings({...siteSettings, tiktok_url: e.target.value})} 
                          className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                          placeholder="https://tiktok.com/@yourprofile" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* WhatsApp Number with Icon */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                          </div>
                          <input 
                            required 
                            value={siteSettings.whatsapp_number} 
                            onChange={e => setSiteSettings({...siteSettings, whatsapp_number: e.target.value})} 
                            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                            placeholder="+254 7..." 
                          />
                        </div>
                      </div>

                      {/* WhatsApp Group Link with Icon */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Group Link</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          </div>
                          <input 
                            value={siteSettings.whatsapp_group_link} 
                            onChange={e => setSiteSettings({...siteSettings, whatsapp_group_link: e.target.value})} 
                            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                            placeholder="https://chat.whatsapp.com/..." 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                      <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-[#05122b] disabled:opacity-50 flex items-center gap-2">
                        {loading ? 'Saving...' : 'Save Configuration'}
                      </button>
                    </div>
                  </form>
                </div>
             </div>

             {/* Right: Visual Connection Status */}
             <div className="hidden lg:block">
                <div className="sticky top-4 space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <h4 className="font-bold text-gray-800 mb-4">Active Channels</h4>
                     <div className="space-y-3">
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${siteSettings.facebook_url ? 'bg-blue-50' : 'bg-gray-50 opacity-50'}`}>
                           <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                           <div>
                              <p className="text-xs font-bold text-gray-500 uppercase">Facebook</p>
                              <p className="text-sm font-semibold text-gray-800">{siteSettings.facebook_url ? 'Connected' : 'Not Set'}</p>
                           </div>
                        </div>

                        <div className={`flex items-center gap-3 p-3 rounded-lg ${siteSettings.tiktok_url ? 'bg-gray-100' : 'bg-gray-50 opacity-50'}`}>
                           <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                           <div>
                              <p className="text-xs font-bold text-gray-500 uppercase">TikTok</p>
                              <p className="text-sm font-semibold text-gray-800">{siteSettings.tiktok_url ? 'Connected' : 'Not Set'}</p>
                           </div>
                        </div>

                        <div className={`flex items-center gap-3 p-3 rounded-lg ${siteSettings.whatsapp_number ? 'bg-green-50' : 'bg-gray-50 opacity-50'}`}>
                           <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                           <div>
                              <p className="text-xs font-bold text-gray-500 uppercase">WhatsApp</p>
                              <p className="text-sm font-semibold text-gray-800">{siteSettings.whatsapp_number ? 'Connected' : 'Not Set'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                     <p className="text-xs text-blue-800 leading-relaxed">
                        <strong>Note:</strong> Changes made here update the Navbar, Footer, and Hero sections instantly.
                     </p>
                  </div>
                </div>
             </div>
           </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard