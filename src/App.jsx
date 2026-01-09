import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'

// Page Components
import Shop from './pages/Shop'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import LandingPage from './pages/LandingPage'
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans flex flex-col bg-gray-50">
        <Routes>
          
          {/* 1. HOME PAGE */}
          {/* We wrap Home in a Layout (Navbar + Footer) */}
          <Route 
            path="/" 
            element={
              <>
                <Navbar />
                <div className="flex-grow">
                 <LandingPage/>
                </div>
                
              </>
            } 
          />

          {/* 2. SHOP PAGE */}
          {/* Same Layout wrapper for consistency */}
          <Route 
            path="/shop" 
            element={
              <>
                <Navbar />
                <div className="flex-grow">
                  <Shop />
                </div>
              </>
            } 
          />

          {/* 3. LOGIN PAGE */}
          <Route 
            path="/login" 
            element={
              <>
                <Navbar />
                <div className="flex-grow">
                  <Login />
                </div>
              </>
            } 
          />

          {/* 4. ADMIN DASHBOARD */}
          {/* Admin has its own internal layout (Sidebar), so we render it standalone */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* 5. CATCH ALL (404) */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App