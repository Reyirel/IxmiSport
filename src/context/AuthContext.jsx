import { createContext, useContext, useEffect, useState } from 'react'
import { observeAuthState } from '../services/authService'
import { getUserData } from '../services/firestoreService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = observeAuthState(async (user) => {
      setCurrentUser(user)
      
      if (user) {
        try {
          const data = await getUserData(user.uid)
          setUserData(data)
          setLoading(false)
        } catch (error) {
          console.error('Error getting user data:', error)
          setLoading(false)
        }
      } else {
        setUserData(null)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userData,
    loading,
    setUserData,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
