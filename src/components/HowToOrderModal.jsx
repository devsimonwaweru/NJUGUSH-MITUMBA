const HowToOrderModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    // Overlay Layer
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      
      {/* Click outside to close */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white relative z-10 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header & Close Button */}
        <div className="bg-primary p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif text-white">How It Works</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-accent transition"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto">
          
          <div className="text-center mb-12">
            <p className="text-gray-600">Ordering your bales in 3 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-200 border-t-2 border-dashed border-gray-400"></div>

            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-accent text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">1. Select Your Bale</h3>
              <p className="text-gray-500 text-sm">
                Browse our New Arrivals. Check prices and categories (Ladies, Kids, Mens).
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-white border-2 border-primary text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">2. Make Payment</h3>
              <p className="text-gray-500 text-sm">
                Pay via MPESA or Bank Transfer. We provide instant confirmation on WhatsApp.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-whatsapp text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">3. Receive Delivery</h3>
              <p className="text-gray-500 text-sm">
                Pick up at our branches or get it delivered to your shop. Unbox & Sell!
              </p>
            </div>

          </div>

          {/* Footer inside Modal */}
          <div className="mt-12 text-center">
            <a 
              href="#products" 
              onClick={onClose} // Close modal on click
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              Shop Arrivals
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}

export default HowToOrderModal