import { createContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import { auth, signInWithGoogle } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import toast from 'react-hot-toast'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // If Firebase has a user, get the ID token
                    const idToken = await firebaseUser.getIdToken()

                    // Send ID token to our backend to get a session
                    const response = await authAPI.googleLogin(idToken)
                    const { access_token, user: backendUser } = response.data

                    // Save session locally
                    localStorage.setItem('token', access_token)
                    localStorage.setItem('user', JSON.stringify(backendUser))
                    setUser(backendUser)
                } else {
                    const token = localStorage.getItem('token')
                    const savedUser = localStorage.getItem('user')

                    if (token && savedUser) {
                        try {
                            // Verify local token with backend record
                            const response = await authAPI.getMe()
                            setUser(response.data)
                        } catch (err) {
                            // Token is invalid or expired
                            logout()
                        }
                    } else {
                        setUser(null)
                    }
                }
            } catch (error) {
                console.error('Auth sync error:', error)
                // Don't logout on network error, only on 401
                if (error.response?.status === 401) {
                    logout()
                }
            } finally {
                setLoading(false)
            }
        })

        return () => unsubscribe()
    }, [])

    const login = async () => {
        try {
            setLoading(true)
            await signInWithGoogle()
            toast.success('Welcome!')
        } catch (error) {
            console.error('Login error:', error)
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error('Failed to login')
            }
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await auth.signOut()
        } catch (error) {
            console.error('Logout error:', error)
        }
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        toast.success('Logged out')
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAdmin: user?.role === 'admin',
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}
