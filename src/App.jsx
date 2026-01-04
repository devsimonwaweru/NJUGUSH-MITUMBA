import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Page Components (Update paths here)
import Home from './components/Home' // Assuming Home is in components
import Shop from './pages/Shop'       // ✅ UPDATED: Now points to pages folder
import Login from './pages/Login'      // ✅ UPDATED: Now points to pages folder
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans flex flex-col bg-gray-50">
        <Routes>
          
          {/* 1. HOME PAGE */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <div className="flex-grow">
                  <Home />
                </div>
                <Footer />
              </>
            } 
          />

          {/* 2. SHOP PAGE (Updated Path) */}
          <Route 
            path="/shop" 
            element={
              <>
                <Navbar />
                <div className="flex-grow">
                  <Shop />
                </div>
                <Footer />
              </>
            } 
          />

          {/* 3. LOGIN PAGE (Updated Path) */}
          <Route 
            path="/login" 
            element={
              <>
                <Navbar />
                <div className="flex-grow">
                  <Login />
                </div>
                <Footer />
              </>
            } 
          />

          {/* 4. ADMIN DASHBOARD (Protected) */}
          <Route path="/admin/*" element={
              <AdminDashboard />
          } />

          {/* 5. CATCH ALL (404) */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App