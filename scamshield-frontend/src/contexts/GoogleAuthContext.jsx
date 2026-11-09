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
      'Google Sign-In is not configured for this environment.\n\nTo enable authentication, please configure VITE_GOOGLE_CLIENT_ID.'
    )
  }, [])

  const requestGmailAccess = useCallback(() => {
    alert(
      'Gmail integration is not configured for this environment.\n\nTo enable Gmail scanning, please configure VITE_GOOGLE_CLIENT_ID.'
    )
  }, [])

  const value = {
    user,
    isLoggedIn: Boolean(user && (user.email || user.name)),
    hasGmailAccess: Boolean(user?.hasGmailAccess && user?.accessToken),
    loading: false,
    login,
    requestGmailAccess,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Inner provider that uses Google hooks (must be inside GoogleOAuthProvider)
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

  // Fetch basic user profile from Google with the access token
  const fetchGoogleProfile = useCallback(async (accessToken) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) throw new Error('Failed to fetch Google profile')
    const profile = await res.json()
    return profile
  }, [])

  // 1. Basic Sign-In: Only requests least-privilege identity scopes (openid, email, profile)
  let basicLoginHandler
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    basicLoginHandler = useGoogleLogin({
      scope: 'openid email profile',
      onSuccess: async (tokenResponse) => {
        setLoading(true)
        try {
          const profile = await fetchGoogleProfile(tokenResponse.access_token)
          const userData = {
            ...(user || {}),
            name: profile.name,
            given_name: profile.given_name,
            email: profile.email,
            picture: profile.picture,
            profileToken: tokenResponse.access_token,
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
    console.warn('useGoogleLogin initialization failed for basic login:', err)
    basicLoginHandler = () => {
      alert('Google authentication service could not be initialized.')
    }
  }

  // 2. Incremental Authorization: Requests restricted Gmail read-only scope ONLY on demand
  let gmailAuthHandler
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    gmailAuthHandler = useGoogleLogin({
      scope: 'https://www.googleapis.com/auth/gmail.readonly openid email profile',
      onSuccess: async (tokenResponse) => {
        setLoading(true)
        try {
          let currentProfile = user
          if (!currentProfile?.email) {
            currentProfile = await fetchGoogleProfile(tokenResponse.access_token)
          }
          const userData = {
            ...currentProfile,
            accessToken: tokenResponse.access_token,
            hasGmailAccess: true,
          }
          saveUser(userData)
        } catch (err) {
          console.error('Gmail authorization failed:', err)
        } finally {
          setLoading(false)
        }
      },
      onError: (err) => {
        console.error('Gmail authorization error:', err)
        setLoading(false)
      },
    })
  } catch (err) {
    console.warn('useGoogleLogin initialization failed for Gmail scope:', err)
    gmailAuthHandler = () => {
      alert('Gmail authorization service could not be initialized.')
    }
  }

  const value = {
    user,
    isLoggedIn: Boolean(user && (user.email || user.name)),
    hasGmailAccess: Boolean(user?.hasGmailAccess && user?.accessToken),
    loading,
    login: basicLoginHandler,
    requestGmailAccess: gmailAuthHandler,
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
