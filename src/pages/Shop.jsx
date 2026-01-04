import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import ProductCard from '../components/ProductCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BusinessGuideModal from '../components/BusinessGuideModal'

const Shop = ({ onOpenHowToOrder, onOpenSourcing }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isGuideOpen, setIsGuideOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      
      <Navbar 
        onOpenHowToOrder={onOpenHowToOrder} 
        onOpenSourcing={onOpenSourcing} 
      />
      
      {/* Shop Header */}
      <header className="bg-primary text-white py-16 relative overflow-hidden">
        {/* Fixed Background Image Style for better compatibility */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/hero-bales.jpg')" }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
             <Link to="/" className="text-accent text-sm font-bold uppercase tracking-widest hover:underline text-left">
               Back Home
             </Link>
             
             {/* Start Business Trigger Button */}
             <button 
               onClick={() => setIsGuideOpen(true)}
               className="bg-accent text-primary px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-500 transition shadow-lg flex items-center gap-2"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               Guide: Start Business
             </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif mt-4">Shop All Bales</h1>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Browse our complete catalog of Grade A mitumba bales. New arrivals from China, UK, Canada, Taiwan, and Korea.
          </p>
        </div>
      </header>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-12 flex-grow">
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        )}
      </div>

      <Footer />
      
      {/* The Business Guide Modal */}
      <BusinessGuideModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
      />
    </div>
  )
}

export default Shop