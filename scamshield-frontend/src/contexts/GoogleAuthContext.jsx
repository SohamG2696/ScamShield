import { createContext, useContext, useState, useCallback } from 'react'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'

const AuthContext = createContext(null)

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const SESSION_KEY = 'scamshield_google_user'

// Inner provider that uses the hook (must be inside GoogleOAuthProvider)
function AuthProviderInner({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const saveUser = useCallback((userData) => {
    setUser(userData)
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData))
    } catch {
      // ignore storage errors
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore
    }
  }, [])

  // Fetch user profile from Google with the access token
  const fetchGoogleProfile = useCallback(async (accessToken) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) throw new Error('Failed to fetch Google profile')
    const profile = await res.json()
    return profile
  }, [])

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/gmail.readonly openid email profile',
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const profile = await fetchGoogleProfile(tokenResponse.access_token)
        const userData = {
          name: profile.name,
          given_name: profile.given_name,
          email: profile.email,
          picture: profile.picture,
          accessToken: tokenResponse.access_token,
        }
        saveUser(userData)
      } catch (err) {
        console.error('Google profile fetch failed:', err)
      } finally {
        setLoading(false)
      }
    },
    onError: (err) => {
      console.error('Google login error:', err)
      setLoading(false)
    },
  })

  const value = {
    user,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Outer provider wraps with GoogleOAuthProvider
export function AuthProvider({ children }) {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </GoogleOAuthProvider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
