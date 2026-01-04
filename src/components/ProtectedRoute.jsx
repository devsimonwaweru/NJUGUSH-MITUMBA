import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Checking access...</div>
  }

  if (!session) {
    // If no user, redirect to login
    return <Navigate to="/login" replace />
  }

  // If user exists, show the component (AdminDashboard)
  return <>{children}</>
}

export default ProtectedRoute