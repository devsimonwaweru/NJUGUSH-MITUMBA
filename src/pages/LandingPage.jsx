import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrustStrip from '../components/TrustStrip'
import CustomerSpotlight from '../components/CustomerSpotlight'
import Products from '../components/Products'
import Branches from '../components/Branches'
import Testimonials from '../components/Testimonials'
import SubmitReview from '../components/SubmitReview'
import Community from '../components/Community'
import Footer from '../components/Footer'

const LandingPage = ({ onOpenHowToOrder, onOpenSourcing, onOpenGuide }) => { // Accept new prop
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar 
        onOpenHowToOrder={onOpenHowToOrder} 
        onOpenSourcing={onOpenSourcing} 
      />
      
      <main>
        <Hero onOpenGuide={onOpenGuide} /> {/* Pass to Hero */}
        <TrustStrip />
        <CustomerSpotlight />
        <Products />
        <Branches />
        <Testimonials />
        <SubmitReview />
        <Community />
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage