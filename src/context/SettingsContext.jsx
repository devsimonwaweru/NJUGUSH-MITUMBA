import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1) // We only use Row ID 1
        .single()

      if (!error && data) {
        setSettings(data)
      }
      setLoading(false)
    }

    fetchSettings()
  }, [])

  // Function to update settings (used by Admin Dashboard)
  const updateSettings = async (newValues) => {
    const { error } = await supabase
      .from('site_settings')
      .update(newValues)
      .eq('id', 1)
    
    if (!error) {
      setSettings({ ...settings, ...newValues })
      alert('Settings Updated Successfully!')
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

// Custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext)