import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Menu, X, LogOut, Package, Shield, Code } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useCart } from '../hooks/useCart'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, login, logout, isAdmin, isAuthenticated } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleCartClick = () => {
    if (!isAuthenticated) {
      login()
    } else {
      navigate('/cart')
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-aura-white border-b border-aura-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-white border-2 border-aura-gold rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-sm">
              <img src="/aura.png" alt="Aura Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display text-2xl lg:text-3xl font-semibold text-aura-black tracking-tight">
              Aura<span className="text-aura-gold">Fashions</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/?category=t-shirt" className="link-underline text-aura-charcoal hover:text-aura-black transition-colors">
              T-Shirts
            </Link>
            <Link to="/?category=hoodie" className="link-underline text-aura-charcoal hover:text-aura-black transition-colors">
              Hoodies
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative p-2 hover:bg-aura-cream rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-aura-gold text-aura-black text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-aura-cream rounded-full transition-colors"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-aura-white border border-aura-cream shadow-lg rounded-lg overflow-hidden animate-slide-down">
                    <div className="px-4 py-3 border-b border-aura-cream">
                      <p className="font-medium text-aura-black">{user.name}</p>
                      <p className="text-sm text-aura-silver">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-aura-cream transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin/products"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-aura-cream transition-colors text-aura-gold"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileOpen(false)
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-aura-cream transition-colors text-red-500"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={login}
                className="btn-primary text-sm"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-aura-cream rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-aura-cream animate-slide-down">
            <Link
              to="/?category=t-shirt"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-aura-charcoal hover:text-aura-black"
            >
              T-Shirts
            </Link>
            <Link
              to="/?category=hoodie"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-aura-charcoal hover:text-aura-black"
            >
              Hoodies
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

