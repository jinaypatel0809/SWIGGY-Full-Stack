import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../services/api'

const AuthContext = createContext(null)
const USER_TOKEN_KEY = 'zomato-clone-user-token'
const ADMIN_TOKEN_KEY = 'zomato-clone-admin-token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async (role, tokenKey, setter) => {
      if (!localStorage.getItem(tokenKey)) return
      try {
        const data = await apiRequest('/auth/me', { authRole: role })
        if (data.account.role === role) setter(data.account)
        else localStorage.removeItem(tokenKey)
      } catch {
        localStorage.removeItem(tokenKey)
      }
    }

    Promise.all([
      restoreSession('user', USER_TOKEN_KEY, setUser),
      restoreSession('admin', ADMIN_TOKEN_KEY, setAdmin),
    ]).finally(() => setIsLoading(false))
  }, [])

  const sendLoginOtp = async ({ email, password, role = 'user' }) => {
    return apiRequest(`/auth/${role}/login/send-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      authRole: role,
    })
  }

  const verifyLoginOtp = async ({ email, password, otp, role = 'user' }) => {
    const data = await apiRequest(`/auth/${role}/login/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, password, otp }),
      authRole: role,
    })

    if (role === 'admin') {
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
      setAdmin(data.account)
    } else {
      localStorage.setItem(USER_TOKEN_KEY, data.token)
      setUser(data.account)
    }
    return data.account
  }

  const sendSignupOtp = async ({ name, email, phone, password, role = 'user' }) => {
    return apiRequest(`/auth/${role}/register/send-otp`, {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
      authRole: role,
    })
  }

  const verifySignupOtp = async ({ name, email, phone, password, otp, role = 'user' }) => {
    return apiRequest(`/auth/${role}/register/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password, otp }),
      authRole: role,
    })
  }

  const logoutUser = () => {
    localStorage.removeItem(USER_TOKEN_KEY)
    setUser(null)
  }

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    setAdmin(null)
  }

  const refreshAccount = async (role = 'user') => {
    const data = await apiRequest('/auth/me', { authRole: role })
    if (role === 'admin') setAdmin(data.account)
    else setUser(data.account)
    return data.account
  }

  const value = {
    user,
    admin,
    isLoading,
    isAuthenticated: Boolean(user),
    isAdminAuthenticated: Boolean(admin),
    sendLoginOtp,
    verifyLoginOtp,
    sendSignupOtp,
    verifySignupOtp,
    logout: logoutUser,
    logoutUser,
    logoutAdmin,
    refreshAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
