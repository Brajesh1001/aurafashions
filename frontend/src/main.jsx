import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { CartProvider } from './hooks/useCart.jsx'
import './index.css'

// Replace with your Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1a1a1a',
                  color: '#fafafa',
                  border: '1px solid #2a2a2a',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)

