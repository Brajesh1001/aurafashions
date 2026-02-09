import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import AdminProducts from './pages/AdminProducts'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ComingSoon from './pages/ComingSoon'
import { Routes, Route, useLocation } from 'react-router-dom'

function App() {
  const location = useLocation()
  const isComingSoonActive = import.meta.env.VITE_COMING_SOON === 'true'

  // Decide if we should show the "clean" landing page layout (no navbar/footer)
  // This happens if ComingSoon is the root page OR if we're explicitly on /launch
  const isLandingPage = (location.pathname === '/' && isComingSoonActive) || location.pathname === '/launch'

  return (
    <div className="min-h-screen flex flex-col bg-aura-white">
      {!isLandingPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={isComingSoonActive ? <ComingSoon /> : <Home />} />
          <Route path="/store" element={<Home />} />
          <Route path="/launch" element={<ComingSoon />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Protected Routes (Login Required) */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
        </Routes>
      </main>
      {!isLandingPage && <Footer />}
    </div>
  )
}

export default App

