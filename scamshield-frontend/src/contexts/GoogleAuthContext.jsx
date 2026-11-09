import React, { createContext, useContext, useState, useCallback } from 'react'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'

const AuthContext = createContext(null)

const rawClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const CLIENT_ID = rawClientId.trim()
const hasValidClientId = Boolean(
  CLIENT_ID &&
  CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' &&
  CLIENT_ID !== 'dummy'
)
const SESSION_KEY = 'scamshield_google_user'

function AuthProviderFallback({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const logout = useCallback(() => {
    setUser(null)
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // ignore
    }
  }, [])

  const login = useCallback(() => {
    alert(
      'Google Sign-In is not configured for this environment.\n\nTo enable Gmail scanning, please configure VITE_GOOGLE_CLIENT_ID.'
    )
  }, [])

  const value = {
    user,
    isLoggedIn: !!user,
    loading: false,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

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

  let loginHandler
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    loginHandler = useGoogleLogin({
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
  } catch (err) {
    console.warn('useGoogleLogin initialization failed, using fallback:', err)
    loginHandler = () => {
      alert('Google authentication service could not be initialized.')
    }
  }

  const value = {
    user,
    isLoggedIn: !!user,
    loading,
    login: loginHandler,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

class GoogleOAuthBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('GoogleOAuthProvider threw an error:', error)
  }

  render() {
    if (this.state.hasError) {
      return <AuthProviderFallback>{this.props.children}</AuthProviderFallback>
    }
    return this.props.children
  }
}

// Outer provider wraps with GoogleOAuthProvider if clientId is configured
export function AuthProvider({ children }) {
  if (!hasValidClientId) {
    return <AuthProviderFallback>{children}</AuthProviderFallback>
  }

  return (
    <GoogleOAuthBoundary>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <AuthProviderInner>{children}</AuthProviderInner>
      </GoogleOAuthProvider>
    </GoogleOAuthBoundary>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
