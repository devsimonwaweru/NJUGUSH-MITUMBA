import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import ProductCard from './ProductCard'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }) // Newest first

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
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-primary mb-4">New Arrivals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Freshly imported bales. Verified quality and weight.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading bales...</div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State (if no products exist) */}
        {!loading && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        )}

      </div>
    </section>
  )
}

export default Products