const TrustStrip = () => {
  return (
    <div className="bg-white py-8 border-b border-gray-100 shadow-sm relative z-30 -mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          
          {/* Stat 1 */}
          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-accent transition">
              <svg className="w-6 h-6 text-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-bold text-primary">Grade A Quality</h3>
            <p className="text-sm text-gray-500">Verified & Weighed</p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-accent transition">
              <svg className="w-6 h-6 text-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="font-bold text-primary">1,000+ Clients</h3>
            <p className="text-sm text-gray-500">Nationwide Service</p>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-accent transition">
              <svg className="w-6 h-6 text-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-primary">Fast Delivery</h3>
            <p className="text-sm text-gray-500">Same Day Dispatch</p>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-3 rounded-full mb-3 group-hover:bg-accent transition">
              <svg className="w-6 h-6 text-primary group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="font-bold text-primary">Secure Payment</h3>
            <p className="text-sm text-gray-500">Pay Safely</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default TrustStrip